"use client";

import React from "react";
import { SIGNAL_DATA } from "../data/mock";

export default function SignalChart() {
  const width = 600;
  const height = 180;
  const padding = { top: 10, right: 20, bottom: 30, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minV = 99.5;
  const maxV = 100;

  const toX = (i: number) => padding.left + (i / (SIGNAL_DATA.length - 1)) * chartW;
  const toY = (v: number) => padding.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const pathD = SIGNAL_DATA.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.value)}`).join(" ");

  const target = 99.95;
  const targetY = toY(target);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxWidth: width }}>
      {/* Grid lines */}
      {[99.5, 99.6, 99.7, 99.8, 99.9, 100].map((v) => (
        <g key={v}>
          <line x1={padding.left} y1={toY(v)} x2={width - padding.right} y2={toY(v)} stroke="#334155" strokeWidth={1} />
          <text x={padding.left - 5} y={toY(v) + 3} textAnchor="end" fill="#94a3b8" fontSize={10}>
            {v.toFixed(1)}%
          </text>
        </g>
      ))}
      {/* Target line */}
      <line x1={padding.left} y1={targetY} x2={width - padding.right} y2={targetY} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" />
      <text x={width - padding.right + 2} y={targetY + 3} fill="#f59e0b" fontSize={9}>
        SLO
      </text>
      {/* Signal path */}
      <path d={pathD} fill="none" stroke="#2dd4bf" strokeWidth={1.5} />
      {/* X labels */}
      {[0, 12, 24, 36, 48].map((h) => {
        const idx = Math.min(h, SIGNAL_DATA.length - 1);
        return (
          <text key={h} x={toX(idx)} y={height - 5} textAnchor="middle" fill="#94a3b8" fontSize={10}>
            {h}h
          </text>
        );
      })}
    </svg>
  );
}
