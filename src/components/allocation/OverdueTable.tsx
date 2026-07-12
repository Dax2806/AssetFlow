import React from 'react';
import { Allocation } from './types';
import { Bell, Heart, ArrowUpDown, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

interface OverdueTableProps {
  allocations: Allocation[];
  onSendReminder: (id: string, name: string) => void;
}

export default function OverdueTable({ allocations, onSendReminder }: OverdueTableProps) {
  // Sort, filter states
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const overdueItems = React.useMemo(() => {
    return allocations.filter((a) => a.status === 'Overdue');
  }, [allocations]);

  const getDaysOverdue = (expectedDate: string) => {
    const returnDate = new Date(expectedDate);
    // Base time is July 12, 2026 based on the local time given (2026-07-12)
    const current = new Date('2026-07-12');
    const diffTime = current.getTime() - returnDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const sortedOverdue = React.useMemo(() => {
    return [...overdueItems].sort((a, b) => {
      return getDaysOverdue(b.expectedReturn) - getDaysOverdue(a.expectedReturn);
    });
  }, [overdueItems]);

  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedOverdue.slice(start, start + itemsPerPage);
  }, [sortedOverdue, currentPage]);

  const totalPages = Math.ceil(sortedOverdue.length / itemsPerPage) || 1;

  return (
    <div className="space-y-4 select-none">
      <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-4.5 dark:border-rose-950/20 dark:bg-rose-950/5 flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
          <AlertTriangle className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-rose-900 dark:text-rose-350 tracking-tight">
            Overdue Enforcement Required
          </h4>
          <p className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-400/70 leading-relaxed max-w-2xl">
            The items listed below have exceeded their expected lease periods. Dispatching a system reminder will trigger instant notifications, Slack channel webhooks, and flag their accounts for department-head intervention.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-zinc-900 dark:bg-zinc-950 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-900 dark:bg-zinc-950/60 dark:text-zinc-500">
                <th className="px-5 py-4">Asset Detail</th>
                <th className="px-5 py-4">Current Lease Holder</th>
                <th className="px-5 py-4">Department</th>
                <th className="px-5 py-4">Overdue Since</th>
                <th className="px-5 py-4">Lapsed Lease Period</th>
                <th className="px-5 py-4">Health score</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">All leases are currently in active compliance</p>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-550 mt-1">Excellent! No overdue leases detected across any operational pools.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const daysOverdue = getDaysOverdue(item.expectedReturn);
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/40 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      {/* Asset */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-450 transition-colors">
                            {item.assetName}
                          </span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="font-mono text-[9px] font-semibold bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-400 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                              {item.assetTag}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-550">
                              {item.assetCategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Holder */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center font-extrabold text-[10px] text-rose-700 dark:text-rose-400 uppercase select-none border border-rose-100/40 dark:border-rose-900/30">
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

                      {/* Overdue Since */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold font-mono text-slate-500 dark:text-zinc-400">
                          {item.expectedReturn}
                        </span>
                      </td>

                      {/* Lapsed Days */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40 animate-pulse">
                            {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
                          </span>
                        </div>
                      </td>

                      {/* Health */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-1.5">
                          <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md text-amber-500 bg-amber-500/10">
                            <Heart className="h-3 w-3 fill-current" />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                            {item.healthScore}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => onSendReminder(item.id, item.employeeName)}
                          className="inline-flex h-7.5 items-center space-x-1.5 rounded-lg bg-rose-600 px-3.5 text-[10.5px] font-bold text-white shadow-xs hover:bg-rose-700 active:scale-98 transition-all cursor-pointer"
                        >
                          <Bell className="h-3.5 w-3.5" />
                          <span>Dispatch Alert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-5 py-3 dark:border-zinc-900 dark:bg-zinc-950/40">
          <div className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedOverdue.length)} of {sortedOverdue.length} overdue leases
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
