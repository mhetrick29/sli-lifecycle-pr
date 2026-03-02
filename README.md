# Brain SLI Lifecycle — PR Workflow Prototype

Interactive walkthrough demonstrating a PR-style change management workflow for SLI updates in Brain (Microsoft's AI-powered health and monitoring system for Azure).

## The Problem

Today, updating an SLI is risky — it can cause detection blackouts, pipeline overloads, and there's no version control. This prototype shows how a PR-style workflow would make SLI changes safe and reviewable.

## The 4-Step Flow

1. **Edit SLI** — YAML editor with quality checks and signal preview
2. **PR Generated** — Diff view, automated checks, approval policy selection
3. **Training & Monitoring** — Timeline of Brain model retraining progress
4. **Review & Merge** — ADO-style PR review with differential metrics, AI recommendation, and go-live scheduling

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

## Build

```bash
npm run build
```
