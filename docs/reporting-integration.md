# Native operational reporting integration

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Recorded 2026-10-09. Continues [ADR-0018](adrs/0018-native-operational-reporting-integration.md), backend ADR-0021 and the existing Master Plan. This is the first approved reporting slice, not completion of all Analytics.

## User workflow and semantics

Sign in, select an active organization, and open **Relatório operacional** in the sidebar (`/reports/operations`). All effective organization members can read it; management privileges are not required. Dates default to the current month through today in America/Sao_Paulo. Apply inclusive dates (maximum 366 days), optionally municipality, route and vehicle. Paginated reference selectors retain inactive routes and fleet for historical queries. Apply filters explicitly; displayed totals carry the backend's actual applied period. Updating results rereads live facts.

The screen uses only GET `/api/v1/reports/operations`, generated OpenAPI types and the shared organization transport. Four cards expose completed executions, reported distance with measured/missing counts, actual elapsed seconds and active collection weight. Decimal quantities stay strings through transport and display; no client aggregation or binary rounding. Empty distance is unknown, measured zero is zero. Execution completion and receipt realization are independent dates. Municipality/route filters exclude unlinked receipts; otherwise their count is visible. Edits and inactivation recalculate future reads.

The existing keyed organization outlet and transport cancellation remove private report state on scope/session changes. Request cleanup prevents late component updates. Loading, safe HTTP errors, retry, empty results and refresh use existing React/components/CSS with Portuguese interface content. No new runtime or tooling dependency, cache, chart package or legacy endpoint is introduced.

## Verification and limits

See [reporting verification](reporting-verification.md) for commands, actual results and executable backend commit. Existing identity, Routes, fleet and intake contracts remain regression gates. Local acceptance does not replace external deployment/homologation, email provider configuration, realistic-volume query review or resolution of the documented build-chain advisories. Exports, productivity, coverage denominators, comparative charts, GPS and BI remain separate product decisions.
