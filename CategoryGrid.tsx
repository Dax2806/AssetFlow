import React from 'react';
import { Building2, Users2, UserCog, FolderHeart } from 'lucide-react';
import { Department, Employee, AssetCategory } from './types';

interface SummaryStripProps {
  departments: Department[];
  employees: Employee[];
  categories: AssetCategory[];
}

export default function SummaryStrip({ departments, employees, categories }: SummaryStripProps) {
  const deptCount = departments.length;
  const empCount = employees.length;
  const headCount = departments.filter(d => d.headName !== 'Vacant').length;
  const catCount = categories.length;

  const kpis = [
    {
      title: 'Departments',
      value: deptCount,
      sub: `${departments.filter(d => d.status === 'Active').length} Active divisions`,
      icon: Building2,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30',
    },
    {
      title: 'Employees',
      value: empCount,
      sub: `${employees.filter(e => e.status === 'Active').length} Active members`,
      icon: Users2,
      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30',
    },
    {
      title: 'Department Heads',
      value: headCount,
      sub: `${departments.filter(d => d.headName === 'Vacant').length} Positions vacant`,
      icon: UserCog,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30',
    },
    {
      title: 'Asset Categories',
      value: catCount,
      sub: `${categories.filter(c => c.status === 'Active').length} Active classes`,
      icon: FolderHeart,
      color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4.5 shadow-xs dark:border-zinc-900 dark:bg-zinc-950 hover:shadow-sm hover:border-slate-200 dark:hover:border-zinc-850 transition-all duration-200"
          >
            <div className="space-y-1">
              <span className="text-[10.5px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-sans text-slate-800 dark:text-zinc-100">
                  {kpi.value}
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                {kpi.sub}
              </span>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${kpi.color}`}>
              <Icon className="h-5 w-5 shrink-0" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
