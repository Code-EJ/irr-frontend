# Frontend pre-release consolidation

Current authority: backend ADR-0027 and [updated installation handoff](homologation-installation.md). Owner permits Railway Virginia with synthetic data only for homologation, and plans Hostinger Brazil production later. This supersedes the blanket region blocker in the historical checkpoint below. Application source/contract are unchanged; portable infrastructure/public environment verification remains separate from local frontend evidence.

Latest handoff: [homologation installation](homologation-installation.md) records the owner's mandatory Brazil/São Paulo location and BRL 130/month ceiling. Provider compatibility/access remains open; Railway currently has Brazil CDN rather than compute. The new backend volume initializer passed isolated/local checks without changing the frontend API; six read-only pair checks and 116 operations passed. Broader operator/accessibility/public environment acceptance remains pending.

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Updated 2026-10-10.

Backend ADR-0025 continues the existing Master Plans and frontend ADR-0021. The coordinated closure matrix, security inventories, client-data procedure and Railway preparation are in backend `docs/release-readiness.md`, `docs/security/`, `docs/data/initial-load.md` and `docs/deploy/railway/preparation.md`. Architecture diagrams are in [the frontend architecture guide](architecture.md).

Identity, organizations/memberships, fleet, catalog, parties, intake/documents, Routes/executions, processing, inventory, buyers/sales and native operations/Analytics are integrated. Tests remain in the corresponding feature modules. Owner acceptance covers the local processing/reversal/stock journey; complete client/browser acceptance remains separate.

Container commit 232d60b retains Nginx 1.28/Alpine 3.23, patches vendor packages and removes four unused dynamic modules. Grype returned 260 original matches versus four medium matches in image `sha256:a457213cc018d2ebe66bdfba55f219452f76342e5104b2c89af588a8fd33f610`, with zero high/critical runtime matches. Build/typecheck, Nginx syntax, restricted-container startup, six actual read-only API-pair checks and the 116-operation contract check passed. The image runs locally at port 5173; the post-restart pair checks passed. See [dependency evidence](dependencies.md).

Previously passing 136 frontend tests/full lint/types/build remain dated evidence, not a newly repeated suite. Seven npm build entries remain mitigated rather than patched. Build-base and residual image reviews are pending. Docker Desktop interruptions prevented a verified backend OS update; the unverified backend Dockerfile edit was removed.

Existing [actual PDF evidence](document-verification.md), [integrated acceptance](integrated-acceptance.md) and Analytics screenshots remain preserved. Browser automation was policy-blocked; no workaround or fabricated screenshot was used. Complete native-dialog focus, keyboard navigation, announcements, theme contrast, 200% zoom/reflow, reduced motion, narrow viewport, role/error/retry and PDF-viewer acceptance remain pending. jsdom/HTTP checks do not certify WCAG 2.2 AA.

| Outcome | Status | Remaining gate |
| --- | --- | --- |
| A — Technical homologation | IN PROGRESS | Browser/operator/accessibility/PDF journeys and residual security review |
| B — Deployment readiness | NOT READY | A; reviewed image pair, public HTTPS/CORS, storage/mail/backups/secrets and owner environment inputs |
| C — Client delivery | NOT DELIVERED | Authorized installation, approved real-client import, public checks and client acceptance |

Railway planning is authorized; resources, real secrets and deployment are not. Frontend receives only public `VITE_API_BASE_URL` at build time. Exports/comparisons remain product proposals; GPS/maps/advanced BI remain deferred.

## Latest coordinated checkpoint — 2026-10-10

The compatible backend Jammy patch now succeeded and runs locally as image 549937278a93; six actual pair checks and 116-operation contract verification passed. Backend/source runtime semantics are unchanged. Node/Maven build-base scans are completed, replacing the earlier missing-scan status; residual vendor/framework/build findings still need review. Backend docs/security/README.md records exact counts and nine specific critical backport/not-affected dispositions. The local candidate manifest records actual images/contract/migration hashes without release authorization.

[The final operator/WCAG worksheet](final-operator-review.md) is prepared and linked from the README and scoped operator record. Its pending scenarios require genuine operator/browser evidence; no historical acceptance is widened. The backend initial-data preflight now passes eight tests including redacted malformed-input errors. The A/B/C gate statuses above remain open.
