# ADR-0020: Existing sales lifecycle integration

- Status: Accepted; implemented and locally verified. Operator acceptance remains pending.
- Date: 2026-10-09.
- Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).
- Frontend baseline: `c7bb5f5`, following ADR-0019's initial processing/inventory delivery.
- Backend executable baseline: `20a03c7`; pinned generated Swagger remains the API reference.

## Context and decision drivers

The owner requested continuation of the existing Master Plan. ADR-0015 step five and ADR-0019 explicitly place draft/post/reverse sales after processing and inventory. Current React/TypeScript frontend has shared scoped transport, paginated references, documents and exact decimal handling but no buyer/sale screens. Backend ADR-0014's exclusively `/api/v1` contract remains in force. No backend architecture or new roadmap is required.

## Considered options and decision

| Option | Benefits | Costs / consequences | Outcome |
| --- | --- | --- | --- |
| Generic editable sales CRUD | Small superficial UI | Allows misleading edits to posted financial/stock history | Rejected |
| New backend functionality or client stock calculations | Flexible UI | Duplicates ledger authority and expands scope without a demonstrated defect | Rejected |
| Feature-owned buyer and sale adapters with explicit lifecycle | Matches executable contract, reviewable incremental delivery | Requires version/conflict and uncertain-transition handling | Selected |

Integrate paginated buyer reference CRUD; only organization managers/global administrators see buyer mutation controls, while members can read buyers and operate the permitted sale workflow. Buyer identity is not donor or user identity. Draft creation/replacement does not reserve stock. PUT and draft deactivation retain the current optimistic version. Posted and reversed records are read-only.

Use exact kg/m³ and BRL-per-kg decimal strings. Display server-calculated rounded line/header totals; never authorize a sale from the browser's availability snapshot. Posting requires an existing organization-owned invoice attachment; optional MTR/CDF remain distinct references. Existing authenticated document download remains the file access path. Posting and reversal use explicit confirmation, current version and stable Idempotency-Key for unchanged transition retries. Do not silently retry writes, hide version conflicts or present draft creation as idempotent: POST draft has no receipt contract. After uncertain draft creation, consult the list before repeating.

## Sequence and acceptance

Implement buyers, then sale list/detail, editable drafts with bounded lot/reference selection, draft deactivation and post/reverse confirmation. Preserve scoped transport cancellation, Portuguese product text, English engineering documentation and existing libraries. Initially allow explicit line selection from bounded lot pages; existing draft lines remain editable without inventing a single-lot endpoint. Replacing a draft retains all declared lines and attachment references.

Lint, strict types, component tests and build must pass. Verify the real local intake → sorting → sale draft/update → invoice-gated post/replay → reversal workflow, stock conservation, version conflicts, member/reference permissions and organization isolation using isolated fixtures. Inspect actual served browser screens; record the difference between API test evidence and operator acceptance. No compile-only completion claim or automatic production deployment.

## Consequences, risks and dependencies

The ledger stays authoritative; competing allocations may reject posting with conflict even after a draft is saved. Stock is not reserved by draft creation. Fiscal authenticity is an operator responsibility; attaching a test PDF proves API linkage, not legal invoice validity. Historical dates use the existing date-time contract and current display conventions, without adding unapproved reporting formulas. Real-volume performance, public deployment, external email and full operator acceptance remain existing release gates. Additional analytics definitions remain PRODUCT DEFINITION REQUIRED. Source/material labels and batch UX can improve incrementally without replacing the architecture.

## Execution checkpoint — 2026-10-09

Implementation `6b98cb8` delivers scoped buyers and the complete existing sale draft/update/deactivate/post/reverse UI. Read-only release checks include buyer and sale SPA routes. [The sales verification guide](../sales-verification.md) records exact commands, evidence and limitations. No backend endpoint, dependency or architecture change was required. This checkpoint does not certify production or full operator acceptance.
