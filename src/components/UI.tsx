"use client";

import React from "react";

export function StatusPill({ status }: { status: "pass" | "fail" | "warn" | "running" | "pending" }) {
  const styles: Record<string, string> = {
    pass: "bg-green-900/50 text-green-400 border-green-700",
    fail: "bg-red-900/50 text-red-400 border-red-700",
    warn: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
    running: "bg-blue-900/50 text-blue-400 border-blue-700",
    pending: "bg-slate-700/50 text-slate-400 border-slate-600",
  };
  const icons: Record<string, string> = {
    pass: "✅",
    fail: "❌",
    warn: "⚠️",
    running: "🔄",
    pending: "⬜",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span>{icons[status]}</span>
      {status === "running" ? "Running" : status === "pending" ? "Pending" : status === "pass" ? "Passed" : status === "warn" ? "Warning" : "Failed"}
    </span>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  onClick?: () => void;
  className?: string;
}) {
  const styles: Record<string, string> = {
    primary: "bg-teal-600 hover:bg-teal-500 text-white",
    secondary: "bg-slate-600 hover:bg-slate-500 text-slate-200",
    success: "bg-green-600 hover:bg-green-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "bg-transparent hover:bg-slate-700 text-slate-300 border border-slate-600",
  };
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function TabBar({
  tabs,
  active,
  onSelect,
}: {
  tabs: string[];
  active: string;
  onSelect: (tab: string) => void;
}) {
  return (
    <div className="flex border-b border-slate-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
            active === tab
              ? "text-teal-400 border-b-2 border-teal-400"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
