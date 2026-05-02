# Onboarding Flow Prototype

This is a React + Python prototype for the first-time VitalTrace onboarding process.

It demonstrates:

- Mock login.
- Goal selection.
- Minimal self profile.
- Demo report upload state.
- Source-linked marker review.
- Transition into the bloodwork action loop.

The prototype uses anonymized demo data from the local Python server. It does not use personal medical data.

## Run Locally

From this folder:

```bash
python3 server.py
```

Then open:

```text
http://127.0.0.1:8765
```

## Stack

- Python standard library HTTP server.
- React 18 loaded from CDN.
- No npm install or production build step.

## Safety Boundary

This mock is non-diagnostic and non-prescriptive.

It does not:

- Diagnose a condition.
- Recommend medication or treatment.
- Prescribe supplement doses.
- Replace clinician review.
- Promise that a lifestyle change caused marker movement.

The purpose is product-flow validation: how quickly a serious self-directed health tracker can reach a first reviewed bloodwork action loop.
