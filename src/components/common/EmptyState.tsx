import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/20 dark:bg-zinc-950/5 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 mb-4 border border-slate-100 dark:border-zinc-800">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-tight">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 h-8 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
