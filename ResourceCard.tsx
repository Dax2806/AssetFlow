import React from 'react';

// --- Skeleton Card for Grid View ---
export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-4.5 space-y-4 shadow-2xs dark:border-zinc-900 dark:bg-zinc-950 animate-pulse">
      {/* Visual Header */}
      <div className="h-40 w-full rounded-lg bg-slate-100 dark:bg-zinc-900" />
      
      {/* Title block */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4.5 w-1/2 rounded bg-slate-100 dark:bg-zinc-900" />
          <div className="h-3 w-12 rounded bg-slate-100 dark:bg-zinc-900 font-mono" />
        </div>
        <div className="h-3 w-full rounded bg-slate-100 dark:bg-zinc-900" />
        <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-zinc-900" />
      </div>

      {/* Meta Specs footer */}
      <div className="border-t border-slate-100 dark:border-zinc-900 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 rounded bg-slate-100 dark:bg-zinc-900" />
          <div className="h-3.5 w-12 rounded bg-slate-100 dark:bg-zinc-900" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-32 rounded bg-slate-100 dark:bg-zinc-900" />
          <div className="h-3.5 w-16 rounded bg-slate-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}

// --- Skeleton Table Rows for Table View ---
export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/65 dark:border-zinc-900 overflow-hidden animate-pulse">
      <div className="border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30 px-6 py-4 flex items-center justify-between">
        <div className="h-4.5 w-36 rounded bg-slate-100 dark:bg-zinc-900" />
        <div className="h-4.5 w-20 rounded bg-slate-100 dark:bg-zinc-900" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0 dark:border-zinc-900/45">
            <div className="flex items-center space-x-3 w-1/3">
              <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-zinc-900 shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-zinc-900" />
                <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-zinc-900" />
              </div>
            </div>
            <div className="h-3.5 w-16 rounded bg-slate-100 dark:bg-zinc-900" />
            <div className="h-3.5 w-24 rounded bg-slate-100 dark:bg-zinc-900" />
            <div className="h-3.5 w-20 rounded bg-slate-100 dark:bg-zinc-900" />
            <div className="h-5 w-16 rounded bg-slate-100 dark:bg-zinc-900" />
            <div className="h-3.5 w-8 rounded bg-slate-100 dark:bg-zinc-900" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Skeleton for Asset 360 page ---
export function Skeleton360() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Hero Block */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-1/2">
            <div className="h-24 w-24 rounded-lg bg-slate-100 dark:bg-zinc-900 shrink-0" />
            <div className="space-y-2.5 w-full">
              <div className="h-5 w-2/3 rounded bg-slate-100 dark:bg-zinc-900" />
              <div className="h-3.5 w-1/3 rounded bg-slate-100 dark:bg-zinc-900" />
              <div className="flex gap-2">
                <div className="h-4.5 w-14 rounded bg-slate-100 dark:bg-zinc-900" />
                <div className="h-4.5 w-16 rounded bg-slate-100 dark:bg-zinc-900" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="h-8.5 w-20 rounded bg-slate-100 dark:bg-zinc-900" />
            <div className="h-8.5 w-24 rounded bg-slate-100 dark:bg-zinc-900" />
          </div>
        </div>
      </div>

      {/* 2. Key/Value Overview Block */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-zinc-900 mb-2" />
            <div className="h-6 w-24 rounded bg-slate-100 dark:bg-zinc-900" />
          </div>
        ))}
      </div>

      {/* 3. Details Splits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-48 rounded-xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-150 dark:border-zinc-900" />
          <div className="h-56 rounded-xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-150 dark:border-zinc-900" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-64 rounded-xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-150 dark:border-zinc-900" />
          <div className="h-40 rounded-xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-150 dark:border-zinc-900" />
        </div>
      </div>
    </div>
  );
}
