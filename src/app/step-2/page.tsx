"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REVIEWERS } from "../../data/mock";
import { Card, Button } from "../../components/UI";
import YamlDiff from "../../components/YamlDiff";

/* Check items — training & shadow not yet complete */
const PR_CHECKS = [
  { name: "Capacity check (streaming)", status: "passed" as const },
  { name: "Capacity check (Brain GPU)", status: "passed" as const },
  { name: "Quality validation", status: "passed" as const },
  { name: "Security checks", status: "passed" as const },
  { name: "Training complete", status: "pending" as const },
  { name: "Shadow evaluation", status: "pending" as const },
];

/* Reviewer row component */
function ReviewerRow({
  name,
  avatar,
  status,
}: {
  name: string;
  avatar: string;
  status: "approved" | "pending";
}) {
  const colors =
    status === "approved"
      ? "bg-green-700 text-white"
      : "bg-[#6264a7] text-white";
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <input
        type="radio"
        className="accent-slate-500"
        readOnly
        checked={false}
      />
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colors}`}
      >
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 leading-tight">{name}</p>
        <p className="text-xs text-slate-500 leading-tight">
          {status === "approved" ? "Approved" : "No review yet"}
        </p>
      </div>
      {status === "approved" && (
        <span className="text-green-400 text-sm">✓</span>
      )}
    </div>
  );
}

export default function Step2() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [approvalPolicy, setApprovalPolicy] = useState("review");
  const [schedule, setSchedule] = useState("immediate");
  const [merged, setMerged] = useState(false);

  const handleSimulateComplete = () => {
    if (approvalPolicy === "auto" || approvalPolicy === "auto-policy") {
      setMerged(true);
    } else {
      router.push("/step-3");
    }
  };

  if (merged) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-green-900/50 flex items-center justify-center border-2 border-green-500">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-green-400">
          PR #1247 Auto-Approved &amp; Merged
        </h1>
        <p className="text-slate-400 text-center max-w-md">
          Training completed successfully. SLI update{" "}
          <strong className="text-slate-200">
            CosmosDB-SuccessRate vNext
          </strong>{" "}
          was auto-approved and merged per your approval policy.
        </p>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-2 text-sm w-full max-w-md">
          <div className="flex justify-between">
            <span className="text-slate-400">Monitor</span>
            <span className="text-green-400">
              Cosmos DB Intelligent Monitor vNext ● Active
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Old monitor</span>
            <span className="text-slate-500">vNow — Decommissioned</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Go-live</span>
            <span className="text-slate-200">
              {schedule === "immediate" ? "Immediate" : "Scheduled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Policy</span>
            <span className="text-slate-200">
              {approvalPolicy === "auto"
                ? "Auto-approve"
                : "Auto-approve with policy"}
            </span>
          </div>
        </div>
        <Button variant="ghost" onClick={() => router.push("/")}>
          ← Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ADO top breadcrumb bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0078d4] rounded-t-lg text-white text-sm">
        <span className="font-semibold">Azure DevOps</span>
        <span className="text-blue-200">msazure</span>
        <span className="text-blue-300">›</span>
        <span className="text-blue-200">One</span>
        <span className="text-blue-300">›</span>
        <span className="text-blue-200">Repos</span>
        <span className="text-blue-300">›</span>
        <span className="text-blue-200">Pull requests</span>
        <span className="text-blue-300">›</span>
        <span className="text-white font-medium">
          EngSys-AIOps-BrainGitopsConfigurations
        </span>
      </div>

      {/* PR frame */}
      <div className="border border-slate-600 border-t-0 rounded-b-lg bg-slate-800 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                Update SLI: CosmosDB-SuccessRate vNow → vNext
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 bg-yellow-700 text-white text-xs font-medium rounded">
                  Training in progress
                </span>
                <span className="text-slate-400 text-sm">!14849262</span>
                <span className="text-slate-400 text-sm">
                  🤖 GitHub Copilot proposes to merge{" "}
                  <span className="text-blue-400 cursor-default">
                    copilot/sli-update-123
                  </span>{" "}
                  into{" "}
                  <span className="font-semibold text-slate-200">main</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled
                className="px-4 py-1.5 bg-slate-600 text-slate-400 text-sm font-medium rounded cursor-not-allowed flex items-center gap-1"
              >
                Approve ✓
              </button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded border border-slate-500 cursor-pointer transition-colors flex items-center gap-1">
                ⚙ Set auto-complete
              </button>
            </div>
          </div>

          {/* ADO Tab bar */}
          <div className="flex mt-5 border-b border-slate-600 -mx-5 px-5">
            {[
              "Overview",
              "Files",
              "Updates",
              "Commits",
              "Owners",
              "Test Results Hub",
              "Copilot Sessions",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab === "Files"
                      ? "Files"
                      : tab === "Overview"
                      ? "Overview"
                      : "Overview"
                  )
                }
                className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  (tab === "Overview" && activeTab === "Overview") ||
                  (tab === "Files" && activeTab === "Files")
                    ? "text-blue-400 border-b-2 border-blue-400 -mb-px"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Overview" && (
          <div className="flex">
            {/* Main content */}
            <div className="flex-1 p-5 pt-0 space-y-4">
              {/* Checks block */}
              <div className="border border-slate-600 rounded-lg overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-2 bg-slate-900/50">
                  <span className="text-blue-400 animate-pulse">◌</span>
                  <span className="text-sm text-slate-200 font-medium">
                    4 of 6 checks passed · 2 in progress
                  </span>
                </div>
                {PR_CHECKS.map((check) => (
                  <div
                    key={check.name}
                    className="px-4 py-2 flex items-center gap-2 border-t border-slate-700"
                  >
                    {check.status === "passed" ? (
                      <>
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-sm text-slate-300">
                          {check.name}
                        </span>
                        <span className="text-xs text-green-600 ml-auto">
                          Passed
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-blue-400 text-sm animate-pulse">
                          ◌
                        </span>
                        <span className="text-sm text-slate-300">
                          {check.name}
                        </span>
                        <span className="text-xs text-blue-400 ml-auto">
                          In progress
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Policy items */}
              <div className="space-y-3 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-900/50 border border-yellow-600 flex items-center justify-center">
                    <span className="text-yellow-400 text-xs">⏳</span>
                  </div>
                  <span className="text-sm text-slate-300">
                    <strong className="text-slate-200">James Chen</strong>{" "}
                    must approve
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-900/50 border border-green-600 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span className="text-sm text-slate-300">
                    Proof of presence policy satisfied by spatel@microsoft.com
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-900/50 border border-green-600 flex items-center justify-center shrink-0">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-300">
                      No merge conflicts
                    </span>
                    <p className="text-xs text-slate-500">
                      Last checked Friday
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-slate-200">
                    Description
                  </h2>
                  <span className="text-slate-500 cursor-default">✏</span>
                </div>

                <h3 className="text-sm font-bold text-slate-200 mb-2">
                  Summary
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  This PR updates the SLI definition for CosmosDB-SuccessRate to
                  add{" "}
                  <code className="text-teal-400 bg-slate-900 px-1 rounded">
                    PartitionKey
                  </code>{" "}
                  as a new monitoring dimension, enabling partition-level anomaly
                  detection. The associated Brain monitor will be automatically
                  retrained on the updated signal definition.
                </p>

                {/* Training in progress indicator */}
                <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    B
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-300">
                      Brain Model Retraining
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      The Brain model is being retrained on the updated signal
                      definition. Results and AI recommendation will be
                      available once training and shadow evaluation complete.
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Training progress</span>
                        <span>~38%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse"
                          style={{ width: "38%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal cards: Approval Policy, Go-Live, Detection Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Approval Policy */}
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      Approval Policy
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          value: "review",
                          label: "Review required",
                          desc: "Must approve after training",
                        },
                        {
                          value: "auto-policy",
                          label: "Auto with policy",
                          desc: "Auto-merge if thresholds met",
                        },
                        {
                          value: "auto",
                          label: "Auto-approve",
                          desc: "Merge when training completes",
                        },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-start gap-2 p-2 rounded cursor-pointer border transition-colors ${
                            approvalPolicy === opt.value
                              ? "bg-teal-900/30 border-teal-700"
                              : "border-transparent hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="policy"
                            value={opt.value}
                            checked={approvalPolicy === opt.value}
                            onChange={(e) => setApprovalPolicy(e.target.value)}
                            className="mt-0.5 accent-teal-500"
                          />
                          <div>
                            <p className="text-xs text-slate-200 font-medium">
                              {opt.label}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {opt.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Go-Live Scheduling */}
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      Go-Live Scheduling
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          value: "immediate",
                          label: "Go live immediately",
                        },
                        {
                          value: "scheduled",
                          label: "Schedule go-live date",
                        },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                            schedule === opt.value
                              ? "bg-teal-900/30 border-teal-700"
                              : "border-transparent hover:bg-slate-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name="schedule"
                            value={opt.value}
                            checked={schedule === opt.value}
                            onChange={(e) => setSchedule(e.target.value)}
                            className="accent-teal-500"
                          />
                          <span className="text-xs text-slate-200">
                            {opt.label}
                          </span>
                        </label>
                      ))}
                      {schedule === "scheduled" && (
                        <input
                          type="date"
                          className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200"
                        />
                      )}
                    </div>
                  </div>

                  {/* Detection Summary */}
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      Detection Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="p-2 bg-slate-800 rounded border border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs font-medium text-slate-200">
                            Current (vNow)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Running in production
                        </p>
                        <span className="text-[11px] text-green-400">
                          ● Healthy
                        </span>
                      </div>
                      <div className="p-2 bg-slate-800 rounded border border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-xs font-medium text-slate-200">
                            Proposed (vNext)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Training in shadow mode
                        </p>
                        <span className="text-[11px] text-blue-400">
                          ◌ Training
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 border-t border-slate-700 pt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Monitor</span>
                          <span className="text-slate-300">
                            Cosmos DB Intelligent Monitor
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mode</span>
                          <span className="text-red-400 font-medium">
                            Outage
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. training</span>
                          <span className="text-slate-300">24–48 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulate training complete button */}
                <button
                  onClick={handleSimulateComplete}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  ⏩ Simulate Training Complete
                </button>
              </div>
            </div>

            {/* Reviewers sidebar */}
            <div className="w-72 shrink-0 border-l border-slate-600 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-200">
                  Reviewers
                </h3>
                <button className="text-xs text-blue-400 cursor-default">
                  Add
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium mb-2">
                Required
              </p>
              {REVIEWERS.required.map((rev) => (
                <ReviewerRow key={rev.name} {...rev} />
              ))}

              <p className="text-xs text-slate-500 font-medium mt-4 mb-2">
                Optional
              </p>
              {REVIEWERS.optional.map((rev) => (
                <ReviewerRow key={rev.name} {...rev} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Files" && (
          <div className="p-5 pt-2 space-y-6">
            <Card title="SLI YAML Changes">
              <YamlDiff mode="side-by-side" />
              <p className="text-xs text-slate-500 mt-3">
                Change: Added{" "}
                <code className="text-teal-400">PartitionKey</code> dimension
                (type: partition) to enable granular partition-level monitoring.
              </p>
            </Card>

            <Card title="Brain Monitor Config">
              <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded border border-slate-700">
                <span className="text-slate-400 text-lg">📄</span>
                <div>
                  <p className="text-sm text-slate-300 font-medium">
                    brain-monitor-config.yaml
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Auto-generated from SLI changes · no manual edits needed
                  </p>
                </div>
                <span className="text-xs text-slate-600 ml-auto">
                  Read-only
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <Button variant="ghost" onClick={() => router.push("/step-1")}>
          ← Back to Editor
        </Button>
      </div>
    </div>
  );
}
