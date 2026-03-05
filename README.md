# Brain SLI Lifecycle — PR Workflow Prototype

Interactive walkthrough demonstrating a PR-style change management workflow for SLI updates in Brain (Microsoft's AI-powered health and monitoring system for Azure).

## The Problem

Today, updating an SLI is risky — it can cause detection blackouts, pipeline overloads, and there's no version control. This prototype shows how a PR-style workflow would make SLI changes safe and reviewable.

## The 3-Stage Flow

1. **Development** — SLI editor with backtesting sandbox, async validation
2. **Review** — PR-style review with streaming checks, auto-promotion criteria
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

## Spec Requirements Coverage

Coverage of requirements from the "SLI Lifecycle and Brain Monitors" spec document.

### User Requirements

| # | Requirement | Pri | Status | Prototype Coverage |
|---|---|---|---|---|
| 1 | **Validate SLI changes E2E** before creating actual outages, without detection downtime | P0 | ✅ Strong | Step 1: YAML editor with highlighted diffs, 6 automated quality checks (schema, signal quality, cardinality, coverage, precision, no regression), full backtest with vCurrent vs vNext comparison (detection rates, TTD, noise, per-outage TP/FP/FN table, signal chart). Step 3: Performance comparison table + incident impact comparison from shadow period. |
| 2 | **One-step revert** of SLI + Brain monitor | P0 | ❌ Gap | Not implemented. Version concepts exist (vCurrent/vNext displayed throughout) but no revert/rollback action or version history UI. |
| 3 | **Proactive scale/capacity/deletion warnings** | P0 | ⚠️ Partial | Step 1: Cardinality warning in Quality tab. Step 2: Review checks include "Scalability assessment" and "Capacity pre-check". Deletion warnings not shown. |
| 4 | **PR-style workflow** for safe changes | P0 | ✅ Strong | Full PR lifecycle: Submit SLI dialog (quality check selection, auto-complete, target date) → ADO PR UI with checks/approval/auto-complete/Files+Overview tabs → Final approval with go-live dialog. Includes reviewers sidebar (required/optional), policy items, merge flow. |
| 5 | **Predictable training/preview timelines** | P1 | ✅ Strong | Step 1: Target completion date picker (Fastest ~3d / Standard ~7d / Conservative ~14d / Custom). Step 1: Backtest progress bar with 6 sequential steps. Step 2: Training progress (38%, streaming verified, shadow queued). |
| 6 | **Continuity across versions** | P1 | ⚠️ Partial | Step 2: Live Status shows vNow "Healthy — Production" alongside vNext "Training". Step 3: vNow healthy while vNext "Ready". Old monitor clearly stays active. No explicit "zero-downtime" guarantee messaging. |
| 7 | **Safely modify Intelligent Monitors** | P1 | ✅ Strong | Step 1: Brain monitor warning banner ("This SLI is used by outage-mode monitor"). Steps 2 & 3: Brain Monitor Config in Files tab (auto-generated, read-only). Step 2: Brain training progress. Step 3: Brain AI Recommendation with coverage/noise/TTD impact analysis. "What happens next" explains Brain retraining flow. |

### Proposed Workflow Steps (Scenario 1: Update SLI)

| Spec Step | Description | Status | Prototype Mapping |
|---|---|---|---|
| Step 1 | Update & preview SLI before saving | ✅ | **Step 1 (Development)**: YAML editor with line numbers, quality checks panel, backtest preview with signal chart, outage comparison, summary metrics |
| Step 2 | Save & set PR approval policy | ✅ | **Step 1 → 2 transition**: Submit SLI dialog lets user configure quality checks, auto-complete, target date. Creates PR in Step 2 with review checks. |
| Step 3 | SLI & Brain setup period + completion notification | ⚠️ | **Step 2 (Review)**: Training progress (38%), shadow evaluation, 12 review checks (5 infra + 2 training + 5 quality). Simulate Training Complete button. Completion notification not explicitly shown. |
| Step 4 | Post-activation monitoring + auto-safety | ⚠️ | **Step 3 (Production)**: Performance comparison + incident impact table show post-training results. Go-live approval shown. No post-activation regression detection or changelog. |

### Phased Roadmap Coverage

| Phase | Scope | Status | Notes |
|---|---|---|---|
| Phase 1 | Safety + versioned change objects | ⚠️ | Quality gates and safety checks shown throughout. Versioned changes (vCurrent vs vNext) displayed. No explicit version management UI (version list, history). |
| Phase 2 | PR-based approval + scheduling, Brain training surfaces results | ✅ | PR-based approval workflow fully demonstrated (Steps 2 & 3). Scheduling via target dates + go-live scheduling. Brain training shows results (performance comparison, AI recommendation). |
| Phase 3 | Multiple PR approval policies, easy reversion, preview results | ⚠️ | Single approval policy shown (could show multiple tiers per spec). Reversion not implemented. Preview results well-covered (backtest, performance comparison). |

### Key Gaps for Future Iterations

1. **Revert / Rollback** — No UI for reverting an SLI + Brain monitor to a previous version (Req 2, Phase 3)
2. **Version History** — No version list or change history view (Phase 1)
3. **Deletion Warnings** — Scale/capacity warnings shown but deletion impact not covered (Req 3)
4. **Post-Activation Monitoring** — No regression detection dashboard or changelog after go-live (Spec Step 4)
5. **Completion Notifications** — Training completion notification flow not shown (Spec Step 3)
6. **Multiple Approval Policies** — Only single approval tier demonstrated; spec describes 3 tiers: review required / auto-approve with policy / auto-approve (Phase 3)

## Build

```bash
npm run build
```
