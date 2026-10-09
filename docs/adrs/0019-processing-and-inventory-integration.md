# ADR-0019: Processing and read-only inventory integration

- Status: Accepted; implementation in progress.
- Date: 2026-10-09.
- Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

## Context and drivers

The owner explicitly selected sorting, pressing and stock as the next integration after accessibility. This resumes the sequence already established in ADR-0015 and ADR-0001 after the owner-prioritized Routes/reporting slices. Backend ADR-0014's v1-only contract and the actual Swagger baseline 20a03c7 remain authoritative. No backend redesign or new roadmap is introduced. Current frontend retains React, TypeScript, Axios, native dialogs and exact decimal strings.

## Decision and considered options

Implement feature-owned adapters and incremental screens for posted sorting, posted pressing, explicit reversal and read-only balances/lots/movements. Reuse the shared organization transport, paginated selectors, exact quantities and server-enforced stock invariants. Rewriting the frontend, generic CRUD abstractions and direct stock editing are rejected: processing is transactional posting, not freely editable CRUD. Existing disabled legacy workflows remain until a verified replacement permits removal.

Sorting consumes explicitly selected collection/donation input and produces net stock after declared rejects. Pressing selects an available sorted lot, preserves source mass and reduces volume through the existing command. Do not infer available raw intake from its original quantity; the backend checks current consumption. No guessed lot lookup or client-computed stock balance. Creation and reversal send a stable Idempotency-Key for one unchanged payload; a retry reuses it and changed payloads get a new key. Display successful posted/reversed records and retained history. Reversal requires a confirmation explaining downstream conflicts; never replace it with DELETE or silently retry a conflict.

## Implementation sequence and acceptance

Inspect Swagger, processing DTOs and inventory semantics; implement sorting create/list/detail/reversal; pressing create/list/detail/reversal; read-only inventory balances/lots/movements. Preserve selected organization scope, exact kg/m3, pagination, safe loading/error/retry states and Portuguese content. Reference choices stay bounded. Existing v1-only permissions and transaction policy remain backend decisions. Verify lint/types/build/component tests, real posting/idempotent replay/pressing/reversal/stock conservation against local backend, and actual browser forms. Compilation alone does not establish completion. Document remaining limitations and remove only replaced legacy dependency closures.

## Consequences and remaining dependencies

The existing ledger stays the sole stock authority; no migration, cache, new library or backend capability is assumed. Historical records cannot be overwritten. Stock conflicts may require reversing downstream allocation first. Sales remains a subsequent integration with its established draft/post/reverse decisions. Additional analytics formulas, deployment/email configuration and realistic-volume performance review remain their existing separate gates. Accessibility preferences are local presentation settings and change no organization/account policy.
