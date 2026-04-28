# PDF Upload Flow

## Purpose

The upload flow receives clinical lab report PDFs and starts the processing pipeline. It must be strict about accepted files because bad input can create unsafe or confusing extraction results.

## Inputs

Upload request:

- Authenticated user session.
- `profile_id`.
- One or more PDF files.
- Optional user-supplied report label.
- Optional report date if the user knows it.

## File Rules

Accepted:

- PDF files only.
- Text PDFs.
- Scanned PDFs.
- Multi-page PDFs.
- Multiple reports in one upload batch.

Rejected:

- Non-PDF files.
- Password-protected PDFs unless a supported unlock workflow is later added.
- Corrupt PDFs.
- Empty PDFs.
- Files above configured size limit.
- Files with malware scan failure.

Recommended initial limits:

- Max files per batch: 10.
- Max file size: 25 MB per PDF.
- Max pages per PDF: 50.

These limits are product defaults and can be changed by configuration.

## Outputs

The upload API returns:

- `batch_id`.
- One report record per accepted file.
- Initial status `uploaded`.
- Rejection details for any rejected file.

The API does not wait for OCR or extraction to complete.

## Status Creation

For every accepted PDF:

- Create report record.
- Attach it to the selected profile.
- Store original filename.
- Store upload timestamp.
- Store temporary file location.
- Set `uploaded_at`.
- Set `pdf_retention_expires_at` to upload time plus 30 days.
- Set status to `uploaded`.
- Emit audit event `report.uploaded`.
- Enqueue processing job.

## Pipeline Step Specification

### Purpose

Convert uploaded PDFs into report records that can be processed asynchronously.

### Inputs

- Authenticated user.
- Profile ID owned by user.
- PDF file stream.
- Original filename.
- File metadata.

### Outputs

- Report ID.
- Batch ID.
- Stored temporary PDF.
- Processing job.
- Upload audit event.

### Failure Modes

- Missing profile.
- Profile belongs to another user.
- Invalid file type.
- File too large.
- Too many files.
- Corrupt PDF.
- Malware scan failure.
- Temporary storage failure.
- Queue unavailable.

### Confidence Signals

Upload itself has no extraction confidence. It stores file quality metadata when available:

- File size.
- Page count.
- PDF text presence.
- Scan/image presence.
- Whether the document appears rotated.
- Whether pages are readable enough for OCR attempt.

### Human Review Requirements

No review happens during upload. Review happens after draft observations are generated.

### Data Stored Permanently

- Report record.
- Upload metadata.
- Processing status.
- Ownership link to profile.
- Audit event.

### Data Stored Temporarily

- Original PDF for 30 days.
- File processing artifacts until cleanup policy removes them.

### Audit Events Emitted

- `report.uploaded`
- `report.file_rejected`
- `report.processing_queued`

### Acceptance Criteria

- Valid PDFs create report records and queued jobs.
- Invalid files produce clear rejection reasons.
- Upload response is deterministic and does not depend on OCR completion.
- Original PDFs have a retention expiry date.

## Retry Behavior

If upload succeeds but job queueing fails:

- The report remains `uploaded`.
- The system records `processing_queue_failed`.
- A retry process can enqueue the job later.
- The user sees the report as waiting for processing.

If storage fails:

- No report should be created unless storage can be completed.
- Partial records must be rolled back or marked failed with no accessible artifact.

## Duplicate Upload Handling

The system should compute a file hash for each PDF.

If the same user uploads the same file for the same profile:

- Warn that a duplicate may exist.
- Allow the user to continue if they intentionally want another copy.
- Do not silently merge records.

## Retention Rule

Original PDFs are deleted automatically 30 days after upload.

Deletion must not delete:

- Confirmed observations.
- Draft observations required for audit, unless policy later changes.
- Audit events.
- Report metadata.

When PDF is deleted:

- Clear file storage pointer.
- Set `pdf_deleted_at`.
- Emit `report.pdf_deleted`.

