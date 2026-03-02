"use client";

import React from "react";
import { DIFF_LINES } from "../data/mock";

export default function YamlDiff({ mode = "unified" }: { mode?: "unified" | "side-by-side" }) {
  if (mode === "side-by-side") {
    const oldLines = DIFF_LINES.filter((l) => l.type !== "added");
    const newLines = DIFF_LINES.filter((l) => l.type !== "removed");
    const maxLen = Math.max(oldLines.length, newLines.length);
    return (
      <div className="grid grid-cols-2 gap-0 font-mono text-xs overflow-x-auto">
        <div className="border-r border-slate-600">
          <div className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold border-b border-slate-600">
            v1 (current)
          </div>
          {Array.from({ length: maxLen }, (_, i) => {
            const line = oldLines[i];
            return (
              <div key={i} className={`px-3 py-0.5 ${line?.type === "removed" ? "bg-red-900/30 text-red-300" : "text-slate-300"}`}>
                {line ? line.text : ""}
              </div>
            );
          })}
        </div>
        <div>
          <div className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold border-b border-slate-600">
            v2 (proposed)
          </div>
          {Array.from({ length: maxLen }, (_, i) => {
            const line = newLines[i];
            return (
              <div key={i} className={`px-3 py-0.5 ${line?.type === "added" ? "bg-green-900/30 text-green-300" : "text-slate-300"}`}>
                {line ? line.text : ""}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono text-xs overflow-x-auto">
      {DIFF_LINES.map((line, i) => (
        <div
          key={i}
          className={`px-3 py-0.5 ${
            line.type === "added"
              ? "bg-green-900/30 text-green-300"
              : line.type === "removed"
              ? "bg-red-900/30 text-red-300"
              : "text-slate-400"
          }`}
        >
          <span className="inline-block w-4 text-right mr-2 text-slate-500 select-none">
            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
          </span>
          {line.text}
        </div>
      ))}
    </div>
  );
}
