# Product Vision

## Purpose

Serious self-directed health trackers collect health reports across labs, portals, email attachments, and paper scans. The data is often trapped in PDFs and cannot be compared over time. Existing apps usually force users into a fixed health ecosystem or support only a narrow source format.

This product gives users one controlled place to upload lab reports, structure the results, review the data, and visualize changes across time for themselves first, with family profiles as a secondary expansion.

## Target Users

- A serious self-directed health tracker who wants deeper signal from bloodwork.
- Family members whose reports may later be uploaded by the owner, especially parents or elders who may not manage digital uploads themselves.
- Future users who want score, trend, and interpretation features after the extraction pipeline is reliable.

## V1 User Promise

The first release does not try to be a full medical assistant. It makes one promise:

> Lab report PDFs can be uploaded, extracted, reviewed, corrected, and converted into reliable structured observations for charts.

## Family Profile Model

One account can own multiple profiles.

Each profile represents a person and contains:

- Name
- Relationship to account owner
- Date of birth
- Sex
- Height and weight if known
- Known conditions
- Medications
- Allergies
- Symptoms and relevant notes
- Family history
- Health goals
- Lifestyle notes
- Pregnancy flag where relevant

Reports, draft observations, official observations, review events, and visualization data are scoped to a profile.

## Clinical-Grade Meaning For V1

For this product, clinical-grade means the system is built with clinical seriousness, not that it is already a certified medical device.

V1 clinical-grade requirements:

- Every official data point has source evidence.
- Every official data point has a review trail.
- Every extraction has confidence and validation metadata.
- The system rejects silent uncertainty.
- The system measures field-level accuracy against golden documents.
- The system can explain where each value came from.
- The system does not diagnose or prescribe.

## Accuracy Philosophy

The product target is 99% field-level accuracy for supported report formats. The system reaches this through layered controls:

- High-quality OCR.
- Layout-aware normalization.
- Strict structured LLM extraction.
- Deterministic validation.
- Second-pass verification.
- Human review before official status.
- Continuous evaluation with golden PDFs.

No single model or vendor is assumed to provide 99% accuracy alone.

## In Scope For Core

- Auth boundary and profile ownership.
- Bulk PDF upload.
- Report status lifecycle.
- Google Document AI OCR.
- Local layout and table normalization.
- LLM structured extraction using `gpt-5.5`.
- Deterministic validation.
- Second-pass verification.
- User review.
- Official observations.
- Visualization-ready APIs.

## Out Of Scope For Core

- Health score algorithm.
- Personalized medical advice.
- Diagnosis.
- Prescription or dosage suggestions.
- Clinician workflow.
- Insurance workflow.
- Wearables ingestion.
- Mobile native app.
- Public marketplace integrations.

## Acceptance Criteria

- An engineer can implement the core backend from these docs without inventing major product behavior.
- Product boundaries are clear enough to prevent unsafe auto-interpretation.
- Official observations are strictly separated from draft observations.
- The system has an explicit path to measured accuracy instead of model trust.
