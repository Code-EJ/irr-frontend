# Local browser and operator homologation

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas). Date: 2026-10-09.

Status: Browser transactional workflow verified; owner accepted the local processing/sales workflow on 2026-10-09. Document-viewer acceptance remains pending. The owner explicitly volunteered to evaluate the flows. Participation is recorded separately from acceptance; no approval is inferred.

Frontend served source: `9cb6345` after the readability correction. Backend executable: `20a03c7`. Frontend: http://localhost:5173; Swagger/API: backend 9292. The existing ADR-0015/0019/0020 and exclusively `/api/v1` contract govern this local rehearsal. Public deployment remains outside the owner's current selected scope.

## Browser execution

The active valid IRR browser tab became available. The older failed tab was not used. The browser was already signed in as the existing development global administrator; no user/role/credential changes were made. API fixture preparation created only a synthetic organization, material hierarchy, donor, buyer, receipt and PDF attachment. The operations below were executed through the actual frontend controls, against the real backend.

Organization: **Homologação IRR 669850**. Initial receipt: 10.0000 kg / 1.0000 m³ of Papelão. Supporting PDF is synthetic verification data, not evidence of a legally valid invoice.

| Step | Action in the browser | Observed result |
| --- | --- | --- |
| Sorting batch | Queue two lines of 4.0000 kg / 0.4000 m³ and 6.0000 kg / 0.6000 m³; post | Registered operation retained two lines; stock 10.0000 kg / 1.0000 m³ |
| Pressing batch | Select each available sorted lot; compact to 0.2000 and 0.3000 m³ | Registered operation; stock 10.0000 kg / 0.5000 m³ |
| Sale draft | Save 1.0000 kg / 0.0500 m³ at BRL 2.5000/kg without invoice | Server total BRL 2.50; registration disabled with invoice guidance |
| Draft update | Select invoice and edit price to BRL 2.7500/kg | Registration disabled while unsaved; saved total BRL 2.75, confirmation version 1 |
| Sale posting | Confirm the saved command | Stock 9.0000 kg / 0.4500 m³; sale recorded |
| Upstream conflict | Attempt to reverse pressing while the sale is posted | Conflict displayed in retained confirmation; no upstream reversal |
| Sale reversal | Confirm version 2 reversal | Sale marked Revertida, history retained and fields disabled; stock 10.0000 kg / 0.5000 m³ |
| Pressing reversal | Reverse after releasing sold quantities | Stock 10.0000 kg / 1.0000 m³ |
| Sorting reversal | Reverse the initial sorting | Stock 0.0000 kg / 0.0000 m³; receipt/history retained |
| Ledger inspection | Open Movimentações | Original signed deltas and compensating movements remain visible |
| Accessibility | Dark theme, 200% font and high contrast; Escape to dismiss | Scrollable dialog, no page horizontal overflow at tested desktop width; focus returned to launcher |

The original light/100%/normal-contrast preferences were restored after inspection. This is a concrete browser check, not complete assistive-technology or WCAG certification. Identity administration, recovery and Routes/reporting retain their earlier verification evidence; they are not reclassified as owner-approved by this transaction walkthrough.

## Correction found during review

Read-only sale values were visually faded by disabled-field opacity and still showed draft-editing instructions. Frontend `9cb6345` retains readable historical values and replaces the draft guidance with attachment-download instructions. Fields remain disabled and existing sale immutability tests pass. Lint, strict types/build and all five sale component tests passed. The rebuilt frontend was inspected again in the browser: historical values are readable, the new attachment guidance is visible, and the synthetic invoice download completed successfully through the download control.

`IRR_VERIFICATION_MODE=local IRR_API_URL=http://localhost:9292/api/v1 IRR_FRONTEND_URL=http://localhost:5173 IRR_FRONTEND_COMMIT=<full 9cb6345 revision> npm run verify:homologation` passed all six read-only integration checks against the rebuilt image. Set these environment variables using the syntax of the current shell. Evidence is stored in ignored `.local/verification`; the command does not certify operator acceptance or freeze the API.

Screenshots are local evidence, kept outside repository history. Reversed sale and 200%/high-contrast dialog evidence are saved in the Codex workspace. No credentials are included in repository documentation.

## Operator review

Open the frontend and select **Homologação IRR 669850**. Inspect Triagem and Prensagem with their retained reversed records, then Vendas → Consultar venda, Estoque → Movimentações and Acessibilidade. Confirm whether labels, quantities, confirmations, correction order and readability match the daily workflow. Report adjustments or explicitly accept this processing/sales workflow. The acceptance decision must identify its scope; accepting this walkthrough does not approve every feature or a production release.

The synthetic organization remains active for operator inspection; all posted stock effects were compensated through the browser. Original operational organizations/data were untouched. Private fixture IDs live in ignored `.local/operator-browser-fixture.json`. After review is complete, `node .local/operator-browser-fixture.mjs cleanup` from this local checkout deactivates only this fixture organization, after checking and compensating remaining posted operations. Do not reset volumes or replace owner data.

## Operator feedback — 2026-10-09

The owner reported that the downloaded invoice did not open. Inspection confirmed that the rehearsal fixture contains only 76 bytes: a PDF header/catalog/trailer without a valid page tree or complete PDF structure. This fixture is unsuitable for viewer acceptance. The browser download check proves delivery of the fixture, not successful PDF rendering. This is a fixture defect; no application download defect has been established. Operator acceptance remains pending. Repeat the attachment upload/download/viewer workflow with a valid synthetic PDF before accepting document usability.

## Scoped owner acceptance — 2026-10-09

The owner explicitly stated: "I approve this workflow." This accepts the local processing, sales, stock restoration and reviewed accessibility walkthrough. It does not establish valid-PDF viewing, broader platform operator acceptance, external mail delivery, published deployment or production readiness. The invalid synthetic PDF limitation above remains an open verification item.
