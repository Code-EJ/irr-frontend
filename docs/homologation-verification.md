# Frontend/backend homologation preparation

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Updated 2026-10-04.

## Existing milestone and scope

Continue the NEXT gate in [the Master Plan](adrs/0001-master-plan.md) and the existing [identity integration decision](adrs/0016-global-identity-and-recovery-integration.md). This is release preparation, not a new architecture. No new backend capability, schema change, library or API version is needed. The backend's ADR-0014/0017/0018 remain authoritative.

The dated Identity closure pinned backend 18f4891825821dae931ab7f3d44a2d0cd48c311f and 95 supported v1 operations. The current Routes candidate pins backend 6bb0a830a9778b16994a83f87e25b3eaad462c4b and 114 supported v1 operations; see [Routes verification](routes-verification.md). UI refinements reuse the native dialog: a shared padded surface, title/description relationships, responsive width/scrolling, close button, input focus and opener restoration. Identity reset, membership management/member selection and organization/account deactivation use the shared header/context/notice/footer layout. In-flight mutations block Escape and close controls; revocation still requires explicit confirmation. No permission or credential policy changed. Other catalog/fleet/intake/document dialogs receive consistent surface padding without retaining nested Card padding. Product text remains Brazilian Portuguese; documentation and code remain English.

## Read-only pair verification

`npm run verify:homologation` checks:

1. Backend liveness/readiness return UP.
2. Current generated OpenAPI matches the pinned schemas, operations and security. Only the root environment-specific servers field is excluded from canonical comparison; application routes remain exclusively /api/v1.
3. Login preflight permits the exact frontend origin and POST method.
4. Nginx health and direct login/reset/organization/user routes serve the SPA.
5. Served entry JavaScript uses the intended API origin and no internal Railway hostname; deployed mode also rejects localhost API destinations.

It does not authenticate, send email, reset a password, grant access or alter application data. Requests have timeouts and no redirects; failures do not print response bodies. A failed contract comparison requires review, not blind recapture. Reports contain public origins, commit references, digests and check names, without credentials. The root servers exclusion does not exclude fields named servers inside schemas.

Node 24 is already required by the frontend tooling. No new package is required. Set IRR_FRONTEND_COMMIT to the full verified source SHA used to build the frontend image; the checker records the supplied reference, not an independently discovered image provenance claim. Record actual image digests and backend source separately in the release manifest.

### Local rehearsal

```powershell
$env:IRR_VERIFICATION_MODE = 'local'
$env:IRR_API_URL = 'http://localhost:9292/api/v1'
$env:IRR_FRONTEND_URL = 'http://localhost:5173'
# Use the verified source SHA of the currently built frontend image.
$env:IRR_FRONTEND_COMMIT = '<full-verified-frontend-image-source-sha>'
npm run verify:homologation
```

Local mode permits loopback targets only. Evidence is written to ignored `.local/verification/local-pair-verification.json`. The 5273 rehearsal frontend remains an alternative; its image must be refreshed as well when verifying a new slice. Default public API configuration lives in ignored .env; private sign-in credentials stay in ignored .env-dev and never VITE_* variables.

### Deployed candidate

```powershell
Remove-Item Env:IRR_VERIFICATION_MODE -ErrorAction SilentlyContinue
$env:IRR_API_URL = 'https://<public-backend-domain>/api/v1'
$env:IRR_FRONTEND_URL = 'https://<public-frontend-domain>'
$env:IRR_FRONTEND_COMMIT = '<full-verified-frontend-image-source-sha>'
npm run verify:homologation
```

Deployed mode requires public HTTPS, rejects loopback/private Railway addresses and writes `.local/verification/deployed-candidate-verification.json`. It never sets apiFrozen=true. Do not overwrite a release manifest with this partial technical candidate report.

## Operator gates still required

Review source/actual image digests, additive V1/V2/V3/V4 history, persistent uploads/database backup, provider account/domain/key/public recovery URL and current build-tool findings. Run authenticated global/local account/organization workflows, last-administrator protection, revocation, recovery expiry/replay and actual external inbox delivery on designated test identities. Use the backend Railway checklist for order and security-compatible rollback. No remote merge, secret update or delivery was performed as part of local preparation.

First homologation approval records the complete matched pair and freezes v1. The owner's subsequent phase decision allows Routes development while external configuration/homologation is pending; native reports/filters/indicators/dashboard follow Routes; GPS remains later and external BI optional. The product decisions in [requirements traceability](requirements/traceability.md) remain unapproved future work.

## Executed UI verification

The frontend passed lint, strict typecheck, build, 59 unit/component tests and 18 local real-backend contract tests after these changes. Two new shared-dialog cases verify labeling/focus restoration and blocked cancellation while busy. Actual browser inspection checks reset and membership dialogs without entering new credentials or changing permissions. Screenshots are ignored local QA evidence; they do not certify external homologation. Current execution results for the pair checker and image refresh are recorded below after execution.

## Local execution and subsequent phase decision

Six read-only checks passed against the refreshed frontend at 5173 and backend at 9292. Image source reference: 78d5396690b5a7e56cb99ccdd3884ba5324853ff. Reset and membership dialogs were visually inspected against the running backend; no credentials or permissions were changed. The subsequent owner instruction closes Identity as IMPLEMENTED / READY FOR HOMOLOGATION and permits Routes development independently of external mail configuration. This supersedes the former development sequencing, without claiming a deployed release.
