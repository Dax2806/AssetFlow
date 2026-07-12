import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/40 p-12 text-center dark:border-zinc-850 dark:bg-zinc-950/20"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-zinc-900 dark:text-zinc-500 mb-4 shadow-xs">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400 dark:text-zinc-500 leading-normal">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex h-8.5 items-center space-x-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </motion.div>
  );
}
