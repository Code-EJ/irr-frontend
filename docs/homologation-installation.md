# Frontend homologation installation handoff

For current human-operated deployment steps, use [manual deployment](manual-deployment.md), which links the complete Railway and portable VPS procedures. This page is a dated evidence/handoff record; historical states below are not installation commands.

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

Continue the existing Master Plan and backend ADR-0027. The final owner clarification keeps homologation on Railway US East Virginia with provider domains and **synthetic data only**. Future production is planned on a Hostinger VPS in Brazil, preferably São Paulo, after procurement/budget approval. The BRL 130/month ceiling remains, with concurrent-environment allocation pending. No real client data or production backups enter foreign homologation. This supersedes the preceding blanket Brazil-only homologation restriction; it does not change the API or application stack.

## Current checkpoint — 2026-10-11: resumed with institutional credits

The owner requested activation after the pause below. Frontend deployment `18bb9965-ce81-48d1-8ce6-52e568ad80d2` from `a4dbac251d03a00afeec0299c9ca8733f1e3ed8b` is SUCCESS; the public JavaScript includes both institutional credits. Backend, PostgreSQL and Redis are also SUCCESS. Six fresh public-pair checks and all 116 pinned v1 operations passed; retained administrator/operator login and the persisted PDF SHA-256 passed. Backend `docs/deploy/railway/resume-2026-10-11.md` records the exact images and sources. Compute billing resumes; synthetic-only data, pending mail and client/security/accessibility boundaries remain. No visual browser acceptance is inferred from served assets.

## Historical checkpoint — 2026-10-11: paused after public verification

The separate synthetic environment successfully served the application before the owner requested a temporary shutdown. All four latest deployments now read **REMOVED**. Volumes, secrets and the previous project are preserved. Persistent volume storage can still consume shared trial credit. The earlier preparation-only statements below are historical; backend `docs/deploy/railway/execution-2026-10-11.md` records deployment identifiers, Virginia runtime/volume verification, the PORT=9191 healthcheck fix, exact public-pair checks and persisted synthetic PDF evidence.

Schedule Paulo's functional session before resuming compute. Start PostgreSQL and Redis, then deploy reviewed backend/frontend sources and repeat the public pair verification, scoped operator login and attachment download. The latest frontend footer change remains local/versioned until that next source upload; CLI uploads do not automatically follow GitHub pushes. Use the private operator credentials for routine client testing and keep the platform administrator account with the owner. Email recovery remains disabled; browser/operator/accessibility acceptance and residual security review are still pending.

The shared institutional footer identifies **Instituto Referência em Resíduos** and **Desenvolvido pela Code Soluções em Tecnologia Jr.** on authenticated pages, login and public recovery pages. It uses existing theme/contrast tokens, wrapping text and semantic footer markup; no new library or API change was introduced. Login branding uses the same institutional name. Lint, types, unit tests and build results are recorded in the release checkpoint. Visual browser acceptance remains pending while cloud services are paused.

Prepared review: [frontend #67](https://github.com/Code-EJ/irr-frontend/pull/67) and [backend #79](https://github.com/Code-EJ/irr-backend/pull/79). Both remain drafts, with no main merge or production-readiness claim.

## Historical provisioning checkpoint — 2026-10-11

Backend ADR-0028 authorizes a separate `irr-homologation` project, preserving `lovely-wonder`. Four empty services, three 500 MB volumes, fresh backend-only credentials and resource ceilings have been created. The reserved frontend domain is `https://frontend-homologation-ffac.up.railway.app`; its build variable is `VITE_API_BASE_URL=https://backend-homologation-7600.up.railway.app/api/v1`. These domains are not yet serving the application. No GitHub autodeployment, image/source connection, remote administrator or main merge occurred.

Desired service configuration reads back Virginia with one replica; effective volume locality remains pending because the volume API still reports its initial `sfo` metadata. Final image/security review and real deployment checks remain open. Refer to the backend's `docs/deploy/railway/execution-2026-10-11.md` for exact IDs, limits, confidential-variable handling and execution sequence. Do not put that record's private provisioning files in this repository or a frontend build context.

Fresh local verification passed `npm run lint`, `npm run typecheck`, all 136 tests across 17 files, `npm run build` and `npm run api:check` (116 supported operations against pinned backend `996e36f`). This is local evidence, not a remote smoke test, successful email delivery or operator acceptance. This earlier backend Spring gate is superseded locally by the supported open-source upgrade checkpoint below; the newly pushed GitHub CI result remains a separate merge requirement. No finding is suppressed.

## Supported backend platform compatibility — 2026-10-11

Backend ADR-0029 implements the owner's free supported Spring decision in `ca8e8df`, with Swagger constraint preservation in `02bc54d`. Boot 4.0.8 / Framework 7.0.9 does not change the frontend business contract. The actual generated Swagger matches the pre-upgrade contract semantically (only environment server origins excluded), so retain the reviewed `996e36f` specification/type baseline rather than recapture it unnecessarily.

Against the new running Docker backend on the retained local database, `IRR_VERIFICATION_MODE=local IRR_API_URL=http://localhost:9292/api/v1 IRR_FRONTEND_URL=http://localhost:5173 IRR_FRONTEND_COMMIT=<current-source-sha> npm run verify:homologation` passed six read-only pair checks. Use PowerShell environment assignments on Windows. The configured API origin is `localhost`; substituting `127.0.0.1` correctly fails the served-bundle origin assertion even though both address loopback. No verification guard was relaxed.

Fresh `npm run lint`, `npm run build` (including all three TypeScript project checks), `npm test` (136 tests / 17 files), and `npm run api:check` (116 v1 operations) pass. Backend's 51 unit / 101 integration tests and 185-coordinate zero-match OSV scan are documented in its dated evidence. This is local compatibility evidence, not browser/operator acceptance or published homologation. Reserved domains remain undeployed; image findings, email setup, effective volume locality and remote checks remain gates. Maintainer: Enzo Ribas (https://github.com/oEnzoRibas).

## Build and public configuration

Use the maintained Dockerfile and UID 101, port 8080, `/health` and SPA fallback. Supply the final public HTTPS backend origin followed by `/api/v1` as the `VITE_API_BASE_URL` build argument. Never use local origins, private network DNS or backend secrets. The Dockerfile's local default is for development only; explicitly override it for homologation. Changing the origin requires rebuilding the static bundle.

Before promotion, build in an isolated directory/container with the final URL and run `npm run verify:production` against that exact bundle. Record the source SHA and immutable image digest. Configure backend CORS with the exact frontend HTTPS origin, recovery URL ending `/reset-password`, and real Brevo sender through backend-only secret configuration. Use Swagger from the deployed backend as the executable API reference; no deprecated/unversioned endpoints return.

## Verification

Follow the backend repository's `docs/deploy/railway/homologation-installation.md` for synthetic Railway homologation. Production follows its provider-independent `docs/deploy/portable-vps.md` and Hostinger budget plan; portable artifacts live under `deploy/`. The non-root volume initializer has passed isolated tests and actual local backend startup, but real cloud upload/download/restart remains unverified.

For an actual public pair, set `IRR_FRONTEND_URL`, `IRR_API_URL` and the exact `IRR_FRONTEND_COMMIT`, remove local verification mode, and run `npm run verify:homologation` plus `npm run api:check`. These are read-only checks and do not constitute browser acceptance. Record actual HTTPS/CORS/static nested-route results rather than substitute local evidence.

Complete [the final operator/accessibility worksheet](final-operator-review.md), including administrator/member/manager flows, real recovery inbox, keyboard/dialog behavior, themes/contrast/font/reflow, Analytics definitions/filter completeness and opening a valid downloaded PDF. Prior processing acceptance remains valid; untested journeys are not marked accepted.

## Current local evidence

Backend `89e9945` runs Java as UID/GID 10001 and passes health, seven isolated storage scenarios, six read-only actual pair checks and the unchanged 116-operation contract. The running frontend remains application/image baseline `232d60b`; this handoff changes documentation only. Existing full lint/types/build/136-test evidence is not replaced by a false claim of rerunning it. The backend security register retains pending findings despite additional exact vendor-backport evidence. Cloud configuration, provider access, mail, coordinated backups and client acceptance remain separate gates.
