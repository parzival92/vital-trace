# Accuracy And Evaluation

## Purpose

This document defines how the product measures accuracy. The goal is not to claim model perfection. The goal is to build a system that can prove field-level reliability before expanding scope.

## Accuracy Target

The product target is 99% field-level accuracy for supported report types.

This is measured only on the supported evaluation set. Unsupported layouts, poor scans, and unknown markers must be detected and routed to review rather than silently counted as success.

## Field-Level Metrics

Measure each field separately:

- Report date.
- Lab name.
- Biomarker name.
- Value.
- Unit.
- Reference range.
- Abnormal flag.
- Source page/table/row.

## Observation-Level Accuracy

An observation is fully correct only when all required fields are correct:

- Correct marker identity.
- Correct value.
- Correct unit.
- Correct report date.
- Correct source reference.

Reference range and abnormal flag may be evaluated separately because some reports omit them.

## Golden PDF Set

Build a private evaluation set of manually labeled PDFs.

The set should include:

- High-quality digital PDFs.
- Scanned PDFs.
- Multi-page reports.
- Common Indian pathology lab formats.
- Dense tables.
- Wrapped reference ranges.
- Mixed units.
- Abnormal flags.
- Unknown markers.
- Duplicate markers.
- Poor quality scans.
- Reports with missing reference ranges.

Each golden PDF should have manually verified labels.

## Evaluation Modes

### Extraction Accuracy

Measures machine output before user correction.

Used to improve OCR, normalization, extraction, validation, and verifier.

### Review Outcome Accuracy

Measures how often users confirm without correction versus correct/reject.

Used to detect product trust and workflow quality.

### Official Data Accuracy

Measures confirmed observations after review.

This is the only accuracy level that matters for visualization reliability.

## Metrics

Track:

- Exact field match rate.
- Observation exact match rate.
- False positive extraction rate.
- Missing observation rate.
- Unit normalization accuracy.
- Reference range parsing accuracy.
- Abnormal flag agreement.
- Verifier disagreement rate.
- User correction rate.
- Blocking issue rate.
- Time to review.

## Manual Review Thresholds

Force review emphasis when:

- OCR confidence is low.
- Layout confidence is low.
- Unit is unknown.
- Marker mapping is ambiguous.
- Value is outside plausible bounds.
- Abnormal flag conflicts with range.
- Verifier disagrees.
- Report date is missing.
- Source evidence is missing.

## Release Gates

Before enabling a report type as supported:

- Golden set exists.
- Field-level accuracy is measured.
- Known failure modes are documented.
- Review UI exposes uncertainty.
- False positives are below acceptable threshold.
- Critical abnormal values are never silently dropped in evaluation.

## 99% Accuracy Interpretation

The 99% target should be used carefully:

- It applies to fields, not necessarily whole reports.
- It applies to supported formats and quality levels.
- It requires human confirmation for official data.
- It must be backed by measured evaluation.
- It must be recalculated when OCR/model/rules change.

## Regression Testing

Every change to OCR processor config, normalization rules, prompts, schemas, validators, or verifier must be evaluated against golden PDFs.

Record:

- Old accuracy.
- New accuracy.
- Changed failures.
- New false positives.
- New missing observations.

## Acceptance Criteria

- Accuracy is defined at field and observation level.
- Golden PDF testing is required before clinical claims.
- 99% is documented as a measured target, not a vendor guarantee.
- Manual review is part of the reliability system.

