import React from 'react';
import { motion } from 'motion/react';
import { Laptop, Armchair, Car, Network, Printer, CalendarRange, ToggleLeft, ToggleRight, Edit3, Trash, ShieldCheck, ShieldAlert, FolderMinus } from 'lucide-react';
import { AssetCategory } from './types';
import { highlightText } from './utils';

// Helper to map dynamic string icons to actual Lucide Icon components
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Laptop: Laptop,
  Armchair: Armchair,
  Car: Car,
  Network: Network,
  Printer: Printer,
};

interface CategoryGridProps {
  categories: AssetCategory[];
  searchQuery: string;
  onEdit: (cat: AssetCategory) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

export default function CategoryGrid({
  categories,
  searchQuery,
  onEdit,
  onToggleStatus,
  isLoading = false,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={`cat-skeleton-${idx}`}
            className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-xs dark:border-zinc-900 dark:bg-zinc-950 h-56 animate-pulse"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-zinc-800" />
                <div className="h-5 w-14 rounded-full bg-slate-100 dark:bg-zinc-800" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-zinc-800" />
                <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-zinc-800" />
              </div>
              <div className="mt-5 space-y-2 border-t border-slate-100/60 pt-3.5 dark:border-zinc-900/40">
                <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-zinc-800" />
                <div className="h-3.5 w-2/3 rounded bg-slate-100 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100/60 dark:border-zinc-900/40 flex justify-end gap-1.5">
              <div className="h-7.5 w-20 rounded-lg bg-slate-100 dark:bg-zinc-800" />
              <div className="h-7.5 w-20 rounded-lg bg-slate-100 dark:bg-zinc-800" />
            </div>
          </div>
        ))
      ) : (
        categories.map((cat, index) => {
          const IconComponent = ICON_MAP[cat.icon] || FolderMinus;
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              whileHover={{ y: -3, scale: 1.005 }}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-xs transition-all duration-200 dark:border-zinc-900 dark:bg-zinc-950 hover:shadow-sm hover:border-slate-200 dark:hover:border-zinc-850 h-full"
            >
            <div>
              {/* Header: Icon & Badges */}
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-zinc-900 dark:text-zinc-500 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400 transition-colors border border-slate-100/40 dark:border-zinc-900/60 shadow-2xs">
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                      cat.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {highlightText(cat.name, searchQuery)}
                </h4>
                <p className="mt-1.5 text-xs text-slate-400 dark:text-zinc-500 leading-normal line-clamp-2">
                  {highlightText(cat.description, searchQuery)}
                </p>
              </div>

              {/* Warranty and Custom Attributes Info */}
              <div className="mt-4.5 space-y-2 border-t border-slate-100/60 pt-3.5 dark:border-zinc-900/40">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-400 dark:text-zinc-500">Global Fleet Count</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-zinc-200 bg-slate-100/50 px-1.5 py-0.5 rounded dark:bg-zinc-900">
                    {cat.assetCount} assets
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-400 dark:text-zinc-500">Warranty Protection</span>
                  {cat.warrantyEnabled ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{cat.defaultWarranty} Months</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 dark:text-zinc-500">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Disabled</span>
                    </span>
                  )}
                </div>

                {cat.customFields.length > 0 && (
                  <div className="mt-2 text-[10.5px]">
                    <span className="block text-slate-400 dark:text-zinc-500 font-semibold mb-1 uppercase tracking-wider text-[8px]">
                      Asset Schema Attributes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cat.customFields.map((field) => (
                        <span
                          key={field.name}
                          className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 font-medium text-slate-600 border border-slate-100 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800"
                        >
                          {field.name}
                          <span className="text-[8px] text-slate-400 ml-1">
                            ({field.type})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100/60 dark:border-zinc-900/40 flex items-center justify-end gap-1.5">
              <button
                onClick={() => onEdit(cat)}
                className="inline-flex h-7.5 items-center gap-1 rounded-lg border border-slate-100 hover:border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white transition-all dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                <Edit3 className="h-3 w-3 shrink-0" />
                <span>Configure</span>
              </button>
              
              <button
                onClick={() => onToggleStatus(cat.id)}
                className={`inline-flex h-7.5 items-center gap-1 rounded-lg px-2 text-xs font-semibold transition-all cursor-pointer ${
                  cat.status === 'Active'
                    ? 'hover:bg-rose-50 text-rose-600 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-400'
                    : 'hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400'
                }`}
                title={cat.status === 'Active' ? 'Deactivate Category' : 'Activate Category'}
              >
                {cat.status === 'Active' ? (
                  <>
                    <ToggleRight className="h-4.5 w-4.5 shrink-0" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4.5 w-4.5 shrink-0" />
                    <span>Activate</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      })
      )}
    </div>
  );
}
