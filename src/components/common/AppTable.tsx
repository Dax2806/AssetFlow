import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StatusBadge from './StatusBadge';

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface AppTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  idField?: keyof T;
  isLoading?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  bulkActions?: React.ReactNode;
}

export default function AppTable<T extends { id?: string; [key: string]: any }>({
  columns,
  data,
  idField = 'id',
  isLoading = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  sortKey,
  sortDirection,
  onSort,
  pagination,
  bulkActions,
}: AppTableProps<T>) {
  const getRowId = (item: T): string => {
    return String(item[idField] || item.id || '');
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-900 overflow-hidden shadow-2xs">
      {/* Bulk Action Bar shown only when records are selected */}
      <AnimatePresence>
        {selectedIds.length > 0 && bulkActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 px-6 py-3 flex items-center justify-between select-none"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              {bulkActions}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-zinc-400">
          {/* Sticky Header */}
          <thead className="bg-slate-50/70 dark:bg-zinc-900/35 border-b border-slate-200/80 dark:border-zinc-900 text-[10.5px] uppercase font-bold text-slate-400 dark:text-zinc-550 select-none sticky top-0 z-10">
            <tr>
              {/* Checkbox column */}
              {onSelectRow && onSelectAll && (
                <th className="px-6 py-3.5 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-slate-300 dark:border-zinc-800 text-emerald-600 focus:ring-emerald-500 cursor-pointer h-3.5 w-3.5"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3.5 tracking-wider ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  } ${col.sortable && onSort ? 'cursor-pointer hover:text-slate-700 dark:hover:text-zinc-300 transition-colors' : ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.label}</span>
                    {col.sortable && onSort && (
                      <span className="text-slate-350 dark:text-zinc-650">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {onSelectRow && onSelectAll && (
                    <td className="px-6 py-4.5 text-center">
                      <div className="h-3.5 w-3.5 mx-auto bg-slate-100 dark:bg-zinc-900 rounded" />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td key={col.key} className="px-6 py-4.5">
                      <div className={`h-3 bg-slate-100 dark:bg-zinc-900 rounded ${cIdx === 0 ? 'w-2/3' : 'w-1/2'}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-350 mb-3 border border-slate-100 dark:border-zinc-850">
                      <Inbox className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">No results found</p>
                    <p className="text-[11px] text-slate-450 dark:text-zinc-500 mt-1">
                      Adjust your queries or filters to explore alternative workspace asset classes.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rIdx) => {
                const id = getRowId(item);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id || rIdx}
                    className={`group hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors duration-150 ${
                      isSelected ? 'bg-emerald-50/20 dark:bg-emerald-950/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    {onSelectRow && onSelectAll && (
                      <td className="px-6 py-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow(id, e.target.checked)}
                          className="rounded border-slate-300 dark:border-zinc-800 text-emerald-600 focus:ring-emerald-500 cursor-pointer h-3.5 w-3.5"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-6 py-4 text-[11.5px] text-slate-700 dark:text-zinc-350 ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? (
                          col.render(item)
                        ) : col.key === 'status' ? (
                          <StatusBadge status={item[col.key]} />
                        ) : (
                          <span className="font-medium truncate block max-w-[240px]">
                            {item[col.key] !== undefined && item[col.key] !== null ? String(item[col.key]) : '—'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && (
        <div className="bg-slate-50/30 dark:bg-zinc-950/20 border-t border-slate-200/80 dark:border-zinc-900 px-6 py-3 flex items-center justify-between text-xs text-slate-550 select-none">
          <div>
            Showing <span className="font-bold text-slate-700 dark:text-zinc-300">{data.length}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="h-8 w-8 rounded-lg border border-slate-200 dark:border-zinc-850 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-zinc-900 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="h-8 w-8 rounded-lg border border-slate-200 dark:border-zinc-850 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-zinc-900 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
