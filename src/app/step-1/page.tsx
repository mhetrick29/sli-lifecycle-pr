"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NEW_SLO_YAML, QUALITY_CHECKS } from "../../data/mock";
import { Card, Button, StatusPill } from "../../components/UI";
import SignalChart from "../../components/SignalChart";

export default function Step1() {
  const router = useRouter();
  const [yaml, setYaml] = useState(NEW_SLO_YAML);

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg">
        <span className="text-amber-400 text-xl mt-0.5">⚠️</span>
        <div>
          <p className="text-amber-200 font-medium text-sm">
            This SLI is used by Brain monitor &lsquo;CosmosDB-SuccessRate&rsquo; in outage mode.
          </p>
          <p className="text-amber-400/70 text-xs mt-1">
            Changes will trigger model retraining. The existing monitor will continue running until the new version is approved.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* YAML Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="SLO Definition — cosmosdb-availability">
            <div className="relative">
              <textarea
                value={yaml}
                onChange={(e) => setYaml(e.target.value)}
                className="w-full h-[500px] bg-slate-900 text-teal-300 font-mono text-xs p-4 rounded border border-slate-600 focus:border-teal-500 focus:outline-none resize-none"
                spellCheck={false}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded">YAML</span>
                <span className="px-2 py-1 bg-teal-900/50 text-teal-400 text-xs rounded border border-teal-700">
                  Edited
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Change: Added <code className="text-teal-400">PartitionKey</code> dimension for granular partition-level monitoring
            </p>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quality Checks */}
          <Card title="Preliminary Quality Checks">
            <div className="space-y-3">
              {QUALITY_CHECKS.map((check) => (
                <div key={check.name} className="flex items-start gap-2">
                  <StatusPill status={check.status} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200">{check.name}</p>
                    <p className="text-xs text-slate-500">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Signal Preview */}
          <Card title="SLI Signal Preview (48h)">
            <SignalChart />
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-teal-400 inline-block" /> Signal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-amber-400 inline-block border-dashed" /> SLO Target
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Mock data showing CosmosDB RequestSuccessRate with a brief dip at hour 32
            </p>
          </Card>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          Saving will generate a PR with your changes. The current monitor will not be affected.
        </p>
        <Button variant="primary" onClick={() => router.push("/step-2")}>
          Save &amp; Generate PR →
        </Button>
      </div>
    </div>
  );
}
