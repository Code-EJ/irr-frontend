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

## Local delivery review — 2026-10-10

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). The full audit initially returned eight affected-package entries: six high and two moderate. A bounded `npm update source-map-js --ignore-scripts` changes only the transitive lockfile entry from 1.2.1 to 1.2.2, the [published patched version](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). No direct package, major version, override or application stack changes. The post-update full audit reports seven entries (five high, two moderate); production-only audit remains zero. See the [sanitized before/after record](data/dependency-review-2026-10-10.json).

Remaining entries propagate two root advisories: the existing [braces issue](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and [selector-parser CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf). Tailwind 3.4.17 and postcss-nested 6.2.0 resolve selector-parser 6.1.4; the advisory's fix is 7.1.6. npm proposes a Tailwind 4 upgrade, outside this compatibility slice. Do not claim that explicit content globs fix selector parsing or either advisory. Repository-controlled CSS/source/globs reduce the observed build exposure; trusted-source enforcement remains necessary, and outstanding findings need deliberate review before release.

Commands: `npm ls source-map-js postcss-selector-parser postcss-nested tailwindcss`, `npm audit --json`, `npm audit --omit=dev --json`, then lint/type/build/test gates. Audit exit 1 is retained for outstanding findings; audit failure is not converted to a zero result. Private raw outputs stay under `.local/audit`. npm audits do not cover the shipped Nginx/Alpine packages or the Node build image. Docker Scout requires account authentication in this environment, so image scanning remains incomplete.

`npm outdated --json` also records available allowed-range and major releases in the sanitized evidence. A newer version is not itself a vulnerability or a reason to upgrade the entire stack. React 19, Vite 8, Tailwind 4, TypeScript 7 and other major suggestions are not applied. Compatible non-security refreshes remain maintenance work; this increment changes only the reviewed security patch.

Commit `511f461` passed zero-warning lint, strict TypeScript and production build, and the repeated full suite passed 136 tests in 17 files. The Docker build passed using the existing Dockerfile and the selected API origin. The rebuilt local frontend is healthy; six read-only pair checks and the 116-operation pinned-contract check passed. The bundle asset names remain unchanged after the build-only patch. No backend API/schema, database volume, credentials or application business data changed. This evidence does not close the remaining build-chain/image/framework or browser/operator release gates.

## Container security correction — 2026-10-10

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). The earlier Scout limitation is superseded by actual Grype 0.120.1 scans, using the database built at 2026-10-10T06:30:01Z. The original runtime returned 260 matches, including 29 critical and 121 high. The corrected candidate `sha256:a457213cc018d2ebe66bdfba55f219452f76342e5104b2c89af588a8fd33f610` returns four medium matches and no high/critical matches. This is a dated scan, not a permanent guarantee. Sanitized per-finding inventories are maintained in the backend repository under `docs/security/`.

The pinned base remains unchanged. The vendor tag still resolves to the old digest; refreshing the tag alone did not patch Nginx. Apply supported Alpine 3.23 repository updates and explicitly select Nginx 1.28.3-r7. Remove the four unused dynamic modules (GeoIP, image filter, njs and XSLT), which were pinned to the old Nginx ABI. None is loaded by the maintained configuration. Preserve the upstream unprivileged main configuration, `/tmp` paths and port 8080. Root is used only during image construction; runtime explicitly restores UID 101. No application stack upgrade, API change or database migration occurs.

The build passed strict TypeScript and Vite compilation. `nginx -t` passed. The candidate ran with read-only filesystem, `/tmp` tmpfs, dropped capabilities and no-new-privileges. `verify:homologation` passed six read-only checks against the actual backend; `api:check` passed 116 operations. These are HTTP/configuration checks, not browser acceptance or WCAG certification. Previously passing application tests are not presented as newly rerun.

Alpine repositories are mutable: the base digest and Nginx patch are pinned, but other system patch resolutions can change. Preserve the approved final image by digest plus package inventory; rebuild, re-scan and verify before promoting any later image. Do not deploy an unreviewed rebuild merely because its Dockerfile is unchanged. Build-stage Node image scanning and individual review of remaining runtime matches remain release tasks. No advisory suppression is introduced.
