# ADR-001: Docs-First Core API

## Status

Accepted

## Context

The product handles sensitive clinical lab data. Jumping directly into implementation would risk unclear boundaries between draft data, official data, AI output, and future scoring.

The initial repository is empty, making it a good moment to define the core behavior before code.

## Decision

Start with a docs-only repository that specifies the Core API and upload-to-confirmation pipeline before any implementation code is added.

The docs define:

- Product scope.
- Upload pipeline.
- OCR behavior.
- LLM extraction.
- Validation.
- Verification.
- Human review.
- Official observations.
- API contracts.
- Accuracy evaluation.
- Security and retention.
- Audit requirements.

## Consequences

Positive:

- Reduces implementation ambiguity.
- Makes clinical safety assumptions explicit.
- Keeps score and advice out of the first milestone.
- Gives future engineers a stable implementation target.

Tradeoffs:

- No runnable product exists yet.
- Some details will need revision during implementation.
- API contracts are conceptual until backed by code and tests.

## Acceptance Criteria

- Repository contains plain Markdown docs only.
- No backend or frontend scaffold is introduced.
- Core upload-to-confirmation behavior is decision-complete enough for implementation.

