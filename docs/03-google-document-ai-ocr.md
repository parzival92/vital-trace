# Google Document AI OCR

## Purpose

Google Document AI is the primary OCR and layout extraction engine. It converts the uploaded PDF into machine-readable text, tables, tokens, bounding boxes, and confidence data.

The OCR layer should not decide final biomarkers. It provides source evidence for later normalization, extraction, validation, verification, and review.

## Why Google Document AI

The product needs:

- Native PDF handling.
- Scanned document OCR.
- Table extraction.
- Page-level text.
- Word/token-level text.
- Bounding boxes.
- Confidence values.
- Rotation handling.
- Layout signals.
- Quality signals.

This is a better fit than simple local OCR for the first serious version.

## Inputs

- Report ID.
- Temporary PDF location.
- Original filename.
- Profile ID.
- Upload metadata.

## Outputs

OCR output must preserve:

- Document text.
- Page text.
- Tables.
- Rows and columns.
- Tokens or words.
- Bounding boxes.
- Confidence scores.
- Page numbers.
- Detected rotation/orientation.
- Language hints if available.
- Image quality hints if available.

## Pipeline Step Specification

### Purpose

Produce faithful, traceable OCR evidence from each uploaded PDF.

### Inputs

- Uploaded PDF.
- Report metadata.
- OCR processor configuration.

### Outputs

- Raw OCR response.
- Normalized OCR document representation.
- Page text.
- Table candidates.
- Token coordinates.
- OCR confidence map.
- OCR audit event.

### Failure Modes

- OCR provider unavailable.
- API quota exceeded.
- Unsupported or corrupt PDF.
- Password-protected PDF.
- Poor scan quality.
- Blank pages.
- Severe rotation/skew.
- Mixed layout that cannot be table-detected.
- Timeout.

### Confidence Signals

Capture and preserve:

- Document-level confidence if available.
- Page-level confidence.
- Token/word confidence.
- Table confidence if available.
- Missing text regions.
- Low-quality scan warnings.
- Rotation corrections.
- OCR provider warnings.

### Human Review Requirements

OCR output itself is not reviewed by normal users, but later review UI must expose source snippets and page references derived from OCR.

If OCR confidence is too low:

- Report status becomes `failed` or `needs_review` with extraction warnings depending on whether usable draft observations exist.
- Draft observations from weak OCR must be flagged.

### Data Stored Permanently

- OCR provider name.
- OCR processor version/config ID.
- OCR job timestamp.
- Summary quality metrics.
- References from extracted fields back to source page/box.
- Audit events.

### Data Stored Temporarily

- Raw OCR response may be retained temporarily or compressed depending on storage policy.
- Rendered page images used for review may be retained while the PDF is retained.

### Audit Events Emitted

- `ocr.started`
- `ocr.completed`
- `ocr.failed`
- `ocr.low_confidence`

### Acceptance Criteria

- Every extracted value can later point back to OCR source evidence.
- OCR confidence is available to validation and review.
- Tables and free text are both preserved.
- OCR failure does not create official observations.

## Required OCR Data Shape

The normalized OCR representation should contain:

- `document_text`
- `pages`
- `tables`
- `tokens`
- `blocks`
- `quality_signals`
- `provider_metadata`

Each token should include:

- Text.
- Page number.
- Bounding box.
- Confidence.
- Reading order.

Each table cell should include:

- Text.
- Row index.
- Column index.
- Page number.
- Bounding box.
- Confidence or derived confidence.
- Linked token IDs if available.

## Clinical Lab Report OCR Concerns

Lab reports often contain:

- Dense tables.
- Multiple panels.
- Repeated headings.
- Small fonts.
- Units with symbols.
- Reference intervals with inequalities.
- Abnormal flags.
- Methodology notes.
- Doctor comments.
- Footer disclaimers.
- Lab metadata.
- Patient identity blocks.

OCR must preserve these without prematurely merging unrelated text.

## OCR Quality Thresholds

Initial recommended thresholds:

- Any page with very low text confidence should trigger report warning.
- Any table row used for extraction must have enough token evidence to show in review.
- Values from low-confidence tokens must be blocked from auto-confidence and highlighted.
- Missing table structure should fall back to text-line normalization, not silent failure.

## Provider Versioning

Store the OCR processor name and version/config for every report. If OCR processor settings change later, old reports must remain traceable to the original extraction version.

