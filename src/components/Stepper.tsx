"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { href: "/step-1", label: "Edit SLI", num: 1 },
  { href: "/step-2", label: "PR & Training", num: 2 },
  { href: "/step-3", label: "Review & Merge", num: 3 },
];

export default function Stepper() {
  const pathname = usePathname();
  const currentStep = STEPS.findIndex((s) => pathname.startsWith(s.href)) + 1;

  return (
    <div className="flex items-center gap-1 px-6 py-3 bg-slate-800 border-b border-slate-700">
      {STEPS.map((step, i) => {
        const isActive = step.num === currentStep;
        const isDone = step.num < currentStep;
        return (
          <div key={step.num} className="flex items-center">
            <Link
              href={step.href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : isDone
                  ? "bg-teal-900/40 text-teal-300 hover:bg-teal-900/60"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-white text-teal-700"
                    : isDone
                    ? "bg-teal-700 text-teal-200"
                    : "bg-slate-600 text-slate-400"
                }`}
              >
                {isDone ? "✓" : step.num}
              </span>
              {step.label}
            </Link>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${isDone ? "bg-teal-600" : "bg-slate-600"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
