"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REVIEW_METRICS, SAMPLE_INCIDENTS, REVIEWERS } from "../../data/mock";
import { Card, Button } from "../../components/UI";
import YamlDiff from "../../components/YamlDiff";

/* ADO-style check items */
const PR_CHECKS = [
  { name: "Capacity check (streaming)", status: "passed" },
  { name: "Capacity check (Brain GPU)", status: "passed" },
  { name: "Quality validation", status: "passed" },
  { name: "Security checks", status: "passed" },
  { name: "Training complete", status: "passed" },
  { name: "Shadow evaluation", status: "passed" },
];

function MetricRow({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) {
  const bNum = parseFloat(before);
  const aNum = parseFloat(after);
  const improved =
    label === "Noise Rate" || label === "Time to Detect"
      ? aNum < bNum
      : aNum > bNum;
  return (
    <tr className="border-b border-slate-700">
      <td className="py-2 pr-4 text-sm text-slate-300 font-medium">{label}</td>
      <td className="py-2 px-4 text-sm text-slate-400 text-center">
        {before}
      </td>
      <td
        className={`py-2 px-4 text-sm text-center font-medium ${
          improved ? "text-green-400" : "text-red-400"
        }`}
      >
        {after}
      </td>
      <td className="py-2 pl-4 text-center">
        <span
          className={`text-xs ${improved ? "text-green-400" : "text-red-400"}`}
        >
          {improved ? "▲" : "▼"} improved
        </span>
      </td>
    </tr>
  );
}

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

export default function Step3() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [merged, setMerged] = useState(false);
  const [showGoLive, setShowGoLive] = useState(false);
  const [goLiveChoice, setGoLiveChoice] = useState("immediate");
  const [approvalPolicy, setApprovalPolicy] = useState("review");
  const [schedule, setSchedule] = useState("immediate");

  const m = REVIEW_METRICS;

  if (merged) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-green-900/50 flex items-center justify-center border-2 border-green-500">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-green-400">PR #1247 Merged</h1>
        <p className="text-slate-400 text-center max-w-md">
          SLI update{" "}
          <strong className="text-slate-200">
            CosmosDB-SuccessRate vNext
          </strong>{" "}
          is now live. The monitor has been switched to the new version.
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
              {goLiveChoice === "immediate" ? "Immediate" : "Scheduled"}
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
      {/* Go-live dialog */}
      {showGoLive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-slate-100">
              Set Go-Live Date
            </h2>
            <div className="space-y-3">
              {[
                { value: "immediate", label: "Go live immediately" },
                { value: "scheduled", label: "Schedule for later" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                    goLiveChoice === opt.value
                      ? "bg-teal-900/30 border-teal-600"
                      : "bg-slate-900 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="goLive"
                    value={opt.value}
                    checked={goLiveChoice === opt.value}
                    onChange={(e) => setGoLiveChoice(e.target.value)}
                    className="accent-teal-500"
                  />
                  <span className="text-sm text-slate-200">{opt.label}</span>
                </label>
              ))}
              {goLiveChoice === "scheduled" && (
                <input
                  type="date"
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200"
                />
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowGoLive(false)}>
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setShowGoLive(false);
                  setMerged(true);
                }}
              >
                Confirm &amp; Merge
              </Button>
            </div>
          </div>
        </div>
      )}

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

      {/* PR Title + Approve area */}
      <div className="border border-slate-600 border-t-0 rounded-b-lg bg-slate-800 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                Update SLI: CosmosDB-SuccessRate vNow → vNext
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 bg-green-700 text-white text-xs font-medium rounded">
                  Active
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
                <span className="text-slate-500 text-sm">
                  All comments resolved
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowGoLive(true)}
                className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded cursor-pointer transition-colors flex items-center gap-1"
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
                  <span className="text-green-400">✓</span>
                  <span className="text-sm text-slate-200 font-medium">
                    6 of 6 checks passed
                  </span>
                </div>
                {PR_CHECKS.map((check) => (
                  <div
                    key={check.name}
                    className="px-4 py-2 flex items-center gap-2 border-t border-slate-700"
                  >
                    <span className="text-green-400 text-sm">✓</span>
                    <span className="text-sm text-slate-300">
                      {check.name}
                    </span>
                    <span className="text-xs text-green-600 ml-auto">
                      Passed
                    </span>
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
                    <strong className="text-slate-200">
                      James Chen
                    </strong>{" "}
                    must approve
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-900/50 border border-green-600 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span className="text-sm text-slate-300">
                    Proof of presence policy satisfied by
                    spatel@microsoft.com
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

                {/* Brain AI Recommendation inside description */}
                <div className="flex items-start gap-3 p-4 bg-teal-900/20 border border-teal-700/50 rounded-lg mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    B
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-300">
                      Brain AI Recommendation
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      This update improves coverage by{" "}
                      <strong className="text-green-400">12%</strong> with
                      minimal noise impact. The PartitionKey dimension enables
                      partition-level anomaly detection, catching{" "}
                      <strong className="text-green-400">
                        3 additional incident types
                      </strong>{" "}
                      while removing{" "}
                      <strong className="text-slate-400">
                        1 noise incident
                      </strong>
                      . Time-to-detect improves by{" "}
                      <strong className="text-green-400">26%</strong>.{" "}
                      <strong className="text-teal-400">
                        Recommended to approve.
                      </strong>
                    </p>
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
                        { value: "review", label: "Review required", desc: "Must approve after training" },
                        { value: "auto-policy", label: "Auto with policy", desc: "Auto-merge if thresholds met" },
                        { value: "auto", label: "Auto-approve", desc: "Merge when training completes" },
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
                            name="s3policy"
                            value={opt.value}
                            checked={approvalPolicy === opt.value}
                            onChange={(e) => setApprovalPolicy(e.target.value)}
                            className="mt-0.5 accent-teal-500"
                          />
                          <div>
                            <p className="text-xs text-slate-200 font-medium">{opt.label}</p>
                            <p className="text-[11px] text-slate-500">{opt.desc}</p>
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
                        { value: "immediate", label: "Go live immediately" },
                        { value: "scheduled", label: "Schedule go-live date" },
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
                            name="s3schedule"
                            value={opt.value}
                            checked={schedule === opt.value}
                            onChange={(e) => setSchedule(e.target.value)}
                            className="accent-teal-500"
                          />
                          <span className="text-xs text-slate-200">{opt.label}</span>
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
                          <span className="text-xs font-medium text-slate-200">Current (vNow)</span>
                        </div>
                        <span className="text-[11px] text-green-400">● Healthy — Production</span>
                      </div>
                      <div className="p-2 bg-slate-800 rounded border border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs font-medium text-slate-200">Proposed (vNext)</span>
                        </div>
                        <span className="text-[11px] text-green-400">● Ready — Shadow complete</span>
                      </div>
                      <div className="text-[11px] text-slate-500 border-t border-slate-700 pt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Monitor</span>
                          <span className="text-slate-300">Cosmos DB Intelligent Monitor</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mode</span>
                          <span className="text-red-400 font-medium">Outage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Comparison */}
                <Card title="Performance Comparison — vNow vs vNext">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="py-2 pr-4 text-left text-xs text-slate-500 font-medium">
                            Metric
                          </th>
                          <th className="py-2 px-4 text-center text-xs text-slate-500 font-medium">
                            Current (vNow)
                          </th>
                          <th className="py-2 px-4 text-center text-xs text-slate-500 font-medium">
                            Proposed (vNext)
                          </th>
                          <th className="py-2 pl-4 text-center text-xs text-slate-500 font-medium">
                            Change
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <MetricRow
                          label="Incidents Detected"
                          before={String(m.before.incidentsDetected)}
                          after={String(m.after.incidentsDetected)}
                        />
                        <MetricRow
                          label="Noise Rate"
                          before={m.before.noiseRate}
                          after={m.after.noiseRate}
                        />
                        <MetricRow
                          label="Precision"
                          before={m.before.precision}
                          after={m.after.precision}
                        />
                        <MetricRow
                          label="Coverage"
                          before={m.before.coverage}
                          after={m.after.coverage}
                        />
                        <MetricRow
                          label="Time to Detect"
                          before={m.before.timeToDetect}
                          after={m.after.timeToDetect}
                        />
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Incident Impact */}
                <Card title="Incident Impact">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="py-2 pr-4 text-left text-xs text-slate-500 font-medium">
                            Change
                          </th>
                          <th className="py-2 px-4 text-left text-xs text-slate-500 font-medium">
                            Incident
                          </th>
                          <th className="py-2 px-4 text-left text-xs text-slate-500 font-medium">
                            Description
                          </th>
                          <th className="py-2 pl-4 text-left text-xs text-slate-500 font-medium">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {SAMPLE_INCIDENTS.map((inc) => (
                          <tr key={inc.id} className="border-b border-slate-700">
                            <td className="py-2.5 pr-4">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  inc.status === "added"
                                    ? "bg-green-900/50 text-green-400 border border-green-700"
                                    : "bg-red-900/50 text-red-400 border border-red-700"
                                }`}
                              >
                                {inc.status === "added" ? "+ Added" : "− Removed"}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-xs text-slate-400 font-mono">
                              {inc.id}
                            </td>
                            <td className="py-2.5 px-4 text-sm text-slate-200">
                              {inc.title}
                            </td>
                            <td className="py-2.5 pl-4 text-xs text-slate-500">
                              {inc.detail}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
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
                  <p className="text-sm text-slate-300 font-medium">brain-monitor-config.yaml</p>
                  <p className="text-xs text-slate-500 mt-0.5">Auto-generated from SLI changes · no manual edits needed</p>
                </div>
                <span className="text-xs text-slate-600 ml-auto">Read-only</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <Button variant="ghost" onClick={() => router.push("/step-2")}>
          ← Back to Training
        </Button>
      </div>
    </div>
  );
}
