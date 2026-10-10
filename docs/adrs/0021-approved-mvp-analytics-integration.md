# ADR-0021: Approved native MVP analytics integration

- Status: Accepted; implementation and verification in progress.
- Date: 2026-10-10.
- Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

## Context, options and decision

Continues ADR-0001/0015/0018 and backend ADR-0022, based on the owner's explicit business approval. Retain existing React/TypeScript/Axios, exact-decimal presentation, shared scope and /api/v1. Select an incremental analytics screen with generated Swagger types. Browser calculations, a frontend rewrite and new chart/BI libraries are rejected because they duplicate backend formulas or add unneeded dependencies.

Backend ADR-0022 is authoritative for completion cohorts, matched comparisons, unique declared-section coverage, weighted kg/h and kg/km, missing/zero exclusions, live sale-date revenue and unsupported geographic revenue attribution. The operations-1 report remains available with its original independent receipt-date semantics. The analytics screen displays definitions, matched/excluded records and raw numerator/denominator totals; unavailable values remain explicit. Product text uses Brazilian Portuguese; engineering docs/code remain English.

## Sequence and acceptance

Backend implementation/tests and actual Swagger capture first; regenerate types, integrate existing period/dimension controls and add protected navigation. Test loading, errors/retry, empty/unavailable values, applied filters, metadata and server-only arithmetic. Verify the actual local pair and browser, recording real screenshots and limitations. Source-only build or fake aggregate results cannot certify integration. Owner processing/sales acceptance does not automatically accept Analytics. No deployment or additional metric family is authorized by this ADR.

## Consequences and risks

Different matched productivity cohorts and live correction semantics require explanations. Geographic filters cannot attribute sales without provenance. This executes existing plans; unresolved exports/alerts/GPS/global comparison requirements stay recorded. See backend ADR-0022 and the central progress register for the complete definition and validation gates.
