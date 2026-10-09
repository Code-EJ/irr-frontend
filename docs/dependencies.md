# Frontend dependency execution notes

Author and maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

This implements the prune/tooling actions in ADR-0003. React 18, TypeScript 5, Vite 6, Router 7, Axios, Formik, Tailwind 3 and the existing icon/state/toast libraries remain the application stack. The committed `package-lock.json` is the reproducible resolution and is no longer ignored.

- Removed the `front: file:` self-dependency, unused `dotenv` and vanilla `lucide`. Vite loads public environment configuration; the browser uses `lucide-react`.
- Removed `jwt-decode` after replacing token-derived profile display with `/api/v1/users/me`.
- Moved TypeScript to development dependencies and installed the actual `typescript-eslint` package to repair TS/TSX lint configuration.
- Updated Axios, Router and Vite within their existing major versions. No forced audit fix or application-stack major migration was used.
- Added `openapi-typescript` as development tooling for the pinned executable API contract. Generated types are not handwritten domain guesses.
- Added Vitest 4.1.11 or compatible patches as development tooling for transport and real contract tests. The initially evaluated Vitest 3 line had a mocker advisory; the selected fixed 4.1.11 release supports Vite 6. This is a new test runner, not an application framework upgrade.

The full and production-only npm audits reported zero known vulnerabilities on 2026-09-28. This is a dated registry observation, not a permanent security guarantee. Use `npm ci`, run the quality gates, inspect `npm audit`, and review future lockfile changes. Never place credentials in `VITE_*`, source files, fixtures or generated contract metadata.

- Added Node 24 type definitions for checked build scripts and real-backend tests. No new visual library was introduced; the interface uses the existing lucide-react icons and CSS/Tailwind.
- The frontend container pins Node 24 Alpine and unprivileged Nginx 1.28 Alpine by digest in Dockerfile. Review digest updates deliberately; npm audits do not assess operating-system image packages.
- The current clean install reports deprecation notices for the retained ESLint 9 and transitive glob 10 tooling. These notices are distinct from the zero-advisory npm audit result. Follow up within dependency maintenance rather than forcing an unrelated framework/tooling migration during this slice.

## Identity delivery — 2026-10-03

Maintainer: Enzo Ribas (https://github.com/oEnzoRibas). Removed unused Zustand with the unreachable legacy state/service dependency closure. Added development-only @testing-library/react, @testing-library/user-event and jsdom to verify credential forms, SessionProvider restrictions and profile refresh. No new runtime abstraction or UI library.

npm audit reported five high findings in the Tailwind 3 toolchain (braces, chokidar, micromatch, fast-glob, tailwindcss), rooted in GHSA-vfj7-8cjw-p6xm. The reported fix requires Tailwind 4, outside this incremental identity scope. Build-time exposure remains a review gate; do not call the full audit clean or use npm audit fix --force to silently change architecture. Production-only audit is recorded separately in the verification evidence.

## Global identity and recovery — 2026-10-04

Maintainer: Enzo Ribas (https://github.com/oEnzoRibas). No new runtime or test library was added for the expanded slice; organization/recovery screens reuse React, generated DTOs, Axios and native dialogs. The jsdom test environment receives a minimal dialog-method polyfill; actual browser verification uses the real native implementation. Retained build-tool advisories remain distinct from the production-only audit; see current verification evidence.

## Build-chain security review — 2026-10-05

Maintainer: Enzo Ribas (https://github.com/oEnzoRibas). Registry checks and the [reviewed upstream advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) confirm braces 3.0.3 remains affected and has no published patched version. Tailwind 3.4.17 -> chokidar/fast-glob/micromatch -> braces explains all five high audit entries; these are propagated findings, not five independent flaws. Current production-only audit is zero. The proposed npm fix changes Tailwind to major 4, which is not applied under ADR-0003's incremental stack policy.

The shipped frontend is static assets in unprivileged Nginx; Node/npm/Tailwind belong to the build stage. Build patterns are literal repository-controlled paths; HTTP/user inputs never supply content globs. The configuration now lists each supported source extension explicitly instead of using brace expansion. This reduces avoidable pattern handling without claiming to patch braces or clear the full audit. Source/build configuration remains trusted input; unreviewed source cannot be considered safe merely because production audit passes.

CI now fails on high/critical production dependency advisories with `npm audit --omit=dev --audit-level=high`. Review the full `npm audit` separately; no ignore/override, forced fix, replacement package, runtime library or fabricated zero-findings result is introduced. Revisit the advisory when a compatible upstream fix becomes available; a major Tailwind migration requires separate compatibility analysis, visual verification and a deliberate architecture decision. Existing historical audit observations above retain their original dates.
