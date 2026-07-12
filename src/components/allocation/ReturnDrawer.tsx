import React from 'react';
import AppDrawer from '../common/AppDrawer';
import { Allocation } from './types';
import { CornerUpLeft, Clipboard, ShieldCheck, Heart, Camera } from 'lucide-react';

interface ReturnDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: Allocation | null;
  onSubmit: (data: {
    allocationId: string;
    assetId: string;
    condition: 'New' | 'Good' | 'Fair' | 'Poor';
    damageNotes?: string;
    returnedDate: string;
    comments?: string;
  }) => void;
}

export default function ReturnDrawer({ isOpen, onClose, allocation, onSubmit }: ReturnDrawerProps) {
  const [condition, setCondition] = React.useState<'New' | 'Good' | 'Fair' | 'Poor'>('Good');
  const [damageNotes, setDamageNotes] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [returnedDate, setReturnedDate] = React.useState(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    if (allocation) {
      setCondition('Good');
      setDamageNotes('');
      setComments('');
      setReturnedDate(new Date().toISOString().split('T')[0]);
    }
  }, [allocation]);

  if (!allocation) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      allocationId: allocation.id,
      assetId: allocation.assetId,
      condition,
      damageNotes,
      returnedDate,
      comments,
    });
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-2 w-full select-none">
      <button
        type="button"
        onClick={onClose}
        className="h-8 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="return-lease-form"
        className="h-8 inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-4.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer shadow-xs"
      >
        <CornerUpLeft className="h-3.5 w-3.5" />
        <span>Terminate Lease & Return Asset</span>
      </button>
    </div>
  );

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Process Asset Return"
      description="Inspect physical hardware condition and verify recovery checksheets before terminating the active lease."
      footer={footer}
    >
      <form id="return-lease-form" onSubmit={handleFormSubmit} className="space-y-5 select-none">
        
        {/* Leased Item Details Banner */}
        <div className="rounded-xl border border-slate-150/40 bg-slate-50/20 p-4 dark:border-zinc-900 dark:bg-zinc-950/20 space-y-2">
          <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest">Active Lease Context</span>
          <div className="flex justify-between items-center text-xs">
            <div className="space-y-0.5">
              <p className="font-extrabold text-slate-800 dark:text-zinc-200">{allocation.assetName}</p>
              <span className="font-mono text-[9px] font-semibold bg-slate-100 dark:bg-zinc-900 text-slate-500 px-1.5 py-0.2 rounded-sm uppercase tracking-wider inline-block">
                {allocation.assetTag}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 dark:text-zinc-300">{allocation.employeeName}</p>
              <span className="text-[10px] text-slate-450 dark:text-zinc-500">{allocation.departmentName}</span>
            </div>
          </div>
        </div>

        {/* Condition Check */}
        <div className="space-y-2">
          <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider block">
            Return Condition Inspection
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['New', 'Good', 'Fair', 'Poor'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setCondition(opt)}
                className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  condition === opt
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-500 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-400'
                }`}
              >
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Damage Notes */}
        {condition === 'Poor' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-[10.5px] font-bold text-rose-500 uppercase tracking-wider block">
              Inspection Damage logs (Required)
            </label>
            <textarea
              required
              rows={3}
              placeholder="State damage details, visual scratch logs, or operational flaws detected..."
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/10 focus:outline-none focus:ring-2 focus:ring-rose-500/25 text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed"
            />
          </div>
        )}

        {/* Returned Date */}
        <div className="space-y-2">
          <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider block">
            Official Return Date
          </label>
          <input
            type="date"
            required
            value={returnedDate}
            onChange={(e) => setReturnedDate(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all cursor-pointer"
          />
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <label className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider block">
            Inspection / Operator Comments
          </label>
          <textarea
            rows={3}
            placeholder="Add hardware checklist verification notes..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all leading-relaxed"
          />
        </div>

        {/* Photos/Attachments Simulation */}
        <div className="space-y-2">
          <span className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider block">
            Condition Inspection photos
          </span>
          <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-slate-50/10 dark:bg-zinc-950/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-950/20 transition-all">
            <Camera className="h-5 w-5 text-slate-400 dark:text-zinc-500 mb-2" />
            <span className="text-[11px] font-extrabold text-slate-700 dark:text-zinc-300">Upload item inspection images</span>
            <span className="text-[9.5px] text-slate-400 mt-1">Accepts PNG, JPG, or HEIC (Up to 10MB)</span>
          </div>
        </div>

      </form>
    </AppDrawer>
  );
}
