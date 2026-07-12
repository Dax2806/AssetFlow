import React from 'react';
import PageHeader from './components/PageHeader';
import LandingPage from './components/LandingPage';
import AppShell from './components/common/AppShell';
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

// Modular Asset Intelligence Platform views
import AssetDirectory from './components/assets/AssetDirectory';
import Asset360Page from './components/assets/Asset360Page';
import AllocationPage from './components/allocation/AllocationPage';
import BookingPage from './components/booking/BookingPage';
import MaintenancePage from './components/maintenance/MaintenancePage';
import ReportsPage from './components/reports/ReportsPage';
import NotificationsPage from './components/notifications/NotificationsPage';
import AuditPage from './components/AuditPage';
import { EXTENDED_MOCK_ASSETS } from './data/extendedAssets';

// Universal Drawer & Additional types
import UniversalDrawer, { Audit } from './components/common/UniversalDrawer';
import { Employee, Department, AssetCategory as OrgAssetCategory } from './components/organization/types';
import { ResourceBooking } from './components/booking/types';
import { MaintenanceWorkflowTask } from './components/maintenance/types';

// Mock Data from modules
import { INITIAL_DEPARTMENTS, INITIAL_EMPLOYEES, INITIAL_CATEGORIES } from './components/organization/mockData';
import { INITIAL_RESOURCE_BOOKINGS } from './components/booking/mockData';
import { INITIAL_WORKFLOW_TASKS } from './components/maintenance/mockData';

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
  const [assets, setAssets] = React.useState<Asset[]>(EXTENDED_MOCK_ASSETS);
  const [activities, setActivities] = React.useState<Activity[]>(INITIAL_ACTIVITIES);
  const [maintenanceTasks, setMaintenanceTasks] = React.useState<MaintenanceWorkflowTask[]>(INITIAL_WORKFLOW_TASKS);
  const [bookings, setBookings] = React.useState<ResourceBooking[]>(INITIAL_RESOURCE_BOOKINGS);
  const [notifications, setNotifications] = React.useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [utilizationData] = React.useState(HISTORICAL_UTILIZATION);

  // Lifted Organizational & Security Audits State
  const [departments, setDepartments] = React.useState<Department[]>(INITIAL_DEPARTMENTS);
  const [employees, setEmployees] = React.useState<Employee[]>(INITIAL_EMPLOYEES);
  const [categories, setCategories] = React.useState<OrgAssetCategory[]>(INITIAL_CATEGORIES);
  const [audits, setAudits] = React.useState<Audit[]>([
    {
      id: 'audit-1',
      location: 'HQ - 4th Floor',
      auditorName: 'Sarah Jenkins',
      status: 'In Progress',
      startDate: '2026-07-10',
      reviewedAssetIds: ['1', '4'],
      notes: 'Physical reconciliation of IT core server frames and laptop devices.'
    },
    {
      id: 'audit-2',
      location: 'Remote - US East',
      auditorName: 'Rahul Mehta',
      status: 'Completed',
      startDate: '2026-07-01',
      endDate: '2026-07-02',
      reviewedAssetIds: ['2'],
      notes: 'All east coast remote staff laptops successfully audited via online MDM sync.'
    }
  ]);

  // Universal Drawer Controller
  const [drawerType, setDrawerType] = React.useState<'asset' | 'employee' | 'department' | 'booking' | 'maintenance' | 'audit' | null>(null);
  const [drawerEntityId, setDrawerEntityId] = React.useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All');
  const [darkMode, setDarkMode] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<string>('dashboard');
  const [isNotifPanelOpen, setIsNotifPanelOpen] = React.useState(false);

  // Selection states for Asset 360 detailed view & Edit triggers
  const [selectedAsset360, setSelectedAsset360] = React.useState<Asset | null>(null);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = React.useState<Asset | null>(null);

  // Modal Visibility States
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const [isAllocateOpen, setIsAllocateOpen] = React.useState(false);
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = React.useState(false);
  const [isAuditOpen, setIsAuditOpen] = React.useState(false);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<Employee | null>(null);

  const handleSignIn = (emailAddress: string) => {
    const foundEmp = employees.find(e => e.email.toLowerCase() === emailAddress.trim().toLowerCase());
    if (foundEmp) {
      setCurrentUser(foundEmp);
      setIsAuthenticated(true);
    } else {
      // General email fallback
      const defaultEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: emailAddress.split('@')[0].toUpperCase(),
        email: emailAddress,
        departmentName: 'Engineering',
        departmentId: 'dept-1',
        role: 'Employee',
        status: 'Active',
        avatar: emailAddress.split('@')[0].substring(0, 2).toUpperCase(),
        lastLogin: 'Active Now',
        employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        phone: '+1 (555) 012-3456',
        notes: 'Simulated employee portal login profile.'
      };
      setEmployees(prev => [...prev, defaultEmp]);
      setCurrentUser(defaultEmp);
      setIsAuthenticated(true);
    }
  };

  const handleSignUp = (userData: { name: string; email: string; departmentName: string; employeeId: string }) => {
    const dept = departments.find(d => d.name === userData.departmentName) || departments[0];
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      departmentName: userData.departmentName,
      departmentId: dept.id,
      role: 'Employee',
      status: 'Active',
      avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      lastLogin: 'Active Now',
      employeeId: userData.employeeId,
      phone: '+1 (555) 012-7492',
      notes: 'Self-registered employee corporate portal access profile.'
    };

    setEmployees(prev => [...prev, newEmp]);
    setCurrentUser(newEmp);
    setIsAuthenticated(true);
  };

  // Theme Syncing Effect
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Expose global window cross-linking triggers for universal drawers & actions
  React.useEffect(() => {
    (window as any).openAssetByTag = (tag: string) => {
      const asset = assets.find(a => a.tag.toLowerCase() === tag.toLowerCase());
      if (asset) {
        setDrawerType('asset');
        setDrawerEntityId(asset.tag);
      }
    };
    (window as any).openEmployeeByName = (name: string) => {
      const emp = employees.find(e => e.name.toLowerCase() === name.toLowerCase());
      if (emp) {
        setDrawerType('employee');
        setDrawerEntityId(emp.name);
      }
    };
    (window as any).openDepartmentByName = (name: string) => {
      const dept = departments.find(d => d.name.toLowerCase() === name.toLowerCase());
      if (dept) {
        setDrawerType('department');
        setDrawerEntityId(dept.name);
      }
    };
    (window as any).openBookingById = (id: string) => {
      const book = bookings.find(b => b.id === id);
      if (book) {
        setDrawerType('booking');
        setDrawerEntityId(book.id);
      }
    };
    (window as any).openMaintenanceById = (id: string) => {
      const task = maintenanceTasks.find(t => t.id === id);
      if (task) {
        setDrawerType('maintenance');
        setDrawerEntityId(task.id);
      }
    };
    (window as any).openAuditById = (id: string) => {
      const au = audits.find(a => a.id === id);
      if (au) {
        setDrawerType('audit');
        setDrawerEntityId(au.id);
      }
    };

    // Quick operations triggers
    (window as any).openRegisterAsset = () => setIsRegisterOpen(true);
    (window as any).openAllocateAsset = () => setIsAllocateOpen(true);
    (window as any).openBookResource = () => setIsBookOpen(true);
    (window as any).openRaiseMaintenance = () => setIsMaintenanceOpen(true);
    (window as any).openCreateAudit = () => setIsAuditOpen(true);

    return () => {
      delete (window as any).openAssetByTag;
      delete (window as any).openEmployeeByName;
      delete (window as any).openDepartmentByName;
      delete (window as any).openBookingById;
      delete (window as any).openMaintenanceById;
      delete (window as any).openAuditById;
      delete (window as any).openRegisterAsset;
      delete (window as any).openAllocateAsset;
      delete (window as any).openBookResource;
      delete (window as any).openRaiseMaintenance;
      delete (window as any).openCreateAudit;
    };
  }, [assets, employees, departments, bookings, maintenanceTasks, audits]);

  // State Mutators for Universal Drawer with Integrated Notification & Timeline Engines
  const handleUpdateAsset = (updated: Asset) => {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Asset Profile Updated',
      message: `${updated.name} (${updated.tag}) has been updated in the global repository.`,
      type: 'info',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateBooking = (updated: ResourceBooking) => {
    setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Resource Booking Updated',
      message: `Booking for ${updated.resourceName} was updated to ${updated.status}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateMaintenance = (updated: MaintenanceWorkflowTask) => {
    setMaintenanceTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Maintenance Order Updated',
      message: `Task ${updated.issueTitle} is now marked as ${updated.status}.`,
      type: 'warning',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleUpdateAudit = (updated: Audit) => {
    setAudits(prev => prev.map(a => a.id === updated.id ? updated : a));
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Facility Audit Updated',
      message: `Security audit in ${updated.location} was modified. Status: ${updated.status}.`,
      type: 'info',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
  };

  const handleAddNotification = (notif: SystemNotification) => {
    setNotifications(prev => [notif, ...prev]);
  };

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
      user: { name: currentUser?.name || 'Om Patel', email: currentUser?.email || 'om.patel@assetflow.com' }
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
      user: { name: currentUser?.name || 'Om Patel', email: currentUser?.email || 'om.patel@assetflow.com' }
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
      user: { name: currentUser?.name || 'Om Patel', email: currentUser?.email || 'om.patel@assetflow.com' }
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
      user: { name: currentUser?.name || 'Om Patel', email: currentUser?.email || 'om.patel@assetflow.com' }
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

  if (!isAuthenticated) {
    return (
      <LandingPage
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <AppShell
      currentView={currentView}
      setCurrentView={setCurrentView}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      assets={assets}
      employees={employees}
      departments={departments}
      bookings={bookings as any}
      maintenanceTasks={maintenanceTasks as any}
      audits={audits}
      onOpenAssetDetail={(asset) => {
        setSelectedAsset360(asset);
        setCurrentView('assets');
      }}
      notificationCount={notifications.filter(n => !n.read).length}
      onOpenNotifications={() => setIsNotifPanelOpen(true)}
      currentUser={currentUser}
      onSignOut={() => {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }}
    >

      {currentView === 'dashboard' ? (
        <main className="w-full px-6 py-8 md:px-8 space-y-8">
        
        {/* 2. GREETING */}
        <PageHeader userName={currentUser?.name.split(' ')[0] || 'Om'} />

        {/* Categories / Fast Filter Selector (Stripe/Linear style pill filters) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mr-2">
            Scope Filter
          </span>
          {['All', 'IT Hardware', 'Facilities', 'Vehicles', 'Office Equipment'].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`rounded-full px-4 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                categoryFilter === category
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 border-slate-900 dark:border-white'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
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
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col justify-between shrink-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Critical Alert</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-tight mt-1">Overdue returns detected from Q3 Marketing</div>
                </div>
                <AlertCircle className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              </div>
              <button
                onClick={() => setIsNotifPanelOpen(true)}
                className="mt-4 w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 text-[10px] font-semibold py-2 rounded-lg transition-colors uppercase tracking-wider cursor-pointer"
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
                    className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 overflow-y-auto max-h-[220px] pr-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle className="h-5 w-5 text-slate-400 dark:text-zinc-600" />
                    <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">Workspace clear</p>
                  </div>
                ) : (
                  notifications.slice(0, 3).map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded border border-slate-100 bg-slate-50/50 p-2.5 dark:border-zinc-900 dark:bg-zinc-900/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-1.5">
                          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                            notif.type === 'alert' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-tight">
                              {notif.title}
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-slate-400 dark:text-zinc-500">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDismissNotification(notif.id)}
                          className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-400 text-xs font-bold cursor-pointer"
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
      ) : currentView === 'assets' ? (
        <main className="w-full px-6 py-8 md:px-8 space-y-8">
          {selectedAsset360 ? (
            <Asset360Page
              asset={selectedAsset360}
              onBack={() => setSelectedAsset360(null)}
              onOpenEdit={(asset) => {
                setSelectedAssetForEdit(asset);
                setIsRegisterOpen(true);
              }}
              onDelete={(id) => {
                setAssets(prev => prev.filter(a => a.id !== id));
                if (selectedAsset360?.id === id) {
                  setSelectedAsset360(null);
                }
              }}
              onUpdateAsset={(updated) => {
                setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
                setSelectedAsset360(updated);
              }}
            />
          ) : (
            <AssetDirectory
              assets={assets}
              isLoading={false}
              onOpenRegister={() => {
                setSelectedAssetForEdit(null);
                setIsRegisterOpen(true);
              }}
              onOpenDetail={(asset) => {
                setSelectedAsset360(asset);
              }}
              onSaveAsset={(data) => {
                if (data.id) {
                  // Edit mode
                  setAssets(prev => prev.map(a => a.id === data.id ? { ...a, ...data } as Asset : a));
                } else {
                  // Create mode
                  const nextId = String(assets.length + 1);
                  const tag = data.tag || `AF-${100 + Number(nextId)}`;
                  const newAsset: Asset = {
                    id: nextId,
                    tag,
                    name: data.name || 'Unnamed Asset',
                    category: data.category || 'IT Hardware',
                    status: 'available',
                    location: data.location || 'HQ - 4th Floor',
                    value: data.value || 1200,
                    purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
                    ...data
                  };
                  setAssets(prev => [newAsset, ...prev]);

                  // Log Activity
                  const newActivity: Activity = {
                    id: `act-${Date.now()}`,
                    assetId: nextId,
                    assetName: newAsset.name,
                    assetTag: tag,
                    type: 'registration',
                    description: `Asset registered: ${newAsset.name} (${tag})`,
                    timestamp: new Date().toISOString(),
                    user: { name: currentUser?.name || 'Om Patel', email: currentUser?.email || 'om.patel@assetflow.com' }
                  };
                  setActivities(prev => [newActivity, ...prev]);
                }
              }}
              onDeleteAsset={(id) => {
                setAssets(prev => prev.filter(a => a.id !== id));
              }}
              onBulkStatusChange={(ids, status) => {
                setAssets(prev => prev.map(a => ids.includes(a.id) ? { ...a, status } : a));
              }}
              isRegisterOpen={isRegisterOpen}
              setIsRegisterOpen={setIsRegisterOpen}
              selectedAssetForEdit={selectedAssetForEdit}
              setSelectedAssetForEdit={setSelectedAssetForEdit}
            />
          )}
        </main>
      ) : currentView === 'allocations' ? (
        <main className="w-full">
          <AllocationPage />
        </main>
      ) : currentView === 'bookings' ? (
        <main className="w-full">
          <BookingPage
            bookings={bookings}
            setBookings={setBookings}
          />
        </main>
      ) : currentView === 'maintenance' ? (
        <main className="w-full">
          <MaintenancePage
            assets={assets}
            tasks={maintenanceTasks}
            setTasks={setMaintenanceTasks}
            onUpdateAsset={(updated) => setAssets(prev => prev.map(a => a.id === updated.id ? updated : a))}
            onAddActivity={(activity) => setActivities(prev => [activity, ...prev])}
          />
        </main>
      ) : currentView === 'reports' ? (
        <main className="w-full">
          <ReportsPage
            assets={assets}
            bookings={bookings}
            activities={activities}
          />
        </main>
      ) : currentView === 'notifications' ? (
        <main className="w-full">
          <NotificationsPage
            notifications={notifications}
            setNotifications={setNotifications}
            activities={activities}
            onAddActivity={(activity) => setActivities(prev => [activity, ...prev])}
          />
        </main>
      ) : currentView === 'audit' ? (
        <main className="w-full">
          <AuditPage
            audits={audits}
            assets={assets}
            onOpenAudit={(id) => {
              setDrawerType('audit');
              setDrawerEntityId(id);
            }}
            onInitiateAudit={() => setIsAuditOpen(true)}
          />
        </main>
      ) : (
        <OrganizationPage
          onBackToDashboard={() => setCurrentView('dashboard')}
          departments={departments}
          setDepartments={setDepartments}
          employees={employees}
          setEmployees={setEmployees}
          categories={categories}
          setCategories={setCategories}
          initialTab={
            currentView === 'departments' 
              ? 'departments' 
              : currentView === 'employees' 
                ? 'employees' 
                : currentView === 'categories' 
                  ? 'categories' 
                  : 'departments'
          }
        />
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-100 dark:border-zinc-900/60 py-6 mt-12 bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row text-[11px] text-slate-400 dark:text-zinc-500">
          <p>© 2026 AssetFlow Technologies, Inc. All rights reserved.</p>
          <div className="mt-2 flex space-x-4 md:mt-0">
            <a href="#" className="hover:text-slate-600 dark:hover:text-zinc-350">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 dark:hover:text-zinc-350">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 dark:hover:text-zinc-350">API Documentation</a>
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

      {/* 9. UNIVERSAL CROSS-LINKING DRAWER PANEL */}
      <UniversalDrawer
        isOpen={drawerType !== null}
        onClose={() => {
          setDrawerType(null);
          setDrawerEntityId(null);
        }}
        type={drawerType}
        entityId={drawerEntityId}
        assets={assets}
        bookings={bookings}
        maintenanceTasks={maintenanceTasks}
        employees={employees}
        departments={departments}
        audits={audits}
        activities={activities}
        onUpdateAsset={handleUpdateAsset}
        onUpdateBooking={handleUpdateBooking}
        onUpdateMaintenance={handleUpdateMaintenance}
        onUpdateAudit={handleUpdateAudit}
        onAddActivity={handleAddActivity}
        onAddNotification={handleAddNotification}
      />

    </AppShell>
  );
}
