import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmationDialogProps) {
  // Handle keyboard ESC to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  let accentBg = 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450';
  let buttonBg = 'bg-rose-650 hover:bg-rose-700 text-white';

  if (type === 'warning') {
    accentBg = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450';
    buttonBg = 'bg-amber-600 hover:bg-amber-700 text-white';
  } else if (type === 'info') {
    accentBg = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450';
    buttonBg = 'bg-emerald-600 hover:bg-emerald-700 text-white';
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-zinc-900 dark:bg-zinc-950"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-55 hover:text-slate-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start space-x-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentBg}`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 flex-1 pr-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-550 dark:text-zinc-450 leading-relaxed font-medium">
                    {description}
                  </p>
                </div>
              </div>

              {/* Actions row */}
              <div className="mt-6 flex items-center justify-end space-x-2.5">
                <button
                  onClick={onClose}
                  className="h-8.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`h-8.5 rounded-lg px-4 text-xs font-bold shadow-xs active:scale-98 transition-all cursor-pointer ${buttonBg}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
