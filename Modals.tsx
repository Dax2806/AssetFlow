import React from 'react';
import { MaintenanceTask } from '../types';
import { CheckCircle2, AlertTriangle, Clock, Hammer } from 'lucide-react';

interface MaintenanceTableProps {
  tasks: MaintenanceTask[];
  onCompleteTask: (taskId: string) => void;
}

export default function MaintenanceTable({ tasks, onCompleteTask }: MaintenanceTableProps) {
  const getPriorityStyle = (priority: MaintenanceTask['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40';
      case 'Medium':
        return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-850';
      case 'Low':
        return 'bg-slate-50/50 text-slate-500 border-slate-100/80 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-900';
    }
  };

  const getStatusStyle = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40';
      case 'In Progress':
        return 'text-blue-700 bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40';
      case 'Pending':
        return 'text-slate-500 bg-slate-50 border border-slate-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-850';
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-900">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Upcoming Maintenance
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500">
            Pending inspections and active service orders
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-zinc-900 dark:text-zinc-600">
              <Hammer className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-zinc-300">All clear</p>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500 max-w-xs">
              No outstanding maintenance tickets registered.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[500px] table-auto border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider dark:border-zinc-900 dark:text-zinc-500">
                <th className="pb-3 pt-1 font-bold">Asset / Tag</th>
                <th className="pb-3 pt-1 font-bold">Priority</th>
                <th className="pb-3 pt-1 font-bold">Due Date</th>
                <th className="pb-3 pt-1 font-bold">Technician</th>
                <th className="pb-3 pt-1 font-bold">Status</th>
                <th className="pb-3 pt-1 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {tasks.map((task) => (
                <tr key={task.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3.5 pr-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-950 dark:text-zinc-200 truncate max-w-[160px]">
                        {task.assetName}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        {task.assetTag}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-medium border ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className="text-xs text-slate-600 dark:text-zinc-400 font-normal">
                      {task.dueDate}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className="text-xs text-slate-700 dark:text-zinc-300 font-semibold">
                      {task.technician}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-medium ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {task.status !== 'Completed' ? (
                      <button
                        onClick={() => onCompleteTask(task.id)}
                        className="inline-flex h-6 items-center space-x-1.5 rounded bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-slate-200 dark:border-zinc-800 px-2.5 text-[10px] font-medium text-slate-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Sign Off</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
