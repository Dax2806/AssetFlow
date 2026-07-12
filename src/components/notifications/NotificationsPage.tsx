import React from 'react';
import { 
  Bell, Activity as ActivityIcon, Check, CheckCircle2, AlertTriangle, 
  Trash2, Search, Filter, Calendar, User, ArrowRight, CornerDownRight, 
  Clock, ShieldAlert, Sparkles, RefreshCw, Key, BookOpen, CheckSquare, 
  Share2, ShieldCheck, Mail, Info, UserCheck, Inbox, Archive
} from 'lucide-react';
import { SystemNotification, Activity } from '../../types';

interface NotificationsPageProps {
  notifications: SystemNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>;
  activities: Activity[];
  onAddActivity: (activity: Activity) => void;
}

export default function NotificationsPage({ 
  notifications, 
  setNotifications, 
  activities,
  onAddActivity 
}: NotificationsPageProps) {
  
  // Tabs: 'notifications' | 'activities'
  const [activeTab, setActiveTab] = React.useState<'notifications' | 'activities'>('notifications');

  // Search & Filter state for Activities
  const [activitySearch, setActivitySearch] = React.useState('');
  const [activityTypeFilter, setActivityTypeFilter] = React.useState('All');
  const [activityUserFilter, setActivityUserFilter] = React.useState('All');

  // Computed Users for activities dropdown
  const activityUsers = React.useMemo(() => {
    const users = new Set<string>();
    activities.forEach(a => { if (a.user?.name) users.add(a.user.name); });
    return ['All', ...Array.from(users)];
  }, [activities]);

  // Helper to determine notification groupings
  const groupedNotifications = React.useMemo(() => {
    const today: SystemNotification[] = [];
    const yesterday: SystemNotification[] = [];
    const earlier: SystemNotification[] = [];

    notifications.forEach((notif) => {
      const ts = notif.timestamp.toLowerCase();
      if (ts.includes('m ago') || ts.includes('h ago') || ts.includes('today') || ts.includes('12')) {
        today.push(notif);
      } else if (ts.includes('1d ago') || ts.includes('yesterday') || ts.includes('11')) {
        yesterday.push(notif);
      } else {
        earlier.push(notif);
      }
    });

    return { today, yesterday, earlier };
  }, [notifications]);

  // Handle Mark Notification Read/Unread
  const toggleReadStatus = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  // Dismiss / Archive notification
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Mark all read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Action Buttons Handler (triggers state updates and pushes a timeline activity entry)
  const resolveAction = (notificationId: string, actionType: string, extraData: any, approved: boolean) => {
    // Locate notification
    const targetNotif = notifications.find(n => n.id === notificationId);
    if (!targetNotif) return;

    // Remove notification (as it is now resolved)
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    // Log the corresponding activity item
    const actionLabel = approved ? 'Approved' : 'Rejected/Addressed';
    const descriptionText = `${targetNotif.title} resolved. Status: ${actionLabel}. Details: ${targetNotif.message}`;

    onAddActivity({
      id: `act-${Date.now()}`,
      type: actionType === 'transfer_approve' ? 'transfer' : actionType === 'booking_confirm' ? 'booking' : 'maintenance',
      description: descriptionText,
      timestamp: new Date().toISOString(),
      user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
    });
  };

  // Filtered Activities
  const filteredActivities = React.useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = 
        activity.description.toLowerCase().includes(activitySearch.toLowerCase()) ||
        (activity.assetName && activity.assetName.toLowerCase().includes(activitySearch.toLowerCase())) ||
        (activity.assetTag && activity.assetTag.toLowerCase().includes(activitySearch.toLowerCase())) ||
        activity.user.name.toLowerCase().includes(activitySearch.toLowerCase());

      const matchesType = activityTypeFilter === 'All' || activity.type === activityTypeFilter;
      const matchesUser = activityUserFilter === 'All' || activity.user.name === activityUserFilter;

      return matchesSearch && matchesType && matchesUser;
    });
  }, [activities, activitySearch, activityTypeFilter, activityUserFilter]);

  // Icons based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />;
      case 'alert':
        return <ShieldAlert className="h-4.5 w-4.5 text-rose-500 dark:text-rose-400" />;
      default:
        return <Info className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-white dark:bg-zinc-950/30 opacity-70 border-slate-150 dark:border-zinc-900';
    switch (type) {
      case 'alert':
        return 'bg-rose-50/20 dark:bg-rose-950/5 border-rose-100 dark:border-rose-900/30';
      case 'warning':
        return 'bg-amber-50/20 dark:bg-amber-950/5 border-amber-100 dark:border-amber-900/30';
      default:
        return 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-900';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'allocation':
        return <Key className="w-4 h-4 text-slate-500 dark:text-zinc-400" />;
      case 'booking':
        return <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
      case 'maintenance':
        return <CheckSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case 'audit':
        return <ShieldCheck className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      case 'transfer':
        return <ArrowRight className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      default:
        return <Inbox className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    }
  };

  return (
    <div className="w-full px-6 py-8 md:px-8 space-y-8 select-none text-left">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-150 pb-5 dark:border-zinc-900 select-none">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-zinc-500 mb-1 select-none">
            <Bell className="h-4 w-4 text-indigo-500" />
            <span>Workspace Operations Center</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Notifications & Timeline
          </h1>
          <p className="text-[11px] font-medium text-slate-450 dark:text-zinc-500 mt-1">
            Dispatch urgent requests, approve asset moves, and filter complete audit logs.
          </p>
        </div>

        {/* Tab Selector Mode */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl self-start sm:self-auto select-none">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-zinc-850 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-450 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications ({notifications.filter(n => !n.read).length})</span>
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-white dark:bg-zinc-850 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-450 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            <ActivityIcon className="w-3.5 h-3.5" />
            <span>Activity Log</span>
          </button>
        </div>
      </div>

      {/* 2. TABBED CONTENT: NOTIFICATIONS PANEL */}
      {activeTab === 'notifications' ? (
        <div className="space-y-6 select-none text-left">
          
          {/* Header Controls for Notifications */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-slate-450" />
              <span>System Alerts & Inbox</span>
            </h3>
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-black text-emerald-600 hover:text-emerald-750 dark:text-emerald-400 dark:hover:text-emerald-300 uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List Empty State */}
          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-900 p-12 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-950/20">
              <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-850">
                <Archive className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                All Cleared!
              </h4>
              <p className="text-[10.5px] text-slate-450 dark:text-zinc-550 mt-1 max-w-sm">
                No active notifications or required sign-offs. Your operations are currently in sync.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Group: TODAY */}
              {groupedNotifications.today.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[9.5px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block ml-1">
                    Today
                  </span>
                  <div className="space-y-3">
                    {groupedNotifications.today.map((notif) => (
                      <div
                        key={notif.id}
                        className={`rounded-2xl border p-4.5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${getNotificationBg(notif.type, notif.read)}`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="mt-0.5 shrink-0">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2.5">
                              <span className={`text-xs font-black uppercase tracking-wider ${notif.read ? 'text-slate-500 dark:text-zinc-400' : 'text-slate-900 dark:text-white'}`}>
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] font-semibold text-slate-650 dark:text-zinc-400 leading-relaxed max-w-2xl">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold block pt-0.5">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Interactive actions */}
                        <div className="flex items-center space-x-2 shrink-0 md:self-center">
                          {notif.actionable && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => resolveAction(notif.id, notif.actionType || '', notif.actionData, true)}
                                className="h-7.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => resolveAction(notif.id, notif.actionType || '', notif.actionData, false)}
                                className="h-7.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 dark:border-zinc-800 dark:hover:bg-zinc-900 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <span>Dismiss</span>
                              </button>
                            </div>
                          )}

                          {/* Controls to mark read / delete */}
                          <div className="flex items-center space-x-1.5 border-l border-slate-150 pl-2.5 dark:border-zinc-900/60">
                            <button
                              onClick={() => toggleReadStatus(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                              title={notif.read ? 'Mark Unread' : 'Mark Read'}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                              title="Delete Notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: YESTERDAY */}
              {groupedNotifications.yesterday.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[9.5px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block ml-1">
                    Yesterday
                  </span>
                  <div className="space-y-3">
                    {groupedNotifications.yesterday.map((notif) => (
                      <div
                        key={notif.id}
                        className={`rounded-2xl border p-4.5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${getNotificationBg(notif.type, notif.read)}`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="mt-0.5 shrink-0">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2.5">
                              <span className={`text-xs font-black uppercase tracking-wider ${notif.read ? 'text-slate-500 dark:text-zinc-400' : 'text-slate-900 dark:text-white'}`}>
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] font-semibold text-slate-650 dark:text-zinc-400 leading-relaxed max-w-2xl">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold block pt-0.5">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Interactive actions */}
                        <div className="flex items-center space-x-2 shrink-0 md:self-center">
                          {notif.actionable && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => resolveAction(notif.id, notif.actionType || '', notif.actionData, true)}
                                className="h-7.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
                              >
                                <Check className="w-3  h-3" />
                                <span>Resolve</span>
                              </button>
                            </div>
                          )}

                          {/* Controls to mark read / delete */}
                          <div className="flex items-center space-x-1.5 border-l border-slate-150 pl-2.5 dark:border-zinc-900/60">
                            <button
                              onClick={() => toggleReadStatus(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                              title={notif.read ? 'Mark Unread' : 'Mark Read'}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                              title="Delete Notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group: EARLIER */}
              {groupedNotifications.earlier.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[9.5px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block ml-1">
                    Earlier
                  </span>
                  <div className="space-y-3">
                    {groupedNotifications.earlier.map((notif) => (
                      <div
                        key={notif.id}
                        className={`rounded-2xl border p-4.5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${getNotificationBg(notif.type, notif.read)}`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="mt-0.5 shrink-0">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2.5">
                              <span className={`text-xs font-black uppercase tracking-wider ${notif.read ? 'text-slate-500 dark:text-zinc-400' : 'text-slate-900 dark:text-white'}`}>
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] font-semibold text-slate-650 dark:text-zinc-400 leading-relaxed max-w-2xl">
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold block pt-0.5">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Interactive actions */}
                        <div className="flex items-center space-x-2 shrink-0 md:self-center">
                          {/* Controls to mark read / delete */}
                          <div className="flex items-center space-x-1.5 pl-2.5">
                            <button
                              onClick={() => toggleReadStatus(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                              title={notif.read ? 'Mark Unread' : 'Mark Read'}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                              title="Delete Notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        // TIMELINE TAB (ACTIVITY LOG)
        <div className="space-y-6 select-none text-left">
          
          {/* Controls Bar for Activity Timeline */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900/80 dark:bg-zinc-950/40 grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
            
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
                Search logs
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  placeholder="Filter by description, tags or users..."
                  className="w-full h-10 px-3.5 pl-9.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Type / Module Filter */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
                Filter Module / Operation
              </label>
              <div className="relative">
                <select
                  value={activityTypeFilter}
                  onChange={(e) => setActivityTypeFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
                >
                  <option value="All">All Operations</option>
                  <option value="allocation">Asset Assigned (Allocation)</option>
                  <option value="booking">Booking Created (Booking)</option>
                  <option value="maintenance">Maintenance Approved</option>
                  <option value="transfer">Transfer Completed</option>
                  <option value="audit">Audit Closed</option>
                  <option value="registration">Asset Registered</option>
                </select>
                <Filter className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* User Filter */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
                Triggered Actor
              </label>
              <div className="relative">
                <select
                  value={activityUserFilter}
                  onChange={(e) => setActivityUserFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
                >
                  {activityUsers.map(u => (
                    <option key={u} value={u}>
                      {u === 'All' ? 'All Workspace Actors' : u}
                    </option>
                  ))}
                </select>
                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Timeline Node List */}
          <div className="relative">
            {filteredActivities.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-900 p-12 text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-950/20">
                <Search className="h-6 w-6 text-slate-400" />
                <h4 className="mt-4 text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  No Matching Logs
                </h4>
                <p className="text-[10.5px] text-slate-450 dark:text-zinc-550 mt-1">
                  We couldn't find any activities matching those specific search filters.
                </p>
              </div>
            ) : (
              <div className="flow-root mt-4">
                
                {/* Vertical Central Line */}
                <div className="absolute left-[26px] top-4 bottom-4 w-0.5 bg-slate-150 dark:bg-zinc-900/70" />

                <ul className="space-y-6">
                  {filteredActivities.map((activity, idx) => (
                    <li key={activity.id} className="relative flex items-start gap-4">
                      
                      {/* Left circular node with custom icon inside */}
                      <div className="h-13 w-13 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 flex items-center justify-center shrink-0 z-10 shadow-3xs">
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Right timeline card body */}
                      <div className="flex-1 bg-white dark:bg-zinc-950/40 border border-slate-150 dark:border-zinc-900 p-4.5 rounded-2xl space-y-2">
                        
                        {/* Title Row with badge and Actor */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 select-none">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase">
                              {activity.type === 'allocation' ? 'Asset Allocation' :
                               activity.type === 'booking' ? 'Resource Booking' :
                               activity.type === 'maintenance' ? 'Maintenance Workflow' :
                               activity.type === 'audit' ? 'Compliance Audit' :
                               activity.type === 'transfer' ? 'Asset Transfer' : 'Registration Log'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">•</span>
                            <span className="text-[10px] text-slate-450 dark:text-zinc-500 font-extrabold flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{activity.user.name}</span>
                            </span>
                          </div>
                          
                          {/* Relative Timestamp */}
                          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Description message */}
                        <p className="text-[11.5px] font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                          {activity.description}
                        </p>

                        {/* If asset fields exist, show connected Asset tag context */}
                        {activity.assetTag && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">Connected Asset:</span>
                            <span className="inline-flex px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-900/60 text-[9.5px] font-mono font-bold text-slate-700 dark:text-zinc-300 border border-slate-200/40 dark:border-zinc-800">
                              [{activity.assetTag}] {activity.assetName}
                            </span>
                          </div>
                        )}

                        {/* Small footer identifier */}
                        <div className="pt-2 border-t border-slate-50 dark:border-zinc-900/20 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                          <span>Log UID: {activity.id}</span>
                          <span>Actor Email: {activity.user.email}</span>
                        </div>

                      </div>
                    </li>
                  ))}
                </ul>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
