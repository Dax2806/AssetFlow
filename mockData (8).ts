import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface FilterDropdown {
  key: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  icon?: React.ComponentType<{ className?: string }>;
}

interface SearchToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  filters?: FilterDropdown[];
  onClearAll?: () => void;
  showClearButton?: boolean;
  extraActions?: React.ReactNode;
}

export default function SearchToolbar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search...',
  filters = [],
  onClearAll,
  showClearButton = false,
  extraActions,
}: SearchToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-900/35 border border-slate-200/85 dark:border-zinc-900 p-3 rounded-xl select-none">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-4 w-4 text-slate-450 dark:text-zinc-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-8.5 w-full rounded-lg border border-slate-250 bg-white pl-9.5 pr-10 text-xs text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:text-zinc-500 dark:hover:text-zinc-350 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Filters Pack */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon || Filter;
          return (
            <div
              key={filter.key}
              className="flex items-center space-x-1 bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 px-2.5 h-8.5 text-xs text-slate-600 dark:text-zinc-300"
            >
              <Icon className="h-3 w-3 text-slate-450 shrink-0" />
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="bg-transparent border-0 outline-none pr-1.5 font-medium cursor-pointer"
              >
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        {/* Clear/Reset button */}
        {showClearButton && onClearAll && (
          <button
            onClick={onClearAll}
            className="inline-flex h-8.5 items-center gap-1 text-[11px] font-bold text-rose-650 hover:text-rose-700 transition-colors bg-white border border-rose-100 rounded-lg px-2.5 dark:bg-zinc-900/40 dark:border-rose-950/40 cursor-pointer"
          >
            <X className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}

        {extraActions && (
          <>
            <div className="h-8.5 w-px bg-slate-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            {extraActions}
          </>
        )}
      </div>
    </div>
  );
}
