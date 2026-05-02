# VitalTrace Frontend

React + TypeScript frontend for the authenticated VitalTrace product.

This is the first real frontend scaffold. It currently includes a public landing page and a sign-in modal; auth submission is local UI behavior until the FastAPI backend exists.

## Run

From this folder:

```bash
npm install
npm run dev
```

The app uses Vite and serves at the URL printed by the dev server.

## Current Scope

- Login screen for serious self-directed health trackers.
- Healthline-inspired landing page adapted to VitalTrace's serious product thesis.
- Email OTP and password mode UI.
- Client-side validation.
- Trust and privacy boundary copy.
- No production auth API integration yet.
