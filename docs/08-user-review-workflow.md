# User Review Workflow

## Purpose

User review is the gate that turns machine-generated draft observations into official observations.

The product must assume extraction can be wrong. The review workflow is therefore not optional in the core milestone.

## Inputs

- Draft report metadata.
- Draft observations.
- Validation issues.
- Verifier decisions.
- Source snippets and page references.
- Original PDF/page preview while retained.

## Outputs

- Confirmed observations.
- Corrected observations.
- Rejected observations.
- Review audit events.
- Report status update.

## Pipeline Step Specification

### Purpose

Allow the user to verify, correct, reject, and confirm extracted lab data before it becomes official.

### Inputs

- Report in `needs_review` status.
- Draft observations.
- Validation and verification results.
- User edits.

### Outputs

- Official observations.
- Review decisions.
- Correction history.
- Updated report status.

### Failure Modes

- User confirms wrong data.
- User skips important warning.
- Source PDF expired before review.
- Draft observations are incomplete.
- Review save fails.
- Concurrent review edits conflict.

### Confidence Signals

Review UI should show:

- OCR confidence.
- Validation status.
- Verifier status.
- Source page and row.
- Low-confidence fields.
- Blocking issues.
- Unknown marker flags.

### Human Review Requirements

Human review is required for every report. No draft observation can become official without explicit user confirmation or correction.

### Data Stored Permanently

- Reviewer user ID.
- Review timestamp.
- Original draft value.
- Corrected value if changed.
- Confirmation/rejection decision.
- Official observation.
- Audit event.

### Data Stored Temporarily

- PDF/page previews only until retention expiry.

### Audit Events Emitted

- `review.opened`
- `review.field_corrected`
- `review.observation_confirmed`
- `review.observation_rejected`
- `review.report_confirmed`
- `review.report_reopened`

### Acceptance Criteria

- User can confirm clean observations quickly.
- User can correct any extracted field.
- User can reject wrong observations.
- User sees source evidence for every observation.
- Only confirmed observations appear in visualization APIs.

## Review Screen Requirements

The review screen should show:

- Report metadata.
- Lab name candidate.
- Report date candidate.
- Profile name.
- Status and warnings.
- List of draft observations.
- Source preview or source snippet.
- Confidence indicators.
- Validation issues.
- Verifier result.

Each row should allow editing:

- Marker name.
- Canonical biomarker mapping if exposed.
- Value.
- Unit.
- Reference range.
- Abnormal flag.
- Report date if row-specific.
- Notes.

## Blocking Behavior

The UI must prevent final confirmation when:

- Required field is missing.
- Value is impossible.
- Unit is invalid for selected biomarker.
- Source evidence is missing.
- Report date is missing.
- Observation has unreconciled verifier rejection.

The user may correct blocked fields and then confirm.

## Correction Policy

When a user edits a draft field:

- Preserve original machine-extracted value.
- Store corrected value.
- Mark correction source as human.
- Re-run deterministic validation on corrected row.
- Store audit event.

The user correction should not erase machine output from audit history.

## Confirmation Policy

When the user confirms:

- Create official observations from validated/corrected rows.
- Mark draft observations as confirmed or rejected.
- Update report status to `confirmed` if at least one official observation exists and report-level metadata is valid.
- Emit audit events.

## Reopen Policy

If a user needs to fix confirmed data later:

- Do not overwrite official observation in place without audit.
- Create a correction event or a new version.
- Keep previous value traceable.
- Update visualization to use the latest active official value.

## Empty Extraction Review

If no observations are extracted:

- Show report as failed or empty review.
- Allow the user to mark unsupported.
- Allow retry if OCR/extraction failure is recoverable.
- Do not create official observations.

