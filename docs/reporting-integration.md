# Native operational reporting integration

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Recorded 2026-10-09. Continues [ADR-0018](adrs/0018-native-operational-reporting-integration.md), backend ADR-0021 and the existing Master Plan. This is the first approved reporting slice, not completion of all Analytics.

## User workflow and semantics

Sign in, select an active organization, and open **Relatório operacional** in the sidebar (`/reports/operations`). All effective organization members can read it; management privileges are not required. Dates default to the current month through today in America/Sao_Paulo. Apply inclusive dates (maximum 366 days), optionally municipality, route and vehicle. Paginated reference selectors retain inactive routes and fleet for historical queries. Apply filters explicitly; displayed totals carry the backend's actual applied period. Updating results rereads live facts.

The screen uses only GET `/api/v1/reports/operations`, generated OpenAPI types and the shared organization transport. Four cards expose completed executions, reported distance with measured/missing counts, actual elapsed seconds and active collection weight. Decimal quantities stay strings through transport and display; no client aggregation or binary rounding. Empty distance is unknown, measured zero is zero. Execution completion and receipt realization are independent dates. Municipality/route filters exclude unlinked receipts; otherwise their count is visible. Edits and inactivation recalculate future reads.

The existing keyed organization outlet and transport cancellation remove private report state on scope/session changes. Request cleanup prevents late component updates. Loading, safe HTTP errors, retry, empty results and refresh use existing React/components/CSS with Portuguese interface content. No new runtime or tooling dependency, cache, chart package or legacy endpoint is introduced.

## Presentation follow-up — 2026-10-09

The owner requested progressive elapsed-time presentation. Backend seconds and definition operations-1 are unchanged. Below 60 seconds, show seconds; below one hour, show minutes and remaining seconds with exact fractions; from one hour, show complete hours/minutes; from one day, include days; from 30 days, include fixed 30-day months; from 365 days, include fixed 365-day years. Months/years are elapsed approximations, marked with an approximation symbol and explained on screen. Complete-minute presentation does not round up. The original decimal seconds remain available in the accessible **Ver segundos exatos** disclosure, including for keyboard/touch users. Integer decomposition uses BigInt without binary precision loss.

Navigation groups existing destinations into Operation, Registers, Results and administrator-only Administration. The separate footer retains the signed-in name, effective role, profile link and sign-out. Only the menu scrolls on desktop; mobile uses bounded grouped navigation. Organization selection stays in the header. Existing route guards and backend authorization remain unchanged. No library, new domain metric or HTTP contract is introduced.

## Verification and limits

See [reporting verification](reporting-verification.md) for commands, actual results and executable backend commit. Existing identity, Routes, fleet and intake contracts remain regression gates. Local acceptance does not replace external deployment/homologation, email provider configuration, realistic-volume query review or resolution of the documented build-chain advisories. Exports, productivity, coverage denominators, comparative charts, GPS and BI remain separate product decisions.
