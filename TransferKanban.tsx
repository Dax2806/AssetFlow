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
    const date = new Date();
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="flex flex-col justify-between space-y-4 pb-2 sm:flex-row sm:items-end sm:space-y-0 shrink-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {getGreeting()}, {userName}
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 font-normal">
          Everything is running smoothly today. <span className="font-semibold text-emerald-600 dark:text-emerald-400">{attentionCount} assets</span> require active oversight.
        </p>
      </div>

      <div className="text-left sm:text-right">
        <div className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
          {getWeekday()}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
          {getFormattedDate()}
        </div>
      </div>
    </header>
  );
}
