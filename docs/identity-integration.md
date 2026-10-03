# Identity and account management execution

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

## Audit before implementation

Frontend main `01a9543` has a single scoped client/session/provider, a read-only current-account screen and verified fleet/material/intake workflows. Backend main `4c50f17` supports current-account reads, administrator partner CRUD and explicit membership grant/revoke. It lacks self-service profile/password changes, administrative reset and administrative organization/membership discovery. Neither repository needs an architectural rewrite.

The working frontend is clean and uses `feat/identity-account-management` from updated main. Backend work uses the same branch name in an isolated checkout; unrelated staged/unstaged Railway documentation remains untouched in `back-irr-v2`.

## Existing plan and new decision

This closes identity/account management within ADR-0001 M1/M5 and extends ADR-0015's transport/identity slice. Backend ADR-0016, `docs/adrs/0016-account-and-credential-lifecycle.md`, is the authoritative credential lifecycle decision. It retains ADR-0003's modular monolith, ADR-0008 provisioning policy, ADR-0009 membership separation and ADR-0014's exclusively versioned API. No copied alternate credential policy is defined here.

Add profile editing, password change, platform-administrator partner administration and explicit memberships. Reuse generated DTOs, apiClient, session and SessionProvider. Load the current account before membership queries so a mandatory password change can be completed without organizational access. Restrict normal navigation until the password change succeeds, then sign out because all old tokens are revoked. Never store a password in browser storage or send it to any destination except the configured backend.

## Legacy disposition and boundaries

Audit imports before removal: Profile/UserEdit, UsersPages/ManageUsers, UsersPages/RegisterUserAdmin and UserService belong to the obsolete identity contract. BaseService has other consumers in unreachable processing/sales screens and generic components. No active route uses those services; the final source audit must distinguish unreachable dead code from supported workflows, remove dead dependency closures where safe, and preserve current active fleet/material/intake behavior. Do not implement unrelated processing domains as part of this identity request.

## Rollout and acceptance

Backend first: populated V1-to-V2 PostgreSQL upgrade, tests, build and health checks. Update the pinned contract deliberately to the verified backend commit, then regenerate types and implement the frontend. Existing `/api/v1` consumers must remain usable with normal accounts. Do not initiate resets until the new frontend is deployed because the older bundle cannot complete mandatory password change. No Railway setting changes or merges are performed by this task.

Run clean install, lint, strict typecheck, unit/component tests, real-backend contract tests, build, api:check and both container gates. Verify profile, password, administrator guards, partner lifecycle, membership revocation, 400/401/403/404/409 and forced change through real browser flows. Check a production HTTPS API build argument and ensure no private credentials or accidental localhost backend origin are included. Record executed results separately from deployment instructions; local verification is not Railway deployment evidence.
