# ADR-004: Human Review Before Official Data

## Status

Accepted

## Context

The product target is high accuracy for clinical lab data. OCR and LLM systems can still make mistakes, especially with dense tables, scans, odd units, and unusual reference ranges.

Charts and future scores must not be polluted by unreviewed machine output.

## Decision

Require human review before any extracted observation becomes official.

Draft observations can be:

- Confirmed.
- Corrected.
- Rejected.

Only confirmed/corrected observations become official and appear in visualization APIs.

## Consequences

Positive:

- Protects data quality.
- Builds user trust.
- Creates correction data for evaluation.
- Prevents silent OCR/LLM errors from affecting charts.

Tradeoffs:

- Adds user friction.
- Requires a strong review UI.
- Delays visualization until review is complete.

## Alternatives Considered

### Auto-Confirm High-Confidence Values

Deferred. This may be considered after the system has strong measured accuracy and enough review data.

### LLM Decides Official Values

Rejected. It is unsafe for clinical data and weakens auditability.

## Acceptance Criteria

- Visualization APIs read official observations only.
- Every official observation has a reviewer and timestamp.
- Corrections preserve machine output and source evidence.
- Blocking validation issues cannot be bypassed silently.

