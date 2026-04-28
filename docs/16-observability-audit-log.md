# Observability And Audit Log

## Purpose

The system must be observable enough to debug extraction quality and auditable enough to explain how an official observation was created.

## Observability Goals

- Track every processing stage.
- Measure latency and failures.
- Measure extraction quality indicators.
- Support user support/debugging.
- Preserve clinical traceability.

## Required Trace IDs

Use stable IDs across logs and events:

- `request_id`
- `user_id`
- `profile_id`
- `upload_batch_id`
- `report_id`
- `job_id`
- `draft_observation_id`
- `official_observation_id`

## Pipeline Events

Capture events for:

- Upload accepted/rejected.
- OCR started/completed/failed.
- Layout normalization started/completed/failed.
- LLM extraction started/completed/failed.
- Validation started/completed/blocked.
- Verification started/completed/disagreed.
- Review opened.
- Field corrected.
- Observation confirmed/rejected.
- Report confirmed/rejected/deleted.
- PDF deleted by retention job.

## Metrics

Operational metrics:

- Upload count.
- OCR duration.
- LLM extraction duration.
- Validation duration.
- Verification duration.
- End-to-end processing duration.
- Queue wait time.
- Failure rate by stage.
- Retry count.

Quality metrics:

- Draft observations per report.
- Validation blocker count.
- Verification disagreement count.
- User correction rate.
- Unknown biomarker rate.
- Unit unknown rate.
- Missing report date rate.
- Low OCR confidence rate.

## Audit Log Requirements

Audit events should record:

- Who acted.
- What changed.
- Which resource changed.
- When it happened.
- Which request/job caused it.
- Which model/rule version was involved.

For corrections, audit must preserve:

- Machine-extracted value.
- Human-corrected value.
- Reviewer ID.
- Timestamp.
- Reason/note if provided.

## Version Traceability

Every report should be traceable to:

- OCR provider.
- OCR processor/config version.
- Layout normalizer version.
- LLM model.
- Prompt version.
- Structured output schema version.
- Validator version.
- Biomarker dictionary version.
- Unit dictionary version.
- Verifier version.

## Privacy In Logs

Logs should avoid full PHI. Prefer IDs, counts, status codes, and timing.

If values must be retained for correction audit, store them in controlled audit tables, not broad application logs.

## Support Debugging

Support/debug view should be able to answer:

- Why is this report stuck?
- Which stage failed?
- Which values were low confidence?
- What did the user correct?
- Why did a value not appear in charts?
- Was the original PDF already deleted?

## Acceptance Criteria

- Every report has an inspectable processing timeline.
- Every official observation can be traced to source and review.
- Version metadata is stored for extraction and validation.
- Logs do not casually duplicate sensitive report contents.

