# Integrated acceptance checkpoint

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Recorded: 2026-10-09.

This record executes ADR-0001/0015/0019/0020 and the existing homologation checklist. It is neither a replacement roadmap nor a production certificate. Backend executable baseline: `20a03c7`; frontend refinement: `a528f90`. Exclusively `/api/v1`, current generated Swagger, organization isolation and the modular monolith remain unchanged.

## Current evidence and gates

| Workflow / gate | Local evidence | Remaining acceptance |
| --- | --- | --- |
| Identity, profile, recovery, global/local administration | Existing component and real-backend suite, Mailpit recovery | Operator review; actual external sender and inbox delivery |
| Fleet, team, catalog, documents and intake | Existing scoped contract fixtures | Operator validation with representative records and retained attachments |
| Routes and approved operational report | Existing date/filter/authority contract and presentation tests | Representative-volume performance and field/operator review |
| Sorting, pressing and stock | Real posting/replay, upstream-conflict rejection, exact conservation and compensating reversal | Complete native-browser batch workflow and operator acceptance |
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

## Subsequent batch checkpoint — 2026-10-09

Frontend `9cd733e` delivers the queued multi-line processing UX described in ADR-0019 and the processing guide. Latest evidence: 118 frontend tests and 24 real API tests, including atomic rollback and stock restoration. Earlier test counts remain dated evidence. Backend `20a03c7` remains the executable baseline. The multi-line UX limitation is resolved; browser/operator, representative-volume, accessibility and external release gates remain.

## Uncertain-delivery acceptance correction — 2026-10-09

Frontend `949e13d` resolves a duplicate-operation risk found during acceptance review: unresolved processing commands can no longer be edited into new submissions while their original outcome is unknown. Exact command/key retention and successful-receipt validation are verified by the processing regression suite. Latest full frontend evidence is 121 passing tests, with eight targeted processing tests after the final retry-path refinement, and 24 passing real API tests. Browser/operator and external deployment/email gates remain outstanding.

The owner selected local-only validation for now. Six read-only pair checks and the pinned 115-operation contract check passed against rebuilt frontend source `949e13d`; all five local service containers were healthy. Publication/external email remain future operator gates and are not claimed as executed. Local browser/operator acceptance remains separately pending.

## Larger local batch checkpoint — 2026-10-09

Twenty-five real-backend tests now pass, including a fifty-line sorting/pressing sample, six-page lot completeness/uniqueness, replay, rollback when the final line fails, and exact restoration. The [processing guide](processing-verification.md) records individual observed timings and their limits. This resolves the bounded local larger-batch check; production workload/concurrency and browser/operator acceptance remain separate gates. No frontend runtime or backend contract change was necessary.

## Browser/operator rehearsal — 2026-10-09

The owner volunteered as operator. The actual browser now verified the scoped processing/sales chain, invoice/unsaved-edit gates, downstream reversal conflict, sale reversal, pressing/sorting reversals and final zero balances in a synthetic organization. Accessibility theme/200% font/contrast, Escape and focus restoration were inspected. A read-only-sale readability issue was corrected in frontend `9cb6345`. See [the operator record](operator-homologation.md) for quantities, evidence and review scope. Earlier browser-blocker statements remain historical evidence; the active valid tab was available for this rehearsal. Owner acceptance is still pending and no complete-platform or production acceptance is inferred.

## Scoped operator acceptance — 2026-10-09

The owner accepted the local processing/sales browser workflow recorded in [operator homologation](operator-homologation.md). This resolves that scoped operator gate; valid-PDF viewing remains unverified because the fixture was invalid. Broader identity/fleet/intake/Routes/report operator gates, external email, deployment, persistent-storage recovery and matched-release approval remain separate.
