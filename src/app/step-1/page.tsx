"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NEW_SLO_YAML } from "../../data/mock";

const NAV_ITEMS = [
  { icon: "❤️", label: "Service Health" },
  { icon: "📊", label: "Dashboard" },
  { icon: "💚", label: "Health" },
  { icon: "📋", label: "Logs" },
  { icon: "⚡", label: "Actions" },
  { icon: "🔍", label: "Trace" },
  { icon: "💡", label: "Insights" },
  { icon: "🔧", label: "Service Hub", active: true },
  { icon: "⚙️", label: "Manage" },
  { icon: "👤", label: "Account" },
  { icon: "🩺", label: "Diagnose" },
];

const BACKTEST_INCIDENTS = [
  { id: "INC-301948", title: "Read availability degradation — West US 2", sev: "Sev2", date: "2025-01-08" },
  { id: "INC-482901", title: "CosmosDB read latency spike — East US 2", sev: "Sev2", date: "2025-01-12" },
  { id: "INC-739205", title: "Throttling on hot partition — West Europe", sev: "Sev1", date: "2025-01-15" },
  { id: "INC-615847", title: "Transient failover noise — Central US", sev: "Sev3", date: "2025-01-18" },
  { id: "INC-928374", title: "Write availability drop — South East Asia", sev: "Sev1", date: "2025-01-22" },
];

const BACKTEST_RESULTS = [
  { id: "INC-301948", detected: true, time: "3.0 min", label: "Detected" },
  { id: "INC-482901", detected: true, time: "3.1 min", label: "New detection" },
  { id: "INC-739205", detected: true, time: "2.8 min", label: "New detection" },
  { id: "INC-615847", detected: false, time: null, label: "Suppressed (noise)" },
  { id: "INC-928374", detected: true, time: "1.9 min", label: "New detection" },
];

type BacktestPhase = "idle" | "running" | "complete";

export default function Step1() {
  const router = useRouter();
  const [yaml, setYaml] = useState(NEW_SLO_YAML);
  const [statusTab, setStatusTab] = useState<"errors" | "warnings">("errors");
  const [backtestPhase, setBacktestPhase] = useState<BacktestPhase>("idle");
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [rightTab, setRightTab] = useState<"status" | "backtest">("status");
  const lines = yaml.split("\n");

  const runBacktest = useCallback(() => {
    setBacktestPhase("running");
    setBacktestProgress(0);
    setRightTab("backtest");
  }, []);

  // Simulate backtest progress
  useEffect(() => {
    if (backtestPhase !== "running") return;
    const interval = setInterval(() => {
      setBacktestProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setBacktestPhase("complete");
          return 100;
        }
        return p + Math.random() * 12 + 3;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [backtestPhase]);

  return (
    <div
      className="flex rounded-lg overflow-hidden border border-slate-600 bg-slate-900"
      style={{ minHeight: 680 }}
    >
      {/* Jarvis Left Sidebar */}
      <div className="w-44 bg-[#1b2a4a] border-r border-[#2a3f6a] flex flex-col shrink-0">
        <div className="px-3 py-3 flex items-center gap-2 border-b border-[#2a3f6a]">
          <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">J</span>
          </div>
          <span className="text-sm font-semibold text-white">Jarvis</span>
        </div>
        <div className="px-3 py-2 text-xs text-slate-400 border-b border-[#2a3f6a]">
          Account &nbsp;›
        </div>
        <nav className="flex-1 py-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-left cursor-default transition-colors ${
                item.active
                  ? "bg-blue-700/40 text-white border-l-2 border-blue-400"
                  : "text-slate-300 hover:bg-[#253a5e] border-l-2 border-transparent"
              }`}
            >
              <span className="w-4 text-center text-xs">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <span>‹</span>
            <span>…</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100">SLO Yaml Editor</h1>
          <div className="flex items-baseline gap-1 mt-2 text-sm">
            <span className="text-slate-500">⌃ Service details</span>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-1 mt-1 text-sm">
            <div>
              <span className="text-slate-500">Service name</span>
              <span className="ml-3 text-blue-400 cursor-default">
                : Azure Cosmos DB ↗
              </span>
            </div>
            <div>
              <span className="text-slate-500">Service Tree ID</span>
              <span className="ml-3 text-slate-300 font-mono text-xs">
                : 724c33bf-1ab8-4691-adb1-0e61932919c2
              </span>
            </div>
          </div>
        </div>

        {/* Development sandbox banner */}
        <div className="mx-6 mt-4 flex items-start gap-2.5 p-3 bg-blue-900/20 border border-blue-700/40 rounded text-[13px] leading-relaxed">
          <span className="text-blue-400 mt-0.5 shrink-0">🔬</span>
          <div>
            <p className="text-blue-200/90">
              <strong className="text-blue-100">Development stage</strong> — SLI is not yet streamed or persisted.
              Edit your signal definition and run a backtest to validate against historical incidents before proceeding.
            </p>
          </div>
        </div>

        {/* Warning about Brain monitor */}
        <div className="mx-6 mt-2 flex items-start gap-2.5 p-3 bg-amber-900/20 border border-amber-700/40 rounded text-[13px] leading-relaxed">
          <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
          <p className="text-amber-200/90">
            This SLI is used by Brain monitor{" "}
            <strong className="text-amber-100">
              &apos;CosmosDB-SuccessRate&apos;
            </strong>{" "}
            in outage mode. Changes will trigger model retraining. The existing
            monitor will continue running until the new version is approved.
          </p>
        </div>

        {/* Editor + status panel */}
        <div className="flex-1 flex gap-4 p-6 pt-4 min-h-0">
          {/* YAML Editor */}
          <div className="flex-1 flex flex-col min-w-0">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Edit your SLO details
            </h2>
            <div className="flex-1 flex border border-slate-600 rounded bg-slate-950 overflow-auto">
              {/* Line numbers */}
              <div className="py-2 pl-3 pr-2 text-right select-none border-r border-slate-700/50 bg-slate-900/30 shrink-0">
                {lines.map((_, i) => (
                  <div
                    key={i}
                    className="text-[11px] text-slate-600 leading-[20px] font-mono h-5"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code content */}
              <div className="flex-1 min-w-0 py-2 overflow-auto">
                {lines.map((line, i) => {
                  const isHighlighted = line.includes("PartitionKey");
                  return (
                    <div
                      key={i}
                      className={`text-[12px] leading-[20px] font-mono h-5 whitespace-pre px-3 ${
                        isHighlighted
                          ? "bg-green-900/40 text-green-300 border-l-2 border-green-500"
                          : "text-slate-200"
                      }`}
                    >
                      {line || "\u00A0"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel — status + backtesting */}
          <div className="w-80 shrink-0 flex flex-col">
            {/* Panel tab bar */}
            <div className="flex mb-2 gap-1">
              <button
                onClick={() => setRightTab("status")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors cursor-pointer ${
                  rightTab === "status"
                    ? "bg-slate-800 text-slate-200 border border-slate-600 border-b-0"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                SLO Status
              </button>
              <button
                onClick={() => setRightTab("backtest")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors cursor-pointer flex items-center gap-1.5 ${
                  rightTab === "backtest"
                    ? "bg-slate-800 text-slate-200 border border-slate-600 border-b-0"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Backtesting
                {backtestPhase === "running" && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                {backtestPhase === "complete" && <span className="text-green-400">✓</span>}
              </button>
            </div>

            <div className="flex-1 border border-slate-600 rounded bg-slate-800 flex flex-col overflow-auto">
              {rightTab === "status" && (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-slate-600">
                    <button
                      onClick={() => setStatusTab("errors")}
                      className={`flex-1 px-3 py-2 text-[12px] font-medium transition-colors cursor-pointer ${
                        statusTab === "errors"
                          ? "text-blue-400 border-b-2 border-blue-400 -mb-px"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Schema and SLI errors (0)
                    </button>
                    <button
                      onClick={() => setStatusTab("warnings")}
                      className={`flex-1 px-3 py-2 text-[12px] font-medium transition-colors cursor-pointer ${
                        statusTab === "warnings"
                          ? "text-blue-400 border-b-2 border-blue-400 -mb-px"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Warnings (0)
                    </button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-3">Code</th>
                        <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-2">Type</th>
                        <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-2">Line number</th>
                        <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-2">Description</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-slate-600">No issues found</p>
                  </div>
                </>
              )}

              {rightTab === "backtest" && backtestPhase === "idle" && (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Brain Backtest Configuration</h3>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Configure what Brain should validate against. Select a time period, incidents to confirm detection, and healthy windows for noise calibration.
                    </p>
                  </div>

                  {/* Time range */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-1">Evaluation Period</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Choose the time window to replay your signal against</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">From</label>
                        <input type="date" defaultValue="2025-01-01" className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[11px] text-slate-300 mt-0.5" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">To</label>
                        <input type="date" defaultValue="2025-02-01" className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[11px] text-slate-300 mt-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Historical incidents to validate */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-1">Incidents to Validate</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Select incidents Brain should detect with the new signal</p>
                    <div className="space-y-1.5 max-h-40 overflow-auto">
                      {BACKTEST_INCIDENTS.map((inc) => (
                        <div key={inc.id} className="flex items-center gap-2 text-[11px]">
                          <input type="checkbox" defaultChecked className="accent-teal-500 w-3 h-3" />
                          <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                            inc.sev === "Sev1" ? "bg-red-900/40 text-red-400" :
                            inc.sev === "Sev2" ? "bg-orange-900/40 text-orange-400" :
                            "bg-yellow-900/40 text-yellow-400"
                          }`}>{inc.sev}</span>
                          <span className="text-slate-400 truncate flex-1">{inc.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Healthy periods for noise calibration */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-1">Healthy Periods to Check</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Verify Brain does NOT fire during these known-good windows</p>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Jan 2 – Jan 7, 2025</span>
                        <span className="text-green-500">● healthy</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jan 19 – Jan 21, 2025</span>
                        <span className="text-green-500">● healthy</span>
                      </div>
                    </div>
                    <button className="mt-2 text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer">+ Add healthy period</button>
                  </div>

                  {/* SLI Signal Chart Preview placeholder */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-1">Signal Preview</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Estimated SLI signal in the evaluation window</p>
                    <div className="h-20 bg-slate-800 rounded border border-slate-700/50 flex items-end justify-between px-2 pb-1 gap-px">
                      {/* Mini bar chart placeholder */}
                      {[65,72,68,40,75,78,30,82,70,74,76,80,35,85,79,77,81,73,69,71,78,76,82,84].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t transition-all ${
                            h < 50 ? "bg-red-500/70" : h < 70 ? "bg-yellow-500/50" : "bg-teal-500/40"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                      <span>Jan 1</span>
                      <span className="text-red-400">▼ incidents</span>
                      <span>Feb 1</span>
                    </div>
                  </div>

                  <button
                    onClick={runBacktest}
                    className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🧪</span> Run Backtest
                  </button>
                </div>
              )}

              {rightTab === "backtest" && backtestPhase === "running" && (
                <div className="p-4 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-[10px] animate-pulse">B</div>
                    <div>
                      <h3 className="text-xs font-semibold text-blue-300">Backtesting in progress</h3>
                      <p className="text-[10px] text-slate-500">Brain is validating your signal…</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.min(100, Math.round(backtestProgress))}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, backtestProgress)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    {[
                      { label: "Parsing SLI signal definition", done: backtestProgress > 15 },
                      { label: "Loading historical incident data", done: backtestProgress > 30 },
                      { label: "Building evaluation model", done: backtestProgress > 50 },
                      { label: "Running against incidents", done: backtestProgress > 70 },
                      { label: "Calculating detection metrics", done: backtestProgress > 85 },
                      { label: "Generating report", done: backtestProgress >= 100 },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-2 text-[11px]">
                        {step.done ? (
                          <span className="text-green-400 w-4 text-center">✓</span>
                        ) : backtestProgress > 0 ? (
                          <span className="text-blue-400 w-4 text-center animate-pulse">◌</span>
                        ) : (
                          <span className="text-slate-600 w-4 text-center">○</span>
                        )}
                        <span className={step.done ? "text-slate-300" : "text-slate-500"}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rightTab === "backtest" && backtestPhase === "complete" && (
                <div className="p-4 space-y-3 overflow-auto">
                  {/* Pass banner */}
                  <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg flex items-center gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-green-300">Backtest Passed</p>
                      <p className="text-[10px] text-green-400/70">Signal validated against 5 historical incidents</p>
                    </div>
                  </div>

                  {/* Summary metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Coverage", value: "4/5", color: "text-green-400" },
                      { label: "New Detections", value: "3", color: "text-teal-400" },
                      { label: "Noise Filtered", value: "1", color: "text-yellow-400" },
                    ].map((m) => (
                      <div key={m.label} className="p-2 bg-slate-900 rounded border border-slate-700 text-center">
                        <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Per-incident results */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-2">Incident Results</h4>
                    <div className="space-y-2">
                      {BACKTEST_INCIDENTS.map((inc, i) => {
                        const result = BACKTEST_RESULTS[i];
                        return (
                          <div key={inc.id} className="flex items-start gap-2 text-[11px]">
                            <span className={`mt-0.5 ${result.detected ? "text-green-400" : "text-slate-500"}`}>
                              {result.detected ? "✓" : "—"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-300 truncate">{inc.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                                  result.label === "New detection" ? "bg-teal-900/40 text-teal-400" :
                                  result.label === "Suppressed (noise)" ? "bg-yellow-900/40 text-yellow-400" :
                                  "bg-green-900/40 text-green-400"
                                }`}>{result.label}</span>
                                {result.time && <span className="text-[10px] text-slate-500">TTD: {result.time}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Development stage checklist */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-2">Development Checks</h4>
                    <div className="space-y-1.5">
                      {[
                        { label: "Schema validation", passed: true },
                        { label: "Signal quality check", passed: true },
                        { label: "Dimension cardinality", passed: true },
                        { label: "Backtest coverage ≥ 60%", passed: true },
                        { label: "No regression vs current", passed: true },
                      ].map((c) => (
                        <div key={c.label} className="flex items-center gap-2 text-[11px]">
                          <span className={c.passed ? "text-green-400" : "text-red-400"}>{c.passed ? "✓" : "✗"}</span>
                          <span className="text-slate-400">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center gap-3 px-6 py-3 border-t border-slate-700 bg-slate-800/30">
          <button
            className="px-5 py-1.5 bg-slate-600/50 text-slate-500 text-sm rounded border border-slate-600 cursor-not-allowed"
            disabled
          >
            Save
          </button>
          {backtestPhase === "idle" && (
            <button
              onClick={() => { setRightTab("backtest"); }}
              className="px-5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded cursor-pointer transition-colors flex items-center gap-1.5"
            >
              🧪 Run Backtest
            </button>
          )}
          {backtestPhase === "running" && (
            <button
              disabled
              className="px-5 py-1.5 bg-slate-600 text-slate-400 text-sm rounded cursor-not-allowed flex items-center gap-1.5"
            >
              <span className="animate-pulse">◌</span> Backtesting…
            </button>
          )}
          {backtestPhase === "complete" && (
            <button
              onClick={() => router.push("/step-2")}
              className="px-5 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded cursor-pointer transition-colors font-medium"
            >
              Proceed to Testing →
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="px-5 py-1.5 bg-slate-600 hover:bg-slate-500 text-slate-200 text-sm rounded border border-slate-500 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          {backtestPhase === "complete" && (
            <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
              ✓ Backtest passed — ready to promote
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
