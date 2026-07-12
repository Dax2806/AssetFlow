import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemNotification } from '../types';
import { X, CheckCircle2, AlertCircle, Info, Trash2, Check } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllRead: () => void;
  onDismissNotification: (id: string) => void;
  onResolveNotificationAction: (id: string, actionType: string, actionData?: Record<string, any>) => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onDismissNotification,
  onResolveNotificationAction
}: NotificationPanelProps) {
  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-sm flex-col border-l border-zinc-100 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-zinc-50 px-5 dark:border-zinc-900">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Notification Center
                </span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-1.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {notifications.filter(n => !n.read).length} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {notifications.length > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="rounded px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="rounded-full bg-zinc-50 p-2 text-zinc-400 dark:bg-zinc-900/60 dark:text-zinc-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">You're all caught up</p>
                  <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                    No new system alerts or actions require your attention right now.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative rounded-md border p-3.5 transition-all ${
                      notification.read
                        ? 'border-zinc-50 bg-white/50 dark:border-zinc-900/40 dark:bg-zinc-950/30'
                        : 'border-zinc-100 bg-white shadow-xs hover:border-zinc-200 dark:border-zinc-900 dark:bg-zinc-950 dark:hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-semibold ${
                            notification.read ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {notification.title}
                          </p>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {notification.message}
                        </p>

                        {/* Action buttons for Actionable notifications */}
                        {!notification.read && notification.actionable && notification.actionType && (
                          <div className="mt-3 flex items-center space-x-2">
                            <button
                              onClick={() => onResolveNotificationAction(
                                notification.id,
                                notification.actionType!,
                                notification.actionData
                              )}
                              className="inline-flex h-6.5 items-center space-x-1 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 px-2.5 text-[10px] font-medium text-white dark:text-zinc-900 transition-all"
                            >
                              <Check className="h-3 w-3" />
                              <span>Resolve Alert</span>
                            </button>
                            <button
                              onClick={() => onDismissNotification(notification.id)}
                              className="inline-flex h-6.5 items-center rounded border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-2 text-[10px] font-medium text-zinc-500 hover:text-zinc-700 transition-all"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Icon Button on hover */}
                    <button
                      onClick={() => onDismissNotification(notification.id)}
                      className="absolute right-2 top-2 rounded p-1 opacity-0 group-hover:opacity-100 text-zinc-400 hover:bg-zinc-50 hover:text-red-500 transition-all dark:hover:bg-zinc-900"
                      title="Delete Notification"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer with counts and status summary */}
            <div className="border-t border-zinc-50 bg-zinc-50/50 p-4 dark:border-zinc-900 dark:bg-zinc-900/20 text-center">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                System uptime 99.98% • Dublin / West Europe region
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
