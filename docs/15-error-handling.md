# Error Handling

## Purpose

Error handling must keep the user informed without hiding clinical uncertainty. Failures should not create official observations.

## Error Principles

- Fail closed for clinical data.
- Preserve traceability.
- Show actionable user messages.
- Keep sensitive details out of logs.
- Allow safe retry where possible.
- Never convert uncertain machine output into official data.

## Upload Errors

Common errors:

- No file provided.
- Unsupported file type.
- File too large.
- Too many files.
- Corrupt PDF.
- Password-protected PDF.
- Malware scan failure.
- Storage failure.

Behavior:

- Reject invalid file before report processing.
- Return file-level rejection reason.
- Do not create official observations.

## OCR Errors

Common errors:

- Provider timeout.
- Provider quota exceeded.
- OCR processor failure.
- Low-quality scan.
- No readable text.
- Unsupported PDF.

Behavior:

- Retry transient provider failures.
- Mark report `failed` if no usable output exists.
- Mark report `failed_with_drafts` if partial output exists.
- Emit audit event.

## Layout Errors

Common errors:

- No tables detected.
- Table rows misaligned.
- Header detection failed.
- Multiple reports mixed together.
- Reference ranges wrapped ambiguously.

Behavior:

- Fall back to line-based candidates where possible.
- Add layout warnings.
- Route uncertain rows to review.

## LLM Extraction Errors

Common errors:

- Schema mismatch.
- Timeout.
- Empty extraction.
- Hallucinated field detected by verifier.
- Unknown marker overload.

Behavior:

- Retry schema failures with same evidence.
- Do not accept free-form fallback output.
- Mark report failed if extraction remains invalid.
- Preserve error metadata.

## Validation Errors

Common errors:

- Missing value.
- Unknown unit.
- Impossible value.
- Date conflict.
- Abnormal flag mismatch.
- Duplicate conflicting rows.

Behavior:

- Create validation issues.
- Mark blockers.
- Require user correction.

## Verification Errors

Common errors:

- Source evidence missing.
- Value mismatch.
- Unit mismatch.
- Wrong source row.
- Verifier unavailable.

Behavior:

- If verifier unavailable, mark report as requiring review with warning or retry according to policy.
- If mismatch exists, block normal confirmation until corrected.

## Review Errors

Common errors:

- Confirmation attempted with blocker.
- Concurrent modification.
- Report no longer in review state.
- PDF expired.
- Save failed.

Behavior:

- Return clear error code.
- Preserve user edits if possible.
- Require revalidation after correction.

## Retry Policy

Retries should be allowed for:

- OCR provider transient failure.
- LLM timeout.
- Schema output failure.
- Worker crash.
- Queue failure.

Retries should not silently change official data. If a confirmed report is reprocessed, new draft results must be reviewed before changing official observations.

## Error Response Format

All API errors should include:

- Stable error code.
- Human-readable message.
- Optional field reference.
- Request ID.

Do not include raw OCR text or clinical values in generic error responses.

## Acceptance Criteria

- Every pipeline stage has defined failure behavior.
- Failed reports cannot become official.
- Retry behavior is explicit.
- Errors are user-actionable and privacy-safe.

