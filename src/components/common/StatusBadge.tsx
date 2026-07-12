import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = status.trim().toLowerCase();

  let bg = 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-350';
  
  if (
    normalized === 'available' ||
    normalized === 'confirmed' ||
    normalized === 'completed' ||
    normalized === 'passed' ||
    normalized === 'active' ||
    normalized === 'success' ||
    normalized === 'new' ||
    normalized === 'good'
  ) {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
  } else if (
    normalized === 'maintenance' ||
    normalized === 'in progress' ||
    normalized === 'pending' ||
    normalized === 'warning' ||
    normalized === 'fair'
  ) {
    bg = 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-405 dark:border-amber-900/30';
  } else if (
    normalized === 'allocated' ||
    normalized === 'reserved' ||
    normalized === 'info'
  ) {
    bg = 'bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30';
  } else if (
    normalized === 'lost' ||
    normalized === 'disposed' ||
    normalized === 'cancelled' ||
    normalized === 'flagged' ||
    normalized === 'inactive' ||
    normalized === 'alert' ||
    normalized === 'poor'
  ) {
    bg = 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${bg} ${className}`}
    >
      {status}
    </span>
  );
}
