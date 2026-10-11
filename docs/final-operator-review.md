# Final local operator and accessibility review

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Updated 2026-10-10.

Status: prepared for execution; unchecked rows are not acceptance evidence. Continue [existing scoped operator acceptance](operator-homologation.md), [actual attachment verification](document-verification.md) and [release readiness](release-readiness.md). Current automation access is policy-blocked; operator evaluation can proceed through the normal application. No alternate automation workaround is implied.

## Record each run

Record exact source/image pair, UTC timestamp, local URL, browser/version, viewport/zoom, role, selected synthetic organization, theme/font/contrast settings, scenario/result and evidence path. Do not capture tokens, passwords, personal client information or private environment files. Distinguish real browser screenshots from PDF renders and test output. State pass/fail/blocked/not-tested explicitly; absence of evidence is not a pass.

Use existing private development account configuration and an approved synthetic organization. Do not modify client records. Fixture accounts must be deliberately scoped for administrator, manager and member checks. Verify expected permissions against backend OpenAPI/current authorization tests; no frontend-only role assumption. Preserve retained histories. An unknown mutation outcome must be reconciled before retry, especially processing/sale commands.

## Remaining functional scenarios

| Scenario | Expected result | Current state |
| --- | --- | --- |
| Sign-in/sign-out and protected direct URL | Correct account/session; sign-out removes protected content; stale requests cannot repopulate it | NOT TESTED in final review |
| Mandatory password change / own profile | Business access restricted while required; change/re-login succeeds; no role escalation | NOT TESTED |
| Recovery and administrative reset | Generic recovery response; valid one-use flow; expired/reused link rejected; old credentials/session rejected | Local evidence retained; final operator review pending; external email separate |
| Organization/account/membership administration | Correct contextual dialogs and server-authorized access; local role cannot alter global authority; revocation removes access | NOT TESTED |
| Materials, fleet and parties | Create/edit validation and linked-history deletion guards; selected scope retained | NOT TESTED |
| Intake and attachment | Valid quantities/references; valid PDF upload/download/open; image preview; rejected inputs preserve correction context | Actual valid PDF bytes/render verified; operator viewer acceptance pending |
| Route plan and execution | Declared sections, lifecycle, actual measures/completion and collection linkage obey existing contract | Prior local implementation evidence; final operator review pending |
| Sorting/pressing/sales/reversals/ledger | Exact quantities, invoice/unsaved gates, atomic operations and safe reversal order | Local scoped owner acceptance recorded; repeat only for relevant changed behavior |
| Operations and Analytics | Correct filters, empty/incomplete states, metric definitions and unavailable values; no invented zeros | Actual Analytics screenshots/tests retained; final operator review pending |
| Error/loading/retry states | Clear actionable message, preserved edits, bounded loading and safe retry; no duplicate command or stale organization result | Tests retained; actual browser error-state coverage pending |

Use service interruption only as a controlled synthetic/local scenario. Restore service health after testing. Do not tamper with shared customer records or global account privileges to manufacture permission failures.

## WCAG 2.2 AA review worksheet

| Check | Relevant criteria | Method / evidence | Current state |
| --- | --- | --- | --- |
| Keyboard and focus order | 2.1.1, 2.1.2, 2.4.3 | Keyboard-only traversal; skip link, route focus, dialogs, Escape and opener return | Complete browser run pending |
| Visible/unobscured focus | 2.4.7, 2.4.11 | Inspect every interactive control at normal/enlarged font and with sticky UI | Pending |
| Text/non-text contrast | 1.4.3, 1.4.11 | Measure actual rendered foreground/background pairs for light/dark/high-contrast and interaction states | Pending; no global contrast claim |
| Resize/reflow | 1.4.4, 1.4.10 | 200% zoom and narrow equivalent 320 CSS-pixel viewport; inspect dialogs/tables/actions | Earlier one-dialog check retained; complete platform review pending |
| Names, roles and status | 1.3.1, 4.1.2, 4.1.3 | Labels/headings/relationships, accessible dialog name, async announcements and screen-reader inspection | Pending |
| Input errors and authentication | 3.3.1, 3.3.2, 3.3.3, 3.3.8 | Errors identify fields and correction; password managers/paste work; no unnecessary cognitive challenge | Pending |
| Pointer target size | 2.5.8 | Actual target measurements or applicable spacing exception; close/actions/sidebar on mobile | Pending |
| Motion and preferences | Existing accessibility product scope | Reduced-motion setting, persistence, readable enlarged type and no lost actions | Component tests retained; complete browser review pending |

This worksheet references WCAG; it is not certification. Automated tests cover selected behavior only. The [official WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) is the criteria reference. Document exceptions and observed defects precisely before any conformance claim.

## Defects and sign-off

Record a defect with scenario, expected/actual behavior, role/viewport, screenshot, severity and reproducible steps. Verify the correction on the same scenario. Each operator acceptance names its exact scope, date, candidate pair and unresolved limitations. Technical A, deployment B and client delivery C remain separate. No signature/approval is inferred from this prepared worksheet or from successful compilation.
