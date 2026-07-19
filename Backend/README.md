# Backend microservices

Backend is a Maven multi-module project. The root project aggregates independent deployable applications; it is not a Spring Boot application.

## Structure

```text
Backend/
├── api-gateway/                 # Port 8080, routes public API traffic
├── services/
│   └── patient-service/         # Port 8081, owns patient data and migrations
├── compose.yml
└── pom.xml                      # Maven aggregator
```

Each business service owns its source code, configuration, tests, database migrations and container image. New domains should be created as sibling folders under `services/`, not added to `patient-service`.

## Build

```bash
mvn clean verify
```

## Run locally without containers

Start the patient service, then the gateway:

```bash
mvn -pl services/patient-service spring-boot:run
mvn -pl api-gateway spring-boot:run
```

Requests to `http://localhost:8080/api/v1/patients` are forwarded to the patient service.

## Run with Docker Compose

Build the JARs first, then start the stack:

```bash
mvn clean package -DskipTests
docker compose up --build
```
