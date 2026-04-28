# VitalTrace

VitalTrace is a docs-only specification for the first core milestone of a family health product: uploading clinical lab PDFs, extracting structured observations, reviewing them, and making confirmed observations available for visualization.

There is intentionally no application code, no scaffold, no dependencies, and no deployment configuration in this repository yet. The goal is to define the product, API, data, accuracy, review, and audit contract before implementation starts.

## Core Pipeline

```text
PDF upload
-> Google Document AI OCR
-> local table/layout normalization
-> gpt-5.5 structured extraction
-> deterministic validation
-> second-pass verifier
-> user review
-> confirmed observations become official
```

## Product Principle

The system handles sensitive clinical data and must be designed around measured accuracy, traceability, and human confirmation.

The product goal is 99% field-level accuracy for supported report types. That is not treated as a promise from OCR or an LLM. It is a release target measured against golden PDFs and manual review outcomes.

No extracted result becomes official until a user reviews and confirms it. Visualization APIs only read confirmed observations.

## What V1 Does

- Accepts one or more PDF lab reports for a selected family profile.
- Uses Google Document AI as the primary OCR/layout engine.
- Normalizes OCR text, tables, rows, columns, page references, and source evidence.
- Uses `gpt-5.5` for strict structured extraction after OCR/layout normalization.
- Runs deterministic validation for marker identity, values, units, reference ranges, dates, duplicates, impossible values, and confidence conflicts.
- Runs a second verification pass before showing the review screen.
- Requires the user to confirm or correct draft observations.
- Stores confirmed observations permanently for visualization.
- Deletes original uploaded PDFs after 30 days.

## What V1 Does Not Do

- Does not provide diagnosis.
- Does not prescribe treatment.
- Does not replace a clinician.
- Does not auto-confirm extracted lab data.
- Does not calculate the future health score yet.
- Does not include frontend/backend implementation code.
- Does not define production compliance certification.

## Milestone Boundary

The milestone is complete when the documentation is detailed enough for an engineer to implement:

- Auth, profile, upload, report, review, and visualization APIs.
- OCR and extraction pipeline behavior.
- Validation and verification rules.
- Data model and lifecycle.
- Security, retention, observability, and audit requirements.
- Accuracy evaluation and release gates.

## Documentation Index

- [Product Vision](docs/00-product-vision.md)
- [Core API Scope](docs/01-core-api-scope.md)
- [PDF Upload Flow](docs/02-pdf-upload-flow.md)
- [Google Document AI OCR](docs/03-google-document-ai-ocr.md)
- [Layout Normalization](docs/04-layout-normalization.md)
- [LLM Structured Extraction](docs/05-llm-structured-extraction.md)
- [Deterministic Validation](docs/06-deterministic-validation.md)
- [Second-Pass Verifier](docs/07-second-pass-verifier.md)
- [User Review Workflow](docs/08-user-review-workflow.md)
- [Official Observations](docs/09-official-observations.md)
- [Data Model](docs/10-data-model.md)
- [API Contracts](docs/11-api-contracts.md)
- [Status Lifecycle](docs/12-status-lifecycle.md)
- [Accuracy and Evaluation](docs/13-accuracy-and-evaluation.md)
- [Security, Privacy, and Retention](docs/14-security-privacy-retention.md)
- [Error Handling](docs/15-error-handling.md)
- [Observability and Audit Log](docs/16-observability-audit-log.md)
- [Future Health Score](docs/17-future-health-score.md)
- [Open Questions](docs/18-open-questions.md)

## Architecture Decisions

- [ADR-001: Docs-First Core API](docs/decisions/ADR-001-docs-first-core-api.md)
- [ADR-002: Google Document AI for OCR](docs/decisions/ADR-002-google-document-ai-for-ocr.md)
- [ADR-003: gpt-5.5 for Structured Extraction](docs/decisions/ADR-003-gpt-5-5-for-structured-extraction.md)
- [ADR-004: Human Review Before Official Data](docs/decisions/ADR-004-human-review-before-official-data.md)

## Accuracy Terms

Field-level accuracy is measured separately for:

- Report date
- Lab name
- Biomarker name
- Value
- Unit
- Reference range
- Abnormal flag
- Source page/table/row

Any low-confidence or conflicting extraction must block automatic confirmation and require human review.

## External References

- OpenAI models: https://developers.openai.com/api/docs/models
- OpenAI file inputs: https://developers.openai.com/api/docs/guides/file-inputs
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- Google Document AI OCR: https://cloud.google.com/document-ai/docs/process-documents-ocr
