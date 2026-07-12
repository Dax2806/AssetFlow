import React from 'react';
import PageHeader from './components/PageHeader';
import TopNav from './components/TopNav';
import MetricCard from './components/MetricCard';
import AssetStatusChart from './components/AssetStatusChart';
import UtilizationChart from './components/UtilizationChart';
import ActivityTimeline from './components/ActivityTimeline';
import MaintenanceTable from './components/MaintenanceTable';
import BookingTable from './components/BookingTable';
import AssetHealthOverview from './components/AssetHealthOverview';
import QuickActionCard from './components/QuickActionCard';
import NotificationPanel from './components/NotificationPanel';
import OrganizationPage from './components/organization/OrganizationPage';

// Modals
import {
  RegisterAssetModal,
  AllocateAssetModal,
  BookResourceModal,
  RaiseMaintenanceModal,
  CreateAuditModal
} from './components/Modals';

// Mock Data
import {
  INITIAL_ASSETS,
  INITIAL_ACTIVITIES,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  HISTORICAL_UTILIZATION
} from './data/mockData';

// Types
import { Asset, Activity, MaintenanceTask, Booking, SystemNotification, AssetCategory, PriorityLevel } from './types';

// Icons
import {
  ShieldAlert,
  FolderKanban,
  CheckCircle,
  CalendarDays,
  RefreshCw,
  Clock,
  Laptop,
  Hammer,
  PlusCircle,
  BookOpen,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Global States
  const [assets, setAssets] = React.useState<Asset[]>(INITIAL_ASSETS);
  const [activities, setActivities] = React.useState<Activity[]>(INITIAL_ACTIVITIES);
  const [maintenanceTasks, setMaintenanceTasks] = React.useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [bookings, setBookings] = React.useState<Booking[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = React.useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [utilizationData] = React.useState(HISTORICAL_UTILIZATION);

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All');
  const [darkMode, setDarkMode] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'organization'>('dashboard');
  const [isNotifPanelOpen, setIsNotifPanelOpen] = React.useState(false);

  // Modal Visibility States
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const [isAllocateOpen, setIsAllocateOpen] = React.useState(false);
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = React.useState(false);
  const [isAuditOpen, setIsAuditOpen] = React.useState(false);

  // Theme Syncing Effect
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute live KPI counts based on active states
  const kpis = React.useMemo(() => {
    const available = assets.filter(a => a.status === 'available').length;
    const allocated = assets.filter(a => a.status === 'allocated').length;
    
    // Maintenance Today (tasks active today or marked as In Progress)
    const maintenance = maintenanceTasks.filter(t => t.status === 'In Progress' || t.dueDate === '2026-07-11').length;
    
    // Active Bookings (Confirmed or In Progress)
    const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
    
    // Pending Transfers (simulated counter, or filter activities with transfer type in the last 24h)
    const pendingTransfers = notifications.filter(n => n.title.toLowerCase().includes('transfer') && !n.read).length || 1;
    
    // Upcoming Returns (items scheduled to return or assets in lost status that are being monitored)
    const upcomingReturns = assets.filter(a => a.status === 'allocated' && a.purchaseDate < '2024-01-01').length;

    return {
      available,
      allocated,
      maintenance,
      activeBookings,
      pendingTransfers,
      upcomingReturns
    };
  }, [assets, maintenanceTasks, bookings, notifications]);

  // Handle Registering a New Asset
  const handleRegisterAsset = (data: { name: string; category: AssetCategory; location: string; value: number }) => {
    const nextId = String(assets.length + 1);
    const tag = `AF-${100 + Number(nextId)}`;
    const newAsset: Asset = {
      id: nextId,
      name: data.name,
      tag,
      category: data.category,
      status: 'available',
      location: data.location,
      value: data.value,
      purchaseDate: new Date().toISOString().split('T')[0]
    };

    setAssets(prev => [newAsset, ...prev]);

    // Create an Activity Log entry
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      assetId: nextId,
      assetName: data.name,
      assetTag: tag,
      type: 'registration',
      description: `Asset registered: ${data.name} (${tag})`,
      timestamp: new Date().toISOString(),
      user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
    };

    setActivities(prev => [newActivity, ...prev]);

    // Add notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Asset Registered',
      message: `${data.name} (${tag}) added to ${data.category} database.`,
      type: 'success',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handle Allocating an Asset to a user
  const handleAllocateAsset = (data: { assetId: string; assignee: string; location: string }) => {
    const asset = assets.find(a => a.id === data.assetId);
    if (!asset) return;

    setAssets(prev =>
      prev.map(a =>
        a.id === data.assetId
          ? { ...a, status: 'allocated', assignedTo: data.assignee, location: data.location }
          : a
      )
    );

    // Create Activity Log entry
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      assetId: asset.id,
      assetName: asset.name,
      assetTag: asset.tag,
      type: 'allocation',
      description: `Laptop ${asset.tag} allocated to ${data.assignee}`,
      timestamp: new Date().toISOString(),
      user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Handle Booking a resource or meeting room
  const handleBookResource = (data: { resourceName: string; resourceType: 'Room' | 'Vehicle' | 'Equipment'; bookedBy: string; email: string; durationHours: number }) => {
    const nextId = `book-${Date.now()}`;
    const now = new Date();
    const end = new Date(now.getTime() + data.durationHours * 60 * 60 * 1000);

    const newBooking: Booking = {
      id: nextId,
      resourceName: data.resourceName,
      resourceType: data.resourceType,
      bookedBy: data.bookedBy,
      userEmail: data.email,
      startTime: now.toISOString(),
      endTime: end.toISOString(),
      status: 'Confirmed'
    };

    setBookings(prev => [newBooking, ...prev]);

    // Create Activity entry
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'booking',
      description: `${data.resourceName} booked for ${data.durationHours} hours by ${data.bookedBy}`,
      timestamp: now.toISOString(),
      user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Handle Raising a Maintenance ticket
  const handleRaiseMaintenance = (data: { assetId: string; priority: PriorityLevel; technician: string; description: string }) => {
    const asset = assets.find(a => a.id === data.assetId);
    if (!asset) return;

    // Change asset status to maintenance
    setAssets(prev =>
      prev.map(a => (a.id === data.assetId ? { ...a, status: 'maintenance' } : a))
    );

    const nextId = `maint-${Date.now()}`;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newTask: MaintenanceTask = {
      id: nextId,
      assetName: asset.name,
      assetTag: asset.tag,
      priority: data.priority,
      dueDate: tomorrow.toISOString().split('T')[0],
      technician: data.technician,
      status: 'Pending',
      description: data.description
    };

    setMaintenanceTasks(prev => [newTask, ...prev]);

    // Create Activity log
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      assetId: asset.id,
      assetName: asset.name,
      assetTag: asset.tag,
      type: 'maintenance',
      description: `Maintenance order dispatched for ${asset.name} (${asset.tag})`,
      timestamp: new Date().toISOString(),
      user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Handle Creating an Audit Log entry
  const handleCreateAudit = (data: { location: string; auditorName: string }) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'audit',
      description: `Comprehensive hardware audit completed for ${data.location}`,
      timestamp: new Date().toISOString(),
      user: { name: data.auditorName, email: `${data.auditorName.toLowerCase().replace(' ', '.')}@assetflow.com` }
    };

    setActivities(prev => [newActivity, ...prev]);

    // Push system alert notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Location Audit Authorized',
      message: `Supervisor ${data.auditorName} has signed off the physical audit in ${data.location}.`,
      type: 'info',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Complete/Resolve Maintenance Task (Sign-off)
  const handleCompleteMaintenanceTask = (taskId: string) => {
    const task = maintenanceTasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task status
    setMaintenanceTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'Completed' } : t))
    );

    // Return asset back to available status
    setAssets(prev =>
      prev.map(a => (a.tag === task.assetTag ? { ...a, status: 'available' } : a))
    );

    // Log Activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      assetTag: task.assetTag,
      type: 'maintenance',
      description: `Maintenance Completed: ${task.assetName} signed off by ${task.technician}`,
      timestamp: new Date().toISOString(),
      user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Check In / End Booking Sessions Live
  const handleCheckInBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const nextStatus = b.status === 'Confirmed' ? 'In Progress' : 'Completed';
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  // Notification Actions
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleResolveNotificationAction = (id: string, actionType: string, actionData?: Record<string, any>) => {
    // Perform simulated resolutions
    if (actionType === 'maintenance_signoff' && actionData) {
      const tag = actionData.assetTag;
      // Mark asset as available
      setAssets(prev => prev.map(a => a.tag === tag ? { ...a, status: 'available' } : a));
    }
    handleDismissNotification(id);
  };

  // Global search filtering logic for absolute zero visual slop
  const filteredActivities = React.useMemo(() => {
    return activities.filter(act => {
      const matchesSearch =
        act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.assetTag && act.assetTag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        act.user.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        categoryFilter === 'All' ||
        assets.find(a => a.tag === act.assetTag)?.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [activities, searchQuery, categoryFilter, assets]);

  const filteredMaintenance = React.useMemo(() => {
    return maintenanceTasks.filter(t => {
      const matchesSearch =
        t.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.technician.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [maintenanceTasks, searchQuery]);

  const filteredBookings = React.useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [bookings, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-800 transition-colors dark:bg-zinc-950 dark:text-zinc-200">
      
      {/* 1. TOP NAVIGATION */}
      <TopNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notificationCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotifPanelOpen(true)}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {currentView === 'dashboard' ? (
        <main className="w-full px-6 py-8 md:px-8 space-y-8">
        
        {/* 2. GREETING */}
        <PageHeader userName="Om" />

        {/* Categories / Fast Filter Selector (Stripe/Linear style pill filters) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mr-2">
            Scope Filter:
          </span>
          {['All', 'IT Hardware', 'Facilities', 'Vehicles', 'Office Equipment'].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium border transition-all ${
                categoryFilter === category
                  ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-950 dark:border-emerald-900/60 dark:text-emerald-400'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 3. KPI CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            id="kpi-available"
            title="Assets Available"
            value={kpis.available}
            icon={Laptop}
            trend={{ value: '+4%', type: 'positive' }}
            description="In inventory pools"
          />
          <MetricCard
            id="kpi-allocated"
            title="Assets Allocated"
            value={kpis.allocated}
            icon={FolderKanban}
            trend={{ value: 'Stable', type: 'neutral' }}
            description="Assigned to operators"
          />
          <MetricCard
            id="kpi-maintenance"
            title="Maintenance Today"
            value={kpis.maintenance}
            icon={Hammer}
            trend={{ value: '-2', type: 'positive' }}
            description="Active servicing orders"
          />
          <MetricCard
            id="kpi-bookings"
            title="Active Bookings"
            value={kpis.activeBookings}
            icon={CalendarDays}
            trend={{ value: '+12%', type: 'positive' }}
            description="Spaces & gear reserved"
          />
          <MetricCard
            id="kpi-pending"
            title="Pending Transfers"
            value={kpis.pendingTransfers}
            icon={RefreshCw}
            trend={{ value: '1 alert', type: 'negative' }}
            description="Inter-site freight"
          />
          <MetricCard
            id="kpi-returns"
            title="Upcoming Returns"
            value={kpis.upcomingReturns}
            icon={Clock}
            trend={{ value: '4 due', type: 'neutral' }}
            description="Rentals past cycle"
          />
        </div>

        {/* 4. MAIN BENTO GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Column: Charts, Tables & Control Deck (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AssetStatusChart assets={assets} />
              <UtilizationChart data={utilizationData} />
            </div>

            {/* Upcoming Actions / Tables */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <MaintenanceTable
                tasks={filteredMaintenance}
                onCompleteTask={handleCompleteMaintenanceTask}
              />
              <BookingTable
                bookings={filteredBookings}
                onCheckInBooking={handleCheckInBooking}
                onCancelBooking={handleCancelBooking}
              />
              <AssetHealthOverview assets={assets} />
            </div>

            {/* Quick Actions Deck */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Operations Control Panel
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  Dispatched actions and hardware workflows
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <QuickActionCard
                  title="Register Asset"
                  description="Onboard new hardware"
                  icon={PlusCircle}
                  onClick={() => setIsRegisterOpen(true)}
                  accent="emerald"
                />
                <QuickActionCard
                  title="Allocate Asset"
                  description="Deploy gear to users"
                  icon={FolderKanban}
                  onClick={() => setIsAllocateOpen(true)}
                />
                <QuickActionCard
                  title="Book Resource"
                  description="Reserve spaces or cars"
                  icon={BookOpen}
                  onClick={() => setIsBookOpen(true)}
                />
                <QuickActionCard
                  title="Raise Maintenance"
                  description="Open technician orders"
                  icon={Hammer}
                  onClick={() => setIsMaintenanceOpen(true)}
                />
                <QuickActionCard
                  title="Create Audit"
                  description="Initiate location checks"
                  icon={ClipboardList}
                  onClick={() => setIsAuditOpen(true)}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Timeline & Alerts (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Activity Feed */}
            <ActivityTimeline activities={filteredActivities} />

            {/* Interactive Alert Callout */}
            <div className="bg-emerald-600 rounded-lg p-5 text-white shadow-lg shadow-emerald-200/50 dark:shadow-none flex flex-col justify-between shrink-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Critical Alert</div>
                  <div className="text-xs font-semibold leading-tight">Overdue returns detected from Q3 Marketing</div>
                </div>
                <AlertCircle className="w-4 h-4 opacity-70" />
              </div>
              <button
                onClick={() => setIsNotifPanelOpen(true)}
                className="mt-4 w-full bg-white/20 hover:bg-white/30 text-[10px] font-bold py-2 rounded transition-colors uppercase tracking-widest"
              >
                Resolve Now
              </button>
            </div>

            {/* Compact alerts module */}
            <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-900">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    System Alerts
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                    Important active triggers
                  </p>
                </div>
                {notifications.filter(n => !n.read).length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-medium text-emerald-600 hover:text-emerald-750 dark:text-emerald-400"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 overflow-y-auto max-h-[220px] pr-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle className="h-5 w-5 text-zinc-300 dark:text-zinc-700" />
                    <p className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">Workspace clear</p>
                  </div>
                ) : (
                  notifications.slice(0, 3).map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded border border-slate-100 bg-zinc-50/40 p-2.5 dark:border-zinc-900 dark:bg-zinc-950"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-1.5">
                          <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                            notif.type === 'alert' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <div>
                            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
                              {notif.title}
                            </p>
                            <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDismissNotification(notif.id)}
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        </main>
      ) : (
        <OrganizationPage onBackToDashboard={() => setCurrentView('dashboard')} />
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/50 py-6 dark:border-zinc-900 dark:bg-zinc-950/50 mt-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>© 2026 AssetFlow Technologies, Inc. All rights reserved.</p>
          <div className="mt-2 flex space-x-4 md:mt-0">
            <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-300">API Documentation</a>
          </div>
        </div>
      </footer>

      {/* 8. SLIDE OVER NOTIFICATION DRAWER PANEL */}
      <NotificationPanel
        isOpen={isNotifPanelOpen}
        onClose={() => setIsNotifPanelOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onDismissNotification={handleDismissNotification}
        onResolveNotificationAction={handleResolveNotificationAction}
      />

      {/* QUICK WORKFLOW MODALS */}
      <RegisterAssetModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleRegisterAsset}
      />

      <AllocateAssetModal
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        availableAssets={assets.filter(a => a.status === 'available')}
        onSubmit={handleAllocateAsset}
      />

      <BookResourceModal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        onSubmit={handleBookResource}
      />

      <RaiseMaintenanceModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
        assets={assets}
        onSubmit={handleRaiseMaintenance}
      />

      <CreateAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        onSubmit={handleCreateAudit}
      />

    </div>
  );
}
