# Attachment verification fixture

Maintainer: [Enzo Ribas (@oEnzoRibas)](https://github.com/oEnzoRibas).

`verification.pdf` is a valid single-page synthetic document with no fiscal value or personal data. It contains the marker IRR-ATTACHMENT-VALID-001. Generated with ReportLab, parsed with pypdf in strict mode and visually inspected after Poppler rendering. It replaces the incomplete PDF-header-only fixture. The intake contract suite verifies both the frontend download adapter and byte-for-byte binary delivery. Browser upload/download and rendering remain separate acceptance evidence.
