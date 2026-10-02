# Frontend integration execution record

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

This record implements [ADR-0015](adrs/0015-frontend-contract-integration.md), using backend commit `0dc0d1f`. It does not replace the Master Plan. The historical audit remains in ADR-0001/0003; the running Swagger contract and ADR-0014 govern all current requests.

## First slice: quality gates, identity and fleet

The initial clean frontend was `cb86727` on `general-frontend-refactor`. ADR-0015 was committed before code in `84f47c1`; tooling and the pinned OpenAPI were committed in `c9078e1`. Existing user changes were absent. The backend repository remains unchanged.

The 519 original strict TypeScript diagnostics were repaired through shared component props, typed forms, correct response consumption, ISO date types, optional-value handling and unused-code cleanup. The compiler retains strictness and checks the complete application, including gated legacy screens. ESLint now uses `typescript-eslint` and checks TS/TSX; hook dependencies and undefined legacy demonstration references were repaired. The production build includes type checking. A new test suite exercises transport and feature contracts.

The active interface now has a single router and HTTP client, current-account lookup, explicit organization selection and server-derived membership. It no longer logs tokens or captures authorization at module initialization. Scope/session changes abort pending requests; late responses are rejected. Organization selection deliberately resets on reload; authentication is restored and revalidated. Protected 401 clears the session. MEMBER cannot open manager-only forms; backend authorization remains definitive.

Fleet supports scoped paginated/filterable lists, UUID-preserving navigation, create, PUT edit and confirmed deactivation. It accepts successful empty responses without inventing a deleted entity. Server errors remain visible. Styling reuses the existing green palette, cards, Formik controls and logo.

## Legacy disposition

- Replaced: active event-driven router, duplicated Axios instances, hardcoded Railway origin, `senha`/`access_token` login, token-derived profile display and fleet page implementations.
- Retained temporarily: compatibility exports for old HTTP imports, generic forms, Portuguese legacy domain types and pending workflow screens. They are not evidence of supported workflows.
- Pending workflows are unreachable from the active router. `BaseService` fails closed without making a legacy request; each future feature replaces that boundary with generated v1 DTOs. No fake translation of old domain semantics is provided.
- No obsolete backend endpoint or compatibility alias was restored. No backend feature was added.

## Verification on 2026-09-28

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, zero errors/warnings |
| `npm run typecheck` | Pass, down from 519 diagnostics without relaxing strictness |
| `npm test` | 23 passing transport/fleet/material adapter tests |
| `npm run test:contract` with private backend env | Seven passing real-backend tests: 11-record pagination/filter/update, required scope/cross-organization denial, MEMBER read/write restrictions and immediate revocation, empty-response deactivation, catalog parent filtering, optimistic conflicts, scoped permissions and unused-hierarchy deactivation |
| Runtime fixture cleanup | Vehicles, temporary member and both temporary organizations deactivated through their APIs; historical soft-deleted rows retained |
| Browser | Invalid login, real development login, required organization selection, manager membership, create/edit/filter/deactivate vehicle, authentication restoration on reload exercised |
| `npm audit` / `npm audit --omit=dev` | Zero known advisories in the installed graph at this observation |

The browser fixture `FE-0928-BROWSER` was deactivated after verification. Checks do not certify intake, processing, sales or reporting UI. There was no blocking backend contract defect in the implemented slice. Swagger's generated success/error descriptions are sparse; runtime tests verify actual empty-success behavior without assuming every delete returns a JSON body.

At that checkpoint, the next existing Master Plan step was intake and its donor/team/document prerequisites. The intake execution below advances that step; processing, inventory, sales and reporting remain pending.

## Material slice and presentation consolidation

The scoped category/type/subtype hierarchy now supports parent filtering, pagination, manager creation/versioned edits and confirmed deactivation. A stale edit displays a conflict and blocks saving until the latest version is reloaded; no write is silently replayed. The backend intentionally cascades deactivation to unused descendants and rejects operational/inventory references. This was verified against the real contract and is not a backend defect.

Removed the replaced six Typology/SubTypology pages, obsolete route inventory and old vehicle service after replacement verification. Other legacy workflows stay gated. Cross-tab logout invalidates private views, and requests queued for an old organization are cancelled before sending.

The active interface uses pt-BR and a responsive green visual system: sidebar/mobile navigation, overview shortcuts, organization/account header, clearer fleet tables and catalog panels, and native modal dialogs. Native dialogs trap focus, support Escape when idle and restore focus after closing. This does not add libraries or change backend domain rules. Development credentials are kept in ignored .env-dev; the README documents their origin and startup/test steps.

The frontend now has a reproducible multi-stage Docker image and its own Compose project, with unprivileged Nginx, SPA deep links, a read-only runtime and loopback host access. Backend source and its Maven/Docker work remain unchanged at 0dc0d1f.

## Final checks for the presentation/container slice

- `npm run lint`: passed with no errors or warnings.
- `npm run typecheck` and `npm run build`: passed for application, configuration and acceptance-test types. The Docker build also passed using the locked clean installation.
- `npm test`: 23 passed. `npm run test:contract`: 7 passed against the running backend, including scoped catalog conflicts and hierarchy behavior.
- `npm run api:check`: verified all 89 supported operations. `npm run api:generate` followed by `git diff --exit-code -- src/shared/api/schema.d.ts`: no contract drift.
- `npm audit --omit=dev`: zero known advisories. Docker's complete clean-install audit also reported zero; deprecation notices are recorded separately in dependency notes.
- `npm run dev:credentials`: preserved the existing ignored credential file without printing its values. `git check-ignore .env-dev` confirmed exclusion; `git ls-files .env-dev` was empty.
- `docker compose up --build -d --wait`: passed. `/health` returned ready and `/materials` returned 200 via SPA fallback. Runtime user is nginx (UID 101); host access remains 127.0.0.1:5173. Backend, PostgreSQL and Redis remained healthy.
- Browser: Portuguese login/error/logout, explicit organization selection, catalog access and native dialog cancel/focus restoration verified in the final Docker bundle. Accented category creation and deactivation were exercised against the real backend before packaging; the temporary record was deactivated. Existing backend fixture data was preserved.
- Responsive checks: fleet list/form, catalog and its modal inspected at 390 × 844. No horizontal document overflow was observed. The temporary viewport override was reset. Desktop overview and mobile fleet evidence are saved locally under `.local/verification/`; they are not committed or copied into Docker.

Implementation commits: `791eb9f` (catalog/contracts), `29933ee` (Portuguese interface and visual refresh), `8a06cc1` (modal focus restoration), `07311a0` (Docker). All remain on `general-frontend-refactor`. No blocking backend defect was found and no backend file was changed. Remote CI has not been claimed as executed.

## Intake slice: implementation boundaries

The next ADR-0015 slice integrates donors, operational team members and attachments before collections and donations. This uses the existing 0dc0d1f contract and introduces no new architectural decision or backend feature. Organization managers maintain donors/team reference data; members may record intake. Attachment rename/delete is restricted by the server to its uploader or a manager; the public metadata does not expose uploader identity, so the UI must handle denied actions explicitly.

Use exact decimal strings for weights/volumes and a non-authoritative exact sum for the required declared total. The backend validates that sum and owns inventory; raw intake does not credit saleable stock. Dates are entered in local time and sent as offset-aware instants. Collection schedules require both departure and arrival in chronological order; DRIVER staff are selected separately from helpers/operators. Donation edits preserve donor identity because the update DTO does not accept a donor change. Processed intake is immutable and returns a conflict; never simulate a successful edit or silently retry it.

Acceptance requires donor/team maintenance and permission checks, paginated reference selection, protected upload/download/rename/delete, collection/donation creation and editing with decimal strings, organization isolation, processed-record conflict handling, browser verification and fixture cleanup. New routes must remain scoped; obsolete pages are removed only after replacements pass these checks. Remaining processing/sales/reporting workflows stay gated.

## Intake execution and verification, 2026-09-29 through 2026-09-30

ADR-0015 step 4 now has scoped donor, operational staff, document, donation and collection screens. No additional ADR was needed: the implementation follows ADR-0001/0003 and the accepted integration sequence, with ADR-0014 and backend `0dc0d1f` remaining authoritative. No backend source was changed and no blocking backend contract defect was discovered. The running OpenAPI was structurally equal to the pinned contract; formatting/order differences alone do not justify replacing the baseline.

Donor/staff maintenance is manager-only. Members can record intake. Paginated selectors hydrate existing UUID references, including values outside the current option page. Driver selection filters the current staff page while preserving server pagination, so a page containing only helpers does not hide drivers on later pages. The donor is read-only on donation edits. Attachments use multipart `documento`, authenticated blob downloads and the server's ownership rules. Metadata does not expose uploader identity, so rename/delete authorization remains a server decision with an explicit error in the UI.

Quantities remain decimal strings. BigInt arithmetic computes only the required declared weight; the server validates totals and owns inventory. The form rejects totals outside the backend precision, duplicate collection crew, repeated drivers and incomplete/reversed schedules. An unchanged displayed timestamp retains its original instant and sub-minute precision rather than truncating it during an unrelated edit. Mutations are never silently replayed after conflicts.

Removed 15 replaced create/list/update pages under `DonatorPages`, `DriverPages`, `DocumentPages`, `DonationPages` and `CollectionPages` after real contract and browser verification. The redundant explicit CollectionCreate compiler include was removed; the complete `src` tree remains checked. Legacy services/models still needed by gated processing screens remain until their replacements work.

Verification evidence:

- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` passed. There are 38 passing unit tests, including decimal validation, exact sums, unchanged timestamp preservation, scoped pagination and multipart/empty-response adapters.
- `npm run test:contract` passed all 15 tests against the running Docker backend. New coverage includes donor addresses, manager/member permissions, a driver on page two, upload/download/rename/ownership, donation and collection edits, total mismatch, invalid crew/schedules, cross-organization denial and history-bound deactivation conflicts. Sorting a test donation verifies the backend refuses subsequent intake editing/deactivation.
- Browser checks created a donor and driver, uploaded and renamed evidence, created/edited/deactivated a donation, and created/edited/deactivated a collection with vehicle, driver, route and schedule. Donation weight `0.2345` remained persisted after container restart; collection weight changed from `12.3456` to `13.4567` and appeared correctly in the list. The browser download event timed out, but the actual downloaded file existed and its hash matched the uploaded fixture; event capture was not used to claim a failed application download.
- Collection list and form were inspected at a 390 × 844 viewport. No horizontal document overflow was present; wide tables scroll inside their own container. The temporary viewport was reset. Local screenshots are under `.local/verification/intake-desktop.png` and `intake-mobile.png`, excluded from source control and the image.
- Test fixtures were cleaned through supported APIs. Both browser intake records were deactivated and their isolated organization was deactivated. Contract tests reversed their sorting movements and deactivated temporary users/organizations; references required by history remain inside inactive test organizations. Existing development data and database volumes were preserved.
- `docker compose up --build -d --wait` rebuilt the frontend successfully and reported it healthy. Backend, PostgreSQL and Redis were restarted with existing volumes and reported healthy. No remote CI or production deployment is claimed.

The next existing ADR-0015 step is sorting, pressing, read-only inventory and draft/post/reverse sales, followed by reporting. These must preserve backend idempotency, reversal and stock semantics; the remaining legacy screens are still gated. Intake acceptance does not establish completion of the whole frontend.

Implementation commits on `general-frontend-refactor`: `d19834c` (acceptance boundaries), `98c3a7f` (contracts, exact quantities and acceptance tests), and `26677b4` (screens, timestamp preservation and legacy retirement). The final Docker bundle was reloaded after rebuilding, and the deactivated browser test organization no longer appeared in the membership selector.
