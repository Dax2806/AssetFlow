import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface SummaryKPI {
  title: string;
  value: string | number;
  subText: string;
  icon: LucideIcon;
  type?: 'positive' | 'negative' | 'neutral' | 'info';
}

interface SummaryStripProps {
  kpis: SummaryKPI[];
  isLoading?: boolean;
}

export default function SummaryStrip({ kpis, isLoading = false }: SummaryStripProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        let iconColor = 'text-slate-400 dark:text-zinc-500';
        let iconBg = 'bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800';

        if (kpi.type === 'positive') {
          iconColor = 'text-emerald-600 dark:text-emerald-400';
          iconBg = 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30';
        } else if (kpi.type === 'negative') {
          iconColor = 'text-rose-600 dark:text-rose-400';
          iconBg = 'bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30';
        } else if (kpi.type === 'info') {
          iconColor = 'text-indigo-600 dark:text-indigo-400';
          iconBg = 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30';
        }

        return (
          <motion.div
            key={kpi.title + idx}
            whileHover={{ y: -1 }}
            className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950 hover:border-slate-300 dark:hover:border-zinc-850 hover:shadow-2xs transition-all duration-150 h-[84px]"
          >
            {isLoading ? (
              <div className="space-y-2 flex-1 animate-pulse">
                <div className="h-3 w-16 rounded bg-slate-100 dark:bg-zinc-850" />
                <div className="h-5 w-10 rounded bg-slate-100 dark:bg-zinc-850" />
                <div className="h-2.5 w-24 rounded bg-slate-100 dark:bg-zinc-850" />
              </div>
            ) : (
              <div className="space-y-0.5 truncate">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className="text-lg font-black text-slate-850 dark:text-zinc-100 leading-tight">
                  {kpi.value}
                </div>
                <span className="block text-[10px] text-slate-400 dark:text-zinc-500 font-medium truncate">
                  {kpi.subText}
                </span>
              </div>
            )}
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 ${isLoading ? 'bg-slate-50 dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800 animate-pulse' : iconBg}`}>
              {!isLoading && <Icon className={`h-4.5 w-4.5 ${iconColor}`} />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
