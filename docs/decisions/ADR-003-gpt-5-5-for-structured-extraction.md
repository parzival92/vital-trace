# ADR-003: gpt-5.5 For Structured Extraction

## Status

Accepted

## Context

The product needs a strong reasoning model to convert normalized OCR/layout evidence into structured lab observations. The model must handle varied lab formats, aliases, units, reference ranges, abnormal flags, and uncertainty.

The model should not be the sole source of truth and should not produce free-form medical advice in the core milestone.

## Decision

Use OpenAI `gpt-5.5` for structured extraction and second-pass verification, with strict schema enforcement.

The model receives:

- Normalized OCR text.
- Table candidates.
- Source references.
- OCR/layout confidence.
- Biomarker aliases.
- Required output schema.

The model returns:

- Draft observations.
- Metadata candidates.
- Source references.
- Uncertainty flags.

## Consequences

Positive:

- Strong model for complex extraction and reasoning over messy layouts.
- Structured output reduces parser ambiguity.
- Model output can be validated and verified before review.

Tradeoffs:

- Adds cost.
- Adds external provider dependency.
- Requires prompt/schema versioning.
- Requires privacy review for PHI handling.

## Non-Goals

The model must not:

- Diagnose.
- Prescribe.
- Generate the health score.
- Make observations official.
- Invent missing values.

## Acceptance Criteria

- Model output is schema-constrained.
- Every extracted field cites source evidence.
- Extraction metadata stores model and prompt versions.
- Validation and human review remain mandatory.

