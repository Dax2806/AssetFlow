import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  description: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: MetricCardProps) {
  let iconColor = 'text-slate-400 dark:text-zinc-500';
  if (title.toLowerCase().includes('available')) {
    iconColor = 'text-emerald-500 dark:text-emerald-400';
  } else if (title.toLowerCase().includes('maintenance')) {
    iconColor = 'text-amber-500 dark:text-amber-400';
  } else if (title.toLowerCase().includes('allocated')) {
    iconColor = 'text-indigo-500 dark:text-indigo-400';
  } else if (title.toLowerCase().includes('booking') || title.toLowerCase().includes('valuation')) {
    iconColor = 'text-rose-500 dark:text-rose-400';
  } else if (title.toLowerCase().includes('transfer') || title.toLowerCase().includes('registered')) {
    iconColor = 'text-cyan-500 dark:text-cyan-400';
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white border border-slate-200/80 dark:border-zinc-900 dark:bg-zinc-950 p-4 rounded-xl shadow-xs hover:shadow-sm hover:border-slate-300 dark:hover:border-zinc-850 transition-all duration-200 flex flex-col justify-between h-[115px]"
    >
      <div className="flex justify-between items-start">
        <div className="p-1.5 bg-slate-50 dark:bg-zinc-900 rounded-lg">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        {trend && (
          <span
            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
              trend.type === 'positive'
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                : trend.type === 'negative'
                ? 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'
                : 'text-slate-500 bg-slate-100 dark:text-zinc-400 dark:bg-zinc-805'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-2">
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold">
          {title}
        </div>
        <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 font-medium truncate mt-0.5">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
