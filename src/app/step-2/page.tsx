"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTOMATED_CHECKS, TIMELINE_EVENTS } from "../../data/mock";
import { Card, Button, StatusPill } from "../../components/UI";
import YamlDiff from "../../components/YamlDiff";

export default function Step2() {
  const router = useRouter();
  const [approvalPolicy, setApprovalPolicy] = useState("review");
  const [schedule, setSchedule] = useState("immediate");
  const [trainingComplete, setTrainingComplete] = useState(false);

  /* Build the full timeline: PR created → checks → training */
  const prCreatedEvent = {
    time: "2024-12-15T10:29:00Z",
    title: "PR created",
    description: "Update SLI: CosmosDB-SuccessRate vNow → vNext",
    status: "completed" as const,
  };

  const checkEvents = AUTOMATED_CHECKS.map((c, i) => ({
    time: `2024-12-15T10:${30 + i}:00Z`,
    title: c.name,
    description: c.detail,
    status: trainingComplete
      ? ("completed" as const)
      : c.status === "pass"
      ? ("completed" as const)
      : c.status === "running"
      ? ("in_progress" as const)
      : ("pending" as const),
  }));

  const trainingEvents = trainingComplete
    ? [
        ...TIMELINE_EVENTS.map((e) => ({ ...e, status: "completed" as const })),
        {
          time: "2024-12-17T08:00:00Z",
          title: "Retraining completed",
          description:
            "All training completed successfully. Ready for review.",
          status: "completed" as const,
        },
        {
          time: "2024-12-17T08:01:00Z",
          title: "Shadow evaluation complete",
          description:
            "14-day shadow run shows improved detection with reduced noise. Ready for review.",
          status: "completed" as const,
        },
      ]
    : TIMELINE_EVENTS;

  const events = [prCreatedEvent, ...checkEvents, ...trainingEvents];

  return (
    <div className="space-y-6">
      {/* PR Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 text-xs font-medium rounded border border-blue-700">
              PR #1247
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded border ${
                trainingComplete
                  ? "bg-green-900/50 text-green-400 border-green-700"
                  : "bg-yellow-900/50 text-yellow-400 border-yellow-700"
              }`}
            >
              {trainingComplete ? "Ready for review" : "Checks in progress"}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">
            Update SLI: CosmosDB-SuccessRate vNow → vNext
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Add PartitionKey dimension for granular partition-level monitoring
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Diff */}
          <Card title="SLI Changes (YAML Diff)">
            <YamlDiff mode="side-by-side" />
          </Card>

          {/* Activity Timeline with checks */}
          <Card title="Activity Timeline">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />
              <div className="space-y-6">
                {events.map((event, i) => (
                  <div key={i} className="relative pl-10">
                    <div
                      className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                        event.status === "completed"
                          ? "bg-green-500 border-green-400"
                          : event.status === "in_progress"
                          ? "bg-blue-500 border-blue-400 animate-pulse"
                          : "bg-slate-600 border-slate-500"
                      }`}
                    />
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-slate-200">
                          {event.title}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {new Date(event.time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 whitespace-pre-line">
                        {event.description}
                      </p>
                      {event.status === "in_progress" && !trainingComplete && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>~38%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all"
                              style={{ width: "38%" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Approval Policy */}
          <Card title="Approval Policy">
            <div className="space-y-3">
              {[
                {
                  value: "review",
                  label: "Review required",
                  desc: "Reviewer must approve after seeing training results",
                },
                {
                  value: "auto-policy",
                  label: "Auto-approve with policy",
                  desc: "Set precision/coverage thresholds for auto-merge",
                },
                {
                  value: "auto",
                  label: "Auto-approve",
                  desc: "Merge when training completes unless blocking issues",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                    approvalPolicy === opt.value
                      ? "bg-teal-900/30 border-teal-600"
                      : "bg-slate-900 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="policy"
                    value={opt.value}
                    checked={approvalPolicy === opt.value}
                    onChange={(e) => setApprovalPolicy(e.target.value)}
                    className="mt-1 accent-teal-500"
                  />
                  <div>
                    <p className="text-sm text-slate-200 font-medium">
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {approvalPolicy === "auto-policy" && (
              <div className="mt-4 p-3 bg-slate-900 rounded-lg space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Min Precision
                  </label>
                  <input
                    type="number"
                    defaultValue={95}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Min Coverage
                  </label>
                  <input
                    type="number"
                    defaultValue={85}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Scheduling */}
          <Card title="Go-Live Scheduling">
            <div className="space-y-2">
              {[
                {
                  value: "immediate",
                  label: "Go live immediately after approval",
                },
                { value: "scheduled", label: "Schedule go-live date" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                    schedule === opt.value
                      ? "bg-teal-900/30 border-teal-600"
                      : "bg-slate-900 border-slate-700 hover:border-slate-600"
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
                  <span className="text-sm text-slate-200">{opt.label}</span>
                </label>
              ))}
              {schedule === "scheduled" && (
                <input
                  type="date"
                  className="w-full mt-2 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200"
                />
              )}
            </div>
          </Card>

          {/* Brain Detection Summary */}
          <Card title="Brain Detection Summary">
            <div className="space-y-4">
              {/* Current vNow */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-slate-200">
                    Current (vNow)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Running in production — outage mode active
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-green-400">● Healthy</span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-slate-400">
                    Last detection: 2h ago
                  </span>
                </div>
              </div>
              {/* Proposed vNext */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      trainingComplete
                        ? "bg-green-500"
                        : "bg-blue-500 animate-pulse"
                    }`}
                  />
                  <span className="text-sm font-medium text-slate-200">
                    Proposed (vNext)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {trainingComplete
                    ? "Training complete — shadow mode"
                    : "Training in shadow mode"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      trainingComplete ? "text-green-400" : "text-blue-400"
                    }`}
                  >
                    {trainingComplete ? "● Ready" : "◌ Training"}
                  </span>
                  <span className="text-xs text-slate-500">|</span>
                  <span className="text-xs text-slate-400">
                    {trainingComplete
                      ? "14-day shadow run complete"
                      : "Not yet detecting"}
                  </span>
                </div>
              </div>
              {/* Key facts */}
              <div className="space-y-2 text-sm border-t border-slate-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monitor</span>
                  <span className="text-slate-200">Cosmos DB Intelligent Monitor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mode</span>
                  <span className="text-red-400 font-medium">Outage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. training time</span>
                  <span className="text-slate-200">24–48 hours</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card title="Notifications">
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                📧 You will be notified when training completes and results are
                ready for review.
              </p>
            </div>
          </Card>

          {/* Simulate button */}
          {!trainingComplete && (
            <Button
              variant="secondary"
              onClick={() => setTrainingComplete(true)}
              className="w-full"
            >
              ⏩ Simulate Training Complete
            </Button>
          )}

          {trainingComplete && (
            <Button
              variant="success"
              onClick={() => router.push("/step-3")}
              className="w-full"
            >
              Review Results →
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <Button variant="ghost" onClick={() => router.push("/step-1")}>
          ← Back to Editor
        </Button>
        {trainingComplete && (
          <Button variant="primary" onClick={() => router.push("/step-3")}>
            Proceed to Review →
          </Button>
        )}
      </div>
    </div>
  );
}
