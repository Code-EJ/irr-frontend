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
- Retained temporarily: compatibility exports for old HTTP imports, old route inventory, generic forms, Portuguese legacy domain types and pending workflow screens. They are not evidence of supported workflows.
- Pending workflows are unreachable from the active router. `BaseService` fails closed without making a legacy request; each future feature replaces that boundary with generated v1 DTOs. No fake translation of old domain semantics is provided.
- No obsolete backend endpoint or compatibility alias was restored. No backend feature was added.

## Verification on 2026-09-28

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, zero errors/warnings |
| `npm run typecheck` | Pass, down from 519 diagnostics without relaxing strictness |
| `npm test` | 17 passing transport/fleet adapter tests |
| `npm run test:contract` with private backend env | Four passing real-backend tests: 11-record pagination/filter/update, required scope/cross-organization denial, MEMBER read/write restrictions and immediate revocation, empty-response deactivation |
| Runtime fixture cleanup | Vehicles, temporary member and both temporary organizations deactivated through their APIs; historical soft-deleted rows retained |
| Browser | Invalid login, real development login, required organization selection, manager membership, create/edit/filter/deactivate vehicle, authentication restoration on reload exercised |
| `npm audit` / `npm audit --omit=dev` | Zero known advisories in the installed graph at this observation |

The browser fixture `FE-0928-BROWSER` was deactivated after verification. Checks do not certify intake, processing, sales or reporting UI. There was no blocking backend contract defect in the implemented slice. Swagger's generated success/error descriptions are sparse; runtime tests verify actual empty-success behavior without assuming every delete returns a JSON body.

The next existing Master Plan step is the material category/type/subtype hierarchy with parent filtering and optimistic-version conflicts, followed by intake and its prerequisites. This record must be updated with the subsequent slice's actual evidence before claiming it accepted.
