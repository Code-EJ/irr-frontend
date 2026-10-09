# Integrated acceptance checkpoint

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Recorded: 2026-10-09.

This record executes ADR-0001/0015/0019/0020 and the existing homologation checklist. It is neither a replacement roadmap nor a production certificate. Backend executable baseline: `20a03c7`; frontend refinement: `a528f90`. Exclusively `/api/v1`, current generated Swagger, organization isolation and the modular monolith remain unchanged.

## Current evidence and gates

| Workflow / gate | Local evidence | Remaining acceptance |
| --- | --- | --- |
| Identity, profile, recovery, global/local administration | Existing component and real-backend suite, Mailpit recovery | Operator review; actual external sender and inbox delivery |
| Fleet, team, catalog, documents and intake | Existing scoped contract fixtures | Operator validation with representative records and retained attachments |
| Routes and approved operational report | Existing date/filter/authority contract and presentation tests | Representative-volume performance and field/operator review |
| Sorting, pressing and stock | Real posting/replay, upstream-conflict rejection, exact conservation and compensating reversal | Multi-line processing UX; complete native-browser workflow acceptance |
| Buyers and sales | Exact totals, invoice gate, stale versions, scoped references, post/reverse replay; prior browser draft/update/post and consumed balance | Complete browser reversal and operator fiscal-document review |
| Appearance and accessibility | Shared dialog tests and prior responsive/theme/contrast/font checks | Keyboard and assistive-technology acceptance across all workflows |
| Docker and executable contract | Read-only local pair checks, pinned Swagger and served origin | Public deployment, real image provenance and matched release approval |

## Increment delivered

Optional declared operation date/time now uses existing sortingDate/pressingDate fields. Blank retains backend server-time defaults. Explicit device-local wall time is converted to an instant and preserved in retry payloads; audit timestamps still record submission independently. Tests send -03:00 timestamps and verify matching persisted instants. Posted processing records remain immutable. Detail/reversal dialogs use shared accessible headings, descriptions and footer spacing. A stock conflict retains the confirmation and unchanged retry identity. No backend or dependency change was required.

## Verification

Run from the frontend repository:

```powershell
npm run lint
npm run build
npm test
$env:IRR_BACKEND_ENV=(Resolve-Path '../irr-backend-identity/.local/identity/contract.env').Path
$env:VITE_API_BASE_URL='http://localhost:9292/api/v1'
$env:IRR_MAILPIT_URL='http://localhost:8025'
npm run test:contract
docker compose up -d --build frontend
$env:IRR_VERIFICATION_MODE='local'
$env:IRR_API_URL='http://localhost:9292/api/v1'
$env:IRR_FRONTEND_URL='http://localhost:5173'
$env:IRR_FRONTEND_COMMIT=(git rev-parse a528f90)
npm run verify:homologation
```

Lint, strict types (included in build), production build, 117 frontend tests in 15 files and 23 real API tests in five files passed. Test organizations are isolated; compensation retains history, and original data/volumes are preserved. The rebuilt frontend and existing backend/PostgreSQL/Redis/Mailpit containers were healthy. Six local pair checks and the pinned 115-operation API check passed against the served frontend source a528f90. The existing browser-policy interruption prevents claiming new browser-native verification in this increment.

## Operator walkthrough still required

Use a designated non-production organization and synthetic commercial documents, never operational owner records. Keep IDs and recorded quantities for each step.

1. Verify global administrator and organization manager/member boundaries using designated identities; no permission expansion is needed for testing.
2. Register intake with exact material quantities. Sort a portion with declared rejects, then press its output. Check balances, lots and signed movement history. Check both blank operation dates and an explicit past local time.
3. Create and edit a multi-line sale draft with existing documents. Confirm draft creation does not change stock. Attempt registration without invoice and with stale version; expect rejection and preserved local state.
4. Save the current draft, register once and inspect the authoritative total/stock decrease. Confirm posted fields cannot be edited. Reverse the sale, inspect restored stock and retained history, then reverse downstream pressing before sorting.
5. Exercise keyboard navigation, dialog heading/focus/Escape, mobile width, 200% font, dark theme and high contrast. Record actual browser/operator evidence separately from component tests.
6. Before public release, complete the existing email/deployment/backup/upload persistence and matched-image gates in homologation-verification.md. No local test count replaces those actions.

Additional analytics require approved formulas; GPS remains planned after deployment. Those dependencies do not justify inventing APIs, resetting data or redesigning the backend.
