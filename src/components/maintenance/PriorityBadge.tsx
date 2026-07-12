import React from 'react';
import { AlertTriangle, AlertOctagon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  let bg = '';
  let text = '';
  let border = '';
  let Icon = ArrowDownRight;

  switch (priority) {
    case 'Critical':
      bg = 'bg-rose-50 dark:bg-rose-950/20';
      text = 'text-rose-700 dark:text-rose-400';
      border = 'border-rose-200 dark:border-rose-900/30';
      Icon = AlertOctagon;
      break;
    case 'High':
      bg = 'bg-amber-50 dark:bg-amber-950/20';
      text = 'text-amber-700 dark:text-amber-400';
      border = 'border-amber-200 dark:border-amber-900/30';
      Icon = AlertTriangle;
      break;
    case 'Medium':
      bg = 'bg-indigo-50 dark:bg-indigo-950/20';
      text = 'text-indigo-700 dark:text-indigo-400';
      border = 'border-indigo-200 dark:border-indigo-900/30';
      Icon = ArrowUpRight;
      break;
    case 'Low':
      bg = 'bg-slate-50 dark:bg-zinc-900';
      text = 'text-slate-600 dark:text-zinc-400';
      border = 'border-slate-200 dark:border-zinc-800';
      Icon = ArrowDownRight;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${bg} ${text} ${border}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{priority}</span>
    </span>
  );
}
