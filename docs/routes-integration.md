# Routes integration and local operation

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

Frontend decision: [ADR-0017](adrs/0017-route-planning-and-execution-integration.md). Backend authority: ADR-0019 Routes, ADR-0020 Analytics & Data, and the running versioned Swagger. This extends the established integration sequence; it does not replace the Master Plan or ADR-0014. Identity remains IMPLEMENTED / READY FOR HOMOLOGATION. External email provider setup is operationally pending and independent of Routes development.

## Executable contract and implementation

The pinned OpenAPI and generated schema are maintained under `docs/api` and `src/shared/api/schema.d.ts`. Every new service uses the existing Axios client and request-time organization/session handling. No unversioned alias, new library, map SDK, backend redesign or speculative analytics API has been added. The backend runtime is additive V1/V2/V3/V4; no reset.

| Screen | Supported behavior | Authority |
| --- | --- | --- |
| /routes | Bounded plan list, inactive inclusion, details, inactivation confirmation | Scoped read; management controls only when allowed |
| /routes/new and /routes/:id | Create/read/edit complete ordered neighborhood/street coverage, planned km/minutes, status and history | Global/local management; members read |
| Territory dialogs | Register shared municipality IBGE/name/UF and municipality-owned neighborhood | Global administrator only |
| /route-executions | Dated list, route/status filters, pagination and history links | Current organization |
| /route-executions/new | Select active plan, planned departure, existing vehicle/DRIVER/optional crew | Global/local management |
| /route-executions/:id | Preserved context, start, declared coverage, completion/manual distance, cancellation and linked intake action | Scoped operations; management cancellation |
| /intake/collections/new and /intake/collections/:id | Optional completed execution reference; matching assignments/logistics automatically selected | Existing intake authority; immutable existing link |

Plan changes retain execution snapshots. Route municipality cannot be changed: create another plan for another territory. All plan/execution mutations retain version preconditions. On 409, reload and review current state before retry. No automatic stale overwrite. Reference pickers stay paginated and resolve saved identities by GET without downloading whole catalogs. MEMBER controls do not grant management and the server remains authoritative.

Completed execution selection supplies vehicle, driver and crew. Linked actual timing/distance is derived by the backend; the frontend deliberately omits those values from the save payload, preserving exact subsecond timestamps and decimal strings. Existing ad-hoc intake and its free routeDescription remain valid. Replaced legacy structured route integration: none existed; compatible free-text intake remains intentionally supported, not an unversioned endpoint. Referenced vehicle/staff lifecycle is retained by the backend.

## Developer workflow

1. Follow the existing backend setup and start its Docker PostgreSQL/Redis/backend/Mailpit services. Keep storage volumes and RSA keys. Verify `/actuator/health/readiness` and `/v3/api-docs`; Flyway should show successful V1 through V4.
2. Configure the ignored frontend `.env` with `VITE_API_BASE_URL=<backend-origin>/api/v1`. It must match the public/browser-accessible backend, never a Railway internal hostname. The current local verification pair uses `http://localhost:9292/api/v1` and frontend `http://localhost:5173`.
3. Keep development account credentials only in ignored `.env-dev` or the private local backend contract environment. See the README's development-credential instructions. Never prefix passwords/tokens with VITE_, bake them into an image or commit these files. No new Routes-specific secret or environment variable is required.
4. Run `npm ci`, `npm run api:check`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Use `npm run dev -- --host 127.0.0.1` for source development or `docker compose up -d --build frontend` for the existing containerized frontend.
5. Sign in with the configured development account and select an active organization. Global administrators can register reviewed municipality/neighborhood references. Create a complete route, keep it DRAFT until ready, then set ACTIVE.
6. Plan an execution using that route, vehicle, DRIVER and optional distinct crew. Start it, mark only attended areas, and conclude with optional measured km. Cancellation requires administration and a reason. Terminal executions cannot be reopened in this phase.
7. Select a completed execution while recording a collection, or use the execution detail's collection link. Record material inputs/evidence and verify the stored association and actual facts. Changing the reusable plan must not change the execution/collection context.
8. For real local API fixtures, set `IRR_BACKEND_ENV` to the ignored credential file, `VITE_API_BASE_URL` to the local API and `IRR_MAILPIT_URL` to the local Mailpit UI/API. Run `npm run test:contract`. Contract tests refuse non-loopback API targets and redact transport failures.
9. Run the existing read-only `npm run verify:homologation` with the actual candidate URLs/source commit when a matched image pair is running. Local mode is explicit and is not a claim of remote deployment or frozen API acceptance.

Contract fixtures create uniquely named local records and deactivate only their own organizations/users afterward. Routes and linked execution history remain stored in inactive fixture organizations; deliberately named shared territorial test references remain available for reproducible local tests. They are test data, not certified geographic references. Do not run fixture tests on deployed/staging/production data. Do not reset the owner's database to clean up history.

## UX and verification boundaries

Platform content is Brazilian Portuguese. New code/documentation/commit messages are English. Route surfaces reuse application colors, cards, spacing, native dialogs and responsive layouts. Existing reset-password/membership dialogs share the improved accessible headers, context, notices, busy protection and focus restoration.

Component/API tests cover list loading/empty/pagination, permissions, create/edit/deactivate, version conflicts, territorial selections, explicit cancellation/coverage, terminal read-only state, scheduling and completed-collection precision. Transport cases cover 400/401/403/404/409, current selected organization and 401 session clearing. Real contract tests verify dated lifecycle, plan edits preserving snapshots, isolation, exact decimal distance and completed collection linkage. Browser QA complements these checks; compilation alone is not completion.

GPS/maps are PLANNED, without a provider or SDK in this phase. Native Analytics/Reports/Filters/Indicators/Dashboards follow Routes. Data grains/units and PRODUCT DEFINITION REQUIRED formulas are in `docs/data`; neither a formula register nor available source fields mean dashboards are implemented. Remote release/inbox verification remains an operator action using the existing runbooks.

Final local acceptance and remaining release gates: [Routes verification record](routes-verification.md).
