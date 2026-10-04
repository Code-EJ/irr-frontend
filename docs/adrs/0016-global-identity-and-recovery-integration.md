# ADR-0016: Global identity, organization administration and recovery integration

- Status: Accepted; implementation and verification in progress.
- Date: 2026-10-04.
- Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

## Context and references

Continue ADR-0001's current Identity & Access milestone and ADR-0015's identity/transport integration. Frontend baseline b156abb already implements profile/password changes, account administration, explicit memberships and legacy-service removal. The owner's consolidated direction expands that slice with global authority, administrator creation, organization CRUD/responsible onboarding and email recovery. Backend ADR-0017/0018 supersede the older membership-only administrator restrictions and recovery exclusion; ADR-0014 still owns the exclusively /api/v1 contract. Do not duplicate their backend policy here.

The frontend remains React, TypeScript, Vite, Axios and the existing UI components/styles. No architecture rewrite, vendor SDK, global role enum or parallel authorization layer is justified. Backend 0ea2a2c contains the approved global authority and one-use email recovery contract; pin the generated Swagger snapshot only after Docker startup/health verification. Final verification records identify the executable baseline and any subsequent defect fixes.

## Decision and implementation sequence

1. Validate the backend's additive V1/V2/V3 upgrade without reset; capture current OpenAPI and regenerate DTOs.
2. Adapt the existing SessionProvider to effective global authority. A global account lists/selects active organizations without requesting a fabricated membership; canManage is derived from the server account role or actual MANAGER association. Every operation remains server-authorized.
3. Expand existing user CRUD to all four platform roles and administrator lifecycle. Display Administrador Geral, local Administrador da Organização, and safe last-active-admin conflicts. Reload shared identity after self-edit/demotion; deactivate/reset must handle session revocation.
4. Add bounded organization list/details/create/edit/deactivation and reuse the membership editor for MEMBER/MANAGER/revocation. Organization administration does not silently change the selected operational scope.
5. Responsible onboarding executes organization creation, account creation or selection, then idempotent MANAGER grant. Retain completed IDs when grant fails; retry only the failed step. If the operator leaves, retain server resources and explain resumption through organization membership administration. No credentials are stored on Organization or in browser storage.
6. Add public forgot/reset screens and login entry point. Use exact recovery endpoints through the single client, without bearer credentials. Read the email-link fragment into component memory and clear browser history. Validate matching passwords/UTF-8 policy, use neutral request success, handle invalid/expired/used authorization and return to login after success.
7. Run lint/type/unit/component/real-contract/build/container gates and document actual evidence. Keep engineering documentation in English and platform content in Brazilian Portuguese.

This extends the accepted incremental identity slice; Routes/GPS/reporting remain in ADR-0001's subsequent milestones. Remove the replaced /organizations/admin consumer after its canonical replacement works. Previously removed legacy BaseService/AuthService/UserService closures stay removed.

## Acceptance and verification

Verify global and ordinary-account selection/controls separately, creation/edit/deactivation of administrator and ordinary users, last-admin 409, organization CRUD, member/manager/revocation and partial onboarding retry. Exercise public recovery neutrality, fragment removal, confirmation validation, token rejection, successful login change and session clearing. Include loading/empty/retry and 400/401/403/404/409 states through component and real-backend tests. Compilation alone does not close the milestone.

Use npm ci, lint, typecheck, test, test:contract, build and api:check, plus both Docker images. Use local Mailpit for actual delivery and Brevo HTTP protocol tests without external mail traffic. Verify production HTTPS build configuration and absence of private credentials/internal backend hostnames in the browser bundle. Browser inspection complements these tests; credential-changing flows use controlled HTTP/component verification where browser-control rules require user handoff.

## Consequences, risks and dependencies

The UI exposes global authority clearly while ordinary users retain actual membership checks. UI guards improve usability and never replace backend authorization. Responsible onboarding is intentionally not an atomic distributed create: partial progress survives server-side and is explained to the operator. Response loss on non-idempotent creation may require selecting an already-created account/resource rather than blindly retrying its creation.

Mail delivery requires operator-approved sender/domain/API key for external homologation. Disabled mail is an explicit 503, not a completed recovery gate. Proxy address aggregation can affect shared throttles and needs deployment verification. Recovery tokens are intentionally not retained across page refresh after the fragment is removed. Tailwind's previously recorded development dependency advisories remain a reviewed build-tool risk; no forced major migration is introduced.

The release baseline freezes v1 only after real homologation and a compatible manifest; local verification does not claim Railway deployment. See the backend mail operations/runbooks and shared requirements traceability for external dependencies and product decisions.
