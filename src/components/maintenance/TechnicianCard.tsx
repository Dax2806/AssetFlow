import React from 'react';
import { User, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Technician } from './types';

interface TechnicianCardProps {
  key?: React.Key;
  technician: Technician;
  onAssign?: () => void;
  isSelectable?: boolean;
}

export default function TechnicianCard({ technician, onAssign, isSelectable = false }: TechnicianCardProps) {
  const workloadColor = (score: number) => {
    if (score > 80) return 'bg-rose-500';
    if (score > 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const workloadBg = (score: number) => {
    if (score > 80) return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400';
    if (score > 50) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400';
    return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400';
  };

  const statusBadge = (status: Technician['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available</span>
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span>Active</span>
          </span>
        );
      case 'On Field':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>On Field</span>
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <div className="group rounded-xl border border-slate-200/80 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950/40 hover:border-slate-300 dark:hover:border-zinc-800 transition-all hover:shadow-xs flex flex-col justify-between">
      <div>
        {/* Avatar + Status & Specialty */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center font-black text-slate-700 dark:text-zinc-300 border border-slate-200/40 dark:border-zinc-800 text-xs uppercase shadow-2xs">
              {technician.avatar}
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 tracking-tight">
                {technician.name}
              </h4>
              <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-medium">
                {technician.specialty}
              </p>
            </div>
          </div>
          {statusBadge(technician.status)}
        </div>

        {/* Workload Metric */}
        <div className="mt-4.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            <span>Workload Capacity</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${workloadBg(technician.workloadScore)}`}>
              {technician.workloadScore}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${workloadColor(technician.workloadScore)}`}
              style={{ width: `${technician.workloadScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Metrics + Assign Call */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-450 dark:text-zinc-500">
          <div>
            Active: <span className="text-slate-700 dark:text-zinc-200 font-extrabold">{technician.activeJobs} Jobs</span>
          </div>
        </div>

        {isSelectable && onAssign && (
          <button
            onClick={onAssign}
            className="text-[10px] font-black uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 px-3 py-1.5 rounded-lg transition-all"
          >
            Assign Tech
          </button>
        )}
      </div>
    </div>
  );
}
