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

const BACKTEST_OUTAGES = [
  { id: "348291576", title: "Read availability degradation — West US 2", sev: "Sev2", date: "2025-01-08", region: "West US 2", classification: "TP" as const },
  { id: "482901337", title: "CosmosDB read latency spike — East US 2", sev: "Sev2", date: "2025-01-12", region: "East US 2", classification: "FN" as const },
  { id: "739205814", title: "Throttling on hot partition — West Europe", sev: "Sev1", date: "2025-01-15", region: "West Europe", classification: "FN" as const },
  { id: "615847290", title: "Transient failover noise — Central US", sev: "Sev3", date: "2025-01-18", region: "Central US", classification: "FP" as const },
  { id: "928374105", title: "Write availability drop — South East Asia", sev: "Sev1", date: "2025-01-22", region: "South East Asia", classification: "FN" as const },
  { id: "104857632", title: "Connection pool exhaustion — East US", sev: "Sev2", date: "2025-01-25", region: "East US", classification: "TP" as const },
  { id: "293847561", title: "Index rebuild latency — North Europe", sev: "Sev3", date: "2025-01-28", region: "North Europe", classification: "TP" as const },
];

const BACKTEST_RESULTS = [
  { id: "348291576", vCurrentDetected: true, vCurrentTTD: "4.2 min", vNextDetected: true, vNextTTD: "3.0 min" },
  { id: "482901337", vCurrentDetected: false, vCurrentTTD: null, vNextDetected: true, vNextTTD: "3.1 min" },
  { id: "739205814", vCurrentDetected: false, vCurrentTTD: null, vNextDetected: true, vNextTTD: "2.8 min" },
  { id: "615847290", vCurrentDetected: true, vCurrentTTD: "1.5 min", vNextDetected: false, vNextTTD: null },
  { id: "928374105", vCurrentDetected: false, vCurrentTTD: null, vNextDetected: true, vNextTTD: "1.9 min" },
  { id: "104857632", vCurrentDetected: true, vCurrentTTD: "5.1 min", vNextDetected: true, vNextTTD: "2.4 min" },
  { id: "293847561", vCurrentDetected: true, vCurrentTTD: "3.8 min", vNextDetected: true, vNextTTD: "3.6 min" },
];

const ICM_TEAMS = [
  "Azure Cosmos DB — Core Availability",
  "Azure Cosmos DB — Data Plane",
  "Azure Cosmos DB — Control Plane",
  "Azure Cosmos DB — Networking",
];

type BacktestPhase = "idle" | "running" | "complete";

export default function Step1() {
  const router = useRouter();
  const [yaml, setYaml] = useState(NEW_SLO_YAML);
  const [backtestPhase, setBacktestPhase] = useState<BacktestPhase>("idle");
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [rightTab, setRightTab] = useState<"quality" | "preview">("quality");
  const [pinnedOutages, setPinnedOutages] = useState<Set<string>>(new Set());
  const [showAllResults, setShowAllResults] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [approvalPolicy, setApprovalPolicy] = useState("review");
  const [devSchedule, setDevSchedule] = useState("fastest");
  const [autoPromoteEnabled, setAutoPromoteEnabled] = useState(false);
  const [autoPromoteDays, setAutoPromoteDays] = useState("7");
  const lines = yaml.split("\n");

  const togglePin = useCallback((id: string) => {
    setPinnedOutages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const runBacktest = useCallback(() => {
    setBacktestPhase("running");
    setBacktestProgress(0);
    setRightTab("preview");
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
                onClick={() => setRightTab("quality")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors cursor-pointer ${
                  rightTab === "quality"
                    ? "bg-slate-800 text-slate-200 border border-slate-600 border-b-0"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Quality
              </button>
              <button
                onClick={() => setRightTab("preview")}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors cursor-pointer flex items-center gap-1.5 ${
                  rightTab === "preview"
                    ? "bg-slate-800 text-slate-200 border border-slate-600 border-b-0"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Preview
                {backtestPhase === "running" && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                {backtestPhase === "complete" && <span className="text-green-400">✓</span>}
              </button>
            </div>

            <div className="flex-1 border border-slate-600 rounded bg-slate-800 flex flex-col overflow-auto">
              {rightTab === "quality" && (
                <div className="p-4 space-y-3 overflow-auto">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">SLI Quality</h3>
                    <p className="text-[10px] text-slate-500 mb-3">Automated validation of your signal definition</p>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "Schema validation", status: "pass", detail: "Valid YAML, all required fields present" },
                      { label: "Signal definition", status: "pass", detail: "Well-formed metric expression" },
                      { label: "Dimension cardinality", status: "warn", detail: "PartitionKey has 1,247 unique values (recommended < 500)" },
                      { label: "Metric naming conventions", status: "pass", detail: "Follows standard naming patterns" },
                      { label: "Time window configuration", status: "pass", detail: "5 min window — within supported range" },
                      { label: "Data freshness", status: "pass", detail: "Signal available within 2 min SLA" },
                    ].map((check) => (
                      <div key={check.label} className="flex items-start gap-2 text-[11px] group">
                        <span className={`mt-0.5 ${
                          check.status === "pass" ? "text-green-400" : "text-yellow-400"
                        }`}>{check.status === "pass" ? "✓" : "⚠"}</span>
                        <div className="flex-1">
                          <span className="text-slate-300">{check.label}</span>
                          <p className="text-[9px] text-slate-600 hidden group-hover:block mt-0.5">{check.detail}</p>
                        </div>
                        <span className={`text-[9px] ${
                          check.status === "pass" ? "text-green-600" : "text-yellow-500"
                        }`}>{check.status === "pass" ? "Passed" : "Warning"}</span>
                      </div>
                    ))}
                  </div>
                  {/* Warning detail */}
                  <div className="p-2.5 bg-yellow-900/15 border border-yellow-700/30 rounded text-[10px] text-yellow-300/80 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <div>
                      <p className="font-medium text-yellow-200">High dimension cardinality</p>
                      <p className="mt-0.5 text-yellow-400/70">The <code className="text-yellow-300 bg-yellow-900/30 px-0.5 rounded">PartitionKey</code> dimension has 1,247 unique values. This may increase training time and resource usage. Consider using <code className="text-yellow-300 bg-yellow-900/30 px-0.5 rounded">PartitionKeyGroup</code> for lower cardinality.</p>
                    </div>
                  </div>
                  {/* Summary */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                    <span className="text-[10px] text-slate-500">5 passed · 1 warning · 0 errors</span>
                  </div>
                </div>
              )}

              {rightTab === "preview" && backtestPhase === "idle" && (
                <div className="p-4 space-y-4 overflow-auto">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Brain Backtest</h3>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Brain will replay your SLI signal over a historical time period and compare detection between the current monitor and your updated signal definition.
                    </p>
                  </div>

                  {/* Time range */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-1">Evaluation Period</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Time window to replay the signal against</p>
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

                  {/* ICM Team */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <h4 className="text-[11px] font-medium text-slate-300 mb-1">IcM Team</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Select the team whose outages to evaluate against</p>
                    <select
                      defaultValue={ICM_TEAMS[0]}
                      className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-[11px] text-slate-300 cursor-pointer"
                    >
                      {ICM_TEAMS.map((team) => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>

                  {/* Outages to pin (optional) */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[11px] font-medium text-slate-300">Pin Outages to Validate</h4>
                      <span className="text-[9px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">optional</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">Flag specific outages you want to make sure Brain catches with this signal</p>
                    {/* Legend */}
                    <div className="flex items-center gap-3 mb-2 pb-2 border-b border-slate-700/50">
                      <span className="flex items-center gap-1 text-[8px]"><span className="px-1 py-0.5 rounded bg-green-900/40 text-green-400 font-bold">TP</span><span className="text-slate-600">True Positive</span></span>
                      <span className="flex items-center gap-1 text-[8px]"><span className="px-1 py-0.5 rounded bg-red-900/40 text-red-400 font-bold">FP</span><span className="text-slate-600">False Positive</span></span>
                      <span className="flex items-center gap-1 text-[8px]"><span className="px-1 py-0.5 rounded bg-amber-900/40 text-amber-400 font-bold">FN</span><span className="text-slate-600">False Negative</span></span>
                    </div>
                    <div className="space-y-1.5 max-h-44 overflow-auto">
                      {BACKTEST_OUTAGES.map((outage) => (
                        <label key={outage.id} className={`flex items-start gap-2 text-[11px] cursor-pointer hover:bg-slate-800/50 rounded p-1 -mx-1 transition-colors ${
                          pinnedOutages.has(outage.id) ? "bg-slate-800/70 ring-1 ring-teal-700/50" : ""
                        }`}>
                          <input
                            type="checkbox"
                            checked={pinnedOutages.has(outage.id)}
                            onChange={() => togglePin(outage.id)}
                            className="accent-teal-500 w-3 h-3 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 font-mono">{outage.id}</span>
                              <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                                outage.sev === "Sev1" ? "bg-red-900/40 text-red-400" :
                                outage.sev === "Sev2" ? "bg-orange-900/40 text-orange-400" :
                                "bg-yellow-900/40 text-yellow-400"
                              }`}>{outage.sev}</span>
                              <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                outage.classification === "TP" ? "bg-green-900/40 text-green-400" :
                                outage.classification === "FP" ? "bg-red-900/40 text-red-400" :
                                "bg-amber-900/40 text-amber-400"
                              }`}>{outage.classification}</span>
                            </div>
                            <p className="text-slate-400 truncate mt-0.5">{outage.title}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SLI Signal Line Chart Preview */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[11px] font-medium text-slate-300">Signal Preview</h4>
                      <span className="text-[9px] text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">All Regions</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">CosmosDB-SuccessRate signal over evaluation window</p>
                    {/* Line chart via SVG */}
                    <div className="h-24 bg-slate-800 rounded border border-slate-700/50 relative overflow-hidden">
                      <svg viewBox="0 0 240 80" className="w-full h-full" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[20, 40, 60].map((y) => (
                          <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 2" />
                        ))}
                        {/* vCurrent line (green, dashed) */}
                        <polyline
                          fill="none"
                          stroke="#4ade80"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                          opacity="0.6"
                          points="0,18 10,16 20,19 30,17 40,14 50,55 60,58 70,20 80,18 90,15 100,17 110,60 120,62 130,22 140,16 150,14 160,13 170,50 180,15 190,14 200,16 210,65 220,18 230,15 240,13"
                        />
                        {/* vNext line (teal, solid) */}
                        <polyline
                          fill="none"
                          stroke="#2dd4bf"
                          strokeWidth="1.8"
                          points="0,15 10,14 20,16 30,14 40,12 50,30 60,32 70,14 80,13 90,12 100,14 110,28 120,30 130,15 140,13 150,11 160,10 170,25 180,12 190,11 200,13 210,35 220,14 230,12 240,10"
                        />
                        {/* Incident markers */}
                        {[50, 110, 170, 210].map((x, i) => (
                          <g key={i}>
                            <line x1={x} y1="0" x2={x} y2="80" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                            <circle cx={x} cy="5" r="2.5" fill="#ef4444" opacity="0.8" />
                          </g>
                        ))}
                      </svg>
                      {/* Legend overlay */}
                      <div className="absolute bottom-1 right-1.5 flex items-center gap-3 text-[8px]">
                        <span className="flex items-center gap-1"><span className="w-3 h-px bg-green-400 inline-block" style={{ borderTop: '1px dashed #4ade80' }} /> vCurrent</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-teal-400 inline-block rounded" /> vNext</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" /> outage</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                      <span>Jan 1, 2025</span>
                      <span>Feb 1, 2025</span>
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

              {rightTab === "preview" && backtestPhase === "running" && (
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

              {rightTab === "preview" && backtestPhase === "complete" && (
                <div className="p-4 space-y-3 overflow-auto">
                  {/* Pass banner */}
                  <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg flex items-center gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-green-300">Backtest Passed</p>
                      <p className="text-[10px] text-green-400/70">Jan 1 – Feb 1, 2025 · 7 outages evaluated · All Regions</p>
                    </div>
                  </div>

                  {/* Summary metrics — vCurrent vs vNext */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-900 rounded border border-slate-700">
                      <p className="text-[9px] text-slate-500 mb-1">vCurrent</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-300">4/7</span>
                        <span className="text-[10px] text-slate-500">detected</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Avg TTD: 3.7 min</p>
                    </div>
                    <div className="p-2 bg-teal-900/20 rounded border border-teal-700/50">
                      <p className="text-[9px] text-teal-400 mb-1">vNext (proposed)</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-teal-300">6/7</span>
                        <span className="text-[10px] text-teal-400/70">detected</span>
                      </div>
                      <p className="text-[10px] text-teal-400/70 mt-0.5">Avg TTD: 2.8 min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "New Detections", value: "+3", color: "text-teal-400" },
                      { label: "Noise Filtered", value: "1", color: "text-yellow-400" },
                      { label: "TTD Improvement", value: "-24%", color: "text-green-400" },
                    ].map((m) => (
                      <div key={m.label} className="p-1.5 bg-slate-900 rounded border border-slate-700 text-center">
                        <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Outage comparison table — pinned first, then view all */}
                  <div className="bg-slate-900 rounded border border-slate-700 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                      <h4 className="text-[11px] font-medium text-slate-300">Outage Detection Comparison</h4>
                      <div className="flex items-center gap-2 text-[8px]">
                        <span className="px-1 py-0.5 rounded bg-green-900/40 text-green-400 font-bold">TP</span>
                        <span className="px-1 py-0.5 rounded bg-red-900/40 text-red-400 font-bold">FP</span>
                        <span className="px-1 py-0.5 rounded bg-amber-900/40 text-amber-400 font-bold">FN</span>
                      </div>
                    </div>
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_50px_50px] px-3 py-1.5 border-b border-slate-700 text-[9px] text-slate-500 uppercase tracking-wide">
                      <span>Outage</span>
                      <span className="text-center">vCurr</span>
                      <span className="text-center">vNext</span>
                    </div>
                    {/* Pinned outages first */}
                    {pinnedOutages.size > 0 && (
                      <>
                        <div className="px-3 py-1 bg-teal-900/15 border-b border-teal-700/30">
                          <span className="text-[9px] text-teal-400 font-medium">📌 Pinned ({pinnedOutages.size})</span>
                        </div>
                        {BACKTEST_OUTAGES.filter(o => pinnedOutages.has(o.id)).map((outage) => {
                          const result = BACKTEST_RESULTS.find(r => r.id === outage.id);
                          if (!result) return null;
                          const improved = !result.vCurrentDetected && result.vNextDetected;
                          const regressed = result.vCurrentDetected && !result.vNextDetected;
                          return (
                            <div key={outage.id} className={`grid grid-cols-[1fr_50px_50px] px-3 py-1.5 border-b border-slate-700/50 text-[10px] ${
                              improved ? "bg-teal-900/10" : regressed ? "bg-yellow-900/10" : ""
                            }`}>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 font-mono text-[9px]">{outage.id}</span>
                                  <span className={`px-1 rounded text-[8px] font-bold ${
                                    outage.sev === "Sev1" ? "bg-red-900/40 text-red-400" :
                                    outage.sev === "Sev2" ? "bg-orange-900/40 text-orange-400" :
                                    "bg-yellow-900/40 text-yellow-400"
                                  }`}>{outage.sev}</span>
                                  <span className={`px-1 rounded text-[7px] font-bold ${
                                    outage.classification === "TP" ? "bg-green-900/40 text-green-400" :
                                    outage.classification === "FP" ? "bg-red-900/40 text-red-400" :
                                    "bg-amber-900/40 text-amber-400"
                                  }`}>{outage.classification}</span>
                                </div>
                                <p className="text-slate-400 truncate text-[9px] mt-0.5">{outage.title}</p>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                {result.vCurrentDetected ? (
                                  <>
                                    <span className="text-green-400 text-[10px]">✓</span>
                                    <span className="text-[8px] text-slate-500">{result.vCurrentTTD}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-600 text-[10px]">—</span>
                                )}
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                {result.vNextDetected ? (
                                  <>
                                    <span className={`text-[10px] ${improved ? "text-teal-400" : "text-green-400"}`}>✓</span>
                                    <span className="text-[8px] text-slate-500">{result.vNextTTD}</span>
                                  </>
                                ) : (
                                  <span className="text-yellow-500 text-[10px]" title="Noise filtered">○</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                    {/* View all toggle or full list */}
                    {!showAllResults && pinnedOutages.size > 0 ? (
                      <button
                        onClick={() => setShowAllResults(true)}
                        className="w-full px-3 py-2 text-[10px] text-teal-400 hover:text-teal-300 hover:bg-slate-800/50 transition-colors cursor-pointer text-center"
                      >
                        View all {BACKTEST_OUTAGES.length} results ↓
                      </button>
                    ) : (
                      <>
                        {pinnedOutages.size > 0 && (
                          <div className="px-3 py-1 bg-slate-800/30 border-b border-slate-700/30 flex items-center justify-between">
                            <span className="text-[9px] text-slate-500">All Results</span>
                            <button onClick={() => setShowAllResults(false)} className="text-[9px] text-slate-600 hover:text-slate-400 cursor-pointer">Collapse ↑</button>
                          </div>
                        )}
                        {BACKTEST_OUTAGES.filter(o => !pinnedOutages.has(o.id)).map((outage) => {
                          const result = BACKTEST_RESULTS.find(r => r.id === outage.id);
                          if (!result) return null;
                          const improved = !result.vCurrentDetected && result.vNextDetected;
                          const regressed = result.vCurrentDetected && !result.vNextDetected;
                          return (
                            <div key={outage.id} className={`grid grid-cols-[1fr_50px_50px] px-3 py-1.5 border-b border-slate-700/50 text-[10px] ${
                              improved ? "bg-teal-900/10" : regressed ? "bg-yellow-900/10" : ""
                            }`}>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500 font-mono text-[9px]">{outage.id}</span>
                                  <span className={`px-1 rounded text-[8px] font-bold ${
                                    outage.sev === "Sev1" ? "bg-red-900/40 text-red-400" :
                                    outage.sev === "Sev2" ? "bg-orange-900/40 text-orange-400" :
                                    "bg-yellow-900/40 text-yellow-400"
                                  }`}>{outage.sev}</span>
                                  <span className={`px-1 rounded text-[7px] font-bold ${
                                    outage.classification === "TP" ? "bg-green-900/40 text-green-400" :
                                    outage.classification === "FP" ? "bg-red-900/40 text-red-400" :
                                    "bg-amber-900/40 text-amber-400"
                                  }`}>{outage.classification}</span>
                                </div>
                                <p className="text-slate-400 truncate text-[9px] mt-0.5">{outage.title}</p>
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                {result.vCurrentDetected ? (
                                  <>
                                    <span className="text-green-400 text-[10px]">✓</span>
                                    <span className="text-[8px] text-slate-500">{result.vCurrentTTD}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-600 text-[10px]">—</span>
                                )}
                              </div>
                              <div className="flex flex-col items-center justify-center">
                                {result.vNextDetected ? (
                                  <>
                                    <span className={`text-[10px] ${improved ? "text-teal-400" : "text-green-400"}`}>✓</span>
                                    <span className="text-[8px] text-slate-500">{result.vNextTTD}</span>
                                  </>
                                ) : (
                                  <span className="text-yellow-500 text-[10px]" title="Noise filtered">○</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
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
              onClick={() => { setRightTab("preview"); }}
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
              onClick={() => setShowSaveDialog(true)}
              className="px-5 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded cursor-pointer transition-colors font-medium"
            >
              Save SLI →
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
              ✓ Backtest passed — ready to save
            </span>
          )}
        </div>
      </div>

      {/* Save SLI Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-full max-w-lg space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Save SLI &amp; Submit for Training</h2>
              <p className="text-sm text-slate-400 mt-1">Configure how this SLI update should be handled once training completes.</p>
            </div>

            {/* Scale & capacity notice */}
            <div className="p-3 bg-blue-900/20 border border-blue-700/40 rounded-lg text-[12px] text-blue-200/80 flex items-start gap-2.5">
              <span className="text-blue-400 mt-0.5 shrink-0">ℹ</span>
              <div>
                <p className="font-medium text-blue-200">What happens next</p>
                <p className="mt-1 text-blue-300/70">Once saved, Brain will run full scalability &amp; capacity checks, start model retraining, and begin shadow evaluation. You&apos;ll be notified if any issues arise. You can edit these policies any time until training completes.</p>
              </div>
            </div>

            {/* Go-Live Schedule */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Go-Live Schedule</h4>
              <p className="text-[10px] text-slate-500 mb-2">When should the new SLI version go live after approval?</p>
              <div className="space-y-1.5">
                {[
                  { value: "fastest", label: "Fastest", date: "Mar 7, 2026", desc: "~3 days — training + shadow evaluation", accent: true },
                  { value: "standard", label: "Standard", date: "Mar 11, 2026", desc: "~7 days — includes extended shadow period", accent: false },
                  { value: "conservative", label: "Conservative", date: "Mar 18, 2026", desc: "~14 days — full shadow validation cycle", accent: false },
                  { value: "custom", label: "Choose a date", date: "", desc: "Set a specific go-live date", accent: false },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                      devSchedule === opt.value
                        ? "bg-teal-900/30 border-teal-600"
                        : "border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="devSchedule"
                      value={opt.value}
                      checked={devSchedule === opt.value}
                      onChange={(e) => setDevSchedule(e.target.value)}
                      className="accent-teal-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${opt.accent && devSchedule === opt.value ? "text-teal-300" : "text-slate-200"}`}>{opt.label}</span>
                        {opt.date && <span className={`text-xs font-semibold ${opt.accent && devSchedule === opt.value ? "text-teal-400" : "text-slate-300"}`}>{opt.date}</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
                {devSchedule === "custom" && (
                  <input type="date" className="w-full mt-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200" />
                )}
              </div>
            </div>

            {/* Auto-Promotion */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Auto-Promotion to Production</h4>
              <label className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                autoPromoteEnabled ? "bg-teal-900/30 border-teal-700" : "border-slate-700 hover:bg-slate-800"
              }`}>
                <input
                  type="checkbox"
                  checked={autoPromoteEnabled}
                  onChange={(e) => setAutoPromoteEnabled(e.target.checked)}
                  className="accent-teal-500"
                />
                <div>
                  <p className="text-xs text-slate-200 font-medium">Enable set &amp; forget</p>
                  <p className="text-[10px] text-slate-500">Auto-promote to production when all criteria pass</p>
                </div>
              </label>
              {autoPromoteEnabled && (
                <div className="mt-2 p-3 bg-slate-900 rounded border border-slate-700 space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Stable duration required</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={autoPromoteDays}
                        onChange={(e) => setAutoPromoteDays(e.target.value)}
                        min="1"
                        max="30"
                        className="w-14 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 text-center"
                      />
                      <span className="text-[11px] text-slate-400">days with no regressions</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: "Coverage ≥ current", checked: true },
                      { label: "Noise rate ≤ current", checked: true },
                      { label: "No Sev1 misses", checked: true },
                    ].map((c) => (
                      <label key={c.label} className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer">
                        <input type="checkbox" defaultChecked={c.checked} className="accent-teal-500 w-3 h-3" />
                        {c.label}
                      </label>
                    ))}
                  </div>
                  <div className="p-2 bg-teal-900/20 border border-teal-800/50 rounded text-[10px] text-teal-400 flex items-start gap-1.5">
                    <span className="shrink-0">💤</span>
                    <span>You&apos;ll be notified when the SLI is promoted to Production. No further action needed.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-700">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded border border-slate-500 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  router.push("/step-2");
                }}
                className="px-5 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded cursor-pointer transition-colors"
              >
                Save &amp; Submit →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
