# Xgrow

**Your Personal X Growth System.** Learn. Grow. Repeat.

> Your X account already knows what works. Xgrow helps you learn it.

Xgrow is a personal X (Twitter) growth system — not a generic tweet generator
and not an analytics dashboard. It studies an account's history, goals, content
and results, then turns them into a personalized daily growth plan:

**CONNECT → LEARN → PLAN → ACT → MEASURE → DIARY → IMPROVE**

## Demo Mode

This build runs in **Demo Mode** with clearly labeled sample data
(`@alexbuilds`). No live X API credentials are required, and demo data is never
presented as a real connected account. The architecture is ready for real X API
integration later.

## Stack

- Next.js (App Router, Turbopack) + React + TypeScript
- Tailwind CSS v4 + Lucide icons
- Structured local demo data, deterministic analysis (later phases)

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # eslint
npm run typecheck  # next typegen + tsc --noEmit
npm run build      # production build
```

## Structure

```
src/app/               landing (/) and app routes (/app/*)
src/components/ui/     design-system primitives + state components
src/components/landing landing page sections
src/components/app     app shell (sidebar, top bar, mobile nav)
src/lib/demo/          Demo Mode account data
```

## Status

Foundation milestone: landing, app shell, onboarding flow, Demo Mode badge,
and empty/loading/error/success states. Analysis, TODAY plan, post
recommendations, engagement opportunities and the Growth Diary follow in the
next milestones.
