# LLM Structured Extraction

## Purpose

The LLM converts normalized OCR/layout candidates into strict structured draft observations. It is not the source of truth by itself. It must cite source evidence and stay inside the required schema.

The primary model for this step is `gpt-5.5`.

## Position In Pipeline

The LLM runs after:

- PDF upload.
- Google Document AI OCR.
- Local layout normalization.

The LLM must not receive only the original PDF as the sole extraction source in the core pipeline. It should receive normalized layout data, OCR text, and source references so output can be verified.

## Inputs

- Normalized table candidates.
- Candidate observation rows.
- Page text snippets.
- Metadata candidates.
- OCR confidence values.
- Source references.
- Biomarker alias dictionary if available.
- Required structured output schema.

## Outputs

- Draft report metadata.
- Draft observations.
- Extraction warnings.
- Unknown marker candidates.
- Source references for each field.
- Model metadata.

## Pipeline Step Specification

### Purpose

Transform normalized OCR/layout evidence into structured lab observations.

### Inputs

- Normalized layout document.
- Biomarker definitions and aliases.
- Extraction schema.
- Report profile context if needed for sex/age-specific interpretation of ranges.

### Outputs

- Draft observations.
- Draft report metadata.
- Extraction confidence.
- Field-level source references.
- Extraction issues.

### Failure Modes

- Model output does not match schema.
- Model omits visible rows.
- Model invents markers or values.
- Model merges separate rows.
- Model misreads unit or range.
- Model misclassifies abnormal flags.
- Model confuses patient metadata with lab values.
- Model cannot resolve multiple report dates.

### Confidence Signals

LLM confidence is not trusted alone. It must be combined with:

- OCR token confidence.
- Layout confidence.
- Source field coverage.
- Validator pass/fail results.
- Verifier agreement.

### Human Review Requirements

Every extracted observation remains draft until user confirmation. Low-confidence fields are highlighted in review.

### Data Stored Permanently

- Model name.
- Prompt/template version.
- Schema version.
- Draft extraction timestamp.
- Structured draft output.
- Field-level source references.
- Extraction warnings.

### Data Stored Temporarily

- Full prompt payloads should not be retained if they contain unnecessary PHI.
- Redacted prompt traces may be retained for debugging if security policy allows.

### Audit Events Emitted

- `llm_extraction.started`
- `llm_extraction.completed`
- `llm_extraction.schema_failed`
- `llm_extraction.failed`

### Acceptance Criteria

- Output conforms to strict schema.
- Every observation has source evidence.
- Unknown markers are preserved for review.
- No observation becomes official from this step.

## Required Extraction Behavior

The LLM must:

- Extract all visible lab observation rows.
- Preserve raw marker labels.
- Map known markers to canonical biomarkers when confident.
- Preserve unknown markers instead of dropping them.
- Preserve values as seen before normalization.
- Preserve units as seen.
- Preserve reference ranges as seen.
- Preserve abnormal flags as seen.
- Identify report date and lab name when available.
- Attach source page/table/row references.
- Mark uncertain fields explicitly.

The LLM must not:

- Diagnose.
- Recommend treatment.
- Calculate health score.
- Invent missing values.
- Convert units without explicit validator support.
- Hide uncertainty.
- Drop abnormal values because they look surprising.

## Draft Observation Fields

Each draft observation should contain:

- Draft observation ID.
- Report ID.
- Profile ID.
- Raw marker label.
- Canonical biomarker ID if matched.
- Biomarker match confidence.
- Value raw text.
- Parsed numeric value if possible.
- Unit raw text.
- Normalized unit candidate if possible.
- Reference range raw text.
- Parsed low reference if possible.
- Parsed high reference if possible.
- Abnormal flag raw text.
- Abnormal flag normalized candidate.
- Panel/category candidate.
- Report date candidate.
- Source page.
- Source table index.
- Source row index.
- Source bounding boxes.
- OCR confidence summary.
- LLM extraction confidence.
- Extraction notes.
- Validation status placeholder.

## Prompting Rules

The extraction prompt should be versioned and must state:

- Extract only from provided evidence.
- Return strict structured output only.
- Preserve uncertainty.
- Never create values absent from the source.
- Never ignore low-confidence source evidence.
- Unknown markers are allowed.
- Every field must link back to source evidence.

## Structured Output Rule

The implementation must use strict structured output mode or equivalent schema enforcement. Free-form prose extraction is not acceptable for the core pipeline.

## Model Versioning

Every extraction must store:

- Model name.
- Model provider.
- Extraction prompt version.
- Schema version.
- Timestamp.
- Retry count.

If the model changes later, historical extractions remain traceable to the original model.

