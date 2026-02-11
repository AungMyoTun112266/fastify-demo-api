# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server with hot reload (tsx watch, port 3000)
npm run build            # Compile TypeScript to dist/
npm start                # Run compiled output
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with V8 coverage
npx vitest run tests/integration/create-user.test.ts           # Run single test file
npx vitest run tests/integration/create-user.test.ts -t "201"  # Run single test by name match
```

## Architecture

Fastify 5 API with Zod validation, DynamoDB, and manual dependency injection.

### Request Lifecycle

```
Request → Auth Plugin (Bearer token) → Role Guard (admin/user) → Zod Schema Validation → Controller → Service → Repository → DynamoDB
```

Errors at any layer bubble up to the global error handler (`src/plugins/error-handler.ts`), which returns RFC 7807 Problem Details.

### Module Pattern

Each feature module lives in `src/modules/<name>/` with this structure:

- **module.ts** — Fastify plugin registration with route prefix and role guard
- **route.ts** — Route definitions with Zod schemas for params, query, body, response
- **controller.ts** — Extends `BaseController`, uses `this.handle()` wrapper and response helpers (`ok`, `created`)
- **service.ts** — Business logic; throws domain errors (`ConflictError`, `NotFoundError`)
- **repository.ts** — Implements `Repository<T>` interface; DynamoDB operations
- **schema.ts** — Zod schemas using shared validators from `src/shared/validators/`
- **types.ts** — TypeScript interfaces

### Dependency Injection

Manual constructor injection wired in `src/container/container.ts`. The container creates Repository → Service → Controller and is passed to modules during app setup.

### App Bootstrap

`buildApp()` in `src/app.ts` creates the Fastify instance and registers plugins/modules. The Zod type provider compiler is set separately in `src/server.ts` via `zodPlugin()` before `app.listen()`. Tests must also call `zodPlugin()` — see `tests/helpers/app.ts`.

### Error Handling

All errors extend `HttpError` (abstract) with `statusCode`, `type`, `title`, and `toProblem()` returning RFC 7807. Available errors: `ValidationError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409), `InternalServerError` (500). Throw them from services; the global handler formats the response.

### Validation

Zod schemas defined at the route level. Shared validator factories in `src/shared/validators/` (`requiredString`, `strictBoolean`, `positiveInt`) accept a field name for error messages. The `fastify-type-provider-zod` package provides type inference from schemas.

### Auth

Two layers registered as Fastify plugins using `fastify-plugin`:
1. `authPlugin` — global `preHandler` hook validates `Bearer` token, decorates `request.user`
2. `requireRole(role)` — factory returning a scoped plugin that checks `request.user.role`

Public routes are whitelisted in `authPlugin` via `PUBLIC_ROUTES` array.

## Testing

Integration tests use Fastify's `app.inject()` (no real HTTP server). DynamoDB is mocked with `aws-sdk-client-mock`. Test helpers in `tests/helpers/`: `setup.ts` (DynamoDB mock), `app.ts` (test app factory), `fixtures.ts` (shared test data). Auth header constant: `"Bearer valid-token"`.

## Environment

Zod-validated config in `src/infra/config/env.ts`. Defaults: `NODE_ENV=development`, `AWS_REGION=ap-northeast-1`, `USERS_TABLE=test_user`.
