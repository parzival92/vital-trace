# Deterministic Validation

## Purpose

Deterministic validation checks draft observations using explicit product rules. This is the first hard safety layer after LLM extraction.

The validator must be predictable, testable, versioned, and independent from the LLM.

## Inputs

- Draft observations.
- Draft report metadata.
- OCR confidence data.
- Layout confidence data.
- Biomarker definitions.
- Unit definitions.
- Reference range parsing rules.
- Profile context.

## Outputs

- Validation result per observation.
- Validation issues.
- Severity level.
- Review requirements.
- Normalized values and units where safe.
- Duplicate detection results.

## Pipeline Step Specification

### Purpose

Catch extraction errors, unsafe ambiguity, impossible values, and normalization conflicts before user review.

### Inputs

- LLM structured draft output.
- OCR/layout source evidence.
- Biomarker and unit dictionaries.
- Validation rules.

### Outputs

- Validated draft observations.
- Blocking issues.
- Warning issues.
- Normalized fields.
- Validator version metadata.

### Failure Modes

- Missing required fields.
- Marker cannot be mapped.
- Value cannot be parsed.
- Unit is unknown.
- Unit conflicts with marker.
- Reference range cannot be parsed.
- Value outside plausible biological bounds.
- Abnormal flag conflicts with value/range.
- Duplicate marker rows conflict.
- Report date missing or conflicting.
- Source evidence missing.

### Confidence Signals

Validation confidence depends on:

- Source evidence completeness.
- OCR confidence.
- Layout confidence.
- Biomarker match confidence.
- Unit parse confidence.
- Range parse confidence.
- Verifier agreement later in pipeline.

### Human Review Requirements

Any blocking issue must require review. Warnings must be visible in review.

### Data Stored Permanently

- Validator version.
- Validation issues.
- Normalized fields accepted for review.
- Blocking/warning status.

### Data Stored Temporarily

- Intermediate parsing attempts if useful for debugging.

### Audit Events Emitted

- `validation.started`
- `validation.completed`
- `validation.blocked`
- `validation.failed`

### Acceptance Criteria

- No draft observation can move to confirmation without validation status.
- Impossible or conflicting values are blocked.
- Validator results are reproducible from stored inputs and version.
- Validation does not rely on LLM opinion.

## Validation Categories

### Required Field Validation

Check:

- Marker label exists.
- Value exists.
- Source reference exists.
- Report date exists at report or observation level.
- Profile ID is present.

### Biomarker Mapping Validation

Check:

- Raw label maps to known biomarker or is marked unknown.
- Alias match is not ambiguous.
- Panel/category is plausible for marker.
- Same marker is not mapped to two unrelated biomarkers.

Unknown markers are allowed but must be flagged for review.

### Value Parsing Validation

Check:

- Numeric values parse correctly.
- Inequality values are preserved, for example `<5` or `>200`.
- Qualitative values are preserved, for example `Negative`, `Trace`, `Reactive`.
- Decimal separators are handled consistently.
- No unit text is accidentally included in numeric value.

### Unit Validation

Check:

- Unit is recognized or marked unknown.
- Unit is plausible for biomarker.
- Unit conversion is supported before producing normalized value.
- Original unit is preserved even after normalization.

Unsupported conversion must not be guessed.

### Reference Range Validation

Check:

- Range is parsed from raw text when possible.
- Low and high bounds are sensible.
- Age/sex-specific ranges are not flattened incorrectly.
- Range format is preserved if not parseable.
- Open-ended ranges are supported.

Examples:

- `70-110`
- `<200`
- `>40`
- `0.4 - 4.5`
- `Negative`
- `Non-reactive`

### Abnormal Flag Validation

Check:

- Raw abnormal flag is preserved.
- Normalized abnormal status is one of allowed values.
- Flag agrees with value and reference range when both are numeric.
- Conflicts are highlighted.

Allowed normalized abnormal statuses:

- `low`
- `high`
- `critical_low`
- `critical_high`
- `normal`
- `abnormal`
- `unknown`

### Duplicate Validation

Check:

- Same biomarker appears multiple times in same report.
- Duplicate values agree or conflict.
- Same row was extracted twice.
- Multiple panels intentionally include same marker.

Conflicting duplicates require review.

### Plausibility Validation

Check values against broad biological plausibility thresholds, not diagnostic ranges.

Examples:

- Negative numeric values for most blood markers should block.
- Hemoglobin values far outside human plausible range should block.
- Percentage values above 100 should usually block unless marker allows it.
- Dates in the future should block.

Plausibility thresholds must be conservative and configurable.

## Validation Severity

- `blocker`: Cannot be confirmed without correction.
- `warning`: Can be confirmed after user review.
- `info`: Informational note.

## Validator Versioning

Every validation run stores:

- Validator version.
- Biomarker dictionary version.
- Unit dictionary version.
- Rule configuration version.
- Timestamp.

