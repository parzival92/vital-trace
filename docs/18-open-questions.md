# Open Questions

## Purpose

This document tracks decisions that should be resolved before or during implementation. They are not blockers for the docs-only repo, but they matter before production.

## Product Questions

- What exact report formats are officially supported in the first release?
- Should unsupported reports be allowed into manual entry flow?
- Should the review UI expose source PDF pages after the 30-day PDF retention period?
- Should users be able to manually add lab values without PDF upload?
- Should profile medical context be optional or required for adult profiles?

## Clinical Safety Questions

- What wording is used to describe clinical-grade behavior without implying certification?
- Which critical values should trigger urgent review warnings?
- Should there be clinician review before future AI summaries?
- How should pregnancy-specific ranges be handled?
- How should pediatric ranges be handled?

## Accuracy Questions

- How many golden PDFs are needed before first release?
- Which labs should be represented in the golden set?
- What is the minimum acceptable observation-level accuracy?
- What false positive rate is acceptable before public beta?
- How should user corrections feed evaluation datasets?

## OCR Questions

- Which Google Document AI processor type and region will be used first?
- Should raw OCR responses be retained, compressed, or discarded?
- How should low-quality scans be surfaced to users?
- Should there be a fallback OCR provider for outage handling?

## LLM Questions

- What exact `gpt-5.5` model variant and API configuration will be used?
- What is the maximum report size sent to the model?
- How should prompts be redacted for debugging?
- Should extraction and verifier use the same model or different configurations?

## Data And Retention Questions

- Should draft observations expire if never reviewed?
- Should source snippets be retained after PDF deletion?
- How should account deletion handle audit logs?
- What is the policy for user-exported health data?

## Infrastructure Questions

- Will the first deploy be single VPS with Docker Compose?
- Which object storage will hold temporary PDFs?
- How will secrets be managed?
- How will background jobs be retried and monitored?

## Legal And Compliance Questions

- Is this positioned as wellness/personal health tracking or medical device software?
- What consent language is required for OCR/AI processing?
- What privacy policy is required before real users upload reports?
- Which jurisdiction applies first?

## Future Product Questions

- When does the health score begin?
- Which biomarkers matter most for the first scoring version?
- Should users be able to set goals?
- Should family members get separate logins later?
- Should labs be integrated directly later?

