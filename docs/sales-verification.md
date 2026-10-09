# Buyers and sales integration

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

## Baseline and workflow

Frontend implementation: `6b98cb8`, branch `feat/frontend-sales-integration`. Backend executable: `20a03c7`. ADR-0020 executes ADR-0015 step five following ADR-0019; ADR-0014 keeps all supported API paths under `/api/v1`. The generated pinned Swagger contract remains authoritative. No backend changes or new libraries were necessary.

1. Start the existing backend Docker stack, preserving its database and upload volumes. For the local identity worktree, run `docker compose -f .local/identity/compose.json up -d` there. Start frontend with `docker compose up -d --build frontend`, with ignored `.env` setting `VITE_API_BASE_URL=http://localhost:9292/api/v1`. Read development credentials locally from ignored `.env-dev`; README documents their private preparation.
2. Sign in and select an active organization. Managers and global administrators maintain **Compradores**; members can read references and use permitted sales operations.
3. Upload the invoice in **Documentos**. Create a sale draft with buyer, date/time and explicit lot lines. Enter exact kg, m³ and BRL/kg decimals; comma input is accepted. MTR/CDF references are optional. Selectors are bounded and paginated.
4. Save the draft. It does not reserve stock. Displayed totals come from the server. Save local changes before **Registrar venda** becomes available.
5. Confirm registration with the saved version and invoice. Competing stock allocation or stale versions can reject the action; inspect the response and reload deliberately rather than silently overwriting another operation.
6. Registered sales cannot be edited or deactivated. **Reverter venda** records the compensating transition and restores stock while retaining the sale history. Reverse downstream sales before reversing consumed pressing/sorting records.

Draft deactivation uses its current version. Transition retries keep one Idempotency-Key while the confirmation remains open. Draft creation has no idempotent receipt contract: an uncertain network/server outcome blocks another submission in the mounted form and directs the operator to inspect the list first. Reloading discards local edits and confirmation state; do not assume it preserves a transition retry key.

## Verification commands

Run from the frontend repository:

```powershell
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run api:check
$env:IRR_BACKEND_ENV=(Resolve-Path '../irr-backend-identity/.local/identity/contract.env').Path
$env:VITE_API_BASE_URL='http://localhost:9292/api/v1'
$env:IRR_MAILPIT_URL='http://localhost:8025'
npm run test:contract
$env:IRR_VERIFICATION_MODE='local'
$env:IRR_API_URL='http://localhost:9292/api/v1'
$env:IRR_FRONTEND_URL='http://localhost:5173'
$env:IRR_FRONTEND_COMMIT=(git rev-parse 6b98cb8)
npm run verify:homologation
```

Use the actual full source SHA of the served frontend image for IRR_FRONTEND_COMMIT. Source changes require an image rebuild. Private credentials and fixtures stay ignored. Never run mutation contract tests against production.

## Local evidence — 2026-10-09

- Lint, strict types and production build passed. 116 frontend tests across 15 files and 23 real-backend contract tests across five files passed.
- The API check verified 115 supported operations. Six read-only pair checks passed after Docker restart, including readiness, pinned OpenAPI, exact CORS, served API origin and direct buyer/sale routes. Backend, PostgreSQL, Redis, Mailpit and frontend containers were healthy; volumes were retained.
- Real API tests verify buyer permissions, organization isolation, invoice gating, optimistic conflicts, draft non-reservation, server rounding, posted-record immutability, replay-safe post/reverse and exact stock restoration. Excess stock allocation is rejected at posting.
- Browser testing used an isolated synthetic organization. A 1 kg / 0.1 m³ draft at BRL 2.50/kg was saved, edited to BRL 2.75/kg and saved again. Registration was disabled while edits were unsaved. Registration confirmed saved version 1, displayed server total BRL 2.75 and read-only fields; stock decreased from 10 kg / 1 m³ to 9 kg / 0.9 m³.
- The browser tab could not be resumed after the service interruption because browser policy blocked the action. Browser reversal and a new screenshot were therefore not completed. Cleanup through the existing API compensated the synthetic sale/sorting and deactivated only the fixture organization, retaining history. Contract tests independently verify reversal and exact restoration. Original operational data was not modified.

## Remaining limits and acceptance

No legacy buyer/sale implementation existed to remove. The obsolete Home sales placeholder was replaced by the working navigation entry. Date/search filtering is not invented where Swagger offers only pagination. A linked synthetic PDF verifies attachment linkage, not fiscal authenticity. Sorting/pressing batch and historical-date UX remain incremental work. Full operator/browser acceptance, assistive-technology evaluation, realistic-volume performance, public deployment, external recovery email and release-pair approval remain existing gates. Additional analytics still require product definitions; GPS remains planned after deployment. Local evidence does not freeze a deployed contract or certify the entire platform.
