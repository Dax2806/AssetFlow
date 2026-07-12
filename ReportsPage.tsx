import React from 'react';
import { MaintenanceWorkflowTask, MaintenanceStatus } from './types';
import MaintenanceCard from './MaintenanceCard';
import { ClipboardList, ThumbsUp, UserCheck, Play, CheckCircle } from 'lucide-react';

interface KanbanBoardProps {
  tasks: MaintenanceWorkflowTask[];
  onCardClick: (task: MaintenanceWorkflowTask) => void;
}

interface ColumnConfig {
  id: MaintenanceStatus;
  title: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
  icon: React.ComponentType<any>;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'Pending',
    title: 'Pending Approval',
    bgColor: 'bg-slate-50 dark:bg-zinc-900/40',
    borderColor: 'border-slate-200 dark:border-zinc-850',
    textColor: 'text-slate-800 dark:text-zinc-200',
    dotColor: 'bg-slate-400',
    icon: ClipboardList
  },
  {
    id: 'Approved',
    title: 'Approved',
    bgColor: 'bg-indigo-50/20 dark:bg-indigo-950/5',
    borderColor: 'border-indigo-100 dark:border-indigo-900/20',
    textColor: 'text-indigo-800 dark:text-indigo-350',
    dotColor: 'bg-indigo-500',
    icon: ThumbsUp
  },
  {
    id: 'Technician Assigned',
    title: 'Tech Assigned',
    bgColor: 'bg-amber-50/25 dark:bg-amber-950/5',
    borderColor: 'border-amber-100 dark:border-amber-900/20',
    textColor: 'text-amber-800 dark:text-amber-350',
    dotColor: 'bg-amber-500',
    icon: UserCheck
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    bgColor: 'bg-emerald-50/10 dark:bg-emerald-950/5',
    borderColor: 'border-emerald-100 dark:border-emerald-900/20',
    textColor: 'text-emerald-800 dark:text-emerald-350',
    dotColor: 'bg-emerald-500',
    icon: Play
  },
  {
    id: 'Resolved',
    title: 'Resolved',
    bgColor: 'bg-slate-50/40 dark:bg-zinc-900/10',
    borderColor: 'border-slate-150 dark:border-zinc-900/60',
    textColor: 'text-slate-500 dark:text-zinc-450',
    dotColor: 'bg-slate-350',
    icon: CheckCircle
  }
];

export default function KanbanBoard({ tasks, onCardClick }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5 overflow-x-auto pb-4 scrollbar-thin select-none">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            className={`flex flex-col rounded-2xl border ${column.bgColor} ${column.borderColor} p-4.5 min-h-[580px] w-full shrink-0 md:w-auto`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-4 select-none">
              <div className="flex items-center gap-2.5">
                <div className={`h-2.5 w-2.5 rounded-full ${column.dotColor}`} />
                <h3 className={`text-xs font-black tracking-tight uppercase ${column.textColor}`}>
                  {column.title}
                </h3>
              </div>
              <span className="inline-flex h-5 items-center justify-center rounded-full bg-slate-150/70 dark:bg-zinc-900 border border-slate-200/20 px-2.5 text-[10px] font-black text-slate-500 dark:text-zinc-400">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[560px] pr-1.5 scrollbar-thin scrollbar-thumb-rounded">
              {columnTasks.length === 0 ? (
                <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-zinc-900 p-4 text-center select-none">
                  <Icon className="h-6 w-6 text-slate-300 dark:text-zinc-800" />
                  <p className="mt-2 text-[9.5px] font-extrabold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
                    Empty Column
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <MaintenanceCard
                    key={task.id}
                    task={task}
                    onClick={() => onCardClick(task)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
