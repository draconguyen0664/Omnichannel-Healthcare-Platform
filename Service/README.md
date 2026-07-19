# Realtime Service

Go service consuming `patient.created` events from RabbitMQ, persisting them to PostgreSQL with pgx, publishing through Redis and broadcasting to WebSocket clients.

## Stack

Go, Gin, Gorilla WebSocket, pgx, go-redis, amqp091-go, Zap, Prometheus, robfig/cron and a bounded worker pool.

## Requirements

- Go 1.25+
- Docker Desktop or PostgreSQL, Redis and RabbitMQ running locally

## Setup

```bash
go mod tidy
docker compose up -d
go run ./cmd/service
```

Endpoints: health `/health`, WebSocket `/ws`, Prometheus `/metrics` on port `8090`.

## Verify

```bash
go fmt ./...
go vet ./...
go test ./...
```
