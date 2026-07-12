import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FolderPlus, ShieldCheck, ShieldAlert, Plus, Trash2, Key, Info, ListPlus, AlertCircle } from 'lucide-react';
import { AssetCategory, CustomField } from './types';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: AssetCategory | null;
  mode: 'create' | 'edit';
  onSave: (data: Partial<AssetCategory>) => void;
}

const AVAILABLE_ICONS = ['Laptop', 'Armchair', 'Car', 'Network', 'Printer'];

export default function CategoryDrawer({
  isOpen,
  onClose,
  category,
  mode,
  onSave,
}: CategoryDrawerProps) {
  // Form State
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState('Laptop');
  const [description, setDescription] = React.useState('');
  const [warrantyEnabled, setWarrantyEnabled] = React.useState(true);
  const [defaultWarranty, setDefaultWarranty] = React.useState(12);
  const [status, setStatus] = React.useState<'Active' | 'Inactive'>('Active');
  const [customFields, setCustomFields] = React.useState<CustomField[]>([]);
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

  // Synchronize state when open
  React.useEffect(() => {
    setAttemptedSubmit(false);
    setIsSaving(false);
    if (mode === 'create') {
      setName('');
      setIcon('Laptop');
      setDescription('');
      setWarrantyEnabled(true);
      setDefaultWarranty(12);
      setStatus('Active');
      setCustomFields([]);
      setFormError('');
    } else if (category) {
      setName(category.name);
      setIcon(category.icon);
      setDescription(category.description);
      setWarrantyEnabled(category.warrantyEnabled);
      setDefaultWarranty(category.defaultWarranty);
      setStatus(category.status);
      setCustomFields(category.customFields || []);
      setFormError('');
    }
  }, [category, mode, isOpen]);

  // Dynamic fields functions
  const handleAddField = () => {
    setCustomFields((prev) => [...prev, { name: '', type: 'text', required: false }]);
  };

  const handleRemoveField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: keyof CustomField, value: any) => {
    setCustomFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!name.trim()) {
      setFormError('Category Name is required.');
      return;
    }
    if (!description.trim()) {
      setFormError('Category Description is required.');
      return;
    }

    // Check custom fields validity
    const emptyFieldName = customFields.some((f) => !f.name.trim());
    if (emptyFieldName) {
      setFormError('All custom fields must have a name defined.');
      return;
    }

    // Duplicate custom field names check
    const names = customFields.map(f => f.name.trim().toLowerCase());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      setFormError('Custom field names must be unique.');
      return;
    }

    setFormError('');
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setAttemptedSubmit(false);
      onSave({
        name,
        icon,
        description,
        warrantyEnabled,
        defaultWarranty: warrantyEnabled ? Number(defaultWarranty) : 0,
        status,
        customFields,
      });
    }, 700);
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
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {mode === 'create' ? 'Create Asset Category' : 'Configure Asset Category'}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                    {mode === 'create' ? 'Define a new class and asset template' : category?.name}
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
            <div className="flex-1 overflow-y-auto p-6 space-y-5.5">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-4.5">
                {formError && (
                  <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Category Class Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. IT Electronics, Networking Gears"
                    disabled={isSaving}
                    className={`h-9 w-full rounded-lg border px-3.5 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 transition-all ${
                      attemptedSubmit && !name.trim()
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                    }`}
                  />
                  {attemptedSubmit && !name.trim() && (
                    <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                      Please specify a valid category class name.
                    </p>
                  )}
                </div>

                {/* Icon selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Representational Icon
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Class Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Specify assets included in this class..."
                    rows={2.5}
                    disabled={isSaving}
                    className={`w-full rounded-lg border p-3 text-xs text-slate-800 outline-none focus:ring-1 dark:bg-zinc-900 dark:text-zinc-200 resize-none leading-relaxed transition-all ${
                      attemptedSubmit && !description.trim()
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 ring-rose-500 ring-1'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-800'
                    }`}
                  />
                  {attemptedSubmit && !description.trim() && (
                    <p className="text-[10px] text-rose-500 font-bold mt-0.5">
                      Description details cannot be blank.
                    </p>
                  )}
                </div>

                {/* Warranty Check */}
                <div className="space-y-2 border-t border-slate-100/60 pt-3 dark:border-zinc-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                        Default Warranty Tracking
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                        Automatically register protection cycles for items in this class
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWarrantyEnabled(!warrantyEnabled)}
                      className={`h-6.5 w-11 shrink-0 rounded-full transition-colors relative cursor-pointer ${
                        warrantyEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-zinc-800'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-xs transition-all ${
                        warrantyEnabled ? 'left-5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {warrantyEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1 pl-1 pt-1.5"
                    >
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block">
                        Warranty Duration (Months)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={defaultWarranty}
                        onChange={(e) => setDefaultWarranty(Number(e.target.value))}
                        className="h-8.5 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-mono font-bold"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1 border-t border-slate-100/60 pt-3 dark:border-zinc-900/40">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Category Availability
                  </label>
                  <div className="flex gap-4">
                    {['Active', 'Inactive'].map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="cat-status"
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

                {/* DYNAMIC ATTRIBUTES / CUSTOM FIELDS SECTION */}
                <div className="border-t border-slate-100/60 pt-4.5 dark:border-zinc-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">
                        Asset Schema Attributes
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                        Custom specifications requested on asset registrations (e.g. RAM, Processor)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddField}
                      className="inline-flex h-7 items-center gap-1 rounded bg-slate-50 border border-slate-100 hover:bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Attribute</span>
                    </button>
                  </div>

                  {customFields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-5 border border-dashed border-slate-100 rounded-xl dark:border-zinc-900 bg-slate-50/10">
                      <ListPlus className="h-5 w-5 text-slate-300 dark:text-zinc-700 mb-1" />
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                        No custom attributes defined
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {customFields.map((field, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-slate-50/40 p-2.5 rounded-lg border border-slate-100/60 dark:bg-zinc-900/10 dark:border-zinc-900/40"
                        >
                          {/* Attribute Name Input */}
                          <input
                            type="text"
                            placeholder="Attribute Name"
                            value={field.name}
                            onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                            className="h-8.5 flex-1 min-w-0 rounded-md border border-slate-200 px-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                          />

                          {/* Attribute Type Select */}
                          <select
                            value={field.type}
                            onChange={(e) => handleFieldChange(idx, 'type', e.target.value as any)}
                            className="h-8.5 rounded-md border border-slate-200 px-2 text-[11px] text-slate-700 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 font-medium"
                          >
                            <option value="text">text</option>
                            <option value="number">number</option>
                            <option value="boolean">boolean</option>
                          </select>

                          {/* Required Toggle */}
                          <label className="flex items-center gap-1 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                            />
                            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-zinc-500">Req</span>
                          </label>

                          {/* Delete Action */}
                          <button
                            type="button"
                            onClick={() => handleRemoveField(idx)}
                            className="h-8 w-8 shrink-0 rounded flex items-center justify-center hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:hover:bg-rose-950/30 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-4 dark:border-zinc-900 flex justify-end gap-2.5 bg-slate-50 dark:bg-zinc-900/30">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="h-8.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="category-form"
                disabled={isSaving}
                className="h-8.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving Category...</span>
                  </>
                ) : (
                  <span>{mode === 'create' ? 'Create Class' : 'Apply Changes'}</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
