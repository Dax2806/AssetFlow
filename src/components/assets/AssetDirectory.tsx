import React from 'react';
import { 
  LayoutGrid, List, Search, Filter, Plus, Compass, Sparkles, 
  Database, RefreshCw, X, ShieldAlert, CheckCircle, TrendingUp, Cpu, HelpCircle 
} from 'lucide-react';
import { Asset, AssetCategory, AssetStatus } from '../../types';
import AssetTable from './AssetTable';
import AssetGrid from './AssetGrid';
import AssetDrawer from './AssetDrawer';
import EmptyState from '../common/EmptyState';

interface AssetDirectoryProps {
  assets: Asset[];
  isLoading: boolean;
  onOpenRegister: () => void;
  onOpenDetail: (asset: Asset) => void;
  onSaveAsset: (asset: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
  onBulkStatusChange?: (ids: string[], status: any) => void;
  // State from parent to trigger drawer opening
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  selectedAssetForEdit: Asset | null;
  setSelectedAssetForEdit: (asset: Asset | null) => void;
}

export default function AssetDirectory({
  assets,
  isLoading,
  onOpenRegister,
  onOpenDetail,
  onSaveAsset,
  onDeleteAsset,
  onBulkStatusChange,
  isRegisterOpen,
  setIsRegisterOpen,
  selectedAssetForEdit,
  setSelectedAssetForEdit,
}: AssetDirectoryProps) {
  // Views
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [conditionFilter, setConditionFilter] = React.useState<string>('all');

  // Drawer handling
  const [drawerMode, setDrawerMode] = React.useState<'create' | 'edit'>('create');

  React.useEffect(() => {
    if (selectedAssetForEdit) {
      setDrawerMode('edit');
      setIsRegisterOpen(true);
    } else {
      setDrawerMode('create');
    }
  }, [selectedAssetForEdit, setIsRegisterOpen]);

  // Compute live KPI summaries from the active assets pool
  const kpis = React.useMemo(() => {
    const totalCount = assets.length;
    const available = assets.filter(a => a.status === 'available').length;
    const allocated = assets.filter(a => a.status === 'allocated').length;
    const maintenance = assets.filter(a => a.status === 'maintenance').length;
    const lost = assets.filter(a => a.status === 'lost').length;
    
    // Total cost/valuation sum
    const totalValuation = assets.reduce((sum, item) => sum + (item.purchaseCost || item.value || 0), 0);

    return { totalCount, available, allocated, maintenance, lost, totalValuation };
  }, [assets]);

  // Handle advanced multiple field searching & filters
  const filteredAssets = React.useMemo(() => {
    return assets.filter(asset => {
      // 1. Search Query mapping
      const normalizedSearch = searchQuery.toLowerCase().trim();
      const matchesSearch = !normalizedSearch || 
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.tag.toLowerCase().includes(normalizedSearch) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(normalizedSearch)) ||
        (asset.manufacturer && asset.manufacturer.toLowerCase().includes(normalizedSearch)) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(normalizedSearch)) ||
        (asset.department && asset.department.toLowerCase().includes(normalizedSearch));

      // 2. Category Filter
      const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;

      // 3. Status Filter
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

      // 4. Condition Filter
      const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
    });
  }, [assets, searchQuery, categoryFilter, statusFilter, conditionFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setConditionFilter('all');
  };

  const handleOpenRegister = () => {
    setSelectedAssetForEdit(null);
    setDrawerMode('create');
    setIsRegisterOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Asset Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Audit, track and analyze your physical resource ecosystem across all corporate locations in real-time.
          </p>
        </div>

        <button
          onClick={handleOpenRegister}
          className="h-9 inline-flex items-center space-x-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer select-none"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        
        {/* KPI: Total Assets */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Total Registered</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-lg font-bold text-slate-800 dark:text-zinc-200">{isLoading ? '...' : kpis.totalCount}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">units</span>
          </div>
        </div>

        {/* KPI: Total Valuation */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Assets Valuation</p>
          <div className="flex items-baseline space-x-0.5 mt-1">
            <span className="text-lg font-bold text-slate-800 dark:text-zinc-200">
              {isLoading ? '...' : `$${Math.round(kpis.totalValuation / 1000)}k`}
            </span>
            <span className="text-[9.5px] font-mono text-slate-400 dark:text-zinc-500">USD</span>
          </div>
        </div>

        {/* KPI: Available */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">Available Pool</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-lg font-bold text-slate-800 dark:text-zinc-200">{isLoading ? '...' : kpis.available}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">active</span>
          </div>
        </div>

        {/* KPI: Allocated */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-[10.5px] font-bold text-sky-600 dark:text-sky-550 uppercase tracking-wide">Allocated Duty</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-lg font-bold text-slate-800 dark:text-zinc-200">{isLoading ? '...' : kpis.allocated}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">deployed</span>
          </div>
        </div>

        {/* KPI: Maintenance */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-[10.5px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-wide">Maintenance</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-lg font-bold text-slate-800 dark:text-zinc-200">{isLoading ? '...' : kpis.maintenance}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">in shop</span>
          </div>
        </div>

        {/* KPI: Lost */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900 dark:bg-zinc-950">
          <p className="text-[10.5px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">Lost/Disposed</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-lg font-bold text-slate-800 dark:text-zinc-200">{isLoading ? '...' : kpis.lost}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">lost</span>
          </div>
        </div>

      </div>

      {/* Smart Insight Card - Asset Intelligence unique element */}
      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4.5 dark:border-zinc-850 dark:bg-zinc-900/30 flex flex-col sm:flex-row items-start gap-4.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-violet-950 dark:text-violet-300 flex items-center gap-1.5 uppercase tracking-wide">
            <span>AssetFlow Intelligence Insight</span>
            <span className="rounded-full bg-violet-200/50 dark:bg-violet-950/70 px-2 py-0.5 text-[8.5px] font-bold text-violet-700 dark:text-violet-400">
              ML recommendation
            </span>
          </h4>
          <p className="text-[11.5px] text-violet-900/85 dark:text-zinc-300 leading-relaxed max-w-4xl">
            Auto-depreciation scan indicates that <strong>IT Hardware units</strong> registered in late 2025 have depreciated by an average of <strong>24.5%</strong>. 
            Two devices (including Apple devices under warranty soon) should be verified through the self-audit portal in the next 15 days to guarantee insurance compliance.
          </p>
        </div>
      </div>

      {/* Advanced Filter, View, & Search Controller bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 bg-slate-50 dark:bg-zinc-900/35 border border-slate-200/85 dark:border-zinc-900 p-3 rounded-xl">
        
        {/* Search input field with keyboard shortcut hints */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by tag, name, serial or assignee..."
            className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-9.5 pr-12 text-xs text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Filter Pack */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Filter Category */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 px-2.5 h-8.5 text-xs text-slate-600 dark:text-zinc-300">
            <Filter className="h-3 w-3 text-slate-450" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-0 outline-none pr-2 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="IT Hardware">IT Hardware</option>
              <option value="Facilities">Facilities</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Office Equipment">Office Equipment</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 px-2.5 h-8.5 text-xs text-slate-600 dark:text-zinc-300">
            <Database className="h-3 w-3 text-slate-450" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-0 outline-none pr-2 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Filter Condition */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 px-2.5 h-8.5 text-xs text-slate-600 dark:text-zinc-300">
            <Compass className="h-3 w-3 text-slate-450" />
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="bg-transparent border-0 outline-none pr-2 font-medium"
            >
              <option value="all">All Conditions</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          {/* Reset Filters Shortcut */}
          {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || conditionFilter !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="inline-flex h-8.5 items-center gap-1 text-[11px] font-bold text-rose-650 hover:text-rose-700 transition-colors bg-white border border-rose-100 rounded-lg px-2.5 dark:bg-zinc-900/40 dark:border-rose-950/40 cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}

          {/* View Mode Toggle Button */}
          <div className="h-8.5 w-px bg-slate-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          <div className="flex items-center bg-white dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 p-0.5 shrink-0 select-none">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-100 text-slate-800 dark:bg-zinc-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table view"
            >
              <List className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-800 dark:bg-zinc-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid bento view"
            >
              <LayoutGrid className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Container Views conditional render */}
      <div className="relative">
        {viewMode === 'table' ? (
          <AssetTable
            assets={filteredAssets}
            isLoading={isLoading}
            onOpenDetail={onOpenDetail}
            onOpenEdit={(asset) => {
              setSelectedAssetForEdit(asset);
              setDrawerMode('edit');
              setIsRegisterOpen(true);
            }}
            onDelete={onDeleteAsset}
            onBulkStatusChange={onBulkStatusChange}
          />
        ) : (
          <AssetGrid
            assets={filteredAssets}
            isLoading={isLoading}
            onOpenDetail={onOpenDetail}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>

      {/* Slide-over Asset register / Edit Drawer component */}
      <AssetDrawer
        isOpen={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false);
          setSelectedAssetForEdit(null);
        }}
        onSave={(data) => {
          onSaveAsset(data);
          setIsRegisterOpen(false);
          setSelectedAssetForEdit(null);
        }}
        mode={drawerMode}
        asset={selectedAssetForEdit}
      />

    </div>
  );
}
