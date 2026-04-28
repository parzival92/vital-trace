# Future Health Score

## Purpose

The health score is a future product moat and intentionally out of scope for the Core API milestone.

This document reserves the design direction so the upload pipeline stores data in a way that supports scoring later.

## Future Score Principle

The health score should be deterministic, transparent, and product-owned. The LLM may explain the score, but must not be the source of the score.

## Inputs Needed Later

The score engine will need:

- Confirmed observations.
- Biomarker definitions.
- Unit-normalized values.
- Reference ranges.
- Profile context.
- Trend history.
- Category weights.
- Severity thresholds.
- Missing data rules.

## Why It Is Deferred

Scoring before reliable extraction is unsafe. The product must first prove:

- Upload works.
- Extraction is traceable.
- Review is usable.
- Official observations are reliable.
- Trends can be visualized from confirmed data.

## Data Requirements For Future Compatibility

The Core API should preserve:

- Raw values and normalized values.
- Raw units and normalized units.
- Report dates.
- Source report links.
- Marker categories.
- Biomarker IDs where known.
- Unknown marker support.
- Correction history.
- Versioned biomarker dictionaries.

## Future Score Shape

Possible future score model:

- Start from 100.
- Apply biomarker severity penalties.
- Weight categories.
- Adjust for trends.
- Adjust for repeated abnormality.
- Adjust for missing high-value panels.
- Show breakdown by category.

This is only a direction, not a committed algorithm for the core milestone.

## LLM Role Later

The LLM may:

- Explain score movement.
- Summarize concerning trends.
- Highlight questions to discuss with a clinician.
- Translate technical markers into plain language.

The LLM must not:

- Generate the score directly.
- Override deterministic score rules.
- Diagnose.
- Prescribe treatment.

## Acceptance Criteria For Core

Core is score-ready when:

- Confirmed observations have canonical biomarker IDs where possible.
- Units are normalized when safely supported.
- Observations are timestamped.
- History is queryable by profile and marker.
- Corrections are versioned.

