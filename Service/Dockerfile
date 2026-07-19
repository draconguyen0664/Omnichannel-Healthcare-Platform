FROM golang:1.25-alpine AS build
WORKDIR /src
COPY . .
RUN go mod tidy && CGO_ENABLED=0 go build -o /service ./cmd/service

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /service /service
EXPOSE 8090
ENTRYPOINT ["/service"]
