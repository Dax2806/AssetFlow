import React from 'react';
import { 
  ClipboardCheck, PlusCircle, Search, RefreshCw, 
  CheckCircle2, AlertCircle, PlayCircle, ArrowUpRight,
  ShieldCheck, Calendar
} from 'lucide-react';
import { Audit } from './common/UniversalDrawer';
import { Asset } from '../types';

interface AuditPageProps {
  audits: Audit[];
  assets: Asset[];
  onOpenAudit: (id: string) => void;
  onInitiateAudit: () => void;
}

export default function AuditPage({ audits, assets, onOpenAudit, onInitiateAudit }: AuditPageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Get total mapped assets in a location
  const getLocationAssetCount = (location: string) => {
    return assets.filter(a => 
      a.location.toLowerCase().includes(location.toLowerCase()) || 
      (location === 'Remote Workforce' && a.location.toLowerCase().includes('remote'))
    ).length;
  };

  // Filtered Audits
  const filteredAudits = React.useMemo(() => {
    return audits.filter(a => {
      const matchesSearch = 
        a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.auditorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [audits, searchQuery, statusFilter]);

  // KPIs
  const kpis = React.useMemo(() => {
    const total = audits.length;
    const inProgress = audits.filter(a => a.status === 'In Progress').length;
    const completed = audits.filter(a => a.status === 'Completed').length;
    
    // Total reviewed across all active/closed audits
    const totalReviewed = audits.reduce((sum, a) => sum + a.reviewedAssetIds.length, 0);

    return [
      { title: 'Total Audits Run', value: total, icon: ClipboardCheck, type: 'info' as const },
      { title: 'In Progress Reconciliation', value: inProgress, icon: AlertCircle, type: 'warning' as const },
      { title: 'Compliance Completed', value: completed, icon: ShieldCheck, type: 'positive' as const },
      { title: 'Physical Reconciled Items', value: totalReviewed, icon: CheckCircle2, type: 'positive' as const }
    ];
  }, [audits]);

  return (
    <div className="w-full px-6 py-8 md:px-8 space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-150/80 pb-5 dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 uppercase dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
              Operations & Compliance
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
            Asset Inventory Audits
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">
            Verify high-value hardware physical presence, run compliance reports, and manage reconciliation logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-98 transition-all dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            title="Refresh Audits Feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={onInitiateAudit}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Initiate Location Audit</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="rounded-xl border border-slate-150/70 bg-white p-5 hover:shadow-sm transition-all dark:border-zinc-900 dark:bg-zinc-950/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-1.5 rounded-lg ${
                  kpi.type === 'positive' 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                    : kpi.type === 'warning'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-450'
                      : 'bg-slate-50 text-slate-600 dark:bg-zinc-900 dark:text-zinc-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none">
                  {kpi.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Table Controls */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-550" />
            <input
              type="text"
              placeholder="Search by location, lead auditor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9.5 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none hover:border-slate-350 hover:bg-slate-50/50 focus:border-emerald-500 focus:bg-white dark:border-zinc-850 dark:bg-zinc-900/40 dark:text-zinc-200 dark:placeholder-zinc-500 dark:focus:bg-zinc-950 transition-all"
            />
          </div>

          {/* Tab Filter buttons */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 sm:border-0 sm:pb-0">
            {['All', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                  statusFilter === tab
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-zinc-900/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>

        {/* Audit Cards Grid */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filteredAudits.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-xl dark:border-zinc-850">
              <ClipboardCheck className="h-10 w-10 text-slate-300 dark:text-zinc-700" />
              <h3 className="mt-3 text-xs font-bold text-slate-800 dark:text-zinc-200">No Audits Found</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1 dark:text-zinc-500">
                Adjust your search or filter settings, or launch a brand new physical audit reconciliation event.
              </p>
            </div>
          ) : (
            filteredAudits.map((audit) => {
              const totalAssets = getLocationAssetCount(audit.location);
              const reviewedCount = audit.reviewedAssetIds.length;
              const percent = totalAssets > 0 ? Math.round((reviewedCount / totalAssets) * 100) : 100;
              const isDone = audit.status === 'Completed';

              return (
                <div 
                  key={audit.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-slate-150 bg-slate-50/45 p-5 hover:border-slate-300 hover:shadow-xs transition-all dark:border-zinc-900 dark:bg-zinc-900/10 dark:hover:border-zinc-800"
                >
                  <div>
                    {/* Badge and Status */}
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                        isDone 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' 
                          : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900'
                      }`}>
                        {audit.status}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                        <Calendar className="h-3 w-3" />
                        {audit.startDate}
                      </span>
                    </div>

                    {/* Location Name & Auditor */}
                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {audit.location}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 dark:text-zinc-400">
                        Authorized Lead: <span className="font-semibold text-slate-700 dark:text-zinc-300">{audit.auditorName}</span>
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-slate-400 dark:text-zinc-500">Reconciliation Progress</span>
                        <span className="text-slate-700 dark:text-zinc-300">{reviewedCount} / {totalAssets} verified ({percent}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-zinc-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Notes summary */}
                    {audit.notes && (
                      <p className="mt-3.5 text-[10.5px] leading-relaxed text-slate-500 italic border-l-2 border-slate-200 pl-2.5 dark:text-zinc-400 dark:border-zinc-800">
                        "{audit.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between dark:border-zinc-900">
                    <span className="text-[10px] font-semibold text-slate-450 dark:text-zinc-500">
                      ID: {audit.id}
                    </span>
                    
                    <button
                      onClick={() => onOpenAudit(audit.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer group/btn"
                    >
                      <span>{isDone ? 'View Ledger Audit' : 'Resume Reconciliation'}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
