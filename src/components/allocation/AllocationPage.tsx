import React from 'react';
import PageHeader from '../common/PageHeader';
import SummaryStrip from '../common/SummaryStrip';
import StatusBadge from '../common/StatusBadge';
import AppDrawer from '../common/AppDrawer';
import { motion, AnimatePresence } from 'motion/react';
import {
  MOCK_ASSETS,
  INITIAL_ALLOCATIONS,
  INITIAL_TRANSFERS,
  INITIAL_HISTORIES,
  MOCK_EMPLOYEES
} from './mockData';
import { Allocation, TransferRequest, AllocationHistory, AssetMock } from './types';
import AllocationTable from './AllocationTable';
import OverdueTable from './OverdueTable';
import TransferKanban from './TransferKanban';
import AllocationDrawer from './AllocationDrawer';
import TransferDrawer from './TransferDrawer';
import ReturnDrawer from './ReturnDrawer';
import HistoryDrawer from './HistoryDrawer';
import {
  ShieldAlert,
  Share2,
  CalendarDays,
  FileCheck2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal
} from 'lucide-react';

export default function AllocationPage() {
  // --- core states ---
  const [activeTab, setActiveTab] = React.useState<'active' | 'transfers' | 'returns' | 'overdue'>('active');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('All');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Unified lists
  const [allocations, setAllocations] = React.useState<Allocation[]>(INITIAL_ALLOCATIONS);
  const [transfers, setTransfers] = React.useState<TransferRequest[]>(INITIAL_TRANSFERS);
  const [histories, setHistories] = React.useState<AllocationHistory[]>(INITIAL_HISTORIES);
  const [assets, setAssets] = React.useState<AssetMock[]>(MOCK_ASSETS);

  // --- Drawer visibility state ---
  const [isAllocationOpen, setIsAllocationOpen] = React.useState(false);
  const [selectedTransfer, setSelectedTransfer] = React.useState<TransferRequest | null>(null);
  const [selectedReturn, setSelectedReturn] = React.useState<Allocation | null>(null);
  const [historyContext, setHistoryContext] = React.useState<{ assetId: string; assetName: string; assetTag: string } | null>(null);

  // --- Smart Insights Rotation ---
  const [insightIdx, setInsightIdx] = React.useState(0);
  const insights = [
    "Engineering currently holds 42% of active company hardware allocations.",
    "3 high-performance workstations have exceeded their expected lease return date.",
    "Finance has achieved 100% lease return compliance with zero overdue assets.",
    "Acknowledge physical security inspections for all returned items to ensure warranty protection."
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setInsightIdx((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [insights.length]);

  // --- Computed KPIs ---
  const activeCount = allocations.filter((a) => a.status === 'Active').length;
  const pendingTransfersCount = transfers.filter((t) => t.status === 'Requested').length;
  const overdueCount = allocations.filter((a) => a.status === 'Overdue').length;

  // Let's compute returns pending or due today (Expected return matches July 12, 2026 or is close)
  const returnsDueTodayCount = allocations.filter((a) => {
    if (a.status === 'Returned') return false;
    const returnDate = new Date(a.expectedReturn);
    const targetDate = new Date('2026-07-12');
    return returnDate.toDateString() === targetDate.toDateString();
  }).length;

  const kpis = [
    {
      title: "Active Leases",
      value: activeCount + overdueCount,
      subText: `${activeCount} compliant, ${overdueCount} overdue`,
      icon: Briefcase,
      type: 'info' as const
    },
    {
      title: "Pending Transfers",
      value: pendingTransfersCount,
      subText: "Requires manager sign-off",
      icon: Share2,
      type: 'neutral' as const
    },
    {
      title: "Returns Due Today",
      value: returnsDueTodayCount,
      subText: "Awaiting physical check-in",
      icon: CalendarDays,
      type: 'positive' as const
    },
    {
      title: "Overdue Leases",
      value: overdueCount,
      subText: "Enforcement alerts pending",
      icon: ShieldAlert,
      type: 'negative' as const
    }
  ];

  // Unique departments for filter list
  const departments = React.useMemo(() => {
    const set = new Set(MOCK_EMPLOYEES.map((e) => e.department));
    return ['All', ...Array.from(set)];
  }, []);

  // --- Action Handlers ---

  // 1. Submit Allocation Lease
  const handleCreateAllocation = (data: {
    employeeId: string;
    employeeName: string;
    departmentName: string;
    assetId: string;
    assetName: string;
    assetTag: string;
    assetCategory: string;
    expectedReturn: string;
    purpose: string;
    notes?: string;
  }) => {
    const newAlloc: Allocation = {
      id: `alloc-${Date.now()}`,
      assetId: data.assetId,
      assetName: data.assetName,
      assetTag: data.assetTag,
      assetCategory: data.assetCategory,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      departmentName: data.departmentName,
      allocatedSince: new Date().toISOString().split('T')[0],
      expectedReturn: data.expectedReturn,
      purpose: data.purpose,
      notes: data.notes,
      status: 'Active',
      healthScore: 100
    };

    // Update active allocations
    setAllocations((prev) => [newAlloc, ...prev]);

    // Update asset status to 'allocated'
    setAssets((prev) =>
      prev.map((a) => (a.id === data.assetId ? { ...a, status: 'allocated' } : a))
    );

    // Create history record
    const newHist: AllocationHistory = {
      id: `hist-${Date.now()}`,
      assetId: data.assetId,
      type: 'Allocated',
      date: new Date().toISOString().split('T')[0],
      description: `Allocated lease created for ${data.employeeName} (${data.departmentName}).`,
      user: 'Om Patel',
      details: data.purpose
    };
    setHistories((prev) => [newHist, ...prev]);
  };

  // 2. Create Transfer Request (triggered when trying to allocate a blocked asset)
  const handleRequestTransfer = (data: {
    assetId: string;
    currentHolderId: string;
    currentHolderName: string;
    currentHolderDept: string;
    requestedById: string;
    requestedByName: string;
    requestedByDept: string;
    reason: string;
  }) => {
    const targetAsset = assets.find((a) => a.id === data.assetId);
    if (!targetAsset) return;

    const newTransfer: TransferRequest = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      assetId: data.assetId,
      assetName: targetAsset.name,
      assetTag: targetAsset.tag,
      currentHolderId: data.currentHolderId,
      currentHolderName: data.currentHolderName,
      currentHolderDept: data.currentHolderDept,
      requestedById: data.requestedById,
      requestedByName: data.requestedByName,
      requestedByDept: data.requestedByDept,
      reason: data.reason,
      priority: 'High',
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Requested'
    };

    setTransfers((prev) => [newTransfer, ...prev]);

    // Create history log
    const newHist: AllocationHistory = {
      id: `hist-${Date.now()}`,
      assetId: data.assetId,
      type: 'Transferred',
      date: new Date().toISOString().split('T')[0],
      description: `Transfer request initiated from ${data.currentHolderName} to ${data.requestedByName}.`,
      user: 'Om Patel',
      details: `Reason: ${data.reason}`
    };
    setHistories((prev) => [newHist, ...prev]);
  };

  // 3. Approve Transfer
  const handleApproveTransfer = (txId: string) => {
    const tx = transfers.find((t) => t.id === txId);
    if (!tx) return;

    // Transition transfer status
    setTransfers((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'Completed' } : t))
    );

    // Reallocate the allocation record to the new holder
    setAllocations((prev) =>
      prev.map((alloc) => {
        if (alloc.assetId === tx.assetId && alloc.status !== 'Returned') {
          return {
            ...alloc,
            employeeId: tx.requestedById,
            employeeName: tx.requestedByName,
            departmentName: tx.requestedByDept,
            allocatedSince: new Date().toISOString().split('T')[0],
            status: 'Active' // Reset overdue status upon successful transfer
          };
        }
        return alloc;
      })
    );

    // Create timeline record
    const newHist: AllocationHistory = {
      id: `hist-${Date.now()}`,
      assetId: tx.assetId,
      type: 'Reallocated',
      date: new Date().toISOString().split('T')[0],
      description: `Hardware transferred & reallocated to ${tx.requestedByName} (${tx.requestedByDept}).`,
      user: 'Om Patel',
      details: `Approved transfer request: TX-${tx.id}`
    };
    setHistories((prev) => [newHist, ...prev]);
  };

  // 4. Reject Transfer
  const handleRejectTransfer = (txId: string) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'Rejected' } : t))
    );
  };

  // 5. Terminate Lease & Return Asset
  const handleReturnAsset = (data: {
    allocationId: string;
    assetId: string;
    condition: 'New' | 'Good' | 'Fair' | 'Poor';
    damageNotes?: string;
    returnedDate: string;
    comments?: string;
  }) => {
    // Set allocation status to Returned
    setAllocations((prev) =>
      prev.map((alloc) =>
        alloc.id === data.allocationId ? { ...alloc, status: 'Returned' } : alloc
      )
    );

    // Set asset status back to available
    setAssets((prev) =>
      prev.map((a) => (a.id === data.assetId ? { ...a, status: 'available' } : a))
    );

    // Create timeline history record
    const newHist: AllocationHistory = {
      id: `hist-${Date.now()}`,
      assetId: data.assetId,
      type: 'Returned',
      date: data.returnedDate,
      description: `Asset returned to inventory pool. Condition rated: ${data.condition}.`,
      user: 'Om Patel',
      details: data.comments || data.damageNotes
    };
    setHistories((prev) => [newHist, ...prev]);
  };

  // 6. Send alert reminder for overdue item
  const handleSendReminder = (id: string, name: string) => {
    setToastMessage(`Enforcement Notice Dispatched to ${name} via Email and SMS.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Toast feedback widget */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-slate-900 px-4.5 py-3 text-xs font-semibold text-white shadow-lg dark:bg-white dark:text-zinc-950"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Page Header with Actions slot */}
      <PageHeader
        title="Asset Allocation & Transfers"
        subtitle="Operational center for asset ownership, cross-department transfers, and return enforcement."
        actions={
          <button
            onClick={() => setIsAllocationOpen(true)}
            className="h-9 inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Deploy Asset Lease</span>
          </button>
        }
      />

      {/* 2. Summary KPI Strip */}
      <SummaryStrip kpis={kpis} />

      {/* 3. Smart Insight Banner */}
      <div className="rounded-xl border border-slate-150/60 bg-slate-50/20 p-4.5 dark:border-zinc-900 dark:bg-zinc-950/20 flex items-center justify-between select-none">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-450 animate-pulse">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-[10.5px] text-emerald-800 dark:text-emerald-450 uppercase tracking-widest block leading-none mb-1">Smart Insight</span>
            <span className="font-medium text-slate-650 dark:text-zinc-300">
              {insights[insightIdx]}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-450">
          <Clock className="h-3.5 w-3.5" />
          <span>Updates Live</span>
        </div>
      </div>

      {/* 4. Tabs Navigation Bar */}
      <div className="border-b border-slate-200/80 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-6">
          {(
            [
              { id: 'active', label: 'Active Allocations', count: allocations.filter((a) => a.status !== 'Returned').length },
              { id: 'transfers', label: 'Transfer Requests', count: transfers.length },
              { id: 'returns', label: 'Returns Log', count: allocations.filter((a) => a.status === 'Returned').length },
              { id: 'overdue', label: 'Overdue Assets', count: overdueCount }
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs font-black uppercase tracking-wider relative cursor-pointer transition-colors ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-450 hover:text-slate-600 dark:text-zinc-500'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center justify-center rounded-full text-[9px] font-black h-5 px-1.5 ${
                    isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-zinc-500'
                  }`}>
                    {tab.count}
                  </span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search and Filter (Only display if relevant) */}
        {activeTab !== 'transfers' && (
          <div className="flex items-center gap-3 pb-3 sm:pb-0">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 w-48 sm:w-56 pl-8.5 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white text-[11px] font-semibold text-slate-750 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300"
              />
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            </div>

            {/* Department Dropdown */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-8.5 pl-3.5 pr-8 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-[11px] font-bold text-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-2.5 text-slate-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Render Selected Tab View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'active' && (
            <AllocationTable
              allocations={allocations.filter((a) => a.status !== 'Returned')}
              searchQuery={searchQuery}
              departmentFilter={departmentFilter}
              onOpenReturn={(alloc) => setSelectedReturn(alloc)}
              onOpenHistory={(assetId, assetName, assetTag) =>
                setHistoryContext({ assetId, assetName, assetTag })
              }
              onOpenTransfer={(alloc) => {
                // Auto open transfer drawer or pre-fill transfer request from active lease
                const mockReq: TransferRequest = {
                  id: `tx-draft`,
                  assetId: alloc.assetId,
                  assetName: alloc.assetName,
                  assetTag: alloc.assetTag,
                  currentHolderId: alloc.employeeId,
                  currentHolderName: alloc.employeeName,
                  currentHolderDept: alloc.departmentName,
                  requestedById: '',
                  requestedByName: '',
                  requestedByDept: '',
                  reason: '',
                  priority: 'Medium',
                  requestedDate: new Date().toISOString().split('T')[0],
                  status: 'Requested'
                };
                setSelectedTransfer(mockReq);
              }}
              onTriggerToast={(msg) => setToastMessage(msg)}
            />
          )}

          {activeTab === 'transfers' && (
            <TransferKanban
              transfers={transfers}
              onApprove={handleApproveTransfer}
              onReject={handleRejectTransfer}
              onView={(tx) => setSelectedTransfer(tx)}
            />
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4 select-none">
              <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-zinc-900 dark:bg-zinc-950 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/75 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:border-zinc-900 dark:bg-zinc-950/60 dark:text-zinc-500">
                        <th className="px-5 py-4">Returned Asset</th>
                        <th className="px-5 py-4">Former Custodian</th>
                        <th className="px-5 py-4">Department</th>
                        <th className="px-5 py-4">Lease Start</th>
                        <th className="px-5 py-4">Expected Return</th>
                        <th className="px-5 py-4 text-right">Life history</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                      {allocations.filter((a) => a.status === 'Returned').length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-xs font-bold text-slate-450">
                            No terminated leases or returned items logged.
                          </td>
                        </tr>
                      ) : (
                        allocations
                          .filter((a) => a.status === 'Returned')
                          .map((item) => (
                            <tr key={item.id} className="group hover:bg-slate-50/40 dark:hover:bg-zinc-900/40 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                    {item.assetName}
                                  </span>
                                  <span className="font-mono text-[8.5px] font-bold bg-slate-100 dark:bg-zinc-900 text-slate-500 px-1.5 py-0.2 mt-0.5 rounded uppercase tracking-wider inline-block max-w-max">
                                    {item.assetTag}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                {item.employeeName}
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-500">
                                {item.departmentName}
                              </td>
                              <td className="px-5 py-4 text-xs font-mono text-slate-500">
                                {item.allocatedSince}
                              </td>
                              <td className="px-5 py-4 text-xs font-mono text-slate-500">
                                {item.expectedReturn}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => setHistoryContext({ assetId: item.assetId, assetName: item.assetName, assetTag: item.assetTag })}
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-450 hover:underline cursor-pointer"
                                >
                                  View Audit
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overdue' && (
            <OverdueTable
              allocations={allocations}
              onSendReminder={handleSendReminder}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- Drawers Container --- */}
      
      {/* 1. Allocate Drawer */}
      <AllocationDrawer
        isOpen={isAllocationOpen}
        onClose={() => setIsAllocationOpen(false)}
        assets={assets}
        activeAllocations={allocations}
        onSubmit={handleCreateAllocation}
        onRequestTransfer={handleRequestTransfer}
      />

      {/* 2. Transfer View / Approve Drawer */}
      <TransferDrawer
        isOpen={!!selectedTransfer && selectedTransfer.id !== 'tx-draft'}
        onClose={() => setSelectedTransfer(null)}
        transfer={selectedTransfer}
        onApprove={handleApproveTransfer}
        onReject={handleRejectTransfer}
      />

      {/* 2b. Direct / Draft Transfer Drawer (when triggered from Active Allocations table action) */}
      {selectedTransfer && selectedTransfer.id === 'tx-draft' && (
        <AppDrawer
          isOpen={true}
          onClose={() => setSelectedTransfer(null)}
          title="Initiate Transfer Request"
          description="Route custody from current lease holder to a new employee recipient."
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                onClick={() => setSelectedTransfer(null)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedTransfer.requestedById || !selectedTransfer.reason) {
                    setToastMessage('Please select a recipient employee and provide transfer reasoning.');
                    return;
                  }
                  const rec = MOCK_EMPLOYEES.find((e) => e.id === selectedTransfer.requestedById);
                  if (!rec) return;

                  handleRequestTransfer({
                    assetId: selectedTransfer.assetId,
                    currentHolderId: selectedTransfer.currentHolderId,
                    currentHolderName: selectedTransfer.currentHolderName,
                    currentHolderDept: selectedTransfer.currentHolderDept,
                    requestedById: rec.id,
                    requestedByName: rec.name,
                    requestedByDept: rec.department,
                    reason: selectedTransfer.reason
                  });
                  setSelectedTransfer(null);
                }}
                className="h-8 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                Submit Transfer Draft
              </button>
            </div>
          }
        >
          <div className="space-y-5 select-none text-xs">
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/20 dark:border-zinc-900 dark:bg-zinc-950/20 space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Lease Context</span>
              <p className="font-bold text-slate-800 dark:text-zinc-200">{selectedTransfer.assetName}</p>
              <p className="text-slate-500">Current Custodian: <span className="font-semibold text-slate-700 dark:text-zinc-300">{selectedTransfer.currentHolderName}</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Recipient (New Employee)</label>
              <select
                value={selectedTransfer.requestedById}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTransfer((prev) => prev ? { ...prev, requestedById: val } : null);
                }}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="">Select recipient...</option>
                {MOCK_EMPLOYEES.filter((e) => e.id !== selectedTransfer.currentHolderId).map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Reason for Custody Transfer</label>
              <textarea
                rows={3}
                required
                placeholder="State project justification or urgency requirement..."
                value={selectedTransfer.reason}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTransfer((prev) => prev ? { ...prev, reason: val } : null);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </AppDrawer>
      )}

      {/* 3. Return Asset Lease Drawer */}
      <ReturnDrawer
        isOpen={!!selectedReturn}
        onClose={() => setSelectedReturn(null)}
        allocation={selectedReturn}
        onSubmit={handleReturnAsset}
      />

      {/* 4. Timeline history Audit Drawer */}
      <HistoryDrawer
        isOpen={!!historyContext}
        onClose={() => setHistoryContext(null)}
        assetId={historyContext?.assetId || ''}
        assetName={historyContext?.assetName || ''}
        assetTag={historyContext?.assetTag || ''}
        histories={histories}
      />

    </div>
  );
}
