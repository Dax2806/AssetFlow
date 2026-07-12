import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {/* Breadcrumbs Row */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center space-x-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300 dark:text-zinc-700">/</span>}
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-slate-650 dark:hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {idx === 0 && <ArrowLeft className="h-3 w-3 inline-block" />}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span className="text-slate-700 dark:text-zinc-300 font-extrabold">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main title + Actions slot Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
