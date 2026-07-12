import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, User, Key, Calendar, Briefcase, FileText, ToggleLeft, ToggleRight, Edit, AlertCircle, Sparkles } from 'lucide-react';
import { Department, Employee } from './types';

interface DepartmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  mode: 'view' | 'edit' | 'create';
  employeesList: Employee[];
  departmentsList: Department[];
  onSave: (data: Partial<Department>) => void;
  onToggleStatus?: (id: string) => void;
}

export default function DepartmentDrawer({
  isOpen,
  onClose,
  department,
  mode: initialMode,
  employeesList,
  departmentsList,
  onSave,
  onToggleStatus,
}: DepartmentDrawerProps) {
  const [activeMode, setActiveMode] = React.useState<'view' | 'edit' | 'create'>(initialMode);

  // Form State
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [headName, setHeadName] = React.useState('Vacant');
  const [parentName, setParentName] = React.useState('None');
  const [status, setStatus] = React.useState<'Active' | 'Inactive'>('Active');
  const [notes, setNotes] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false);

  // Keyboard Navigation: Escape key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Sync mode and values
  React.useEffect(() => {
    setActiveMode(initialMode);
    setAttemptedSubmit(false);
    setIsSaving(false);
    if (initialMode === 'create') {
      setName('');
      setDescription('');
      setHeadName('Vacant');
      setParentName('None');
      setStatus('Active');
      setNotes('');
      setFormError('');
    } else if (department) {
      setName(department.name);
      setDescription(department.description);
      setHeadName(department.headName);
      setParentName(department.parentName);
      setStatus(department.status);
      setNotes(department.notes || '');
      setFormError('');
    }
  }, [initialMode, department, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!name.trim()) {
      setFormError('Department Name is required.');
      return;
    }
    setFormError('');
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setAttemptedSubmit(false);
      onSave({
        name,
        description,
        headName,
        parentName,
        status,
        notes,
      });
    }, 700);
  };

  const handleToggleLocalStatus = () => {
    if (department && onToggleStatus) {
      onToggleStatus(department.id);
      setStatus(prev => prev === 'Active' ? 'Inactive' : 'Active');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl dark:bg-zinc-950 border-l border-slate-100 dark:border-zinc-900 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-900">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {activeMode === 'create'
                      ? 'Create Department'
                      : activeMode === 'edit'
                      ? 'Edit Department'
                      : 'Department Details'}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                    {activeMode === 'create' ? 'Define a new organizational unit' : department?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 cursor-pointer transition-all"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeMode === 'view' && department ? (
                /* VIEW MODE */
                <div className="space-y-6">
                  {/* General Block */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Overview
                    </h4>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 dark:border-zinc-900 dark:bg-zinc-950/20">
                      <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100">
                        {department.name}
                      </h2>
                      <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                        {department.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Lists */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block uppercase">
                        Department Head
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mt-1">
                        {department.headName}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block uppercase">
                        Parent Department
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mt-1">
                        {department.parentName}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block uppercase">
                        Total Staff
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 block mt-1">
                        {department.employeeCount} Members
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block uppercase">
                        Total Allocated Assets
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 block mt-1">
                        {department.assetCount} Units
                      </span>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {department.notes && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Operational Notes
                      </h4>
                      <div className="rounded-xl border border-slate-100 p-4 dark:border-zinc-900 bg-white">
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                          {department.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Created Stamp */}
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 dark:text-zinc-500 bg-slate-50 px-4 py-2 rounded-lg dark:bg-zinc-900/40">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>Created on {department.createdAt}</span>
                  </div>

                  {/* Actions Deck */}
                  <div className="border-t border-slate-100 pt-5 dark:border-zinc-900 space-y-2">
                    <button
                      onClick={() => setActiveMode('edit')}
                      className="flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 font-bold text-xs dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Department Settings</span>
                    </button>
                    {onToggleStatus && (
                      <button
                        onClick={handleToggleLocalStatus}
                        className={`flex w-full h-9 items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          department.status === 'Active'
                            ? 'border-rose-100 hover:bg-rose-50 text-rose-600 dark:border-rose-950/30 dark:hover:bg-rose-950/20 dark:text-rose-400'
                            : 'border-emerald-100 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-950/30 dark:hover:bg-emerald-950/20 dark:text-emerald-400'
                        }`}
                      >
                        {department.status === 'Active' ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            <span>Deactivate Department</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            <span>Activate Department</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* FORM MODE (CREATE / EDIT) */
                <form id="department-form" onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Department Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Engineering Development"
                      disabled={isSaving}
                      className={`h-9 w-full rounded-lg border px-3.5 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 transition-all ${
                        attemptedSubmit && !name.trim()
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                      }`}
                    />
                    {attemptedSubmit && !name.trim() && (
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                        Please specify a valid department identifier.
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly summarize the operations of this division..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 resize-none"
                    />
                  </div>

                  {/* Department Head */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Department Head
                    </label>
                    <select
                      value={headName}
                      onChange={(e) => setHeadName(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      <option value="Vacant">Vacant</option>
                      {employeesList
                        .filter(e => e.status === 'Active')
                        .map(e => (
                          <option key={e.id} value={e.name}>
                            {e.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Parent Department */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Parent Department
                    </label>
                    <select
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      <option value="None">None</option>
                      {departmentsList
                        .filter(d => d.id !== department?.id)
                        .map(d => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Operational Status
                    </label>
                    <div className="flex gap-4">
                      {['Active', 'Inactive'].map((s) => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="dept-status"
                            value={s}
                            checked={status === s}
                            onChange={() => setStatus(s as 'Active' | 'Inactive')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Operational Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add auxiliary notes for audit context..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 resize-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4 dark:border-zinc-900 flex justify-end gap-2.5 bg-slate-50 dark:bg-zinc-900/30">
              {activeMode === 'view' ? (
                <button
                  onClick={onClose}
                  className="h-8.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                  Close Sheet
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => activeMode === 'create' ? onClose() : setActiveMode('view')}
                    disabled={isSaving}
                    className="h-8.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="department-form"
                    disabled={isSaving}
                    className="h-8.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-75"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
