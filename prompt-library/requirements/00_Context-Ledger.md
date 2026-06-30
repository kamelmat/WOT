# Context Ledger (LLM Memory Bank)

## Product & Domain

- **Wizard of Toes (WOT)**: product
- **Fit Engine**: fit intelligence
- **Fit Service**: API service
- **Matching Engine**: internal matcher
- **Fit Profile**: user fit
- **fitProfileId**: profile key
- **Shoe**: owned item
- **brand**: manufacturer
- **model**: shoe model
- **size**: size string
- **Fit Feedback**: perceived fit
- **fitFeedback**: fit enum
- **TIGHT**: fit state
- **PERFECT**: fit state
- **LOOSE**: fit state
- **Fit Score**: match score
- **fitScore**: numeric score
- **Fit Label**: recommendation fit
- **confidence**: certainty
- **profileState**: profile status
- **LOW_CONFIDENCE**: low certainty
- **Feedback loop**: iterative improvement
- **Normalization**: sizing alignment
- **Inconsistent inputs**: conflicting data
- **Low data user**: sparse history

## Business Phases & Behaviors

- **Phase 1**: initiate fit
- **Phase 2**: validate profile
- **Phase 3**: recommend shoes
- **Input validation**: pre-checks
- **Retry (3x)**: transient handling
- **Fallback message**: user-safe error
- **No matches**: closest results
- **Disclaimer**: confidence warning

## API Surface (Business Flow)

- **BASE_URL**: API root
- **Versioning**: `/v1`
- **Add Shoe**: record shoe
- **Validate Fit**: compute confidence
- **Recommendations**: fetch matches
- **POST**: create/action
- **GET**: retrieve
- **/fit/add-shoe**: add endpoint
- **/fit/validate**: validate endpoint
- **/fit/recommendations**: recommend endpoint
- **Status**: response state
- **FIT_RECORDED**: add result
- **VALIDATED**: validation result
- **Request Object**: input DTO
- **Response Object**: output DTO

## Platform & Tech Stack

- **Java 21**: language
- **Spring Boot 3.2.x**: framework
- **Maven**: build tool
- **PostgreSQL**: database
- **Flyway**: migrations
- **/db/migration**: migration path

## Architecture & Code Conventions

- **Layered architecture**: tiered design
- **Controller**: web layer
- **Service**: business layer
- **Repository**: data layer
- **DTO**: API mapping
- **Enum**: fixed values
- **Utilities**: shared helpers
- **No Lombok**: explicit code
- **Explicit constructors**: manual wiring
- **Java conventions**: standard style

## Validation & Error Handling

- **@Valid**: payload validation
- **javax.validation**: validation API
- **Global handler**: centralized errors
- **@ControllerAdvice**: exception handler
- **Error format**: standard payload
- **errorCode**: error key
- **message**: user message
- **timestamp**: event time
- **traceId**: correlation id
- **Sensitive masking**: redaction

## Observability & Audit

- **Structured logs**: key-value logs
- **Audit Service**: audit logger
- **MDC**: logging context
- **SLF4J**: logging API
- **Logback**: logging impl
- **Tracing interceptor**: context injector
- **MDC filter**: trace propagation
- **No manual traceId**: auto-included

## Configuration & Environment

- **Externalized config**: env-driven
- **Env vars**: environment config
- **.env**: local config
- **config.yml**: YAML config
- **config.json**: JSON config
- **No hardcoding**: config-only
- **Configurable port**: env port
- **Local DB**: dev database
- **Container DB**: docker database
- **Timeouts**: request limits
- **Retries**: resilience

## Routing & Health Checks

- **capability-name**: domain label
- **kebab-case**: naming style
- **Base path**: `/api/{capability}`
- **HealthController**: health endpoint
- **/health**: health root
- **/health/live**: liveness
- **/health/ready**: readiness
- **/v1/{capability}/health**: versioned health

## OpenAPI & API Docs

- **OpenAPI 3.0+**: spec version
- **YAML**: spec format
- **Standalone spec**: no annotations
- **Swagger UI**: API viewer
- **Redoc**: API viewer
- **Servers block**: env URLs
- **Info block**: metadata
- **Paths**: endpoint list
- **Components**: schema registry
- **Schemas**: models
- **Examples**: sample payloads
- **Status codes**: 2xx/4xx/5xx
- **Error model**: error schema
- **Correlation header**: trace header
- **CORS**: cross-origin
- **Docs CORS**: docs allowlist
- **swagger/{capability}-openapi.yaml**: spec path

## Build & Compilation

- **Build success**: compiles clean
- **Zero compile errors**: no failures
- **Dependency conflicts**: version mismatch
- **Minimal pom.xml**: standard config

## Containerization & Deployment

- **Multi-stage Dockerfile**: build+runtime
- **docker-compose.yml**: local orchestration
- **Volumes**: persistent storage
- **Network**: container comms
- **Health checks**: service probes
- **Graceful shutdown**: clean stop
- **Layer caching**: build speed
- **Security best practices**: hardened images
- **DB pooling**: connection reuse

## Testing & Quality Guardrails

- **JUnit 5**: test framework
- **Spring Boot test utils**: test tools
- **Integration tests**: cross-layer
- **H2**: in-memory DB
- **Testcontainers**: container tests
- **No Mockito**: no mocking lib
- **Deterministic tests**: stable results
- **Reproducible tests**: repeatable runs
- **Chunk-wise**: staged testing
- **File manifest**: coverage list
- **Run immediately**: test-on-write
- **Fix failures**: unblock next

## Coverage Targets

- **Instructions ≥90%**: coverage bar
- **Branches ≥90%**: coverage bar
- **Lines ≥95%**: coverage bar
- **Methods ≥95%**: coverage bar
- **Classes 100%**: coverage bar

## Test Chunk Order (Strict)

- **Chunk 1**: DTOs
- **Chunk 2**: Entities
- **Chunk 3**: Utilities
- **Chunk 4**: Exceptions
- **Chunk 5**: Controllers
- **Chunk 6**: Services
- **Chunk 7**: Repositories
- **Chunk 8**: Configuration
- **Chunk 9**: Deployment
- **Chunk 10**: Full integration
