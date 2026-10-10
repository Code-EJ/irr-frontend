# Processing and inventory integration

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

This implements the owner-selected sequence in [ADR-0019](adrs/0019-processing-and-inventory-integration.md), resuming ADR-0015 and the existing Master Plan. Backend executable reference: `20a03c7`; the checked-in Swagger and generated types remain authoritative. All business requests use the shared `/api/v1` transport and the selected organization's header. No backend or migration changes were needed.

## Supported workflow

1. Select an organization in the header. Register a donation or collection with an active material subtype if no suitable input exists.
2. Open **Triagem**, then **Registrar triagem**. Select donation/collection, a paginated receipt and its input line; choose the sorting stage. Enter gross kg/m³ and nonnegative reject kg/m³. The backend validates remaining input and posts net stock. Original intake quantities are explicitly not presented as remaining availability.
3. Open **Estoque** to inspect authoritative **Saldos**, **Lotes** and immutable signed **Movimentações**. These screens are read-only; quantities are never recomputed with floating-point arithmetic.
4. Open **Prensagem**, then **Registrar prensagem**. Select a paginated available sorting lot. Enter conserved kg, initial m³ and strictly smaller final m³. The backend checks the selected subtype and current availability atomically.
5. Use **Consultar** to view the original posted lines. Use **Reverter**, review the confirmation and confirm an eligible correction. Reverse downstream processing first: consumed sorting cannot be reversed while a pressing depends on it. Reversed records remain readable.

Creation and reversal use explicit `Idempotency-Key` values. Retrying an unchanged command in the same mounted form/confirmation reuses its key after an uncertain network response. Editing a submitted payload generates a new key. Keys are not persisted across navigation/reload: consult posted history before repeating a command after leaving the form. Do not interpret browser reload as automatic replay. Organization changes unmount the scoped screen and cancel outstanding scoped requests.

The first forms post one source line per operation and use the server's current time. Multi-line batches, explicit historical date entry and richer source/material labels remain incremental UI refinements. Empty eligible-lot pages can occur because consumed/pressed lots are excluded locally; continue through the server's bounded pages. No new endpoint is assumed for direct lot lookup. Sales is the subsequent established integration, not part of this slice.

## Reproduce verification

Run from the frontend repository:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
$env:IRR_BACKEND_ENV=(Resolve-Path ../irr-backend-identity/.local/identity/contract.env).Path
$env:VITE_API_BASE_URL='http://localhost:9292/api/v1'
$env:IRR_MAILPIT_URL='http://localhost:8025'
npm run test:contract
docker compose up -d --build
$env:IRR_VERIFICATION_MODE='local'
$env:IRR_API_URL='http://localhost:9292/api/v1'
$env:IRR_FRONTEND_URL='http://localhost:5173'
$env:IRR_FRONTEND_COMMIT=(git rev-parse HEAD)
npm run verify:homologation
```

The contract suite requires the private local development environment; never publish its credentials or test against production. Tests create isolated organizations and retain posted history after compensating reversals rather than resetting the database. Existing application data is preserved. Local verification is distinct from operator acceptance and public deployment.

## Accessibility preferences

The **Acessibilidade** launcher is available on login and authenticated screens. Choose device/light/dark theme, 100/125/150/200 percent font size and independent high contrast; **Restaurar padrão** restores device theme, default size and normal contrast. Preferences apply immediately and persist locally under `irr.appearance.v1`, including after reload; they contain no credentials or account policy. Cross-tab changes synchronize, and device theme changes apply while following the device. Unavailable or malformed storage falls back safely; blocked writes still allow current-session changes. Reduced motion follows the device setting. Browser zoom remains supported.

Shared dialogs preserve keyboard focus, Escape and scrollable content; native fields and semantic colors follow appearance preferences. This is an accessibility improvement, not a claim of complete WCAG compliance. Comprehensive assistive-technology and operator evaluation remain release checks.

## Local verification evidence — 2026-10-09

- Frontend ESLint passed with zero warnings; TypeScript and production build passed. Full component/unit suite: 111 tests across 14 files passed after selecting jsdom for the processing component tests.
- Real local backend: 22 contract tests across five files passed. The processing test posts and replays pressing as an organization member, validates unchanged weight and exact reduced volume, reads lots/movements, rejects upstream reversal and foreign-organization lookup, and replays the compensating reversal with exact quantity restoration.
- Docker Desktop was restarted after the engine was found offline. Existing backend, PostgreSQL, Redis, Mailpit and rebuilt frontend containers became healthy; volumes were preserved.
- Six local homologation checks passed, including exact CORS, pinned Swagger compatibility, readiness and served API origin. Direct SPA route checks now include sorting, pressing and inventory.
- Browser inspection used the served frontend and running backend: scoped triage list, collection pagination and receipt items loaded; pressing form and empty available-lot state were checked. Original operational receipts were inspected without posting against them. Real mutations/reversals were verified by the isolated contract fixtures, rather than claimed as completed browser/operator acceptance.
- Dark theme, maximum font size, high contrast and persistence were inspected. Responsive 390×844 checks exposed and led to corrections for preference grid sizing and long dialog headings. Ignored local screenshots are visual evidence, not repository assets.

No legacy processing screens existed in the current source tree to delete. The obsolete Home placeholder for processing/stock was replaced with the remaining sales milestone. Existing technology and shared UI/transport were preserved; no new library or backend endpoint was added. Sales integration, batch/historical-date UX, operator acceptance, external email/deployment and unapproved indicator definitions remain open.

## Subsequent sales checkpoint — 2026-10-09

The historical processing evidence above remains unchanged. The subsequent sales milestone is now implemented and locally verified under ADR-0020; see [sales workflow and verification](sales-verification.md). Batch/historical-date UX, operator acceptance, external email/deployment and unapproved indicator definitions remain open.

## Declared operation dates and dialog refinement — 2026-10-09

Triagem and Prensagem now accept optional **Data e hora da operação**. Leave it blank for server time; otherwise use the local time of this device. The frontend sends the corresponding instant through the existing Swagger field. Audit time remains separate. Unchanged retry payloads preserve the same explicit instant and Idempotency-Key. Historical posted records remain immutable. Multi-line batches are still pending.

Frontend `a528f90` passed lint, typecheck and build, 117 component/unit tests across 15 files and 23 contract tests across five files. The real backend verifies explicit sorting/pressing dates with a -03:00 offset, idempotent replay and stock conservation. Reversal component tests keep the labelled confirmation and retry key after a stock conflict. Processing detail/reversal dialogs now reuse the shared heading/description/footer instead of nested cards. Browser-native visual acceptance is still pending; component evidence is not presented as browser verification.

## Multi-line batches — 2026-10-09

1. Select an intake item or available sorted lot and enter exact quantities.
2. Select **Adicionar item ao lote** to retain a normalized snapshot. Select another source or page and repeat. The queue displays source, weight, volume, rejects or final volume. Use **Remover item** to correct a line by removing and adding it again.
3. Review the complete queue. Sorting stage and optional operation date apply to every line in this operation. Pending quantity edits must be added or cleared before submission; the frontend refuses to discard them silently.
4. Register the operation once. All queued lines are sent in one existing Swagger command; failure rejects the entire batch. Repeated source lines share cumulative backend availability checks. Without queued lines, the previous one-item workflow remains supported.
5. On uncertain delivery, repeat an unchanged command from the same mounted form. Changes produce a new command identity; inspect the operation list before editing/repeating an uncertain command to avoid creating an additional intended operation. Navigation/reload does not retain the queue or retry key.

Frontend `9cd733e` passed lint, strict types/build and 118 tests across 15 files. The 24 real-backend tests across five files now include multi-source sorting, multi-bale pressing, replay, a conflict in the second bale with full rollback, upstream reversal rejection and exact stock restoration. Fixtures use new isolated receipts and retain reversed history; cleanup checks current state before reversing. An initial test correctly failed because its older receipt was already fully processed; a new unconsumed fixture replaced that incorrect assumption. Docker was restarted after a connectivity failure; no database reset was performed. New browser visual/operator acceptance is not claimed.
