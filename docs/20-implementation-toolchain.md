# Implementation Toolchain

## Purpose

This document defines the recommended toolchain for moving VitalTrace from docs and prototypes into an actual product implementation.

The stack should stay boring, explicit, and backend-heavy. VitalTrace is an authenticated health-data product with OCR, extraction, validation, review, audit, and background processing. The toolchain should optimize for correctness, traceability, and implementation speed over novelty.

## Recommended Stack

### Frontend

- React with TypeScript.
- Vite for the application build.
- TanStack Query for API state and async server data.
- React Router or TanStack Router for authenticated app navigation.
- Tailwind CSS for product styling.
- Radix UI or shadcn-style components for accessible controls.
- Recharts for biomarker trend charts.
- Zod for frontend validation and form-level parsing.

Use React for the authenticated web app. Do not start with Next.js unless server rendering or public marketing pages become a real requirement.

### Backend

- Python 3.12 or newer.
- FastAPI for HTTP APIs.
- Pydantic for request and response schemas.
- SQLAlchemy 2.x for database access.
- Alembic for migrations.
- PostgreSQL as the primary relational database.
- Redis for queues, locks, and short-lived cache where needed.
- RQ or Celery for background jobs.

The backend should own validation, normalization, report state transitions, official observation creation, audit events, retention policy, and integration with OCR/LLM providers.

### Extraction Pipeline

- Google Document AI for OCR and layout extraction.
- OpenAI structured extraction for lab observations.
- Deterministic Python validators for marker identity, values, units, ranges, duplicates, plausibility, and source evidence.
- Second-pass verifier before user review.
- Human review before official observations.

The LLM should never be the source of truth by itself. Official observations remain review-gated.

### Storage

- PostgreSQL for users, profiles, reports, observations, review events, validation issues, audit records, and version metadata.
- S3-compatible object storage for temporary PDFs, rendered page previews, and source artifacts.
- Explicit 30-day PDF retention job for uploaded originals.
- Audit events stored in the database first. A separate log pipeline can come later if volume requires it.

### Auth

Start with a simple account model:

- Email/password or email OTP.
- Server-side sessions or signed HTTP-only cookies.
- One account can own one or more profiles.
- Family-member access and role-based sharing should be deferred.

Authentication should be boring and auditable. Do not mix production auth with prototype-only login flows.

## Monorepo Layout

Recommended first implementation layout:

```text
apps/
  web/        React + TypeScript app
  api/        FastAPI app
workers/
  extraction/ Python background processing
packages/
  schemas/    shared generated schema artifacts later if needed
docs/
prototypes/
infra/
```

Keep prototypes under `prototypes/`. They are not production code and should not share runtime state with the real app.

## Local Development

Use:

- `pnpm` for frontend package management.
- `uv` for Python dependency management.
- Docker Compose for local PostgreSQL, Redis, API, worker, and frontend.
- `.env.example` files for required local variables.
- Local object storage emulator or S3-compatible development bucket for PDF artifacts.

The local developer loop should support:

- Running the web app.
- Running the API.
- Running a background worker.
- Uploading a demo PDF.
- Inspecting report status transitions.
- Reviewing draft observations.
- Creating official observations.

## Quality Gates

Frontend:

- TypeScript typecheck.
- ESLint.
- Prettier.
- Playwright tests for onboarding, upload, review, and visualization flows.

Backend:

- Ruff for linting and formatting.
- Pytest for API, validation, status lifecycle, and pipeline tests.
- Mypy or Pyright once core types stabilize.
- Migration tests for Alembic revisions.

Extraction pipeline:

- Golden PDF regression tests.
- Field-level accuracy measurements.
- False-positive and missing-observation tracking.
- Snapshot comparison for validator and verifier outputs.

Every change to OCR configuration, prompts, schemas, validators, biomarker dictionaries, or verifier logic should be evaluated against the golden PDF set before release.

## Deployment Direction

Initial production shape:

- Dockerized FastAPI API service.
- Separate background worker service.
- React/Vite app served as static assets behind a CDN or simple web host.
- Managed PostgreSQL.
- Managed Redis.
- S3-compatible object storage.
- Scheduled retention worker for original PDFs and temporary artifacts.

Do not overbuild Kubernetes, service meshes, or multi-region infrastructure for the first implementation unless user volume or compliance requirements force it.

## Toolchain Defaults

- Frontend language: TypeScript.
- Backend language: Python.
- API style: REST first.
- Database: PostgreSQL.
- Queue: Redis-backed RQ or Celery.
- Package managers: `pnpm` and `uv`.
- Local orchestration: Docker Compose.
- UI app: React + Vite.
- Backend app: FastAPI.

These defaults are intended to remove ambiguity when implementation starts. They can be changed later only with an explicit ADR.

