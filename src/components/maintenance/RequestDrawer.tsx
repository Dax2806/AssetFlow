import React from 'react';
import { Asset, PriorityLevel } from '../../types';
import AppDrawer from '../common/AppDrawer';
import { CheckCircle, AlertTriangle, HelpCircle, Paperclip, X, Sparkles, Database } from 'lucide-react';

interface RequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onRaiseRequest: (requestData: {
    assetId: string;
    issueTitle: string;
    description: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    estimatedCost: number;
    attachments: { name: string; size: string; type: string }[];
  }) => void;
}

export default function RequestDrawer({ isOpen, onClose, assets, onRaiseRequest }: RequestDrawerProps) {
  const [selectedAssetId, setSelectedAssetId] = React.useState('');
  const [issueTitle, setIssueTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<'Critical' | 'High' | 'Medium' | 'Low'>('Medium');
  const [estimatedCost, setEstimatedCost] = React.useState<number>(100);
  const [attachments, setAttachments] = React.useState<{ name: string; size: string; type: string }[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const activeAssets = React.useMemo(() => {
    return assets.filter(a => a.status !== 'lost' && a.status !== 'disposed');
  }, [assets]);

  // Handle fake attachment addition
  const handleAddFakeAttachment = () => {
    const fileNames = [
      'diagnostic_report_v2.pdf',
      'device_error_screenshot.png',
      'system_temperature_log.txt',
      'fuser_alignment_specs.docx'
    ];
    const sizes = ['1.2 MB', '850 KB', '140 KB', '2.1 MB'];
    const types = ['application/pdf', 'image/png', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const randomIndex = Math.floor(Math.random() * fileNames.length);
    const newFile = {
      name: fileNames[randomIndex],
      size: sizes[randomIndex],
      type: types[randomIndex]
    };

    setAttachments(prev => [...prev, newFile]);
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) {
      setFormError('Please select an asset requiring maintenance.');
      return;
    }
    if (!issueTitle.trim()) {
      setFormError('Please provide a short descriptive issue title.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a detailed description of the maintenance issue.');
      return;
    }

    onRaiseRequest({
      assetId: selectedAssetId,
      issueTitle,
      description,
      priority,
      estimatedCost: Number(estimatedCost) || 0,
      attachments
    });

    // Reset state
    setSelectedAssetId('');
    setIssueTitle('');
    setDescription('');
    setPriority('Medium');
    setEstimatedCost(100);
    setAttachments([]);
    setFormError('');
    onClose();
  };

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Raise Maintenance Request"
      description="Report asset damage, plan inspections, or schedule hardware servicing."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-9.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-zinc-800 dark:hover:border-zinc-700 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="maintenance-request-form"
            className="h-9.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            Submit Request
          </button>
        </>
      }
    >
      <form id="maintenance-request-form" onSubmit={handleSubmit} className="space-y-5.5 select-none text-left">
        {formError && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/30 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Searchable/Scrollable Asset Picker */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Select Asset *
          </label>
          <div className="relative">
            <select
              value={selectedAssetId}
              onChange={(e) => {
                setSelectedAssetId(e.target.value);
                setFormError('');
              }}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-slate-450 dark:text-zinc-600">-- Choose asset to maintain --</option>
              {activeAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  [{asset.tag}] {asset.name} ({asset.category})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
              <Database className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Issue Title */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Issue Title / Repair Objective *
          </label>
          <input
            type="text"
            value={issueTitle}
            onChange={(e) => {
              setIssueTitle(e.target.value);
              setFormError('');
            }}
            placeholder="e.g., Sticky spacebar keys on tech lab laptops"
            className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Detailed Issue Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFormError('');
            }}
            placeholder="Describe the diagnostics, error messages, or exact service requirements here..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 p-3.5 text-xs font-medium text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Dual Column: Priority & Estimated Cost */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority Select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
              Priority SLA *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all appearance-none cursor-pointer"
            >
              <option value="Critical">Critical (12hr SLA)</option>
              <option value="High">High (48hr SLA)</option>
              <option value="Medium">Medium (72hr SLA)</option>
              <option value="Low">Low (168hr SLA)</option>
            </select>
          </div>

          {/* Estimated Cost */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
              Estimated Cost ($ USD)
            </label>
            <input
              type="number"
              min={0}
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Math.max(0, Number(e.target.value)))}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Drag and Drop Attachments Simulator */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Diagnostic Attachments & Images
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleAddFakeAttachment();
            }}
            onClick={handleAddFakeAttachment}
            className={`border border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10'
                : 'border-slate-200 hover:border-slate-350 bg-slate-50/20 dark:border-zinc-900 dark:bg-zinc-950/20'
            }`}
          >
            <Paperclip className="h-6 w-6 text-slate-400 dark:text-zinc-600 animate-pulse" />
            <p className="mt-2 text-xs font-black text-slate-700 dark:text-zinc-300">
              Drag file here or <span className="text-emerald-600 dark:text-emerald-400">click to upload</span>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
              Supports CSV log telemetry, PDF reports, or PNG snaps (Max 10MB)
            </p>
          </div>

          {/* List of attachments */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-slate-150/80 bg-white dark:border-zinc-900 dark:bg-zinc-950 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-extrabold text-slate-700 dark:text-zinc-300 truncate">{file.name}</span>
                    <span className="text-[9.5px] text-slate-400 dark:text-zinc-500 font-medium">({file.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAttachment(index);
                    }}
                    className="p-1 text-slate-450 hover:text-rose-500 rounded hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </AppDrawer>
  );
}
