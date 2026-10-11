# Frontend homologation installation handoff

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

Continue the existing Master Plan and backend ADR-0027. The final owner clarification keeps homologation on Railway US East Virginia with provider domains and **synthetic data only**. Future production is planned on a Hostinger VPS in Brazil, preferably São Paulo, after procurement/budget approval. The BRL 130/month ceiling remains, with concurrent-environment allocation pending. No real client data or production backups enter foreign homologation. This supersedes the preceding blanket Brazil-only homologation restriction; it does not change the API or application stack.

## Provisioning checkpoint — 2026-10-11

Backend ADR-0028 authorizes a separate `irr-homologation` project, preserving `lovely-wonder`. Four empty services, three 500 MB volumes, fresh backend-only credentials and resource ceilings have been created. The reserved frontend domain is `https://frontend-homologation-ffac.up.railway.app`; its build variable is `VITE_API_BASE_URL=https://backend-homologation-7600.up.railway.app/api/v1`. These domains are not yet serving the application. No GitHub autodeployment, image/source connection, remote administrator or main merge occurred.

Desired service configuration reads back Virginia with one replica; effective volume locality remains pending because the volume API still reports its initial `sfo` metadata. Final image/security review and real deployment checks remain open. Refer to the backend's `docs/deploy/railway/execution-2026-10-11.md` for exact IDs, limits, confidential-variable handling and execution sequence. Do not put that record's private provisioning files in this repository or a frontend build context.

Fresh local verification passed `npm run lint`, `npm run typecheck`, all 136 tests across 17 files, `npm run build` and `npm run api:check` (116 supported operations against pinned backend `996e36f`). This is local evidence, not a remote smoke test, successful email delivery or operator acceptance. Backend security CI still has the documented Spring advisory gate; no finding was suppressed to enable merge.

## Build and public configuration

Use the maintained Dockerfile and UID 101, port 8080, `/health` and SPA fallback. Supply the final public HTTPS backend origin followed by `/api/v1` as the `VITE_API_BASE_URL` build argument. Never use local origins, private network DNS or backend secrets. The Dockerfile's local default is for development only; explicitly override it for homologation. Changing the origin requires rebuilding the static bundle.

Before promotion, build in an isolated directory/container with the final URL and run `npm run verify:production` against that exact bundle. Record the source SHA and immutable image digest. Configure backend CORS with the exact frontend HTTPS origin, recovery URL ending `/reset-password`, and real Brevo sender through backend-only secret configuration. Use Swagger from the deployed backend as the executable API reference; no deprecated/unversioned endpoints return.

## Verification

Follow the backend repository's `docs/deploy/railway/homologation-installation.md` for synthetic Railway homologation. Production follows its provider-independent `docs/deploy/portable-vps.md` and Hostinger budget plan; portable artifacts live under `deploy/`. The non-root volume initializer has passed isolated tests and actual local backend startup, but real cloud upload/download/restart remains unverified.

For an actual public pair, set `IRR_FRONTEND_URL`, `IRR_API_URL` and the exact `IRR_FRONTEND_COMMIT`, remove local verification mode, and run `npm run verify:homologation` plus `npm run api:check`. These are read-only checks and do not constitute browser acceptance. Record actual HTTPS/CORS/static nested-route results rather than substitute local evidence.

Complete [the final operator/accessibility worksheet](final-operator-review.md), including administrator/member/manager flows, real recovery inbox, keyboard/dialog behavior, themes/contrast/font/reflow, Analytics definitions/filter completeness and opening a valid downloaded PDF. Prior processing acceptance remains valid; untested journeys are not marked accepted.

## Current local evidence

Backend `89e9945` runs Java as UID/GID 10001 and passes health, seven isolated storage scenarios, six read-only actual pair checks and the unchanged 116-operation contract. The running frontend remains application/image baseline `232d60b`; this handoff changes documentation only. Existing full lint/types/build/136-test evidence is not replaced by a false claim of rerunning it. The backend security register retains pending findings despite additional exact vendor-backport evidence. Cloud configuration, provider access, mail, coordinated backups and client acceptance remain separate gates.
