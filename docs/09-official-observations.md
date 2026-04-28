# Official Observations

## Purpose

Official observations are the only lab values trusted by the product for visualization and future scoring. They are created only after user review.

## Definition

An official observation is a confirmed clinical lab value linked to:

- User account.
- Family profile.
- Source report.
- Report date.
- Biomarker or raw marker.
- Value.
- Unit.
- Reference range when available.
- Abnormal status.
- Source evidence.
- Review history.

## Inputs

- Confirmed/corrected draft observations.
- Final report metadata.
- Reviewer identity.
- Validation result after correction.

## Outputs

- Official observations.
- Visualization-ready records.
- Audit events.
- Report status `confirmed`.

## Pipeline Step Specification

### Purpose

Persist reviewed lab data as the source of truth for charts and future score computation.

### Inputs

- User-confirmed draft observations.
- Human corrections.
- Report metadata.
- Validation result.

### Outputs

- Official observations.
- Active observation versions.
- Audit history.
- Updated report status.

### Failure Modes

- Confirmation transaction fails.
- Duplicate official observations are created accidentally.
- Report metadata is incomplete.
- User confirms observations under wrong profile.
- Correction loses source traceability.

### Confidence Signals

Official observations should preserve:

- OCR confidence summary.
- LLM extraction confidence.
- Validator result.
- Verifier result.
- Human reviewer confirmation.

Human confirmation is the final gate, not a replacement for traceability.

### Human Review Requirements

Every official observation must have a reviewer and timestamp.

### Data Stored Permanently

- Official observation fields.
- Source report link.
- Source evidence references.
- Review decision.
- Correction history.
- Audit events.

### Data Stored Temporarily

- Original PDF only until 30-day expiry.

### Audit Events Emitted

- `official_observation.created`
- `official_observation.corrected`
- `official_observation.deactivated`
- `report.confirmed`

### Acceptance Criteria

- Visualization APIs read official observations only.
- Every official observation has review history.
- Corrections are auditable.
- Original source remains traceable even after PDF deletion through metadata and source references.

## Immutability Policy

Official observations should be versioned rather than destructively overwritten.

Recommended behavior:

- First confirmation creates version 1.
- Later correction creates version 2.
- Only the latest active version is used for visualization.
- Older versions remain available for audit.

## Deletion Policy

When a user deletes a report:

- Mark report as deleted.
- Deactivate associated official observations.
- Preserve minimal audit events unless legal deletion requirements demand full erasure.
- Remove original PDF if still retained.

When a user deletes a profile:

- Require explicit confirmation.
- Delete or anonymize associated reports and observations according to privacy policy.

## Visualization Eligibility

An observation is eligible for visualization only if:

- Status is active.
- Review status is confirmed.
- Report is not deleted.
- Profile is active.
- Observation has a valid date.
- Observation has a value suitable for charting.

Qualitative observations may appear in tables but not numeric trend charts unless specifically supported.

## Source Evidence After PDF Deletion

Original PDFs are deleted after 30 days. After deletion, the system should still retain:

- Page number.
- Table/row/cell reference.
- Extracted source text snippet where allowed.
- OCR confidence summary.
- Review and correction history.

If source snippets are considered sensitive, retention should be governed by the same PHI policy as observations.

