import React from 'react';
import AppDrawer from '../common/AppDrawer';
import { TransferRequest, AllocationHistory } from './types';
import { INITIAL_HISTORIES } from './mockData';
import { RefreshCw, User, HelpCircle, Calendar, ShieldCheck, CornerDownRight, ThumbsUp, ThumbsDown } from 'lucide-react';

interface TransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: TransferRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function TransferDrawer({
  isOpen,
  onClose,
  transfer,
  onApprove,
  onReject,
}: TransferDrawerProps) {
  if (!transfer) return null;

  const assetHistory = React.useMemo(() => {
    return INITIAL_HISTORIES.filter((h) => h.assetId === transfer.assetId);
  }, [transfer]);

  const footer = (
    <div className="flex justify-between items-center w-full select-none">
      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
        TX STATE: {transfer.status}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        {transfer.status === 'Requested' && (
          <>
            <button
              onClick={() => {
                onReject(transfer.id);
                onClose();
              }}
              className="h-8 inline-flex items-center space-x-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-3.5 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span>Reject Request</span>
            </button>
            <button
              onClick={() => {
                onApprove(transfer.id);
                onClose();
              }}
              className="h-8 inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Approve Transfer</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Transfer Review: TX-${transfer.id}`}
      description="Validate cross-departmental hardware transfers before asset reallocation takes effect."
      footer={footer}
    >
      <div className="space-y-6 select-none">
        
        {/* Routing Flow Header */}
        <div className="rounded-2xl border border-slate-150/60 bg-slate-50/40 p-5 dark:border-zinc-900 dark:bg-zinc-950/20 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
            Transfer Route Mapping
          </h4>
          
          <div className="flex items-center justify-between gap-3 text-xs">
            {/* Sender */}
            <div className="flex flex-col flex-1 p-3.5 rounded-xl border border-slate-100 bg-white dark:border-zinc-900 dark:bg-zinc-950 space-y-1.5">
              <span className="text-[8.5px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                Source Lease Holder
              </span>
              <p className="font-bold text-slate-800 dark:text-zinc-200 truncate">
                {transfer.currentHolderName}
              </p>
              <span className="text-[10px] font-semibold text-slate-500">
                Dept: {transfer.currentHolderDept}
              </span>
            </div>

            {/* Indicator */}
            <div className="flex flex-col items-center justify-center text-emerald-600 animate-pulse shrink-0">
              <CornerDownRight className="h-5 w-5 rotate-[-45deg]" />
              <span className="text-[8px] font-extrabold uppercase tracking-widest mt-0.5 text-emerald-600">Route</span>
            </div>

            {/* Recipient */}
            <div className="flex flex-col flex-1 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/15 dark:border-emerald-950/40 dark:bg-emerald-950/10 space-y-1.5">
              <span className="text-[8.5px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                Recipient Holder
              </span>
              <p className="font-bold text-emerald-900 dark:text-emerald-300 truncate">
                {transfer.requestedByName}
              </p>
              <span className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-450">
                Dept: {transfer.requestedByDept}
              </span>
            </div>
          </div>
        </div>

        {/* Request Information */}
        <div className="space-y-4.5">
          <h4 className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
            Lease & Transfer specifications
          </h4>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 p-3 rounded-xl border border-slate-150/45 dark:border-zinc-900">
              <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Asset Item</span>
              <p className="font-bold text-slate-850 dark:text-zinc-200">
                {transfer.assetName}
              </p>
              <span className="font-mono text-[9px] font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-550 px-1.5 py-0.2 rounded uppercase tracking-wider inline-block mt-1">
                {transfer.assetTag}
              </span>
            </div>

            <div className="space-y-1 p-3 rounded-xl border border-slate-150/45 dark:border-zinc-900">
              <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Priority Clearance</span>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 mt-1 text-[9px] font-bold border rounded uppercase tracking-wider ${
                  transfer.priority === 'Critical' || transfer.priority === 'High'
                    ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                }`}>
                  {transfer.priority} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5 p-4 rounded-xl border border-slate-150/45 bg-slate-50/15 dark:border-zinc-900">
            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Transfer Rationale</span>
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed italic">
              "{transfer.reason || 'No additional rationale provided.'}"
            </p>
          </div>
        </div>

        {/* Asset History Audit list */}
        <div className="space-y-3">
          <h4 className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
            Asset Lease Timeline Audit
          </h4>
          
          <div className="space-y-3.5 border-l-2 border-slate-100 dark:border-zinc-900 pl-4.5 py-1">
            {assetHistory.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No historical allocations recorded for this asset yet.</p>
            ) : (
              assetHistory.map((hist) => (
                <div key={hist.id} className="relative text-xs">
                  <div className="absolute -left-[24.5px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-950" />
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-800 dark:text-zinc-200">
                        {hist.type}
                      </span>
                      <span className="font-mono text-[9px] font-semibold text-slate-400 dark:text-zinc-500">
                        {hist.date}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {hist.description}
                    </p>
                    {hist.details && (
                      <p className="text-[9.5px] font-mono text-slate-405 dark:text-zinc-550 italic leading-snug">
                        {hist.details}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AppDrawer>
  );
}
