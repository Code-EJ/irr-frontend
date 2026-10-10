# IRR frontend

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

React 18, TypeScript, Vite, React Router, Axios, Formik and Tailwind interface for IRR. The current integration uses backend commit **0dc0d1f** and exclusively **/api/v1**. Supported slices are sign-in/current account, organization selection, vehicles, the material category/type/subtype hierarchy, donors, operational staff, documents, collections and donations. Processing, inventory, sales and reports remain gated while their existing Master Plan slices are implemented. A passing build does not mean the whole application is finished.

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

7. Prepare intake references in **Doadores**, **Equipe**, **Veículos** and **Materiais**. A manager maintains these records; operational staff are distinct from application user accounts. Collections require a staff member with the DRIVER role. Reference selectors are paginated; use the next page if the required driver or material is not on the current page.

8. Upload optional PDF/PNG/JPEG evidence (up to 10 MiB) in **Documentos** before starting an intake form. Downloads use authenticated requests. The server permits rename/delete only for the uploader or a manager; a linked document cannot be removed. An authorization or history conflict is displayed rather than silently ignored.

9. Open **Entradas**, choose **Doações** or **Coletas**, and register the receipt. Enter kg and m³ with a decimal comma or point, up to four decimal places and no thousands separator. Collection distance accepts three decimal places; departure/arrival must be supplied together in chronological order. Dates use local browser time and are transmitted as instants. Editing another field preserves the original timestamp precision when the displayed date is unchanged. Donation edits preserve the original donor. Confirmed deactivation is available for unprocessed intake; the backend refuses edits/deactivation once sorting history exists. Intake alone does not create saleable inventory.

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
$env:BACKEND_COMMIT = (git -C ../irr-backend-identity rev-parse HEAD)
$env:OPENAPI_URL = "http://localhost:9292/v3/api-docs"
npm run api:capture
npm run api:generate
git diff -- docs/api src/shared/api/schema.d.ts
~~~

The current capture script requires BACKEND_COMMIT as a full verified Git SHA and OPENAPI_URL for the intended running backend. The pinned metadata identifies the locally verified identity contract. The original 0dc0d1f baseline is historical; v1 freezes only at the first release/homologation manifest. Before accepting a different backend, review the contract diff and validate the matched pair. Do not blindly capture an unrelated running server to make a test pass. CI regenerates types from the pinned snapshot and fails on a tracked diff.

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

This command requires a running local backend and administrator credentials from that file. It tests the actual frontend API adapters, scope isolation, member restrictions, immediate revocation, fleet pagination/mutations, material hierarchy and stale-version refusal. Intake checks cover donor/staff rules, document upload/download/ownership, exact quantities, schedules, paginated driver selection and processed-record conflicts. It creates uniquely named test organizations, members and records, reverses test sorting stock movements and deactivates disposable records and organizations through their APIs. History-bound intake/references remain inside inactive test organizations; no SQL reset or volume deletion is performed. It refuses non-loopback API origins. Do not run it against a production service. Runtime failures are sanitized so Axios credential headers and passwords do not enter test reports.

Browser verification and dated results are in [the integration execution record](docs/frontend-integration.md). Test login/logout, organization switching and representative forms against the running backend; a mock test or bundle alone is insufficient acceptance.

## Repository map

| Path | Responsibility |
| --- | --- |
| src/features/identity | Session bootstrap, current account, organizations and membership |
| src/features/fleet | Generated vehicle DTOs and v1 adapter/form |
| src/features/materials | Scoped three-level catalog and optimistic editing |
| src/features/parties | Organization donors and operational staff maintenance |
| src/features/documents | Protected multipart uploads, downloads and attachment maintenance |
| src/features/intake | Collection/donation workflows, generated DTOs and exact quantity handling |
| src/shared/ui | Paginated reference selection and scoped page loading |
| src/shared/api | Single Axios transport, session invalidation and generated schemas |
| src/route/Router.tsx | Active guarded navigation and pending-workflow gating |
| src/pages/VehiclePages | Integrated fleet pages |
| src/components | Existing shared presentation and typed controls |
| src/pages | Retained active login/fleet presentation; obsolete services/models/bases and unreachable workflow closures were removed after replacement verification |
| tests/contract | Opt-in real-backend acceptance |
| docs/adrs | Historical decisions and ADR-0015 integration decision |
| docs/api | Pinned executable contract and baseline digest |

## Architecture and contribution

Follow [ADR-0001](docs/adrs/0001-master-plan.md), [ADR-0003](docs/adrs/0003-architecture-and-dependencies.md) and [ADR-0015](docs/adrs/0015-frontend-contract-integration.md). ADR-0014 in the backend supersedes old aliases and transitional references in earlier ADRs. [Dependency notes](docs/dependencies.md) describe the retained stack and precise tooling changes. Inventory arithmetic, authorization and domain transitions remain backend responsibilities; later UI slices preserve decimal strings, versions and idempotency semantics.

Use feature/refactor branches and coherent semantic commits. Keep engineering identifiers, documentation and comments in English. All active product UI, accessibility labels and user-facing errors use Brazilian Portuguese (pt-BR), as requested by the owner. ABNT2 refers to the operating-system keyboard layout; the application accepts accented Unicode input without changing the user's keyboard. Use TSDoc/JSDoc in TypeScript and JavaDoc in the backend. Attribute Enzo Ribas (@oEnzoRibas) for these changes without replacing historical contributor credits. Remove legacy code only after the corresponding replacement is verified. No Kubernetes or backend architecture rewrite is part of this frontend phase.

## Identity & Access completion

The next Master Plan gate is first deployment/homologation. [Pair verification instructions](docs/homologation-verification.md) describe `npm run verify:homologation`, which checks health, pinned OpenAPI, exact CORS, direct SPA routes and served API configuration without changing accounts or business data. Local results do not replace external email smoke or operator release approval.

[ADR-0016](docs/adrs/0016-global-identity-and-recovery-integration.md) extends the existing integration; backend ADR-0017/0018 own global authority and recovery policy. Administrador Geral can manage users/organizations and operate in any selected active organization without membership. Administrador da Organização reuses MANAGER and stays local. User creation includes ADMINISTRATOR; the server protects the last active global administrator with 409.

Use Organizations to create/edit/deactivate units and manage MEMBER/MANAGER/revocation. New organization onboarding creates the unit, then creates or selects the responsible user, then grants MANAGER. A failed grant retains the created identifiers for retry. If you leave the page, resume through organization member management. Credentials never belong to Organization or browser storage.

Login → Esqueci minha senha requests a neutral recovery message. The link opens /reset-password with a fragment token, immediately removed from history and held only in memory. Refresh requires reopening the email link. Successful reset clears local session state and returns to login; the backend revokes previous sessions. Invalid, expired or used links require another request. Disabled mail returns an explicit unavailable state.

### Local verification environment

For the isolated identity rehearsal, the backend listens on 9292, frontend on 5273, and local Mailpit on 8025. These are deliberate local overrides; normal README examples use backend 9191/frontend 5173. Keep VITE_API_BASE_URL and backend PASSWORD_RESET_BASE_URL matched to the actual frontend/backend pair. See the backend docs/email-recovery.md for Docker startup and sender configuration.

Local access correction (2026-10-04): the standard frontend at 5173 was rebuilt against the running identity backend at 9292. Its ignored `.env` now sets `VITE_API_BASE_URL=http://localhost:9292/api/v1`; the separate rehearsal frontend at 5273 remains available. The old backend listener at 9191 is stopped. If changing the local API address, update this public value and run `docker compose up -d --build frontend`: restarting an existing static image does not update its compiled API URL. Administrator login, CORS for 5173, the served API origin and container health were verified. Recovery links still use the configured rehearsal frontend at 5273. No database or credential reset was performed.

```powershell
$env:VITE_API_BASE_URL = 'http://localhost:9292/api/v1'
$env:IRR_BACKEND_ENV = (Resolve-Path '../irr-backend-identity/.local/identity/contract.env').Path
$env:IRR_MAILPIT_URL = 'http://localhost:8025'
npm run dev:credentials
npm run test:contract
```

The credentials helper creates ignored .env-dev from the private backend file without printing values. Read that private file locally for development sign-in. It preserves an existing .env-dev; after changing your password, update your private reference deliberately. Vite does not load .env-dev, and no DEV_ADMIN_PASSWORD or mail key may be renamed to VITE_* or included in the bundle. Public examples contain placeholders only.

The contract suite includes real email capture, credential replacement/replay, global authority, organization CRUD and local manager restrictions in addition to earlier identity/fleet/intake workflows. Fixture history is retained in deactivated test organizations, without a database reset. External Brevo sender/domain approval and Railway mail Variables remain operator actions before homologation. The subsequent owner decision permits Routes development while external configuration/homologation remains pending; native reporting follows Routes in ADR-0001.

## Route planning and execution

The current Routes integration includes municipal plans, ordered neighborhood/street coverage, dated fleet/team assignments, start/coverage/completion/cancellation and optional completed-execution collection linkage. Select an organization before opening `/routes`. Global administrators curate territory; organization administration manages plans/scheduling; members record permitted field operations. Platform content is Brazilian Portuguese. See [the Routes development and verification guide](docs/routes-integration.md) for step-by-step Docker/source operation, credentials, tests, exact contract behavior and rollout. No new secret/service is needed. Backend V4 must run before the matching frontend; preserve database volumes. Analytics and GPS remain future phases.

Final local acceptance and remaining release gates: [Routes verification record](docs/routes-verification.md).

## Native operational reporting

Open **Relatório operacional** after selecting an organization. The four approved metrics use the current Swagger contract, exact decimal quantities, Brazilian calendar dates and optional municipality/route/vehicle filters. See [user workflow and development](docs/reporting-integration.md) and [verification evidence](docs/reporting-verification.md). For the local identity worktree stack, set the public VITE_API_BASE_URL in the ignored local environment to http://localhost:9292/api/v1 and rebuild the frontend container. Development credentials remain in the ignored private environment file.

## Navigation and duration

The sidebar groups Operation, Registers, Results and global Administration, with profile/sign-out in the account footer. Operational duration now progresses from seconds to minutes, hours, days, approximate months and years. Expand **Ver segundos exatos** for the original quantity. [Presentation rules and local verification](docs/reporting-verification.md) document the tested boundaries without changing the backend contract.

## Processing and accessibility

Sorting, pressing and read-only organization stock are available through **Triagem**, **Prensagem** and **Estoque**. The global **Acessibilidade** control provides persisted device/light/dark theme, font enlargement and high contrast. See [the workflow, limitations and verification commands](docs/processing-verification.md), maintained by [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Product text remains Brazilian Portuguese; technical documentation remains English.

## Code quality commands

Run `npm run lint` for ESLint with zero warnings allowed, `npm run lint:fix` for deliberate local autofixes, and `npm run typecheck` for TypeScript. CI checks lint and types before testing/building. Generated API types and private local artifacts are excluded from lint. Maintainer: Enzo Ribas (https://github.com/oEnzoRibas).

## Buyers and sales

Open **Compradores** to maintain organization-owned commercial references and **Vendas** to create or edit drafts, register against an invoice and reverse registered sales. Save local edits before registering; drafts do not reserve inventory. Posted and reversed records retain history and are read-only. See [the sales development and verification guide](docs/sales-verification.md) and [ADR-0020](docs/adrs/0020-sales-lifecycle-integration.md). Development credentials remain in the ignored `.env-dev` described above; no secret is bundled or committed.

## Integrated acceptance

[The acceptance record](docs/integrated-acceptance.md) distinguishes automated local evidence from remaining browser/operator and deployment gates. Processing forms accept an optional operation date in the device's local time; blank dates preserve server time. These controls do not edit historical records or change stock policy.

Processing forms also support **Adicionar item ao lote**: queue multiple source lines, review/remove them and submit one atomic operation. Stage/date apply to the whole batch. Pending quantity edits must be added or cleared before registration. See [the processing guide](docs/processing-verification.md) for retry, rollback and historical-record rules.
