# Brain SLI Lifecycle — PR Workflow Prototype

Interactive walkthrough demonstrating a PR-style change management workflow for SLI updates in Brain (Microsoft's AI-powered health and monitoring system for Azure).

## The Problem

Today, updating an SLI is risky — it can cause detection blackouts, pipeline overloads, and there's no version control. This prototype shows how a PR-style workflow would make SLI changes safe and reviewable.

## The 3-Stage Flow

1. **Development** — SLI editor with backtesting sandbox, async validation
2. **Testing** — PR-style review with streaming checks, auto-promotion criteria
3. **Production** — Final review with differential metrics, AI recommendation, go-live

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click "Start Walkthrough".

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- All mock data — no external APIs

## Design: PR-to-SLI Concept Mapping

| PR concept | SLI lifecycle equivalent |
|---|---|
| Submit PR | Submit SLI change (enters Testing) |
| CI checks | Quality gates (training status, coverage, precision, min days in testing) |
| Approve | Someone reviews and approves the SLI |
| Auto-complete | Auto-promote (go live when all checks pass) |
| Complete/Merge | Go live (SLI enters Production) |

## Build

```bash
npm run build
```
