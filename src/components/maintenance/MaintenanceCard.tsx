import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Hammer, Paperclip, Clock, ShieldAlert } from 'lucide-react';
import { MaintenanceWorkflowTask } from './types';
import PriorityBadge from './PriorityBadge';

interface MaintenanceCardProps {
  key?: React.Key;
  task: MaintenanceWorkflowTask;
  onClick: () => void;
}

export default function MaintenanceCard({ task, onClick }: MaintenanceCardProps) {
  const isSlaCritical = task.priority === 'Critical' && task.status !== 'Resolved';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.995 }}
      onClick={onClick}
      className={`group rounded-xl border bg-white p-4.5 dark:bg-zinc-950/60 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer text-left flex flex-col gap-3.5 select-none relative overflow-hidden ${
        isSlaCritical
          ? 'border-rose-200 dark:border-rose-900/50 hover:border-rose-350 bg-rose-50/10 dark:bg-rose-950/5'
          : 'border-slate-200/80 hover:border-slate-350 dark:border-zinc-900 dark:hover:border-zinc-800'
      }`}
    >
      {/* SLA highlight strip */}
      {isSlaCritical && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse" />
      )}

      {/* Header Info (Category + ID / Tag) */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest bg-slate-50 dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800 px-2 py-0.5 rounded-md">
          {task.assetTag}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Main Details */}
      <div className="space-y-1">
        <h4 className="text-xs font-black text-slate-850 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {task.issueTitle}
        </h4>
        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
          Asset: <span className="text-slate-800 dark:text-zinc-200 font-extrabold">{task.assetName}</span>
        </p>
        <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-medium line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Progress / SLA Indicators */}
      {task.status !== 'Resolved' && (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 dark:text-zinc-500">
          <Clock className={`w-3.5 h-3.5 ${isSlaCritical ? 'text-rose-500 dark:text-rose-400 animate-spin-slow' : 'text-slate-400'}`} />
          <span className={isSlaCritical ? 'text-rose-600 dark:text-rose-400 font-extrabold' : ''}>
            SLA: {task.slaHours} hrs remaining
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-zinc-900/60" />

      {/* Footer Details (Reported By, Tech Assigned, Attachments) */}
      <div className="flex items-center justify-between">
        {/* Reported By */}
        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-450 dark:text-zinc-500 font-semibold">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>{task.reportedBy}</span>
        </div>

        {/* Technician Avatar or Assign Label */}
        <div className="flex items-center gap-2">
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-0.5 text-[9.5px] text-slate-400 dark:text-zinc-500 font-bold mr-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments.length}</span>
            </div>
          )}

          {task.technicianName ? (
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-900 px-2 py-1 rounded-lg border border-slate-200/40 dark:border-zinc-800">
              <div className="h-4 w-4 rounded bg-emerald-600 flex items-center justify-center text-[8px] font-black text-white">
                {task.technicianName.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-[9.5px] font-extrabold text-slate-600 dark:text-zinc-400 max-w-[80px] truncate">
                {task.technicianName}
              </span>
            </div>
          ) : (
            <span className="text-[9.5px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Unassigned
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
