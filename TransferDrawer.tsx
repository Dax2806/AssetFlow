import React from 'react';
import { Allocation } from './types';
import StatusBadge from '../common/StatusBadge';
import { ArrowUpDown, History, CornerUpLeft, RefreshCcw, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface AllocationTableProps {
  allocations: Allocation[];
  searchQuery: string;
  departmentFilter: string;
  onOpenReturn: (allocation: Allocation) => void;
  onOpenHistory: (assetId: string, assetName: string, assetTag: string) => void;
  onOpenTransfer: (allocation: Allocation) => void;
  onTriggerToast?: (message: string) => void;
}

export default function AllocationTable({
  allocations,
  searchQuery,
  departmentFilter,
  onOpenReturn,
  onOpenHistory,
  onOpenTransfer,
  onTriggerToast,
}: AllocationTableProps) {
  // Sorting state
  const [sortField, setSortField] = React.useState<keyof Allocation>('allocatedSince');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  
  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Filter and Search
  const filtered = React.useMemo(() => {
    return allocations.filter((item) => {
      const matchQuery =
        item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDept = departmentFilter === 'All' || item.departmentName === departmentFilter;
      
      return matchQuery && matchDept;
    });
  }, [allocations, searchQuery, departmentFilter]);

  // Sort
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

  // Paginated
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;

  // Reset page on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, departmentFilter]);

  const handleSort = (field: keyof Allocation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginated.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10';
    if (score >= 75) return 'text-amber-500 bg-amber-500/10';
    return 'text-rose-500 bg-rose-500/10';
  };

  return (
    <div className="space-y-4">
      {/* Selection operations bar if rows are selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-950/40 dark:bg-emerald-950/10 select-none animate-fadeIn">
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-bold text-emerald-850 dark:text-emerald-450">
              {selectedIds.length} active allocation{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const msg = `Successfully sent urgent lease renewal alerts to ${selectedIds.length} custody holders.`;
                if (onTriggerToast) {
                  onTriggerToast(msg);
                } else {
                  console.log(msg);
                }
                setSelectedIds([]);
              }}
              className="h-7 rounded-lg bg-emerald-600 px-3 text-[10px] font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
            >
              Batch Send Reminders
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-zinc-900 dark:bg-zinc-950 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-900 dark:bg-zinc-950/60 dark:text-zinc-500 select-none">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.length === paginated.length}
                    onChange={handleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-4">
                  <button
                    onClick={() => handleSort('assetName')}
                    className="flex items-center space-x-1 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer font-bold"
                  >
                    <span>Asset</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </button>
                </th>
                <th className="px-5 py-4">
                  <button
                    onClick={() => handleSort('employeeName')}
                    className="flex items-center space-x-1 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer font-bold"
                  >
                    <span>Current Holder</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </button>
                </th>
                <th className="px-5 py-4">
                  <button
                    onClick={() => handleSort('departmentName')}
                    className="flex items-center space-x-1 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer font-bold"
                  >
                    <span>Department</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </button>
                </th>
                <th className="px-5 py-4">
                  <button
                    onClick={() => handleSort('allocatedSince')}
                    className="flex items-center space-x-1 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer font-bold"
                  >
                    <span>Allocated Since</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </button>
                </th>
                <th className="px-5 py-4">
                  <button
                    onClick={() => handleSort('expectedReturn')}
                    className="flex items-center space-x-1 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer font-bold"
                  >
                    <span>Expected Return</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </button>
                </th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Health</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">No active allocations found</p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Try adjusting your search query or department filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isOverdue = item.status === 'Overdue';
                  return (
                    <tr
                      key={item.id}
                      className={`group hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors ${
                        isSelected ? 'bg-emerald-50/15 dark:bg-emerald-950/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
                        />
                      </td>

                      {/* Asset Column */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.assetName}
                          </span>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span className="font-mono text-[9px] font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-500 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                              {item.assetTag}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-550">
                              {item.assetCategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Holder Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-zinc-900 flex items-center justify-center font-extrabold text-[10px] text-slate-600 dark:text-zinc-400 uppercase select-none border border-slate-150/40 dark:border-zinc-850">
                            {item.employeeName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-750 dark:text-zinc-300">
                              {item.employeeName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                          {item.departmentName}
                        </span>
                      </td>

                      {/* Allocated Since */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium font-mono text-slate-500 dark:text-zinc-400">
                          {item.allocatedSince}
                        </span>
                      </td>

                      {/* Expected Return */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold font-mono ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-zinc-400'}`}>
                          {item.expectedReturn}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Health */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-1.5">
                          <div className={`flex h-5.5 w-5.5 items-center justify-center rounded-md ${getHealthColor(item.healthScore)}`}>
                            <Heart className="h-3 w-3 fill-current" />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                            {item.healthScore}%
                          </span>
                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 select-none">
                          <button
                            onClick={() => onOpenTransfer(item)}
                            title="Request Transfer"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-550 hover:bg-slate-50 hover:text-emerald-600 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            <RefreshCcw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenReturn(item)}
                            title="Return Asset"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-550 hover:bg-slate-50 hover:text-amber-600 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <CornerUpLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenHistory(item.assetId, item.assetName, item.assetTag)}
                            title="View Allocation Timeline"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-550 hover:bg-slate-50 hover:text-slate-800 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                          >
                            <History className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-5 py-3 dark:border-zinc-900 dark:bg-zinc-950/40 select-none">
          <div className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length} allocations
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2.5 text-xs font-extrabold text-slate-600 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
