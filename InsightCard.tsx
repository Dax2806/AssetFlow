import React from 'react';
import { Calendar } from 'lucide-react';

interface PageHeaderProps {
  userName: string;
  attentionCount?: number;
}

export default function PageHeader({ userName, attentionCount = 7 }: PageHeaderProps) {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWeekday = () => {
    const date = new Date('2026-07-11T21:32:53-07:00'); // Consistent system mock time
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDate = () => {
    const date = new Date('2026-07-11T21:32:53-07:00'); // Consistent system mock time
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="flex flex-col justify-between space-y-4 pb-2 sm:flex-row sm:items-end sm:space-y-0 shrink-0">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {getGreeting()}, {userName} 👋
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400">
          Everything is running smoothly today. <span className="font-medium text-emerald-600 dark:text-emerald-400">{attentionCount} assets</span> need your attention.
        </p>
      </div>

      <div className="text-left sm:text-right">
        <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
          {getWeekday()}
        </div>
        <div className="text-sm font-medium text-slate-700 dark:text-zinc-300 mt-1">
          {getFormattedDate()}
        </div>
      </div>
    </header>
  );
}
