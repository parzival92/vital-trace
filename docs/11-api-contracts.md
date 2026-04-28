# API Contracts

## Purpose

This document defines the Core API behavior at endpoint level. It is not implementation code. Request and response examples are illustrative contracts.

## API Principles

- All protected endpoints require authentication.
- All resources are owner-scoped.
- Draft data and official data are separate.
- Upload is asynchronous.
- Visualization APIs return confirmed observations only.
- Errors must be explicit and safe.

## Auth API

### Register

`POST /auth/register`

Purpose:

- Create account owner.
- Start authenticated session or return login-ready response depending on implementation.

Request fields:

- `email`
- `password`

Response fields:

- `user.id`
- `user.email`
- `created_at`

Errors:

- Email already exists.
- Weak password.
- Invalid email.

### Login

`POST /auth/login`

Request fields:

- `email`
- `password`

Response fields:

- `user`
- `session_expires_at`

Errors:

- Invalid credentials.
- Account disabled.

### Logout

`POST /auth/logout`

Purpose:

- End current session.

### Current User

`GET /me`

Response fields:

- `id`
- `email`
- `created_at`

## Profile API

### Create Profile

`POST /profiles`

Request fields:

- `display_name`
- `relationship`
- `date_of_birth`
- `sex`
- Optional detailed medical context fields.

Response:

- Created profile.

### List Profiles

`GET /profiles`

Response:

- Profiles owned by current user.

### Get Profile

`GET /profiles/{profile_id}`

Response:

- Profile details.

Authorization:

- Profile must belong to current user.

### Update Profile

`PATCH /profiles/{profile_id}`

Purpose:

- Update profile demographics or medical context.

### Delete Profile

`DELETE /profiles/{profile_id}`

Purpose:

- Delete or deactivate profile and associated data according to privacy policy.

## Upload API

### Upload Reports

`POST /reports/upload`

Content type:

- `multipart/form-data`

Request fields:

- `profile_id`
- `files[]`
- Optional `user_report_label`

Response fields:

- `batch_id`
- `accepted_reports`
- `rejected_files`

Accepted report fields:

- `report_id`
- `filename`
- `status`
- `pdf_retention_expires_at`

Rejected file fields:

- `filename`
- `reason_code`
- `message`

Behavior:

- Validate profile ownership.
- Validate PDF files.
- Create report records.
- Store files temporarily.
- Queue processing.
- Return immediately.

Errors:

- Unauthorized.
- Profile not found.
- No files.
- File too large.
- Unsupported file type.
- Storage unavailable.

## Report API

### List Reports

`GET /reports?profile_id=...`

Response fields:

- `reports`
- `profile_id`

Report summary fields:

- `report_id`
- `filename`
- `status`
- `lab_name_candidate`
- `report_date_candidate`
- `created_at`
- `processing_completed_at`
- `confirmed_at`
- `pdf_retention_expires_at`
- `pdf_deleted_at`
- `issue_counts`

### Get Report

`GET /reports/{report_id}`

Response fields:

- Report metadata.
- Processing status.
- Status timeline.
- Counts of draft, verified, rejected, and confirmed observations.

### Get Draft Observations

`GET /reports/{report_id}/draft-observations`

Response fields:

- Report metadata.
- Draft observations.
- Validation issues.
- Verification results.
- Source evidence references.

Rules:

- Available when report is `needs_review`, `confirmed`, or `failed_with_drafts`.
- Must not expose another user's report.

### Confirm Report

`POST /reports/{report_id}/confirm`

Purpose:

- Convert reviewed draft observations into official observations.

Request fields:

- `report_metadata`
- `observations`
- `review_decision`

Observation review fields:

- `draft_observation_id`
- `decision`: `confirm`, `correct`, or `reject`
- Corrected marker/value/unit/range/date fields when applicable.
- Optional reviewer note.

Response fields:

- `report_id`
- `status`
- `official_observation_count`
- `rejected_observation_count`
- `confirmed_at`

Rules:

- Blocking validation issues must be corrected.
- Rejected verifier results must be corrected or rejected.
- Confirmation must be transactional.

### Reject Report

`POST /reports/{report_id}/reject`

Purpose:

- Mark report extraction unusable or unsupported.

Request fields:

- `reason_code`
- Optional note.

Rules:

- Rejected reports create no official observations.

### Delete Report

`DELETE /reports/{report_id}`

Purpose:

- Delete report and deactivate associated official observations according to policy.

Rules:

- Original PDF is removed if still present.
- Visualization must stop showing deleted report data.

## Visualization API

### List Observations

`GET /profiles/{profile_id}/observations`

Query filters:

- `biomarker_id`
- `from`
- `to`
- `category`
- `report_id`

Response fields:

- Confirmed observations only.

### Trends

`GET /profiles/{profile_id}/trends`

Purpose:

- Return chart-ready series grouped by biomarker.

Response fields:

- `profile_id`
- `series`

Each series:

- `biomarker_id`
- `display_name`
- `unit`
- `points`

Each point:

- `observed_at`
- `value_numeric`
- `value_raw`
- `unit`
- `reference_low`
- `reference_high`
- `abnormal_status`
- `report_id`

Rules:

- Only active official observations.
- Qualitative values require explicit chart support.

### Dashboard Summary

`GET /profiles/{profile_id}/dashboard-summary`

Response fields:

- Latest report.
- Report counts by status.
- Recent abnormal observations.
- Markers with at least two observations.
- Review queue count.

Rules:

- No health score in core milestone.

## Error Format

Errors should include:

- `error.code`
- `error.message`
- Optional `error.field`
- Optional `request_id`

Do not include sensitive report text in error messages.

## Acceptance Criteria

- API supports full upload-to-confirmation loop.
- Endpoint contracts distinguish draft and official data.
- Upload endpoint is clearly defined.
- Visualization endpoint cannot expose unreviewed data.

