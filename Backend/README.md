# Omni Health Backend

Java 23 / Spring Boot 4 backend using MySQL, Redis and RabbitMQ.

## Start infrastructure

```bash
docker compose up -d
```

## Run

```bash
./mvnw spring-boot:run
```

Defaults: API `http://localhost:8080`, Swagger UI `/swagger-ui.html`, health `/actuator/health`, Prometheus `/actuator/prometheus`.

Development Basic Auth defaults to `admin` / `change-me`. Override all credentials through the environment variables documented in `application.yml` before deployment.

## Verify

```bash
./mvnw test
./mvnw verify
```
