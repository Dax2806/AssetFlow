import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
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
  id,
  title,
  value,
  icon: Icon,
  trend,
  description
}: MetricCardProps) {
  // Determine icon color based on title to reflect professional accents
  let iconColor = "text-slate-400 dark:text-zinc-500";
  if (title.toLowerCase().includes("available")) {
    iconColor = "text-emerald-500 dark:text-emerald-400";
  } else if (title.toLowerCase().includes("maintenance")) {
    iconColor = "text-amber-500 dark:text-amber-400";
  } else if (title.toLowerCase().includes("allocated")) {
    iconColor = "text-indigo-500 dark:text-indigo-400";
  } else if (title.toLowerCase().includes("booking")) {
    iconColor = "text-rose-500 dark:text-rose-400";
  } else if (title.toLowerCase().includes("transfer")) {
    iconColor = "text-cyan-500 dark:text-cyan-400";
  } else if (title.toLowerCase().includes("return")) {
    iconColor = "text-violet-500 dark:text-violet-400";
  }

  return (
    <motion.div
      id={id}
      whileHover={{ y: -1.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-white border border-slate-100 dark:border-zinc-900 dark:bg-zinc-950 p-5 rounded-2xl shadow-xs hover:shadow-sm hover:border-slate-200 dark:hover:border-zinc-850 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-1.5 bg-slate-50/80 dark:bg-zinc-900 rounded-lg">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        {trend && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              trend.type === "positive"
                ? "text-emerald-700 bg-emerald-50/80 dark:text-emerald-400 dark:bg-emerald-950/40"
                : trend.type === "negative"
                ? "text-red-700 bg-red-50/80 dark:text-red-400 dark:bg-red-950/40"
                : "text-slate-500 bg-slate-100 dark:text-zinc-400 dark:bg-zinc-800"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div>
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
          {title}
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1 leading-none">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-normal mt-2 leading-tight">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
