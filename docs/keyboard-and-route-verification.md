# Keyboard navigation and route boundary verification

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Date: 2026-10-10.

## Scope and authority

This increment continues Master Plan L5 and ADR-0015/0016's existing session and permission boundaries. It introduces no architecture, API, permission or business-rule change. The backend remains ADR-0014's exclusively `/api/v1` contract, with ADR-0024's locally verified query correction.

The protected workspace now exposes a named, programmatically focusable main landmark. The skip link explicitly focuses it, and changing page or organization moves the keyboard reading position into the new content. `tabIndex=-1` avoids an extra ordinary tab stop. Native dialog focus trapping and opener restoration remain unchanged.

## Maintained automated coverage

`src/route/Router.test.tsx` mounts the actual application router and session provider. Its API adapter is an explicit fixture, not the running backend; unexpected protected requests fail the fixture. Tests distinguish hiding sidebar links from denying direct route access.

| Journey | Expected boundary |
| --- | --- |
| Member opens users or organization creation directly | Restricted message; no administration data request |
| Organization manager opens user creation | Local management does not grant global administration |
| Member opens vehicle update directly | Denied before a vehicle request |
| Analytics without selected organization | Organization guidance; no report request |
| Mandatory credential change | Password screen precedes organization/private loading |
| Skip link and client-side navigation | Main landmark receives focus without an ordinary tab stop |
| Sign-out from selected organization | Token and organization cleared; login route restored |
| Account load fails, then retry succeeds | Safe error; private navigation absent until recovery; session retained |

Run `npm test -- src/route/Router.test.tsx`, followed by `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Existing identity/transport/dialog suites provide complementary revoked-session, request-scope, mutation-busy and modal focus restoration checks. Fixture-based route tests do not replace actual server authorization tests.

The final full suite passed 136 tests in 17 files, including all nine route-boundary cases. Zero-warning ESLint, strict TypeScript checks and the production Vite build passed. The initial eight-case targeted run passed before the account-load recovery case was added; the full run includes that case.

Frontend implementation commit `0fb082c` was built with the existing Dockerfile and `VITE_API_BASE_URL=http://localhost:9292/api/v1`. Only the local frontend service was recreated; backend, database, Redis, Mailpit and retained data were unchanged. Running image: `sha256:7b5069bd5bd45112adb276b57de5b27e8873f6dee33bcca0319ed2a4fc5b8a13`, healthy. `npm run verify:homologation` passed all six read-only pair checks, including actual Swagger equality, exact-origin CORS, direct SPA routes and served API origin. `npm run api:check` passed for 116 supported versioned operations. Its pinned backend metadata remains `996e36f`; live backend implementation is `ebea9f2`, whose contract remains identical. Private local verification output is excluded from Git.

## Browser and operator gate

The browser-control tool rejected access to the current local page with a URL policy error during this increment. No alternate browser surface or automation bypass was attempted. There are no new screenshots or browser/operator acceptance claims from this run.

When browser access is available, verify the rebuilt local frontend with the existing development accounts:

1. Use keyboard only: activate the skip link, navigate among identity, fleet, intake, routes and reports, and confirm visible focus starts in the newly selected content.
2. Open and close membership, credential and accessibility dialogs. Confirm Tab stays within the native modal, Escape respects in-flight mutations, and closing restores the launcher focus. Do not change credentials merely to exercise a dialog.
3. Check light/dark/high-contrast appearance at 100% and 200% font size and narrow viewport widths. Inspect clipping, horizontal scrolling and focus visibility.
4. With member, organization-manager and global-administrator accounts, visit restricted routes directly. Confirm expected denials and legitimate operations, without expanding permissions for the rehearsal.
5. Verify readable loading, unavailable-record, validation, conflict and session-expiry messages against the running backend. Preserve owner data and use compensated disposable fixtures for mutations.

Record actual observations and operator acceptance separately. L5 remains partial until these broader visual, keyboard, role and error journeys have evidence. This increment does not establish WCAG certification or production readiness.
