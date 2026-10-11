# Manual frontend deployment and operator handoff

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Reviewed 2026-10-11.

This guide is usable without an AI session. The backend repository owns the complete multi-service deployment manual so database, storage and frontend procedures cannot drift into separate architectures. Open its `docs/deploy/operator-guide.md` from the same reviewed release. Current review links:

- [Start here: complete operator guide](https://github.com/Code-EJ/irr-backend/blob/chore/release-readiness/docs/deploy/operator-guide.md).
- [Railway installation, resume, update and shutdown](https://github.com/Code-EJ/irr-backend/blob/chore/release-readiness/docs/deploy/railway/operator-guide.md).
- [Hostinger or another Linux VPS](https://github.com/Code-EJ/irr-backend/blob/chore/release-readiness/docs/deploy/vps-operator-guide.md).
- [Coordinated backup and isolated recovery](https://github.com/Code-EJ/irr-backend/blob/chore/release-readiness/docs/deploy/backup-and-recovery.md).

The links target the release-review branch until merge. When selecting a release, use its exact reviewed backend/frontend commits and keep a copy of the corresponding manuals. The backend guide has commands for both repositories; deploying only this static frontend does not provision its API, database, Redis or uploaded files.

## Frontend-specific checklist

1. Obtain your own GitHub/hosting access and both reviewed commit SHAs. Inspect `git status --short`; do not reset unrelated changes. Use the backend guide's `git archive` procedure for clean source.
2. On the build workstation install Node.js 24, Git and Docker with Linux containers. Run `npm ci`, `npm run lint`, `npm run build`, `npm test` and `npm run api:check` from the reviewed frontend checkout. Stop at a nonzero exit.
3. Decide the final **public HTTPS API origin**. Build with `VITE_API_BASE_URL=https://API-DOMAIN/api/v1`. This is public configuration, not a secret. Never use private Railway DNS or localhost for the deployed browser.
4. Railway: set that value in frontend Variables before uploading the clean source to its explicit project/environment/service. Use its Dockerfile, port 8080 and healthcheck `/health`. Wait for deployment SUCCESS; a CLI upload response does not prove readiness. The complete guide includes the exact current IDs and commands.
5. VPS: build/push the image on the workstation using that public build argument. Record its immutable registry digest as IRR_FRONTEND_IMAGE in the backend hosted.env. The server pulls the image and Caddy serves its domain over HTTPS. Do not put `.env` credentials into the frontend image or rebuild sources on the production server.
6. Backend configuration must allow the exact frontend origin in CORS_ALLOWED_ORIGINS and use its `/reset-password` page in PASSWORD_RESET_BASE_URL. Origin changes require a frontend **rebuild**, not just restarting Nginx or editing runtime variables.
7. Run the commands below, then complete [the operator/accessibility worksheet](final-operator-review.md). Inspect `/login`, a direct nested route and institutional footer, as well as scoped business workflows. Browser visual and client acceptance are separate from a passing build.

## Verify the published pair

PowerShell, from the frontend root after `npm ci`:

```powershell
$env:IRR_FRONTEND_URL = 'https://FRONTEND-DOMAIN'
$env:IRR_API_URL = 'https://BACKEND-DOMAIN/api/v1'
$env:IRR_FRONTEND_COMMIT = 'REPLACE_WITH_FULL_DEPLOYED_FRONTEND_SHA'
Remove-Item Env:IRR_VERIFICATION_MODE -ErrorAction SilentlyContinue
npm run api:check
if ($LASTEXITCODE -ne 0) { throw 'Pinned API contract failed' }
npm run verify:homologation
if ($LASTEXITCODE -ne 0) { throw 'Public verification failed' }
```

Expected: 116 supported pinned v1 operations for the current contract and six public pair checks. Enable backend generated OpenAPI for this verification window when necessary. If counts change in a later approved contract, use that release's evidence; do not edit the check merely to suppress a mismatch.

## Updates, rollback and credentials

Publish a new reviewed image/source upload when frontend code or the API origin changes. On Railway, Git pushes do not update the manually uploaded services. On a VPS, change the immutable frontend image reference and run the guide's Compose update sequence. Retain the previous compatible image/commit, and repeat public checks after a rollback. Never restore database data just to undo a frontend release.

Credentials belong in the backend owner's protected secret store. The existing local handoff path is backend `.local/railway-homologation/.env-homologation`, excluded from Git; a fresh clone cannot contain it. Use an organization-scoped operator for client workflows. Do not embed a default administrator login or password in this repository.

At this documentation checkpoint Railway remains paused. Data/volumes are preserved, storage can still consume credit, and the latest footer is awaiting the next deployment. Recovery email is disabled until the external provider is configured and a real inbox is verified. [The dated installation record](homologation-installation.md) retains evidence; it should not be followed as a fresh command sequence.
