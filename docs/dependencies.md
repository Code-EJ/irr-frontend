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
