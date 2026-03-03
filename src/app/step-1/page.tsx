"use client";

import { useState } from "react";
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

export default function Step1() {
  const router = useRouter();
  const [yaml, setYaml] = useState(NEW_SLO_YAML);
  const [statusTab, setStatusTab] = useState<"errors" | "warnings">("errors");
  const lines = yaml.split("\n");

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

        {/* Warning banner */}
        <div className="mx-6 mt-4 flex items-start gap-2.5 p-3 bg-amber-900/20 border border-amber-700/40 rounded text-[13px] leading-relaxed">
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

          {/* SLO status panel */}
          <div className="w-72 shrink-0 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              SLO status
            </h2>
            <div className="flex-1 border border-slate-600 rounded bg-slate-800 flex flex-col">
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
              {/* Table header */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-3">
                      Code
                    </th>
                    <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-2">
                      Type
                    </th>
                    <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-2">
                      Line number
                    </th>
                    <th className="py-1.5 text-left text-[11px] text-slate-500 font-medium px-2">
                      Description
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-slate-600">No issues found</p>
              </div>
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
          <button
            onClick={() => router.push("/step-2")}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded cursor-pointer transition-colors"
          >
            Validate Yaml
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-1.5 bg-slate-600 hover:bg-slate-500 text-slate-200 text-sm rounded border border-slate-500 cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
