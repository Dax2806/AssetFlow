import React from 'react';
import { TransferRequest, TransferPriority, TransferStatus } from './types';
import { Check, X, Eye, FileText, ArrowRight, CornerRightDown, AlertCircle } from 'lucide-react';

interface TransferKanbanProps {
  transfers: TransferRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (transfer: TransferRequest) => void;
}

export default function TransferKanban({ transfers, onApprove, onReject, onView }: TransferKanbanProps) {
  const columns: { status: TransferStatus; label: string; accent: string; bg: string; dot: string }[] = [
    { status: 'Requested', label: 'Requested', accent: 'border-slate-200 dark:border-zinc-800', bg: 'bg-slate-50/50 dark:bg-zinc-950/20', dot: 'bg-amber-500' },
    { status: 'Approved', label: 'Approved', accent: 'border-emerald-100 dark:border-emerald-950/50', bg: 'bg-emerald-50/10 dark:bg-emerald-950/10', dot: 'bg-emerald-500' },
    { status: 'Rejected', label: 'Rejected', accent: 'border-rose-100 dark:border-rose-950/50', bg: 'bg-rose-50/10 dark:bg-rose-950/10', dot: 'bg-rose-500' },
    { status: 'Completed', label: 'Completed', accent: 'border-indigo-100 dark:border-indigo-950/50', bg: 'bg-indigo-50/10 dark:bg-indigo-950/10', dot: 'bg-indigo-500' },
  ];

  const getPriorityColor = (priority: TransferPriority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/30';
      case 'Medium': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 select-none">
      {columns.map((col) => {
        const filteredTransfers = transfers.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className={`rounded-2xl border ${col.accent} ${col.bg} p-4 flex flex-col min-h-[500px] transition-all`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-150/60 dark:border-zinc-900 mb-4 shrink-0">
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <h4 className="text-xs font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase">
                  {col.label}
                </h4>
              </div>
              <span className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-[10.5px] font-extrabold text-slate-600 dark:text-zinc-400 border border-slate-150/40 dark:border-zinc-850 px-1.5">
                {filteredTransfers.length}
              </span>
            </div>

            {/* Kanban Body (Cards stack) */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[550px] pr-1.5 scrollbar-thin">
              {filteredTransfers.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-slate-200 dark:border-zinc-900 rounded-xl bg-slate-50/10 dark:bg-zinc-950/5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Empty stage</span>
                </div>
              ) : (
                filteredTransfers.map((req) => (
                  <div
                    key={req.id}
                    className="group bg-white dark:bg-zinc-950 border border-slate-200/90 hover:border-slate-350 dark:border-zinc-900 dark:hover:border-zinc-800 p-4 rounded-xl hover:shadow-xs transition-all duration-150 relative flex flex-col justify-between"
                  >
                    {/* Header: Priority & ID */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8.5px] font-bold border uppercase tracking-widest ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                      <span className="font-mono text-[9px] font-semibold text-slate-400 dark:text-zinc-550">
                        REQ-{req.id}
                      </span>
                    </div>

                    {/* Asset Name and Tag */}
                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-150 leading-tight">
                        {req.assetName}
                      </p>
                      <span className="inline-block mt-1 font-mono text-[8.5px] font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-500 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                        {req.assetTag}
                      </span>
                    </div>

                    {/* Flow: Current -> Requested */}
                    <div className="p-2 bg-slate-50/50 dark:bg-zinc-900/30 rounded-lg border border-slate-100 dark:border-zinc-900/40 space-y-1.5 mb-3 text-[10.5px]">
                      <div className="flex items-center justify-between text-slate-500 dark:text-zinc-450 font-medium">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Current</span>
                        <span className="truncate max-w-[120px] font-semibold text-slate-700 dark:text-zinc-300">
                          {req.currentHolderName}
                        </span>
                      </div>
                      <div className="flex justify-center text-slate-300 dark:text-zinc-800">
                        <CornerRightDown className="h-3 w-3 shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-slate-500 dark:text-zinc-450 font-medium">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Recipient</span>
                        <span className="truncate max-w-[120px] font-semibold text-slate-800 dark:text-emerald-400">
                          {req.requestedByName}
                        </span>
                      </div>
                    </div>

                    {/* Reason snippet */}
                    {req.reason && (
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic truncate mb-4.5">
                        "{req.reason}"
                      </p>
                    )}

                    {/* Footer: Date & Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-zinc-900 mt-2">
                      <span className="text-[9px] font-bold font-mono text-slate-400 dark:text-zinc-550">
                        {req.requestedDate}
                      </span>
                      
                      <div className="flex items-center gap-1 select-none">
                        <button
                          onClick={() => onView(req)}
                          title="View Details"
                          className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-550 hover:bg-slate-50 hover:text-slate-850 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        
                        {req.status === 'Requested' && (
                          <>
                            <button
                              onClick={() => onReject(req.id)}
                              title="Reject Transfer"
                              className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-rose-100 bg-rose-50/20 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-950/25 dark:bg-rose-950/10 dark:text-rose-455 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onApprove(req.id)}
                              title="Approve Transfer"
                              className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-950/25 dark:bg-emerald-950/10 dark:text-emerald-450 cursor-pointer animate-pulse"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
