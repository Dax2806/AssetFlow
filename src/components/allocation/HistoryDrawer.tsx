import React from 'react';
import AppDrawer from '../common/AppDrawer';
import { AllocationHistory } from './types';
import { INITIAL_HISTORIES } from './mockData';
import { Shield, Sparkles, User, RefreshCw, CornerUpLeft, PlusCircle } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
  assetName: string;
  assetTag: string;
  histories: AllocationHistory[];
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  assetId,
  assetName,
  assetTag,
  histories,
}: HistoryDrawerProps) {
  // Filter history records for this asset
  const filteredHistories = React.useMemo(() => {
    return histories
      .filter((h) => h.assetId === assetId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [histories, assetId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Registered':
        return <PlusCircle className="h-4 w-4 text-slate-500" />;
      case 'Allocated':
        return <User className="h-4 w-4 text-emerald-500" />;
      case 'Transferred':
        return <RefreshCw className="h-4 w-4 text-indigo-500" />;
      case 'Returned':
        return <CornerUpLeft className="h-4 w-4 text-amber-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-slate-500" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Registered':
        return 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400';
      case 'Allocated':
        return 'bg-emerald-50 border-emerald-150 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400';
      case 'Transferred':
        return 'bg-indigo-50 border-indigo-150 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400';
      case 'Returned':
        return 'bg-amber-50 border-amber-150 text-amber-850 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const footer = (
    <div className="flex justify-end w-full select-none">
      <button
        onClick={onClose}
        className="h-8 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
      >
        Close Audit logs
      </button>
    </div>
  );

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Asset Lease Lifecycle History"
      description="Trace complete audit trail and historical legal custody of high-value company assets."
      footer={footer}
    >
      <div className="space-y-6 select-none">
        
        {/* Summary Header */}
        <div className="p-4 rounded-xl border border-slate-150/50 bg-slate-50/20 dark:border-zinc-900 dark:bg-zinc-950/20 flex justify-between items-center text-xs">
          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-zinc-200">
              {assetName}
            </h4>
            <span className="font-mono text-[9px] font-bold bg-slate-100 dark:bg-zinc-900 text-slate-500 px-1.5 py-0.2 mt-1 rounded inline-block uppercase tracking-wider">
              {assetTag}
            </span>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Shield className="h-3 w-3 shrink-0" />
              <span>Verified Ledger</span>
            </span>
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l-2 border-slate-150 dark:border-zinc-800 pl-6 space-y-7 py-2.5">
          {filteredHistories.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs font-bold text-slate-400">No lifecycle history available.</p>
            </div>
          ) : (
            filteredHistories.map((hist) => (
              <div key={hist.id} className="relative text-xs">
                
                {/* Visual marker dot */}
                <div className="absolute -left-[32.5px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs dark:bg-zinc-950 dark:border-zinc-800 text-slate-650 dark:text-zinc-400">
                  {getIcon(hist.type)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex px-1.5 py-0.2 rounded text-[8.5px] font-bold uppercase tracking-wider border ${getBadgeStyle(hist.type)}`}>
                      {hist.type}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-zinc-500">
                      {hist.date}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium">
                      by {hist.user}
                    </span>
                  </div>

                  <p className="text-[11.5px] font-bold text-slate-800 dark:text-zinc-200 leading-relaxed">
                    {hist.description}
                  </p>

                  {hist.details && (
                    <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900/40 text-[10px] font-mono text-slate-500 dark:text-zinc-450 leading-relaxed">
                      {hist.details}
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </AppDrawer>
  );
}
