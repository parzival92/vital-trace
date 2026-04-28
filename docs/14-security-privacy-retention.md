# Security, Privacy, And Retention

## Purpose

The product handles sensitive health data. Security and privacy must be part of the core design, not a later add-on.

## Data Classification

Sensitive data includes:

- Uploaded PDFs.
- OCR text.
- Lab observations.
- Profile medical context.
- Source snippets.
- Review notes.
- Audit metadata that references clinical details.

## Access Control

Rules:

- Every protected request requires authentication.
- Every resource must be scoped to current user ownership.
- Users cannot access another user's profiles, reports, or observations.
- Internal admin access must be separately audited if added later.

## Storage Security

Requirements:

- Encrypt database at rest where infrastructure supports it.
- Encrypt object storage at rest.
- Use TLS for transport.
- Do not store API keys in repo.
- Do not log secrets.
- Restrict production database access.

## PDF Retention

Original PDFs:

- Retained for 30 days after upload.
- Deleted automatically after retention expiry.
- Deleted immediately if user deletes report.
- Not required for visualization after official observations exist.

After deletion:

- Clear file URI.
- Set `pdf_deleted_at`.
- Emit audit event.

## Structured Data Retention

Confirmed structured observations persist until:

- User deletes the report.
- User deletes the profile.
- User deletes account.
- Legal/privacy policy requires deletion.

Draft observations and artifacts should be retained only as long as needed for review, audit, and product quality, subject to privacy policy.

## Logging Rules

Do not log:

- Full PDF text.
- Full OCR output.
- Full LLM prompts containing PHI.
- Access tokens.
- Passwords.
- API keys.

Allowed logs:

- Request ID.
- User ID or hashed user ID.
- Report ID.
- Status transition.
- Error code.
- Processing duration.
- Provider status code.

## LLM And OCR Provider Data Handling

Before production:

- Confirm provider data retention settings.
- Confirm whether uploaded data is used for training.
- Configure enterprise/privacy settings where available.
- Document regional data processing assumptions.
- Avoid sending unnecessary profile context to OCR/LLM.

## API Key Handling

Keys for OCR and LLM providers:

- Stored only in environment/secret manager.
- Never committed.
- Rotated when exposed.
- Scoped to least privilege where possible.

## User Consent

The product should explain:

- PDFs are processed by OCR and AI providers.
- Extracted values require review.
- Original PDFs are retained for 30 days.
- Structured observations persist for future visualization.
- User can delete reports/profiles.

## Audit And Privacy Balance

Audit logs are needed for traceability, but they should not become uncontrolled PHI copies.

Audit metadata should prefer IDs and event codes. Store clinical values in audit only when required to preserve correction history.

## Acceptance Criteria

- PDF retention is explicit.
- Logs are PHI-minimized.
- Provider processing is acknowledged.
- Access control is owner-scoped.
- Deletion behavior is documented.

