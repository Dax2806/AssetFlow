import React from 'react';
import { Asset } from '../types';
import { ShieldCheck } from 'lucide-react';

interface AssetHealthOverviewProps {
  assets: Asset[];
}

export default function AssetHealthOverview({ assets }: AssetHealthOverviewProps) {
  const total = assets.length;
  const operational = assets.filter(
    a => a.status === 'available' || a.status === 'allocated' || a.status === 'reserved'
  ).length;
  const inMaintenance = assets.filter(a => a.status === 'maintenance').length;
  const compromised = assets.filter(a => a.status === 'lost').length;
  
  const healthRate = total > 0 ? Math.round((operational / total) * 100) : 100;

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950 h-full justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-900">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Asset Health Overview
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
              Operational readiness index
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/30 dark:text-emerald-400">
            {healthRate}% Optimal
          </span>
        </div>

        {/* Segmented visual health bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
            <span>Overall Fleet Health</span>
            <span className="font-mono">{healthRate}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${(operational / total) * 100}%` }}
            />
            {inMaintenance > 0 && (
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${(inMaintenance / total) * 100}%` }}
              />
            )}
            {compromised > 0 && (
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{ width: `${(compromised / total) * 100}%` }}
              />
            )}
          </div>
        </div>

        {/* Fleet statistics breakdown list */}
        <div className="mt-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Operational Assets</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{operational}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Under Servicing</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{inMaintenance}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Compromised / Lost</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{compromised}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-900/40 flex items-center gap-2 text-[10.5px] text-slate-400 dark:text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>Hardware audit passed 2 days ago</span>
      </div>
    </div>
  );
}
