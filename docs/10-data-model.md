# Data Model

## Purpose

This document defines the conceptual data model for the Core API. It is not a database migration or implementation schema. It describes the entities, ownership rules, lifecycle fields, and audit relationships needed for implementation.

## Entity Overview

Core entities:

- User
- Profile
- Report
- Upload batch
- OCR artifact
- Layout artifact
- Draft observation
- Official observation
- Biomarker definition
- Unit definition
- Validation issue
- Verification result
- Audit event

## User

Represents the account owner.

Fields:

- `id`
- `email`
- `password_hash`
- `created_at`
- `updated_at`
- `last_login_at`
- `status`

Relationships:

- User owns many profiles.
- User owns many upload batches through profiles/reports.
- User creates review events.

Rules:

- Email must be unique.
- Protected resources must be scoped to user ownership.
- User deletion must trigger profile/report/observation deletion or anonymization policy.

## Profile

Represents one person managed under an account.

Fields:

- `id`
- `user_id`
- `display_name`
- `relationship`
- `date_of_birth`
- `sex`
- `height`
- `weight`
- `known_conditions`
- `medications`
- `allergies`
- `symptoms`
- `family_history`
- `health_goals`
- `lifestyle_notes`
- `pregnancy_flag`
- `created_at`
- `updated_at`
- `deleted_at`

Relationships:

- Profile belongs to one user.
- Profile has many reports.
- Profile has many official observations.

Rules:

- Every report must belong to a profile.
- Profile medical context may influence future scoring and range interpretation, but must not override report values.

## Upload Batch

Represents a group of files uploaded together.

Fields:

- `id`
- `user_id`
- `profile_id`
- `created_at`
- `file_count`
- `accepted_count`
- `rejected_count`
- `status`

Relationships:

- Upload batch has many reports.

Rules:

- Batch status is derived from report statuses.
- Rejected files may be represented as batch-level rejection records even if no report row is created.

## Report

Represents one uploaded PDF file.

Fields:

- `id`
- `user_id`
- `profile_id`
- `upload_batch_id`
- `original_filename`
- `file_hash`
- `file_size_bytes`
- `page_count`
- `mime_type`
- `status`
- `lab_name_candidate`
- `report_date_candidate`
- `collection_date_candidate`
- `temporary_file_uri`
- `pdf_retention_expires_at`
- `pdf_deleted_at`
- `processing_started_at`
- `processing_completed_at`
- `confirmed_at`
- `deleted_at`
- `created_at`
- `updated_at`

Relationships:

- Report belongs to one profile.
- Report has one or more OCR/layout artifacts.
- Report has many draft observations.
- Report may create many official observations.

Rules:

- Original PDF is retained for 30 days.
- Report status controls UI and API behavior.
- Deleted reports should not appear in normal visualization.

## OCR Artifact

Represents OCR output and metadata.

Fields:

- `id`
- `report_id`
- `provider`
- `processor_name`
- `processor_version`
- `status`
- `quality_summary`
- `raw_artifact_uri`
- `created_at`

Rules:

- Raw OCR may be stored temporarily or in compressed/redacted form.
- OCR metadata must be retained enough to explain extraction lineage.

## Layout Artifact

Represents normalized layout output.

Fields:

- `id`
- `report_id`
- `normalizer_version`
- `status`
- `table_count`
- `candidate_row_count`
- `metadata_candidates`
- `warnings`
- `artifact_uri`
- `created_at`

Rules:

- Layout artifact should preserve source references used by draft observations.

## Draft Observation

Represents machine-generated observation before confirmation.

Fields:

- `id`
- `report_id`
- `profile_id`
- `raw_marker_label`
- `canonical_biomarker_id`
- `biomarker_match_confidence`
- `value_raw`
- `value_numeric`
- `value_operator`
- `unit_raw`
- `unit_normalized`
- `reference_range_raw`
- `reference_low`
- `reference_high`
- `abnormal_flag_raw`
- `abnormal_status`
- `panel_candidate`
- `report_date_candidate`
- `source_page`
- `source_table_index`
- `source_row_index`
- `source_bounding_boxes`
- `ocr_confidence`
- `layout_confidence`
- `llm_confidence`
- `validation_status`
- `verification_status`
- `review_status`
- `created_at`
- `updated_at`

Rules:

- Draft observations are not visualization-ready.
- Draft observations may be corrected before becoming official.
- Draft observations must preserve original machine output.

## Official Observation

Represents confirmed lab data.

Fields:

- `id`
- `profile_id`
- `report_id`
- `draft_observation_id`
- `canonical_biomarker_id`
- `raw_marker_label`
- `display_marker_name`
- `value_raw`
- `value_numeric`
- `value_operator`
- `unit_raw`
- `unit_normalized`
- `reference_range_raw`
- `reference_low`
- `reference_high`
- `abnormal_status`
- `observed_at`
- `source_page`
- `source_table_index`
- `source_row_index`
- `source_bounding_boxes`
- `reviewed_by_user_id`
- `reviewed_at`
- `version`
- `active`
- `created_at`
- `updated_at`

Rules:

- Only active official observations are used for visualization.
- Corrections create new versions or correction events.
- Every official observation must link to review history.

## Biomarker Definition

Represents known marker identity and matching rules.

Fields:

- `id`
- `canonical_name`
- `aliases`
- `category`
- `default_unit`
- `supported_units`
- `qualitative`
- `plausible_min`
- `plausible_max`
- `sex_specific`
- `age_specific`
- `active`
- `version`

Rules:

- Unknown markers can still become official, but should be flagged.
- Biomarker definitions are versioned because scoring will depend on them later.

## Unit Definition

Represents supported units and conversions.

Fields:

- `id`
- `unit`
- `canonical_unit`
- `aliases`
- `dimension`
- `conversion_rule`
- `active`
- `version`

Rules:

- Unsupported conversions must not be guessed.
- Original raw unit is always retained.

## Validation Issue

Represents deterministic validation findings.

Fields:

- `id`
- `draft_observation_id`
- `report_id`
- `code`
- `severity`
- `field`
- `message`
- `validator_version`
- `created_at`

Rules:

- Blocking issues must be resolved before confirmation.
- Warnings remain visible during review.

## Verification Result

Represents second-pass verification output.

Fields:

- `id`
- `draft_observation_id`
- `report_id`
- `status`
- `field_results`
- `mismatch_summary`
- `verifier_type`
- `verifier_model`
- `verifier_version`
- `created_at`

Rules:

- Verification result cannot create official data by itself.
- Rejected verification blocks normal confirmation until corrected.

## Audit Event

Represents immutable event history.

Fields:

- `id`
- `user_id`
- `profile_id`
- `report_id`
- `entity_type`
- `entity_id`
- `event_type`
- `metadata`
- `created_at`
- `request_id`

Rules:

- Audit logs must avoid storing unnecessary PHI.
- Audit logs must be sufficient for traceability.
- Sensitive values in metadata should be redacted unless required for clinical traceability.

## Ownership Rules

- User owns profiles.
- Profile owns reports.
- Report owns draft observations.
- Official observations belong to profile and report.
- API access must always resolve ownership from current user to target resource.

## Acceptance Criteria

- The model separates draft and official observations.
- Every official observation is traceable to report, source, and review.
- OCR, layout, LLM, validation, and verification versions are stored.
- Visualization can be built from official observations without reading PDFs.

