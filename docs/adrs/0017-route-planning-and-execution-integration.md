# ADR-0017: Route planning and execution integration

- Status: Accepted for incremental implementation; verification pending.
- Date: 2026-10-04.
- Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

## Context and references

Identity is functionally closed under ADR-0016. The owner now authorizes Routes development while external mail/homologation configuration is pending, superseding the former sequencing restriction in ADR-0001/0016. Backend ADR-0019 defines Route/Execution/territory/Collection semantics; backend ADR-0020 defines Analytics & Data planning only. The running generated Swagger remains the executable contract. No Identity rewrite, deprecated endpoint or additional runtime library is justified.

## Decision and sequence

Continue React/TypeScript/Vite/Axios, current SessionProvider, resource pickers, exact decimal/date utilities and the improved native modal. Backend first: additive V4, scoped route/execution API and tests. Capture its verified OpenAPI and regenerate DTOs before frontend domain integration. Add Routes navigation/list/detail/create/edit/inactivate with Municipality/Neighborhood/street coverage and manager guards. Then execution scheduling/detail/start/coverage/complete/cancel with the backend's role/lifecycle/version rules. Extend Collection with completed-execution selection, populate matching fleet/team/time/distance and preserve optional ad hoc workflows. Retire only replaced integration code after verification.

Global administrators can register shared territorial references; MANAGER plans/schedules/cancels only its current active organization; MEMBER reads and records permitted execution progress. The UI does not fabricate associations, authorize by CITY_HALL or suppress server errors. Use Brazilian Portuguese labels and distinguish null measurements from zero. Keep pending/loading/empty/pagination/retry/400/401/403/404/409 states. A stale version prompts reload, never blind overwrite.

## Verification, acceptance and dependencies

Run lint/typecheck/unit/component/real-backend contract/build/OpenAPI checks, both Docker images and browser workflows. Preserve Identity/ledger/intake regressions. Verify route history survives plan edits and Collection points to the executed snapshot. Verify actual organization isolation/global/member permissions and active municipality/neighborhood selection. A successful compile or this ADR alone does not close Routes.

External mail approval, unknown product formulas, vehicle booking/coverage completeness policy, GPS/maps, route terminal corrections and dashboards remain separate. Analytics is planned, with native PostgreSQL/query/API/IRR frontend and shared export definitions; no charts, BI SDK, geometry provider or empty telemetry interface is implemented now. Current tests/actual executed API reference are recorded as implementation advances.
