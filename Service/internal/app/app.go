package app

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/robfig/cron/v3"
	"go.uber.org/zap"

	"github.com/omnihealth/realtime-service/internal/config"
	"github.com/omnihealth/realtime-service/internal/messaging"
	"github.com/omnihealth/realtime-service/internal/realtime"
	"github.com/omnihealth/realtime-service/internal/store"
	"github.com/omnihealth/realtime-service/internal/worker"
)

var eventsProcessed = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "omni", Subsystem: "realtime", Name: "events_processed_total",
	Help: "Total RabbitMQ events processed by the realtime service.",
})

type Application struct {
	Logger *zap.Logger
	server *http.Server
	store *store.Store
	redis *redis.Client
	rabbit *messaging.Consumer
	workers *worker.Pool
	cron *cron.Cron
}

func New(ctx context.Context) (*Application, error) {
	cfg := config.Load()
	logger, _ := zap.NewProduction()
	database, err := store.Open(ctx, cfg.PostgresURL)
	if err != nil { return nil, err }
	redisClient := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr})
	if err := redisClient.Ping(ctx).Err(); err != nil { database.Pool.Close(); return nil, err }
	rabbit, err := messaging.New(cfg.RabbitMQURL)
	if err != nil { database.Pool.Close(); redisClient.Close(); return nil, err }

	hub := realtime.NewHub()
	go hub.Run()
	pool := worker.New(cfg.WorkerCount, 256)
	if err := rabbit.Consume(ctx, cfg.RabbitMQQueue, func(payload []byte) {
		pool.Submit(func(jobCtx context.Context) error {
			if err := database.SaveEvent(jobCtx, payload); err != nil { return err }
			_ = redisClient.Publish(jobCtx, "realtime.notifications", payload).Err()
			hub.Broadcast(payload)
			eventsProcessed.Inc()
			return nil
		})
	}); err != nil { return nil, err }

	registry := prometheus.NewRegistry()
	registry.MustRegister(eventsProcessed)
	router := gin.New()
	router.Use(gin.Recovery(), requestLogger(logger))
	router.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })
	router.GET("/ws", hub.Handle)
	router.GET("/metrics", gin.WrapH(promhttp.HandlerFor(registry, promhttp.HandlerOpts{})))

	cronRunner := cron.New()
	_, _ = cronRunner.AddFunc("0 3 * * *", func() { _ = database.DeleteOldEvents(context.Background()) })
	cronRunner.Start()

	return &Application{
		Logger: logger, server: &http.Server{Addr: cfg.HTTPAddr, Handler: router, ReadHeaderTimeout: 5 * time.Second},
		store: database, redis: redisClient, rabbit: rabbit, workers: pool, cron: cronRunner,
	}, nil
}

func (a *Application) Run() error { return a.server.ListenAndServe() }
func (a *Application) Shutdown(ctx context.Context) error { return a.server.Shutdown(ctx) }
func (a *Application) Close() {
	ctx := a.cron.Stop(); <-ctx.Done()
	a.rabbit.Close(); a.workers.Close(); _ = a.redis.Close(); a.store.Pool.Close(); _ = a.Logger.Sync()
}
func (a *Application) Error(err error) zap.Field { return zap.Error(err) }

func requestLogger(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		started := time.Now(); c.Next()
		logger.Info("http request", zap.String("method", c.Request.Method), zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()), zap.Duration("duration", time.Since(started)))
	}
}
