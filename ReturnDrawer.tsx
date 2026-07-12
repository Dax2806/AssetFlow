import React from 'react';
import AppDrawer from '../common/AppDrawer';
import { AssetMock, EmployeeMock, Allocation } from './types';
import { MOCK_EMPLOYEES, MOCK_ASSETS } from './mockData';
import { AlertTriangle, User, Calendar, RefreshCw, X, FileText, Sparkles } from 'lucide-react';

interface AllocationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetMock[];
  activeAllocations: Allocation[];
  onSubmit: (data: {
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
  }) => void;
  onRequestTransfer: (data: {
    assetId: string;
    currentHolderId: string;
    currentHolderName: string;
    currentHolderDept: string;
    requestedById: string;
    requestedByName: string;
    requestedByDept: string;
    reason: string;
  }) => void;
}

export default function AllocationDrawer({
  isOpen,
  onClose,
  assets,
  activeAllocations,
  onSubmit,
  onRequestTransfer,
}: AllocationDrawerProps) {
  // Form State
  const [employeeId, setEmployeeId] = React.useState('');
  const [assetId, setAssetId] = React.useState('');
  const [expectedReturn, setExpectedReturn] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [notes, setNotes] = React.useState('');

  // Selected Employee & Asset helper data
  const selectedEmployee = React.useMemo(() => {
    return MOCK_EMPLOYEES.find((e) => e.id === employeeId);
  }, [employeeId]);

  const selectedAsset = React.useMemo(() => {
    return assets.find((a) => a.id === assetId);
  }, [assets, assetId]);

  // Conflict Detection: is the selected asset already active or allocated?
  const existingAllocation = React.useMemo(() => {
    if (!assetId) return null;
    return activeAllocations.find((a) => a.assetId === assetId && a.status !== 'Returned');
  }, [activeAllocations, assetId]);

  // Auto set department when employee changes
  React.useEffect(() => {
    if (selectedEmployee) {
      // Set default department if needed
    }
  }, [selectedEmployee]);

  // Handle Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedAsset || !expectedReturn || !purpose) return;

    onSubmit({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      departmentName: selectedEmployee.department,
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      assetTag: selectedAsset.tag,
      assetCategory: selectedAsset.category,
      expectedReturn,
      purpose,
      notes,
    });

    // Reset Form
    resetForm();
    onClose();
  };

  const handleTransferRequest = () => {
    if (!existingAllocation || !selectedEmployee) return;

    onRequestTransfer({
      assetId: existingAllocation.assetId,
      currentHolderId: existingAllocation.employeeId,
      currentHolderName: existingAllocation.employeeName,
      currentHolderDept: existingAllocation.departmentName,
      requestedById: selectedEmployee.id,
      requestedByName: selectedEmployee.name,
      requestedByDept: selectedEmployee.departmentName,
      reason: purpose || 'Urgent project operational swap required.',
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setEmployeeId('');
    setAssetId('');
    setExpectedReturn('');
    setPurpose('');
    setNotes('');
  };

  const footerButtons = existingAllocation ? (
    <div className="flex w-full items-center justify-between gap-3 select-none">
      <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3 shrink-0" />
        Allocation Blocked: Hardware Deployed
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Close Drawer
        </button>
        <button
          type="button"
          onClick={handleTransferRequest}
          disabled={!employeeId}
          className="h-8 inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 active:scale-98 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Request Transfer</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-end space-x-2 w-full select-none">
      <button
        type="button"
        onClick={() => {
          resetForm();
          onClose();
        }}
        className="h-8 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="allocate-form"
        disabled={!employeeId || !assetId || !expectedReturn || !purpose}
        className="h-8 rounded-lg bg-emerald-600 px-4.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all cursor-pointer shadow-xs"
      >
        Allocate Lease
      </button>
    </div>
  );

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Deploy Asset lease"
      description="Create a legal hardware deployment lease or trigger cross-departmental transfers."
      footer={footerButtons}
    >
      <div className="space-y-6">
        <form id="allocate-form" onSubmit={handleFormSubmit} className="space-y-5 select-none">
          {/* Employee Picker */}
          <div className="space-y-2">
            <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Lease Holder (Employee)
            </label>
            <div className="relative">
              <select
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select organizational employee...</option>
                {MOCK_EMPLOYEES.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.department} ({emp.email})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-450">
                <User className="h-4 w-4" />
              </div>
            </div>
            {selectedEmployee && (
              <div className="rounded-xl border border-slate-150/40 bg-slate-50/20 p-3 flex items-center space-x-2.5 dark:border-zinc-900 dark:bg-zinc-950/20">
                <div className="h-8 w-8 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-450 flex items-center justify-center font-black text-xs">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 leading-none">
                    {selectedEmployee.name}
                  </p>
                  <p className="text-[9.5px] text-slate-450 mt-1 dark:text-zinc-500">
                    Dept: <span className="font-bold">{selectedEmployee.department}</span> • Email: {selectedEmployee.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Asset Picker */}
          <div className="space-y-2">
            <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Asset to Deploy
            </label>
            <div className="relative">
              <select
                required
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select registered hardware piece...</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    [{asset.tag}] {asset.name} — Status: {asset.status} ({asset.category})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-450">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Premium Conflict Panel overlay if selected asset has allocation block */}
          {existingAllocation && (
            <div className="rounded-xl border border-rose-150/80 bg-rose-50/20 p-5 dark:border-rose-950/30 dark:bg-rose-950/5 space-y-4 animate-fadeIn select-none">
              <div className="flex items-start space-x-3">
                <div className="h-8.5 w-8.5 rounded-lg bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/30 text-rose-600 dark:text-rose-450 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-rose-900 dark:text-rose-350 tracking-tight uppercase leading-snug">
                    Deployment Conflict Detected
                  </h4>
                  <p className="mt-0.5 text-[10.5px] text-rose-700/80 dark:text-rose-400/80 leading-relaxed">
                    This physical asset is already leased and deployed to another employee. Double allocations are prevented by the ERP system rules.
                  </p>
                </div>
              </div>

              <div className="border-t border-rose-150/40 dark:border-rose-900/20 pt-3 flex flex-col gap-1 text-[11px] text-slate-600 dark:text-zinc-400">
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-slate-400">Asset Tag & Label:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200 font-mono">
                    {existingAllocation.assetTag} ({existingAllocation.assetName})
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-slate-400">Current Lease Holder:</span>
                  <span className="font-bold text-rose-700 dark:text-rose-400">
                    {existingAllocation.employeeName} ({existingAllocation.departmentName})
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-slate-400">Deployed Since:</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 font-mono">
                    {existingAllocation.allocatedSince}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="font-medium text-slate-400">Lease Expiry Date:</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 font-mono">
                    {existingAllocation.expectedReturn}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-white/60 dark:bg-zinc-950/20 border border-rose-100 dark:border-rose-900/20 p-3 text-[10.5px] leading-relaxed text-slate-500 dark:text-zinc-400">
                <p>
                  💡 <strong>System Alternative:</strong> You can submit a <strong>Transfer Request</strong> to route the gear automatically to <strong>{selectedEmployee?.name || 'the recipient'}</strong> upon current lease release approval.
                </p>
              </div>
            </div>
          )}

          {/* Lease Details (Only show or highlight if no conflict) */}
          {!existingAllocation && (
            <>
              {/* Expected Return Date */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                  Lease Return Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all cursor-pointer"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-450">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                  Deployment Purpose
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide operational reason for this deployment..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                  Compliance / Special Instructions (Optional)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="E.g., custom configuration required, software load specs..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all leading-relaxed"
                  />
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </AppDrawer>
  );
}
