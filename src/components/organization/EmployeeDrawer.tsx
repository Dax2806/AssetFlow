import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Briefcase, Mail, Phone, Hash, Shield, Key, FileText, ToggleLeft, ToggleRight, Edit, AlertCircle, Sparkles } from 'lucide-react';
import { Employee, Department } from './types';

interface EmployeeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  mode: 'view' | 'edit' | 'create';
  departmentsList: Department[];
  onSave: (data: Partial<Employee>) => void;
  onToggleStatus?: (id: string) => void;
}

export default function EmployeeDrawer({
  isOpen,
  onClose,
  employee,
  mode: initialMode,
  departmentsList,
  onSave,
  onToggleStatus,
}: EmployeeDrawerProps) {
  const [activeMode, setActiveMode] = React.useState<'view' | 'edit' | 'create'>(initialMode);

  // Form State
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [departmentId, setDepartmentId] = React.useState('');
  const [role, setRole] = React.useState<'Admin' | 'Asset Manager' | 'Department Head' | 'Employee'>('Employee');
  const [status, setStatus] = React.useState<'Active' | 'Inactive'>('Active');
  const [phone, setPhone] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false);

  // Keyboard navigation: Escape key listener
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

  // Synchronize state
  React.useEffect(() => {
    setActiveMode(initialMode);
    setAttemptedSubmit(false);
    setIsSaving(false);
    if (initialMode === 'create') {
      setName('');
      setEmail('');
      setDepartmentId(departmentsList[0]?.id || '');
      setRole('Employee');
      setStatus('Active');
      setPhone('');
      const randomId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
      setEmployeeId(randomId);
      setNotes('');
      setFormError('');
    } else if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setDepartmentId(employee.departmentId);
      setRole(employee.role);
      setStatus(employee.status);
      setPhone(employee.phone);
      setEmployeeId(employee.employeeId);
      setNotes(employee.notes || '');
      setFormError('');
    }
  }, [initialMode, employee, isOpen, departmentsList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!name.trim()) {
      setFormError('Employee Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid corporate Email is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Contact phone is required.');
      return;
    }
    if (!employeeId.trim()) {
      setFormError('Employee ID is required.');
      return;
    }

    setFormError('');
    setIsSaving(true);

    const selectedDept = departmentsList.find(d => d.id === departmentId);
    
    setTimeout(() => {
      setIsSaving(false);
      setAttemptedSubmit(false);
      onSave({
        name,
        email,
        departmentId,
        departmentName: selectedDept ? selectedDept.name : 'Unknown Department',
        role,
        status,
        phone,
        employeeId,
        notes,
      });
    }, 700);
  };

  const handleToggleLocalStatus = () => {
    if (employee && onToggleStatus) {
      onToggleStatus(employee.id);
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
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {activeMode === 'create'
                      ? 'Add Employee'
                      : activeMode === 'edit'
                      ? 'Edit Employee'
                      : 'Employee Directory Card'}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                    {activeMode === 'create' ? 'Onboard a new system member' : employee?.name}
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
              {activeMode === 'view' && employee ? (
                /* VIEW DETAILS MODE */
                <div className="space-y-6">
                  {/* Identity Block */}
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-zinc-900/60">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 shadow-xs select-none">
                      {employee.avatar}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100">
                        {employee.name}
                      </h2>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                          employee.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                            : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                        }`}
                      >
                        {employee.status}
                      </span>
                      <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 font-medium">
                        Last Active: {employee.lastLogin}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info list */}
                  <div className="space-y-3.5">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      Identity & Contact Details
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase">ID</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 block mt-1">
                          {employee.employeeId}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Division</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mt-1 truncate">
                          {employee.departmentName}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 col-span-2">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Email Address</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mt-1 truncate">
                          {employee.email}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Telephone</span>
                        </div>
                        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mt-1">
                          {employee.phone}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                          <Shield className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-semibold uppercase">Authority</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mt-1">
                          {employee.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes block */}
                  {employee.notes && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Administrative Notes
                      </h4>
                      <div className="rounded-xl border border-slate-100 p-4 dark:border-zinc-900 bg-white">
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                          {employee.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Commands */}
                  <div className="border-t border-slate-100 pt-5 dark:border-zinc-900 space-y-2">
                    <button
                      onClick={() => setActiveMode('edit')}
                      className="flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 font-bold text-xs dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Account Settings</span>
                    </button>
                    {onToggleStatus && (
                      <button
                        onClick={handleToggleLocalStatus}
                        className={`flex w-full h-9 items-center justify-center gap-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          employee.status === 'Active'
                            ? 'border-rose-100 hover:bg-rose-50 text-rose-600 dark:border-rose-950/30 dark:hover:bg-rose-950/20 dark:text-rose-400'
                            : 'border-emerald-100 hover:bg-emerald-50 text-emerald-600 dark:border-emerald-950/30 dark:hover:bg-emerald-950/20 dark:text-emerald-400'
                        }`}
                      >
                        {employee.status === 'Active' ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            <span>Suspend System Account</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            <span>Activate System Account</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* EDIT / CREATE MODE */
                <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Om Patel"
                      disabled={isSaving}
                      className={`h-9 w-full rounded-lg border px-3.5 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 transition-all ${
                        attemptedSubmit && !name.trim()
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                      }`}
                    />
                    {attemptedSubmit && !name.trim() && (
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                        Please specify a valid full name.
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Corporate Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. om.patel@company.com"
                      disabled={isSaving}
                      className={`h-9 w-full rounded-lg border px-3.5 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 transition-all ${
                        attemptedSubmit && (!email.trim() || !email.includes('@'))
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                      }`}
                    />
                    {attemptedSubmit && (!email.trim() || !email.includes('@')) && (
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                        Please specify a valid corporate email.
                      </p>
                    )}
                  </div>

                  {/* Employee ID */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Employee ID Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. EMP-101"
                      disabled={isSaving}
                      className={`h-9 w-full rounded-lg border px-3.5 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 font-mono font-bold transition-all ${
                        attemptedSubmit && !employeeId.trim()
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                      }`}
                    />
                    {attemptedSubmit && !employeeId.trim() && (
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                        Employee ID code cannot be blank.
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 012-3456"
                      disabled={isSaving}
                      className={`h-9 w-full rounded-lg border px-3.5 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 transition-all ${
                        attemptedSubmit && !phone.trim()
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                      }`}
                    />
                    {attemptedSubmit && !phone.trim() && (
                      <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                        Valid contact phone is required.
                      </p>
                    )}
                  </div>

                  {/* Department select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      Assign Department
                    </label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                    >
                      {departmentsList.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      ERP System Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Department Head">Department Head</option>
                      <option value="Asset Manager">Asset Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                      System Access Status
                    </label>
                    <div className="flex gap-4">
                      {['Active', 'Inactive'].map((s) => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="radio"
                            name="emp-status"
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
                      Administrative Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add system onboarding remarks..."
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
                  Close Card
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
                    form="employee-form"
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
                      <span>Save Member</span>
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
