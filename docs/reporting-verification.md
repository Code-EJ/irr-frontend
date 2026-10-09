# Operational reporting verification

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Recorded 2026-10-09. Continues [ADR-0018](adrs/0018-native-operational-reporting-integration.md), backend ADR-0021 and the existing Master Plans.

## Baseline and implemented scope

Executable backend: 20a03c7cc8cb31e338056917877c733bdda99b6e. Frontend implementation: f063a7c on feat/operational-reporting. Captured actual Swagger and generated types expose 115 supported operations across 64 exclusively versioned paths. The new report reads GET /api/v1/reports/operations. Existing stack and shared organization transport remain unchanged.

The Portuguese screen implements explicit date/municipality/route/vehicle filters, paginated historical reference choices, exact decimal-string totals, missing-km counts, unlinked receipt provenance, empty/loading/error/retry states and live refresh. The current month defaults use America/Sao_Paulo independently of host timezone. Displayed results use the backend's applied period. Organization switching uses the existing keyed outlet and request invalidation. The local public API setting was corrected to port 9292 and the frontend container rebuilt; credentials remain private.

## Commands and results

| Command / gate | Result |
| --- | --- |
| npm run lint | PASS: ESLint with max-warnings=0; generated schemas/private artifacts excluded |
| npm run typecheck | PASS: application, tooling and test configurations |
| npm test | PASS: 83 tests across 10 files; nine report checks |
| npm run test:contract | PASS: 21 tests across five files against actual local backend/PostgreSQL/Redis/Mailpit |
| npm run api:capture / api:generate / api:check | PASS: current Swagger baseline 20a03c7; nullable quantities and filters represented |
| npm run build | PASS: Vite production assets, 1837 transformed modules |
| docker compose up -d --build | PASS: healthy frontend at port 5173, configured API root at port 9292/api/v1 |
| npm audit --omit=dev --audit-level=high | PASS: zero production vulnerabilities in the observed registry response |
| npm run verify:homologation with explicit local mode | PASS: six read-only checks, including exact pinned contract/security, readiness, CORS, direct report URL and served API configuration |
| Backend full Maven verify | PASS from public source-only snapshot: 48 unit + 89 integration tests, including five report tests |

For real-backend checks, use the private IRR_BACKEND_ENV reference, VITE_API_BASE_URL=http://localhost:9292/api/v1 and IRR_MAILPIT_URL=http://localhost:8025. For local pair verification, set IRR_VERIFICATION_MODE=local, IRR_API_URL=http://localhost:9292/api/v1, IRR_FRONTEND_URL=http://localhost:5173 and IRR_FRONTEND_COMMIT to the frontend image's source SHA. Do not substitute local evidence for public deployment approval.

Backend verification used a public-source build snapshot because the original Windows generated target migration file was locked; original source/migrations/permissions were preserved. Spotless also passed in the original worktree. The public HTTPS-only production bundle gate is not applicable to a localhost build and remains a release gate, together with external email/homologation and the documented build-chain advisories.

## Contract findings and follow-up

Browser acceptance also passed against the running containers: existing administrator sign-in; required organization selection; empty report with unknown distance; switch to retained Routes fixture history; route/vehicle filter application; exact 8.125 km, 63.485280 seconds and 1.2345 kg from one execution and one receipt. Organization switching cleared the prior report. The full-page layout was visually reviewed; private local evidence is saved as frontend .local/operational-report.png. These read-only browser checks created no new business fixtures.

Nullable applied filter IDs were explicitly documented in backend Swagger. Existing fleet listing already retains inactive vehicles, so historical selectors required no new backend functionality. No deprecated endpoint or legacy adapter was added; no obsolete frontend closure needed removal for this additive slice. Existing commercial summaries/CSV keep their own rules.

This delivers the first approved operational report, not all Analytics. Remaining metrics, comparative charts, productivity/coverage denominators, exports, targets and GPS require the remaining product decisions. Realistic-volume aggregate latency/query-plan review and operator deployment/homologation remain pending.
