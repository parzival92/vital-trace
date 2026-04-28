# Layout Normalization

## Purpose

Layout normalization converts raw OCR output into a local, consistent representation that is easier and safer for the LLM and validators to consume.

This step reduces dependence on provider-specific OCR response structures.

## Inputs

- Raw OCR response.
- Normalized OCR tokens.
- OCR tables and blocks.
- Report metadata.

## Outputs

- Normalized page text.
- Normalized table candidates.
- Row candidates.
- Column candidates.
- Lab panel candidates.
- Report metadata candidates.
- Source references.
- Layout quality warnings.

## Pipeline Step Specification

### Purpose

Transform OCR data into stable, source-linked candidate structures for extraction.

### Inputs

- OCR tokens.
- OCR table cells.
- OCR page blocks.
- Page dimensions.
- OCR confidence values.

### Outputs

- Candidate report metadata.
- Candidate lab tables.
- Candidate observation rows.
- Candidate non-tabular observation lines.
- Source references for every candidate.
- Layout warnings.

### Failure Modes

- OCR tables are missing.
- Table columns are misaligned.
- Header rows are split.
- Units are separated from marker names.
- Reference ranges wrap to another line.
- Multiple reports exist in one PDF.
- Patient metadata conflicts across pages.
- Footer text is mistaken for lab values.

### Confidence Signals

Derived layout confidence should consider:

- OCR token confidence.
- Table detection quality.
- Column consistency.
- Row alignment.
- Presence of expected lab table headers.
- Whether value/unit/range fields can be separated.
- Whether source tokens are contiguous.

### Human Review Requirements

Layout normalization does not require direct user review, but its warnings must appear in review when they affect draft observations.

### Data Stored Permanently

- Source references used by draft and official observations.
- Layout warnings attached to observations.
- Normalization version.

### Data Stored Temporarily

- Full normalized table structures can be retained as processing artifacts.

### Audit Events Emitted

- `layout.started`
- `layout.completed`
- `layout.warning`
- `layout.failed`

### Acceptance Criteria

- Every candidate observation has source page and bounding box references.
- Tables and free-text rows are represented consistently.
- Layout warnings are available to validators and review UI.
- The LLM receives normalized input, not raw provider output only.

## Normalized Table Candidate

Each table candidate should track:

- Page number.
- Table index.
- Header rows.
- Body rows.
- Column labels.
- Cell text.
- Cell coordinates.
- Cell confidence.
- Linked token IDs.
- Reading order.

## Candidate Observation Row

A candidate row should try to identify:

- Marker label.
- Result value.
- Unit.
- Reference range.
- Abnormal flag.
- Method if present.
- Panel/category if present.
- Source table/cell references.

The row does not need to be fully correct yet. It only needs to preserve evidence and likely structure.

## Metadata Candidates

The normalizer should extract candidates for:

- Lab name.
- Report date.
- Sample collection date.
- Patient name.
- Patient age.
- Patient sex.
- Accession/report number.
- Ordering doctor if present.

Conflicts should be preserved, not resolved silently.

## Panel Detection

Panel candidates may include:

- Complete Blood Count
- Liver Function Test
- Kidney/Renal Function Test
- Lipid Profile
- Thyroid Profile
- Diabetes/Glucose/HbA1c
- Vitamins
- Minerals
- Hormones
- Urine Routine
- Inflammation markers
- Miscellaneous lab chemistry

Panel detection helps extraction but must not override row-level evidence.

## Unit Handling At This Stage

Normalization may separate unit text from value text but should not make final conversions. Unit conversion belongs to deterministic validation.

Examples of preserved unit text:

- `mg/dL`
- `g/dL`
- `10^3/uL`
- `IU/L`
- `mIU/L`
- `ng/mL`
- `%`
- `mm/hr`

## Report Splitting

If one PDF appears to contain multiple distinct lab reports:

- Preserve as one uploaded report record.
- Create multiple internal document sections.
- Require review to confirm dates and panel grouping.
- Do not silently split into multiple official reports unless a future product decision adds this.

