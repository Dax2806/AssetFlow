import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  accent?: 'emerald' | 'zinc';
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  accent = 'zinc'
}: QuickActionCardProps) {
  return (
    <motion.button
      id={`quick-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      whileHover={{ y: -1.5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group flex items-center text-left rounded-xl border p-4 transition-all duration-200 outline-none w-full shadow-xs hover:shadow-sm cursor-pointer ${
        accent === 'emerald'
          ? 'border-emerald-100 bg-emerald-50/10 hover:border-emerald-200/80 hover:bg-emerald-50/20 dark:border-emerald-950/20 dark:bg-emerald-950/5 dark:hover:border-emerald-900/40'
          : 'border-slate-100 bg-white hover:border-slate-200 dark:border-zinc-900 dark:bg-zinc-950 dark:hover:border-zinc-850'
      }`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
        accent === 'emerald'
          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
          : 'bg-slate-50 text-slate-500 dark:bg-zinc-900 dark:text-zinc-400 group-hover:bg-slate-100 dark:group-hover:bg-zinc-850'
      }`}>
        <Icon className="h-4 w-4 shrink-0" />
      </div>

      <div className="ml-3.5 min-w-0 flex-1">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 leading-snug">
          {title}
        </h4>
        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500 truncate leading-normal">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
