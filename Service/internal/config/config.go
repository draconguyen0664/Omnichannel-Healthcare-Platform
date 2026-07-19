package config

import (
	"os"
	"strconv"
)

type Config struct {
	HTTPAddr      string
	PostgresURL   string
	RedisAddr     string
	RabbitMQURL   string
	RabbitMQQueue string
	WorkerCount   int
}

func Load() Config {
	return Config{
		HTTPAddr:      env("HTTP_ADDR", ":8090"),
		PostgresURL:   env("POSTGRES_URL", "postgres://omni:omni_secret@localhost:5432/omni_service?sslmode=disable"),
		RedisAddr:     env("REDIS_ADDR", "localhost:6379"),
		RabbitMQURL:   env("RABBITMQ_URL", "amqp://omni:omni_secret@localhost:5672/"),
		RabbitMQQueue: env("RABBITMQ_QUEUE", "patient.created"),
		WorkerCount:   envInt("WORKER_COUNT", 4),
	}
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func envInt(key string, fallback int) int {
	value, err := strconv.Atoi(os.Getenv(key))
	if err != nil || value < 1 {
		return fallback
	}
	return value
}
