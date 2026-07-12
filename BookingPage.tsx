import React from 'react';
import { Asset } from '../../types';
import { 
  ArrowUpDown, MoreHorizontal, Eye, Edit2, ShieldAlert, CheckSquare, 
  Square, FileDown, Trash2, Heart, AlertTriangle, Hammer, CheckCircle
} from 'lucide-react';
import { SkeletonTable } from './SkeletonState';

interface AssetTableProps {
  assets: Asset[];
  isLoading: boolean;
  onOpenDetail: (asset: Asset) => void;
  onOpenEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onBulkStatusChange?: (ids: string[], status: any) => void;
}

type SortField = 'tag' | 'name' | 'value' | 'healthScore' | 'purchaseDate';
type SortOrder = 'asc' | 'desc';

export default function AssetTable({ 
  assets, 
  isLoading, 
  onOpenDetail, 
  onOpenEdit, 
  onDelete,
  onBulkStatusChange 
}: AssetTableProps) {
  // Sort and Selection state
  const [sortField, setSortField] = React.useState<SortField>('tag');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [showActionMenuId, setShowActionMenuId] = React.useState<string | null>(null);

  // Sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedAssets = React.useMemo(() => {
    return [...assets].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Safe defaults
      if (sortField === 'healthScore') {
        aVal = a.healthScore ?? 90;
        bVal = b.healthScore ?? 90;
      } else if (sortField === 'value') {
        aVal = a.purchaseCost ?? a.value ?? 0;
        bVal = b.purchaseCost ?? b.value ?? 0;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      } else {
        return sortOrder === 'asc' 
          ? (aVal as number) - (bVal as number) 
          : (bVal as number) - (aVal as number);
      }
    });
  }, [assets, sortField, sortOrder]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === assets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map(a => a.id));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Status Style Builders
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        );
      case 'allocated':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10.5px] font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-450 border border-sky-200/50 dark:border-sky-850/45">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Allocated
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-850/45">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" />
            Reserved
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10.5px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Maintenance
          </span>
        );
      case 'lost':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10.5px] font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-850/50">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
            Lost
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-700">
            Unknown
          </span>
        );
    }
  };

  const getConditionStyle = (cond?: string) => {
    switch (cond) {
      case 'New':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30';
      case 'Good':
        return 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30';
      case 'Fair':
        return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
      case 'Poor':
        return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  };

  // Helper to colorize Health Scores
  const getHealthBarColor = (score?: number) => {
    const s = score ?? 90;
    if (s >= 90) return 'bg-emerald-500';
    if (s >= 75) return 'bg-sky-400';
    if (s >= 50) return 'bg-amber-450';
    return 'bg-rose-500';
  };

  // Simulated export
  const handleExportCSV = () => {
    const selectedAssets = assets.filter(a => selectedIds.includes(a.id));
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Asset Tag,Asset Name,Category,Status,Location,Cost"].join(",") + "\n"
      + selectedAssets.map(a => `${a.tag},"${a.name}",${a.category},${a.status},"${a.location}",$${a.value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AssetFlow_Export_Selected.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <SkeletonTable rows={7} />;
  }

  const defaultImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="relative">
      
      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-16 z-30 mb-4 flex w-full items-center justify-between rounded-xl border border-emerald-200/85 bg-emerald-50/95 px-5 py-3 shadow-md backdrop-blur-md dark:border-emerald-900/60 dark:bg-emerald-950/90 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center space-x-3 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckSquare className="h-4.5 w-4.5 text-emerald-600" />
            <span>Selected {selectedIds.length} of {assets.length} Assets</span>
          </div>
          
          <div className="flex items-center space-x-2.5">
            {onBulkStatusChange && (
              <>
                <button
                  onClick={() => {
                    onBulkStatusChange(selectedIds, 'maintenance');
                    setSelectedIds([]);
                  }}
                  className="inline-flex h-8 items-center space-x-1.5 rounded-lg bg-white border border-emerald-200 px-3 text-[11.5px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-800"
                >
                  <Hammer className="h-3.5 w-3.5" />
                  <span>Send to Maintenance</span>
                </button>
                <button
                  onClick={() => {
                    onBulkStatusChange(selectedIds, 'available');
                    setSelectedIds([]);
                  }}
                  className="inline-flex h-8 items-center space-x-1.5 rounded-lg bg-white border border-emerald-200 px-3 text-[11.5px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-800"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Mark Available</span>
                </button>
              </>
            )}
            
            <button
              onClick={handleExportCSV}
              className="inline-flex h-8 items-center space-x-1.5 rounded-lg bg-white border border-emerald-200 px-3 text-[11.5px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-800"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            <div className="h-4.5 w-px bg-emerald-200 dark:bg-emerald-800" />

            <button
              onClick={() => {
                if(confirm(`Confirm deleting ${selectedIds.length} assets?`)) {
                  selectedIds.forEach(id => onDelete(id));
                  setSelectedIds([]);
                }
              }}
              className="inline-flex h-8 items-center space-x-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 text-[11.5px] font-bold text-white transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Decommission</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Layout */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-zinc-900 dark:bg-zinc-950">
        <table className="w-full border-collapse text-left">
          
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
            <tr>
              {/* Checkbox Column */}
              <th className="w-12 py-3 px-4.5">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {selectedIds.length === assets.length && assets.length > 0 ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>

              {/* Asset Identity Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none min-w-[220px]">
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Asset Profile</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </button>
              </th>

              {/* Asset Tag Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none">
                <button
                  type="button"
                  onClick={() => handleSort('tag')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Tag ID</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </button>
              </th>

              {/* Status Badge Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none">
                Status
              </th>

              {/* Location Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none">
                Location
              </th>

              {/* Ownership & Department Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none">
                Department & Assignee
              </th>

              {/* Condition Badge Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none">
                Condition
              </th>

              {/* Value Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none text-right">
                <button
                  type="button"
                  onClick={() => handleSort('value')}
                  className="flex items-center gap-1 ml-auto hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Book Value</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>

              {/* Health Score Column */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 select-none min-w-[120px]">
                <button
                  type="button"
                  onClick={() => handleSort('healthScore')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Health Index</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>

              {/* Context Actions Trigger */}
              <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400 text-center w-14">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/60">
            {sortedAssets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              const assetImg = asset.images && asset.images.length > 0 ? asset.images[0] : defaultImage;
              const assetVal = asset.purchaseCost || asset.value || 0;

              return (
                <tr 
                  key={asset.id}
                  onClick={() => onOpenDetail(asset)}
                  className={`group/row hover:bg-slate-50/50 dark:hover:bg-zinc-900/35 transition-colors cursor-pointer ${
                    isSelected ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                  }`}
                >
                  {/* Select Checkbox Cell */}
                  <td className="p-4 px-4.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleSelectRow(asset.id, e)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>

                  {/* Identity Profile Cell */}
                  <td className="p-4 py-3 px-4">
                    <div className="flex items-center space-x-3 max-w-[240px]">
                      <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100">
                        <img src={assetImg} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate group-hover/row:text-emerald-600 dark:group-hover/row:text-emerald-450 transition-colors">
                          {asset.name}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                          {asset.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tag ID Cell */}
                  <td className="p-4 py-3 px-4 font-mono text-xs text-slate-500 dark:text-zinc-400">
                    {asset.tag}
                  </td>

                  {/* Status Badge Cell */}
                  <td className="p-4 py-3 px-4">
                    {getStatusBadge(asset.status)}
                  </td>

                  {/* Location Cell */}
                  <td className="p-4 py-3 px-4 text-xs text-slate-600 dark:text-zinc-350 truncate max-w-[150px]">
                    {asset.location}
                  </td>

                  {/* Department & Assignee Cell */}
                  <td className="p-4 py-3 px-4">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate">
                        {asset.assignedTo || <span className="text-slate-400 dark:text-zinc-600 italic">Central Vault</span>}
                      </div>
                      <div className="text-[9.5px] text-slate-400 dark:text-zinc-500 truncate">
                        {asset.department || 'Operations'}
                      </div>
                    </div>
                  </td>

                  {/* Condition Badge Cell */}
                  <td className="p-4 py-3 px-4">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${getConditionStyle(asset.condition)}`}>
                      {asset.condition || 'Good'}
                    </span>
                  </td>

                  {/* Cost Value Cell */}
                  <td className="p-4 py-3 px-4 text-xs font-bold text-slate-800 dark:text-zinc-200 text-right font-mono">
                    ${assetVal.toLocaleString()}
                  </td>

                  {/* Health score mini-indicator */}
                  <td className="p-4 py-3 px-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-slate-700 dark:text-zinc-300">{asset.healthScore ?? 92}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-900 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getHealthBarColor(asset.healthScore)}`} 
                          style={{ width: `${asset.healthScore ?? 92}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Context Actions Trigger Cell */}
                  <td className="p-4 py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => setShowActionMenuId(showActionMenuId === asset.id ? null : asset.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {showActionMenuId === asset.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowActionMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-44 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-50">
                            <button
                              onClick={() => {
                                onOpenDetail(asset);
                                setShowActionMenuId(null);
                              }}
                              className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-850"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-400" />
                              <span>Explore 360</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                onOpenEdit(asset);
                                setShowActionMenuId(null);
                              }}
                              className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-850"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                              <span>Edit Specifications</span>
                            </button>

                            <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />

                            <button
                              onClick={() => {
                                if(confirm(`Confirm deleting asset ${asset.tag}?`)) {
                                  onDelete(asset.id);
                                }
                                setShowActionMenuId(null);
                              }}
                              className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-left text-xs font-bold text-rose-650 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Decommission</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
