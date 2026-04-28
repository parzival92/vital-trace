# Second-Pass Verifier

## Purpose

The second-pass verifier independently checks whether the draft observations match the OCR/layout source evidence.

This step exists because neither OCR nor LLM extraction should be trusted alone for clinical data.

## Inputs

- Validated draft observations.
- Normalized OCR/layout evidence.
- Source snippets.
- Source bounding boxes.
- Validation issues.
- Biomarker definitions.

## Outputs

- Verifier decision per observation.
- Agreement/disagreement details.
- Additional review flags.
- Report-level verification summary.

## Pipeline Step Specification

### Purpose

Compare extracted structured fields against source evidence and identify mismatches before user review.

### Inputs

- Draft observation fields.
- OCR source text.
- Layout row/cell evidence.
- Validator results.
- Verifier prompt/schema version.

### Outputs

- `verified`, `needs_review`, or `rejected` recommendation per observation.
- Field-level mismatch list.
- Verifier confidence.
- Source comparison notes.

### Failure Modes

- Verifier cannot access source evidence.
- Verifier output fails schema.
- Verifier agrees incorrectly.
- Verifier over-flags valid unusual rows.
- Source evidence is too low quality to compare.
- Report is too complex for reliable verification.

### Confidence Signals

Verifier confidence should consider:

- Exact text match between field and source.
- Numeric value match.
- Unit match.
- Range match.
- Abnormal flag match.
- Source box presence.
- OCR confidence.
- Validation issue severity.

### Human Review Requirements

Verifier disagreement must be shown to the user. Any `rejected` or `needs_review` verifier decision blocks automatic official status.

### Data Stored Permanently

- Verifier model/provider if LLM-based.
- Verifier prompt/schema version.
- Verifier result.
- Field mismatch details.
- Verification timestamp.

### Data Stored Temporarily

- Verifier prompt payload may be retained only in redacted form if policy allows.

### Audit Events Emitted

- `verification.started`
- `verification.completed`
- `verification.disagreed`
- `verification.failed`

### Acceptance Criteria

- Every draft observation has a verification result before review.
- Mismatches are visible in review.
- Verifier cannot make data official.
- Verification result is stored with version metadata.

## Verifier Strategy

The verifier can be implemented as:

- Deterministic source comparison where exact evidence exists.
- LLM-based comparison using `gpt-5.5` where layout is ambiguous.
- Hybrid approach combining both.

For core planning, use hybrid verification:

- Deterministic checks for numeric/value/unit/range string agreement.
- LLM verifier for ambiguous table layout, wrapped reference ranges, and unknown markers.

## Field-Level Checks

The verifier should compare:

- Raw marker label against source row.
- Value against source cell/text.
- Unit against source cell/text.
- Reference range against source cell/text.
- Abnormal flag against source cell/text.
- Report date against metadata source.
- Lab name against metadata source.

## Verifier Decisions

### Verified

Use when:

- Source evidence is present.
- Key fields match source.
- Validator has no blockers.
- No critical disagreement exists.

### Needs Review

Use when:

- Source evidence is incomplete.
- OCR confidence is low.
- Layout is ambiguous.
- Unknown marker is present.
- Validator warnings exist.
- Verifier cannot decide.

### Rejected

Use when:

- Value does not match source.
- Unit does not match source.
- Marker appears invented.
- Source reference points to wrong row.
- Duplicate extraction is clearly wrong.

Rejected observations remain visible for audit and debugging but should not be presented as normal confirmable values without correction.

## Report-Level Verification

The report should receive a verification summary:

- Total draft observations.
- Verified count.
- Needs review count.
- Rejected count.
- Blocking issue count.
- Overall status recommendation.

If all observations are rejected or no observations are extracted, report status should become `failed` or `needs_review_empty` depending on product handling.

