# WOT Fit Service

Spring Boot 3.2 / Java 21 service implementing the WOT Fit business flow:

- Add owned shoe → create/update Fit Profile
- Validate Fit Profile → compute confidence + profile state
- Get recommendations → return recommended shoes

## Quickstart (local)

### Prereqs

- Java 21

### Configure (optional)

The service reads configuration from environment variables (see `src/main/resources/application.yml`).

- `SERVER_PORT` (default `8080`)
- `DB_URL` (default `jdbc:postgresql://localhost:5432/wot`)
- `DB_USER` (default `wot`)
- `DB_PASSWORD` (default `wot`)
- `CORS_ALLOWED_ORIGINS` (default `*`)

### Run

```bash
./mvnw spring-boot:run
```

### Build + tests

```bash
./mvnw test
```

## Quickstart (Docker)

Build + run app + Postgres:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

## Health

- `GET /health`
- `GET /health/live`
- `GET /health/ready`
- `GET /v1/fit/health`

## API (Fit flow)

All endpoints are under `/api/v1/fit`.

### 1) Add shoe

```bash
curl -sS -X POST "http://localhost:8080/api/v1/fit/add-shoe" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER123",
    "brand": "Nike",
    "model": "Pegasus 40",
    "size": "EU 42",
    "fitFeedback": "PERFECT"
  }'
```

### 2) Validate fit profile

Replace `FP...` with the `fitProfileId` returned from add-shoe.

```bash
curl -sS -X POST "http://localhost:8080/api/v1/fit/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "fitProfileId": "FPXXXXXXXXXX"
  }'
```

### 3) Get recommendations

```bash
curl -sS "http://localhost:8080/api/v1/fit/recommendations?fitProfileId=FPXXXXXXXXXX"
```

## Trace IDs

You may pass `X-Trace-Id` on requests. If omitted, the server generates one and echoes it back.

## Errors

Errors follow a standard shape:

- `errorCode`
- `message`
- `timestamp`
- `traceId`

## OpenAPI

The OpenAPI 3.0+ YAML spec is at:

- `swagger/fit-openapi.yaml`
