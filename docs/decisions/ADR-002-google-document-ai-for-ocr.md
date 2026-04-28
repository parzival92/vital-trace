# ADR-002: Google Document AI For OCR

## Status

Accepted

## Context

Clinical lab PDFs can be digital, scanned, rotated, dense, table-heavy, or low quality. The product needs OCR output with text, tables, bounding boxes, confidence values, and layout structure.

Local OCR alone is not the right first serious choice for the desired accuracy target.

## Decision

Use Google Document AI as the primary OCR/layout provider for the core pipeline.

The OCR output must preserve:

- Page text.
- Tables.
- Rows and cells.
- Tokens.
- Bounding boxes.
- Confidence values.
- Orientation/rotation signals.
- Quality warnings.

## Consequences

Positive:

- Better fit for table-heavy clinical PDFs.
- Provides source evidence needed for review and verification.
- Supports measured extraction quality.

Tradeoffs:

- Adds vendor dependency.
- Adds cost.
- Requires privacy and data-processing review.
- Requires version tracking for processor configuration.

## Alternatives Considered

### Local Tesseract OCR

Rejected for v1 clinical-grade target. It may be useful for prototypes or fallback experiments, but it does not provide the desired out-of-box reliability and structured layout evidence.

### LLM-Only PDF Parsing

Rejected as the primary OCR strategy. LLMs can parse documents, but clinical extraction needs source coordinates, OCR confidence, and deterministic verification.

## Acceptance Criteria

- Every extracted field can trace back to OCR source evidence.
- OCR version/provider metadata is stored.
- OCR confidence influences validation and review.

