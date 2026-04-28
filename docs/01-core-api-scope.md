# Core API Scope

## Purpose

The Core API provides the backend contract for the upload-to-confirmation loop. It is deliberately narrower than the full product.

The API must support:

- Account authentication.
- Owner-managed family profiles.
- PDF upload.
- Report processing status.
- Draft observation review.
- Official observation confirmation.
- Chart-ready visualization data.

## Milestone Boundary

The Core API stops at confirmed observations and visualization. It does not include the future health score, advanced AI reasoning summary, clinician review, payment, or public team workflows.

## API Groups

### Auth API

Responsibilities:

- Register account owner.
- Login.
- Logout.
- Return current authenticated user.
- Enforce session ownership on every protected resource.

Endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`

### Profile API

Responsibilities:

- Create and manage family profiles.
- Store profile medical context used later by extraction and scoring.
- Ensure every report belongs to exactly one profile.

Endpoints:

- `POST /profiles`
- `GET /profiles`
- `GET /profiles/{profile_id}`
- `PATCH /profiles/{profile_id}`
- `DELETE /profiles/{profile_id}`

### Upload API

Responsibilities:

- Accept one or more PDF reports.
- Validate file type and size.
- Create report records.
- Store original PDFs temporarily.
- Queue OCR/extraction processing.

Endpoint:

- `POST /reports/upload`

### Report API

Responsibilities:

- Show reports and statuses.
- Expose draft observations for review.
- Confirm or reject report extraction.
- Delete reports.

Endpoints:

- `GET /reports?profile_id=...`
- `GET /reports/{report_id}`
- `GET /reports/{report_id}/draft-observations`
- `POST /reports/{report_id}/confirm`
- `POST /reports/{report_id}/reject`
- `DELETE /reports/{report_id}`

### Visualization API

Responsibilities:

- Return confirmed observations only.
- Return trend data grouped by biomarker.
- Return dashboard summaries.

Endpoints:

- `GET /profiles/{profile_id}/observations`
- `GET /profiles/{profile_id}/trends`
- `GET /profiles/{profile_id}/dashboard-summary`

## Authorization Rule

Every resource access must be checked through account ownership:

- User owns profile.
- Profile owns report.
- Report owns draft observations.
- Profile owns official observations.

If any link fails, return unauthorized or not found. Do not leak whether a resource exists under another account.

## Processing Rule

The API is asynchronous after upload.

The upload endpoint must return quickly with report IDs and initial status. OCR, extraction, validation, and verification run in a background worker.

## Draft Versus Official Rule

Draft observations are machine-generated and reviewable.

Official observations are human-confirmed and visualization-ready.

Visualization APIs must never read draft observations.

## Deferred Features

The following must not be implemented in the Core API milestone:

- Health score.
- AI medical summary.
- Treatment recommendation.
- Doctor chat.
- Payment.
- Organization accounts.
- Direct lab integrations.
- Wearable integrations.

## Acceptance Criteria

- The API contract supports the complete upload-to-review-to-visualize loop.
- Every endpoint has an ownership boundary.
- Draft and official data are separate.
- Processing is represented through explicit statuses.
- Future scoring can be added without changing confirmed observation history.

