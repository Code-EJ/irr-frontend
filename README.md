# IRR frontend

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

React 18, TypeScript, Vite, React Router, Axios, Formik and Tailwind interface for IRR. The current integration uses backend commit **0dc0d1f** and exclusively **/api/v1**. Supported slices are sign-in/current account, organization selection, vehicles and the material category/type/subtype hierarchy. Intake, processing, inventory, sales and reports remain gated while their existing Master Plan slices are implemented. A passing build does not mean the whole application is finished.

## Run locally, step by step

1. Start the backend from its repository using its README and existing private environment configuration:

   ~~~powershell
   Set-Location '../back-irr-v2'
   docker compose up -d --build --wait
   ~~~

   Check readiness at http://localhost:9191/actuator/health/readiness. PostgreSQL and Redis are backend-only Docker services. Do not publish them or put their credentials in the browser. Do not delete named volumes to resolve an integration error.

2. Use Node.js 24 and npm. From this frontend repository:

   ~~~powershell
   npm ci
   if (-not (Test-Path .env)) { Copy-Item .env.example .env }
   npm run dev
   ~~~

3. Open http://localhost:5173. Vite binds to loopback on port 5173 and fails explicitly if that port is occupied. The ignored frontend .env contains only VITE_API_BASE_URL=http://localhost:9191/api/v1. Configuration is embedded at build time. Its value must be an HTTP(S) origin with the /api/v1 path and no credentials, query or fragment. A different browser origin must also be allowed by the backend CORS configuration.

4. Create the local credential reference, then open the ignored **.env-dev** file:

   ~~~powershell
   $env:IRR_BACKEND_ENV = (Resolve-Path '../back-irr-v2/.env').Path
   npm run dev:credentials
   notepad .env-dev
   ~~~

   Sign in using DEV_ADMIN_EMAIL and DEV_ADMIN_PASSWORD from that file. The command copies the existing backend development bootstrap credentials without printing them or overwriting an existing file. It does not create/reset an account. If the backend bootstrap credentials change, update this local reference to match the actual development account. The private file is excluded from Git and Docker, is not automatically loaded by Vite, and must never be renamed to a Vite environment file. Database/Redis credentials remain in the backend environment; the browser does not connect to them. There is no public signup/reset-password flow in this contract.

5. Select an organization in the header. The development bootstrap normally provides the explicit IRR Development manager association. If the account has no membership, an administrator must grant one through the backend's documented organization API. Platform administrator status alone does not grant business access. Reloading keeps the session but requires explicit organization selection again.

6. Open Vehicles to list, filter, create, edit or deactivate vehicles. MEMBER can read; MANAGER can maintain fleet records. Open Materials to choose a category and type and work with its subtypes. Edits submit the loaded version; on a conflict, reload the current version, review it, then edit again. Category/type deactivation also deactivates descendants when the backend permits it; operational/inventory references can block deactivation. History is retained.

## Run the frontend in Docker

Keep the backend stack running. Stop Vite or preview before using the same frontend port:

~~~powershell
docker compose up --build -d --wait
docker compose ps
~~~

Open http://localhost:5173 and use the credentials in .env-dev. This repository's Compose project only manages the frontend; the backend repository manages its API, PostgreSQL and Redis. The multi-stage image uses npm ci, compiles with Node 24, and serves the SPA with unprivileged Nginx on container port 8080. Its host binding is loopback-only. The runtime has a read-only filesystem, a temporary /tmp, dropped capabilities and a /health readiness check. Deep links fall back to index.html; missing bundled assets return 404.

The Dockerfile pins base-image digests. VITE_API_BASE_URL is a public build argument; rebuild after changing it. Docker must not consume .env-dev, and passwords must never be passed as build arguments. To return to hot-reload development:

~~~powershell
docker compose stop frontend
npm run dev
~~~

If port 5173 is occupied, stop the other frontend process instead of changing origins silently. If sign-in succeeds but the account has no organization, check the backend development bootstrap and membership through Swagger. A connection error requires checking backend readiness and CORS for http://localhost:5173. Do not reset the database to fix frontend configuration.

## Official API reference and generated types

- [Swagger UI](http://localhost:9191/swagger-ui/index.html)
- [Running OpenAPI](http://localhost:9191/v3/api-docs)
- [Pinned contract metadata](docs/api/baseline.json) and [snapshot](docs/api/openapi.json)

Swagger is the official API documentation. Markdown guides explain integration and operations, not a competing HTTP specification. DTOs are generated into src/shared/api/schema.d.ts. To intentionally review a backend contract change:

~~~powershell
npm run api:capture
npm run api:generate
git diff -- docs/api src/shared/api/schema.d.ts
~~~

The current capture script records the frozen 0dc0d1f baseline. Before accepting a different backend, update that reference deliberately and validate the matched backend/frontend pair. Do not blindly capture an unrelated running server to make a test pass. CI regenerates types from the pinned snapshot and fails on a tracked diff.

## Verify

~~~powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit
npm run preview -- --host 127.0.0.1 --port 5173 --strictPort
~~~

Stop the development server before previewing on the same port. Type checking covers application, tests and Vite/Vitest configuration. Build includes that gate. Unit tests use synthetic credentials and transport adapters; they do not contact a database. GitHub Actions runs the isolated checks; authoring the workflow does not establish that a remote run has passed.

For the explicit **local development backend** acceptance suite:

~~~powershell
$env:IRR_BACKEND_ENV = (Resolve-Path '../back-irr-v2/.env').Path
npm run test:contract
~~~

This command requires a running local backend and administrator credentials from that file. It tests the actual frontend API adapters, scope isolation, member restrictions, immediate revocation, fleet pagination/mutations, material hierarchy and stale-version refusal. It creates uniquely named test organizations, a member and records, then deactivates them through the APIs. Soft-deleted history remains; no SQL reset or volume deletion is performed. It refuses non-loopback API origins. Do not run it against a production service. Runtime failures are sanitized so Axios credential headers and passwords do not enter test reports.

Browser verification and dated results are in [the integration execution record](docs/frontend-integration.md). Test login/logout, organization switching and representative forms against the running backend; a mock test or bundle alone is insufficient acceptance.

## Repository map

| Path | Responsibility |
| --- | --- |
| src/features/identity | Session bootstrap, current account, organizations and membership |
| src/features/fleet | Generated vehicle DTOs and v1 adapter/form |
| src/features/materials | Scoped three-level catalog and optimistic editing |
| src/shared/api | Single Axios transport, session invalidation and generated schemas |
| src/route/Router.tsx | Active guarded navigation and pending-workflow gating |
| src/pages/VehiclePages | Integrated fleet pages |
| src/components | Existing shared presentation and typed controls |
| src/pages, src/models, src/services, src/bases | Remaining legacy workflow code, kept for incremental replacement; legacy BaseService fails closed |
| tests/contract | Opt-in real-backend acceptance |
| docs/adrs | Historical decisions and ADR-0015 integration decision |
| docs/api | Pinned executable contract and baseline digest |

## Architecture and contribution

Follow [ADR-0001](docs/adrs/0001-master-plan.md), [ADR-0003](docs/adrs/0003-architecture-and-dependencies.md) and [ADR-0015](docs/adrs/0015-frontend-contract-integration.md). ADR-0014 in the backend supersedes old aliases and transitional references in earlier ADRs. [Dependency notes](docs/dependencies.md) describe the retained stack and precise tooling changes. Inventory arithmetic, authorization and domain transitions remain backend responsibilities; later UI slices preserve decimal strings, versions and idempotency semantics.

Use feature/refactor branches and coherent semantic commits. Keep engineering identifiers, documentation and comments in English. All active product UI, accessibility labels and user-facing errors use Brazilian Portuguese (pt-BR), as requested by the owner. ABNT2 refers to the operating-system keyboard layout; the application accepts accented Unicode input without changing the user's keyboard. Use TSDoc/JSDoc in TypeScript and JavaDoc in the backend. Attribute Enzo Ribas (@oEnzoRibas) for these changes without replacing historical contributor credits. Remove legacy code only after the corresponding replacement is verified. No Kubernetes or backend architecture rewrite is part of this frontend phase.
