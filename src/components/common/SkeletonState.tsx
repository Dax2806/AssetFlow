import React from 'react';

// Single Skeleton Item for general layouts
export function SkeletonBlock({ className = 'h-4 w-full' }: { className?: string }) {
  return (
    <div className={`rounded bg-slate-100/85 dark:bg-zinc-900/60 animate-pulse ${className}`} />
  );
}

// 1. Skeleton Header
export function SkeletonHeader() {
  return (
    <div className="space-y-3 pb-2 animate-pulse select-none">
      <div className="h-4 w-28 bg-slate-100 dark:bg-zinc-900 rounded" />
      <div className="flex items-center justify-between gap-4">
        <div className="h-7 w-1/3 bg-slate-100 dark:bg-zinc-900 rounded" />
        <div className="h-8 w-24 bg-slate-100 dark:bg-zinc-900 rounded-lg" />
      </div>
    </div>
  );
}

// 2. Skeleton KPI Cards / Metric Cards
export function SkeletonKPICards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 select-none">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-200/60 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col justify-between h-[84px] animate-pulse"
        >
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-16 bg-slate-100 dark:bg-zinc-900 rounded" />
            <div className="h-5 w-10 bg-slate-100 dark:bg-zinc-900 rounded" />
            <div className="h-2.5 w-24 bg-slate-100 dark:bg-zinc-900 rounded" />
          </div>
          <div className="h-10 w-10 bg-slate-50 dark:bg-zinc-900 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
}

// 3. Skeleton Table
export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-900 overflow-hidden animate-pulse select-none">
      <div className="border-b border-slate-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-100 dark:bg-zinc-900 rounded" />
        <div className="h-4 w-20 bg-slate-100 dark:bg-zinc-900 rounded" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0 dark:border-zinc-900/40">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className={`h-3.5 bg-slate-100 dark:bg-zinc-900 rounded ${
                  cIdx === 0 ? 'w-1/3' : 'w-16'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Skeleton Cards (Grid Bento)
export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 select-none">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col rounded-xl border border-slate-200/60 bg-white p-4.5 space-y-4 shadow-2xs dark:border-zinc-900 dark:bg-zinc-950 animate-pulse"
        >
          <div className="h-40 w-full rounded-lg bg-slate-100 dark:bg-zinc-900" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-1/2 bg-slate-100 dark:bg-zinc-900 rounded" />
              <div className="h-3 w-12 bg-slate-100 dark:bg-zinc-900 rounded" />
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-zinc-900 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 5. Skeleton Drawer
export function SkeletonDrawer() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-900">
        <div className="space-y-2">
          <div className="h-4.5 w-32 bg-slate-100 dark:bg-zinc-900 rounded" />
          <div className="h-3.5 w-48 bg-slate-100 dark:bg-zinc-900 rounded" />
        </div>
        <div className="h-6 w-6 bg-slate-100 dark:bg-zinc-900 rounded" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-3 w-20 bg-slate-100 dark:bg-zinc-900 rounded" />
            <div className="h-9 w-full bg-slate-100 dark:bg-zinc-900 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Skeleton Charts
export function SkeletonCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 select-none">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-200/60 bg-white p-5 h-64 dark:border-zinc-900 dark:bg-zinc-950 animate-pulse flex flex-col justify-between"
        >
          <div className="h-4 w-32 bg-slate-100 dark:bg-zinc-900 rounded" />
          <div className="h-32 w-full bg-slate-50 dark:bg-zinc-900/45 rounded-lg flex items-end justify-around p-4">
            <div className="h-20 w-8 bg-slate-100 dark:bg-zinc-900 rounded" />
            <div className="h-24 w-8 bg-slate-100 dark:bg-zinc-900 rounded" />
            <div className="h-16 w-8 bg-slate-100 dark:bg-zinc-900 rounded" />
            <div className="h-28 w-8 bg-slate-100 dark:bg-zinc-900 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
