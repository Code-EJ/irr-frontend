# Frontend homologation installation handoff

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

Continue the existing Master Plan and backend ADR-0026; no frontend architecture or API changes are required by container storage initialization. The owner requires a new homologation environment, execution in Brazil (preferably São Paulo), and a total BRL 130/month ceiling. Railway-generated domains were initially preferred, but Railway currently publishes São Paulo as CDN only. Brazil-capable provider selection is pending; no foreign fallback is authorized. See [Railway's compute list](https://docs.railway.com/deployments/regions) and [staff clarification](https://station.railway.com/feedback/request-for-brazil-hosting-region-availa-64766196).

## Build and public configuration

Use the maintained Dockerfile and UID 101, port 8080, `/health` and SPA fallback. Supply the final public HTTPS backend origin followed by `/api/v1` as the `VITE_API_BASE_URL` build argument. Never use local origins, private network DNS or backend secrets. The Dockerfile's local default is for development only; explicitly override it for homologation. Changing the origin requires rebuilding the static bundle.

Before promotion, build in an isolated directory/container with the final URL and run `npm run verify:production` against that exact bundle. Record the source SHA and immutable image digest. Configure backend CORS with the exact frontend HTTPS origin, recovery URL ending `/reset-password`, and real Brevo sender through backend-only secret configuration. Use Swagger from the deployed backend as the executable API reference; no deprecated/unversioned endpoints return.

## Verification

Follow the backend repository's `docs/deploy/railway/homologation-installation.md` only if the chosen provider meets the Brazil requirement. The non-root volume initializer has passed isolated tests and actual local backend startup, but real cloud upload/download/restart remains unverified.

For an actual public pair, set `IRR_FRONTEND_URL`, `IRR_API_URL` and the exact `IRR_FRONTEND_COMMIT`, remove local verification mode, and run `npm run verify:homologation` plus `npm run api:check`. These are read-only checks and do not constitute browser acceptance. Record actual HTTPS/CORS/static nested-route results rather than substitute local evidence.

Complete [the final operator/accessibility worksheet](final-operator-review.md), including administrator/member/manager flows, real recovery inbox, keyboard/dialog behavior, themes/contrast/font/reflow, Analytics definitions/filter completeness and opening a valid downloaded PDF. Prior processing acceptance remains valid; untested journeys are not marked accepted.

## Current local evidence

Backend `89e9945` runs Java as UID/GID 10001 and passes health, seven isolated storage scenarios, six read-only actual pair checks and the unchanged 116-operation contract. The running frontend remains application/image baseline `232d60b`; this handoff changes documentation only. Existing full lint/types/build/136-test evidence is not replaced by a false claim of rerunning it. The backend security register retains pending findings despite additional exact vendor-backport evidence. Cloud configuration, provider access, mail, coordinated backups and client acceptance remain separate gates.
