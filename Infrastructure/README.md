# Infrastructure

Local/staging infrastructure for the Omni Health platform.

## Included

Docker Compose, Traefik, MySQL, Redis, RabbitMQ, MinIO (S3-compatible), Prometheus, Grafana, Loki, Tempo, OpenTelemetry Collector, Grafana Alloy, Sentry integration, k6 and advanced Kubernetes manifests.

## Start local infrastructure

```bash
copy .env.example .env
docker compose up -d
```

Useful endpoints:

- Traefik dashboard: `http://localhost:8081`
- Grafana: `http://grafana.localhost` or `http://localhost:3001`
- Prometheus: `http://localhost:9090`
- MinIO Console: `http://minio.localhost` or `http://localhost:9001`
- RabbitMQ management: `http://localhost:15672`

## Load test

```bash
docker compose -f k6/compose.k6.yml run --rm k6
```

## Kubernetes (advanced phase)

Review image names and create secrets with an external secret manager before applying:

```bash
kubectl apply -k kubernetes/base
```

Do not apply `secret.example.yml` unchanged.
