import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../types';
import { Shield, BookOpen, Key, CheckCircle, ArrowLeftRight, Package, ArrowUpRight } from 'lucide-react';

interface ActivityTimelineProps {
  activities: Activity[];
}

const TYPE_ICONS: Record<Activity['type'], any> = {
  allocation: Key,
  booking: BookOpen,
  maintenance: CheckCircle,
  audit: Shield,
  transfer: ArrowLeftRight,
  registration: Package
};

const TYPE_COLORS: Record<Activity['type'], string> = {
  allocation: 'text-slate-600 bg-slate-50 dark:text-zinc-300 dark:bg-zinc-900',
  booking: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40',
  maintenance: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
  audit: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40',
  transfer: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
  registration: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40'
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  // Format the ISO timestamp into a human readable friendly text (e.g., "10 mins ago", "1 hour ago", or "July 11, 10:45 AM")
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date('2026-07-11T21:32:53-07:00'); // Consistent system mock time
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-900">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Recent Activity
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500">
            Operational and audit events across the organization
          </p>
        </div>
      </div>

      <div className="relative mt-6 flow-root">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-zinc-900 dark:text-zinc-600">
              <Package className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-zinc-300">No events found</p>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500 max-w-xs">
              No audit logs or actions matched your current query or filter.
            </p>
          </div>
        ) : (
          <ul className="-mb-8">
            <AnimatePresence initial={false}>
              {activities.map((activity, activityIdx) => {
                const Icon = TYPE_ICONS[activity.type] || Package;
                const iconColorClass = TYPE_COLORS[activity.type] || 'text-slate-600 bg-slate-50 dark:text-zinc-300 dark:bg-zinc-900';

                return (
                  <motion.li
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative pb-8">
                      {/* Vertical connector line */}
                      {activityIdx !== activities.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-zinc-900"
                          aria-hidden="true"
                        />
                      )}
                      
                      <div className="relative flex space-x-3">
                        {/* Status Icon Indicator */}
                        <div>
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-zinc-950 ${iconColorClass}`}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </div>

                        {/* Event details block */}
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-xs text-slate-600 dark:text-zinc-300">
                              {activity.description}{' '}
                              {activity.assetTag && (
                                <span className="inline-flex items-center rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-500 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-100 dark:border-zinc-850">
                                  {activity.assetTag}
                                </span>
                              )}
                            </p>
                            <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-slate-400 dark:text-zinc-500">
                              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                {activity.user.name}
                              </span>
                              <span>•</span>
                              <span>{activity.user.email}</span>
                            </div>
                          </div>
                          
                          <div className="whitespace-nowrap text-right text-[10px] text-slate-400 dark:text-zinc-500">
                            <time dateTime={activity.timestamp}>{formatTime(activity.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
