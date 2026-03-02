"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REVIEW_METRICS, SAMPLE_INCIDENTS, REVIEWERS } from "../../data/mock";
import type { } from "react";
import { Card, Button, TabBar } from "../../components/UI";
import YamlDiff from "../../components/YamlDiff";

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

export default function Step3() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [merged, setMerged] = useState(false);
  const [showGoLive, setShowGoLive] = useState(false);
  const [goLiveChoice, setGoLiveChoice] = useState("immediate");

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

      {/* PR Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 text-xs font-medium rounded border border-blue-700">
              PR #1247
            </span>
            <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs font-medium rounded border border-green-700">
              All checks passed
            </span>
            <span className="px-2 py-0.5 bg-teal-900/50 text-teal-400 text-xs font-medium rounded border border-teal-700">
              Training complete
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">
            Update SLI: CosmosDB-SuccessRate vNow → vNext
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Opened by <span className="text-slate-300">you</span> · Dec 15,
            2024 · Training completed Dec 17, 2024
          </p>
        </div>
      </div>

      <TabBar
        tabs={["Overview", "Diff"]}
        active={activeTab}
        onSelect={setActiveTab}
      />

      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Brain AI Recommendation */}
            <div className="flex items-start gap-3 p-4 bg-teal-900/20 border border-teal-700/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                B
              </div>
              <div>
                <p className="text-sm font-medium text-teal-300">
                  Brain AI Recommendation
                </p>
                <p className="text-sm text-slate-300 mt-1">
                  This update improves coverage by{" "}
                  <strong className="text-green-400">12%</strong> with minimal
                  noise impact. The PartitionKey dimension enables
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

            {/* Differential Summary */}
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

            {/* Shadow Evaluation Summary (high-level numbers only) */}
            <Card title="Shadow Evaluation Summary (14 days)">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Alerts", value: "158", color: "text-slate-200" },
                  { label: "True Positives", value: "152", color: "text-green-400" },
                  { label: "False Positives", value: "6", color: "text-yellow-400" },
                  { label: "Missed (vNow only)", value: "0", color: "text-green-400" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-slate-900 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className={`text-lg font-bold mt-1 ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>


          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Reviewers */}
            <Card title="Reviewers">
              <div className="space-y-3">
                {REVIEWERS.map((rev) => (
                  <div key={rev.name} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        rev.status === "approved"
                          ? "bg-green-900/50 text-green-400 border border-green-700"
                          : "bg-slate-700 text-slate-400 border border-slate-600"
                      }`}
                    >
                      {rev.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{rev.name}</p>
                      <p className="text-xs text-slate-500">{rev.role}</p>
                    </div>
                    <span
                      className={`text-xs ${
                        rev.status === "approved"
                          ? "text-green-400"
                          : "text-slate-500"
                      }`}
                    >
                      {rev.status === "approved" ? "✅ Approved" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Checks */}
            <Card title="Checks">
              <div className="space-y-2">
                {[
                  "Capacity (streaming)",
                  "Capacity (Brain)",
                  "Quality validation",
                  "Security checks",
                  "Training complete",
                  "Shadow evaluation",
                ].map((check) => (
                  <div
                    key={check}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-green-400">✅</span>
                    <span className="text-slate-300">{check}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card title="Actions">
              <div className="space-y-2">
                <Button
                  variant="success"
                  onClick={() => setShowGoLive(true)}
                  className="w-full"
                >
                  ✅ Approve &amp; Merge
                </Button>
                <Button variant="danger" className="w-full">
                  ❌ Reject
                </Button>
                <Button variant="ghost" className="w-full">
                  💬 Request Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "Diff" && (
        <div className="space-y-6">
          <Card title="SLI YAML Changes">
            <YamlDiff mode="side-by-side" />
            <p className="text-xs text-slate-500 mt-3">
              Change: Added{" "}
              <code className="text-teal-400">PartitionKey</code> dimension
              (type: partition) to enable granular partition-level monitoring.
            </p>
          </Card>

          <Card title="Incident Impact">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="py-2 pr-4 text-left text-xs text-slate-500 font-medium">Change</th>
                    <th className="py-2 px-4 text-left text-xs text-slate-500 font-medium">Incident</th>
                    <th className="py-2 px-4 text-left text-xs text-slate-500 font-medium">Description</th>
                    <th className="py-2 pl-4 text-left text-xs text-slate-500 font-medium">Reason</th>
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
                      <td className="py-2.5 px-4 text-xs text-slate-400 font-mono">{inc.id}</td>
                      <td className="py-2.5 px-4 text-sm text-slate-200">{inc.title}</td>
                      <td className="py-2.5 pl-4 text-xs text-slate-500">{inc.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <Button variant="ghost" onClick={() => router.push("/step-2")}>
          ← Back to PR
        </Button>
      </div>
    </div>
  );
}
