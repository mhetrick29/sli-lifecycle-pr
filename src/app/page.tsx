import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mx-auto">
          B
        </div>
        <h1 className="text-3xl font-bold text-slate-100">Brain SLI Lifecycle</h1>
        <p className="text-slate-400 max-w-lg text-lg">
          PR-style change management for SLI updates. Edit, review, train, and merge — safely.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        {[
          { step: 1, label: "Edit SLI", desc: "Author SLO changes" },
          { step: 2, label: "Generate PR", desc: "Diff & checks" },
          { step: 3, label: "Training", desc: "Retrain Brain models" },
          { step: 4, label: "Review & Merge", desc: "Approve & go live" },
        ].map((s) => (
          <div key={s.step} className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-1">
            <div className="w-8 h-8 rounded-full bg-teal-600/20 text-teal-400 flex items-center justify-center text-sm font-bold mx-auto">
              {s.step}
            </div>
            <div className="font-semibold text-slate-200">{s.label}</div>
            <div className="text-slate-500 text-xs">{s.desc}</div>
          </div>
        ))}
      </div>
      <Link
        href="/step-1"
        className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-colors text-lg"
      >
        Start Walkthrough →
      </Link>
    </div>
  );
}
