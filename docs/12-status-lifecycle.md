# Status Lifecycle

## Purpose

The status lifecycle makes asynchronous processing visible and auditable. It also prevents draft data from being mistaken for official data.

## Primary Status Path

```text
uploaded
-> processing
-> needs_review
-> confirmed
```

## Additional Statuses

- `failed`
- `failed_with_drafts`
- `rejected`
- `expired`
- `deleted`

## Status Definitions

### Uploaded

The PDF file was accepted, stored temporarily, and report record was created.

Allowed next statuses:

- `processing`
- `failed`
- `deleted`

### Processing

The worker is running OCR, layout normalization, LLM extraction, validation, and verification.

Allowed next statuses:

- `needs_review`
- `failed`
- `failed_with_drafts`

### Needs Review

Draft observations exist and require user review.

Allowed next statuses:

- `confirmed`
- `rejected`
- `processing` if reprocessing is requested.
- `deleted`

### Confirmed

At least one official observation was created after user review.

Allowed next statuses:

- `deleted`
- `needs_review` if reopened for correction.

### Failed

Processing failed and no usable draft observations are available.

Allowed next statuses:

- `processing` if retry is allowed.
- `rejected`
- `deleted`

### Failed With Drafts

Processing had serious issues, but some draft observations exist for review.

Allowed next statuses:

- `needs_review`
- `rejected`
- `processing`
- `deleted`

### Rejected

The user or system marked the report unusable for official observations.

Allowed next statuses:

- `processing` only if retry is explicitly requested.
- `deleted`

### Expired

The original PDF retention period ended before review or while still retained.

Important:

- PDF expiry alone does not delete report metadata.
- If draft observations exist, review may continue with retained source snippets if policy allows.
- If source evidence is insufficient after PDF expiry, confirmation may be blocked.

### Deleted

The report is removed from normal product use.

Rules:

- Associated active observations are deactivated.
- Audit policy determines retained metadata.

## Lifecycle Events

Every status transition should emit an audit event:

- `report.uploaded`
- `report.processing_started`
- `report.processing_completed`
- `report.needs_review`
- `report.confirmed`
- `report.failed`
- `report.rejected`
- `report.expired`
- `report.deleted`

## Status Transition Rules

- A report cannot move to `confirmed` without user review.
- A report cannot move to `needs_review` without draft observation or explicit empty-review state.
- A report cannot move directly from `uploaded` to `confirmed`.
- A deleted report cannot return to active status without admin-level restore policy.
- Retry attempts must be counted.

## Report Batch Status

Upload batch status is derived:

- `completed`: all reports confirmed, rejected, failed, or deleted.
- `processing`: at least one report is uploaded or processing.
- `needs_review`: at least one report needs review.
- `mixed`: reports are in different terminal or review states.

## Acceptance Criteria

- Status transitions are explicit and auditable.
- UI can show the right next action for each status.
- Draft data cannot bypass review.
- Failed processing can be retried without losing lineage.

