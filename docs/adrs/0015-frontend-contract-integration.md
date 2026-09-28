# ADR-0015: Incremental frontend integration with the final backend contract

- Status: Accepted; execution in progress. Acceptance is recorded per slice, not inferred from a successful bundle.
- Date: 2026-09-28.
- Author and documentation maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).
- Frontend starting point: `cb86727`, clean `general-frontend-refactor` worktree.
- Backend reference: `0dc0d1f576a72fd45df981cd8e290e98e82b990b`, `general-backend-refactor`.

## Context

This implements the frontend milestone in [ADR-0001](0001-master-plan.md) and the frontend sequence and quality gates in [ADR-0003](0003-architecture-and-dependencies.md). ADR-0002 through ADR-0013 supply domain, identity, ownership, ledger and operational decisions; their historical endpoints and migration observations are not current contracts. The backend [ADR-0014 at the frozen baseline](https://github.com/Code-EJ/irr-backend/blob/0dc0d1f/docs/adrs/0014-final-preproduction-contract-and-baseline.md) supersedes the transitional aliases in ADR-0011 and ADR-0013. There is no compatibility requirement to call them from this frontend.

The inspected frontend retains React 18, TypeScript 5, Vite 6, React Router 7, Axios, Formik and Tailwind 3. It has two Axios instances, a hardcoded Railway origin, captured bearer headers, a token-logging router, Portuguese legacy payloads, PATCH updates and incompatible pagination. The strict application compiler reports 519 diagnostics. ESLint imports TypeScript as its configuration plugin. No acceptance suite exists. Existing shared components and styling remain useful; untouched workflow screens cannot be advertised as functioning integrations.

## Decision drivers

Use the completed backend without reimplementing domain rules; make organization scope explicit; prevent stale session/scope data and permission assumptions; preserve the stack and useful UI; establish truthful automated and runtime evidence before enabling each workflow.

## Considered options

| Option | Benefits | Costs | Decision |
| --- | --- | --- | --- |
| Change only the old API origin | Small diff | Preserves incorrect fields, verbs, authorization and pagination | Rejected |
| Rewrite the frontend and change its stack | Uniform new implementation | Discards working presentation and increases simultaneous risk | Rejected |
| Integrate vertical slices with generated contract types and gated routes | Reviewable behavior, reusable existing UI, verifiable cutover | Temporarily incomplete navigation and explicit legacy repair work | Selected, as already required by ADR-0003 |

## Decision and integration objective

Retain the pragmatic modular approach and the existing libraries. New feature API/model/UI boundaries live under `src/features`; cross-cutting transport lives under `src/shared/api`. Do not introduce a generic domain CRUD engine. Replace legacy modules only after their replacement works. Retain unreachable pending modules for incremental migration, with their diagnostics visible until repaired. Do not relax TypeScript strictness, hide source files or permanently allow failed CI checks.

The executable reference is the running backend's `/v3/api-docs`, also available through Swagger UI at `http://localhost:9191/swagger-ui/index.html`. Pin its JSON and generated TypeScript types in this repository, with the backend commit and digest. All application requests must use `/api/v1`. Framework documentation and health endpoints are not business API aliases. No backend redesign is part of this decision.

One Axios client uses validated public configuration, reads the token for each request, centrally handles session expiry and sends `X-Organization-Id` only for explicitly scoped operations. Login uses `{email,password}` and `{token}`; account display uses `/users/me`, not decoded token role claims. Organization selection comes from the user's paginated memberships; local MEMBER/MANAGER permissions are distinct from platform roles. An administrator has no implicit organization access. Logout clears client state and private views. Changing organization unmounts scoped pages and cancels pending requests; late responses cannot populate another scope.

Lists consume actual backend page shapes, zero-based `page` and `size`; mutations use the documented POST/PUT/DELETE and response statuses, including empty 204. Error handling distinguishes authentication, authorization, validation, missing scope and conflict from network failure. Do not silently retry writes. Later slices retain decimal strings, server-computed totals, multipart `documento`, optimistic versions and stable idempotency keys for the lifecycle commands established by ADR-0012/0013. Inventory remains read-only; posted operations use reversal rather than generic edits/deletes.

## Existing implementation sequence

1. Repair lint/type/build quality gates and reproducible dependency installation.
2. Consolidate HTTP/session handling, current-account loading and organization selection; integrate one complete fleet workflow.
3. Integrate the category/type/subtype hierarchy, scoped filtering and conflict-aware versioned edits.
4. Integrate intake and its donor/team/document prerequisites.
5. Integrate sorting, pressing, inventory and draft/post/reverse sales, followed by the established reporting workflow.

Only enabled, verified slices appear as usable navigation. Pending routes display an explicit integration status rather than issuing old requests. This is the existing Master Plan order, not a new roadmap. Quality repairs and the first feature may share a working tree while broken gates are resolved, but no slice is accepted with failing gates.

## Acceptance criteria

- Clean install, full TS/TSX lint, strict type check, production build and relevant automated tests pass without suppressing the legacy diagnostic baseline.
- Login, reload, invalid credentials, expiry, logout, no-membership and organization switching have observable outcomes without token/password logs.
- Requests use only the final API and the selected scope; a late response cannot leak another organization's data into the current view.
- Fleet list/filter/pagination, create, edit and deactivate work against the real backend; UUID identity is retained, 204 is handled, and manager-only controls are unavailable to members.
- Each subsequent slice supplies positive workflow and negative permission/conflict tests before its legacy path is removed.
- Browser evidence covers representative user actions and errors. Compilation alone never establishes frontend completion.

## Verification strategy

Capture the initial diagnostics, then run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Use generated OpenAPI types for feature DTOs and transport tests for headers, URLs, errors and session/scope changes. Use the running Docker backend for real API acceptance and browser interactions; read development credentials from the ignored backend `.env`, never from committed source or public `VITE_*` configuration. Record commands, counts, fixture cleanup, limitations and the matched frontend/backend revisions in the execution record. Future automation must fail on contract drift rather than regenerate and silently accept it.

## Consequences, risks and dependencies

The interface will temporarily expose fewer workflows while obsolete routes are gated. The initial compiler debt is substantial; shared component fixes should precede repetitive page edits. A successful manager session does not prove member or cross-organization isolation. Browser storage remains exposed to same-origin script execution, so no token logging or HTML injection is acceptable; a new backend session design is outside scope. The development backend must be running with explicit membership and allowed frontend origin. OpenAPI response properties may be optional in the generated schema; validate required identity/page fields at the feature boundary rather than asserting that missing data is present. GitHub board reconciliation and production deployment remain external gates, not reasons to redesign this contract.

Implementation evidence will be maintained in `docs/frontend-integration.md`. Historical ADR inventories remain dated evidence and are not rewritten as if the original audit described this cutover.
