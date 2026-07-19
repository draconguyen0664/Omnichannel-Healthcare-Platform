package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/omnihealth/realtime-service/internal/app"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	application, err := app.New(ctx)
	if err != nil {
		panic(err)
	}
	defer application.Close()

	go func() {
		if err := application.Run(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			application.Logger.Error("http server stopped", application.Error(err))
			stop()
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = application.Shutdown(shutdownCtx)
}
