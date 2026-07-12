import React from 'react';
import { 
  LayoutDashboard, Boxes, Building2, Users, FolderTree, 
  Search, Sun, Moon, Command, X, Bell, Sparkles, Database,
  User, ChevronRight, Laptop, HelpCircle, ArrowRight, CalendarDays, Wrench, BarChart3,
  ClipboardCheck, PlayCircle, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Asset } from '../../types';
import { AssetFlowBrandLogo } from './AssetFlowLogo';

interface AppShellProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: any) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  assets: Asset[];
  employees: any[];
  departments: any[];
  bookings: any[];
  maintenanceTasks: any[];
  audits: any[];
  onOpenAssetDetail: (asset: Asset) => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  currentUser?: any;
  onSignOut?: () => void;
}

export default function AppShell({
  children,
  currentView,
  setCurrentView,
  darkMode,
  setDarkMode,
  assets,
  employees,
  departments,
  bookings,
  maintenanceTasks,
  audits,
  onOpenAssetDetail,
  notificationCount,
  onOpenNotifications,
  currentUser,
  onSignOut,
}: AppShellProps) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [paletteSearch, setPaletteSearch] = React.useState('');
  const [activeFlatIndex, setActiveFlatIndex] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Command Palette listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset active flat index when query or open state changes
  React.useEffect(() => {
    setActiveFlatIndex(0);
  }, [paletteSearch, isCommandPaletteOpen]);

  const handleCommandSelect = (view: 'dashboard' | 'organization' | 'assets' | 'allocations' | 'bookings' | 'maintenance' | 'reports' | 'notifications') => {
    setCurrentView(view);
    setIsCommandPaletteOpen(false);
    setPaletteSearch('');
  };

  const handleEntitySelect = (type: 'asset' | 'employee' | 'department' | 'booking' | 'maintenance' | 'audit', id: string) => {
    setIsCommandPaletteOpen(false);
    setPaletteSearch('');
    const w = window as any;
    if (type === 'asset' && w.openAssetByTag) w.openAssetByTag(id);
    else if (type === 'employee' && w.openEmployeeByName) w.openEmployeeByName(id);
    else if (type === 'department' && w.openDepartmentByName) w.openDepartmentByName(id);
    else if (type === 'booking' && w.openBookingById) w.openBookingById(id);
    else if (type === 'maintenance' && w.openMaintenanceById) w.openMaintenanceById(id);
    else if (type === 'audit' && w.openAuditById) w.openAuditById(id);
  };

  // Master Filter Engine covering Assets, Employees, Departments, Bookings, Maintenance, Audits, Pages, Actions
  // Returns both groups of search results and a single flattened items array for arrow-key navigation.
  const { groups, flatItems } = React.useMemo(() => {
    const query = paletteSearch.trim().toLowerCase();

    // 1. Pages Match
    const pagesList = [
      { id: 'view-dashboard', label: 'Go to Dashboard', view: 'dashboard' as const, icon: LayoutDashboard },
      { id: 'view-assets', label: 'Go to Asset Directory', view: 'assets' as const, icon: Boxes },
      { id: 'view-allocations', label: 'Go to Asset Allocation & Transfers', view: 'allocations' as const, icon: FolderTree },
      { id: 'view-bookings', label: 'Go to Resource Booking', view: 'bookings' as const, icon: CalendarDays },
      { id: 'view-maint', label: 'Go to Maintenance', view: 'maintenance' as const, icon: Wrench },
      { id: 'view-reports', label: 'Go to Reports & Analytics', view: 'reports' as const, icon: BarChart3 },
      { id: 'view-notif', label: 'Go to Notifications & Activity', view: 'notifications' as const, icon: Bell },
      { id: 'view-org', label: 'Go to Organization Setup', view: 'organization' as const, icon: Building2 },
    ];
    const matchedPages = !query 
      ? pagesList.slice(0, 4) 
      : pagesList.filter(p => p.label.toLowerCase().includes(query));

    // 2. Actions Match
    const actionsList = [
      { id: 'act-reg', label: 'Action: Register New Asset', action: () => (window as any).openRegisterAsset?.(), icon: PlusCircle },
      { id: 'act-alloc', label: 'Action: Allocate Asset to Operator', action: () => (window as any).openAllocateAsset?.(), icon: PlusCircle },
      { id: 'act-book', label: 'Action: Book Shared Resource', action: () => (window as any).openBookResource?.(), icon: PlusCircle },
      { id: 'act-maint', label: 'Action: Raise Maintenance Ticket', action: () => (window as any).openRaiseMaintenance?.(), icon: PlusCircle },
      { id: 'act-audit', label: 'Action: Initiate Location Audit', action: () => (window as any).openCreateAudit?.(), icon: PlusCircle },
    ];
    const matchedActions = !query
      ? actionsList.slice(0, 2)
      : actionsList.filter(a => a.label.toLowerCase().includes(query));

    // 3. Assets Match
    const matchedAssets = !query
      ? assets.slice(0, 3)
      : assets.filter(a => a.name.toLowerCase().includes(query) || a.tag.toLowerCase().includes(query));

    // 4. Employees Match
    const matchedEmployees = !query
      ? employees.slice(0, 3)
      : employees.filter(e => e.name.toLowerCase().includes(query) || e.email.toLowerCase().includes(query) || e.departmentName.toLowerCase().includes(query));

    // 5. Departments Match
    const matchedDepartments = !query
      ? departments.slice(0, 2)
      : departments.filter(d => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query));

    // 6. Bookings Match
    const matchedBookings = !query
      ? bookings.slice(0, 2)
      : bookings.filter(b => b.resourceName.toLowerCase().includes(query) || b.bookedBy.toLowerCase().includes(query) || b.purpose.toLowerCase().includes(query));

    // 7. Maintenance Match
    const matchedMaintenance = !query
      ? maintenanceTasks.slice(0, 2)
      : maintenanceTasks.filter(t => t.issueTitle.toLowerCase().includes(query) || t.assetName.toLowerCase().includes(query) || t.reportedBy.toLowerCase().includes(query));

    // 8. Audits Match
    const matchedAudits = !query
      ? audits.slice(0, 2)
      : audits.filter(au => au.location.toLowerCase().includes(query) || au.auditorName.toLowerCase().includes(query));

    const flatList: any[] = [];
    const groupedResult: { title: string; colorClass: string; items: any[] }[] = [];

    if (matchedPages.length > 0) {
      const groupItems = matchedPages.map(p => {
        const item = {
          id: p.id,
          type: 'page' as const,
          label: p.label,
          icon: p.icon,
          badge: 'Jump',
          action: () => handleCommandSelect(p.view),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'System Views Navigation',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    if (matchedActions.length > 0) {
      const groupItems = matchedActions.map(a => {
        const item = {
          id: a.id,
          type: 'action' as const,
          label: a.label,
          icon: a.icon,
          badge: 'Trigger action',
          action: () => {
            setIsCommandPaletteOpen(false);
            a.action();
          },
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Quick Operations & Workflows',
        colorClass: 'text-emerald-650 dark:text-emerald-500',
        items: groupItems
      });
    }

    if (matchedAssets.length > 0) {
      const groupItems = matchedAssets.slice(0, 4).map(asset => {
        const item = {
          id: asset.id,
          type: 'asset' as const,
          label: asset.name,
          subLabel: asset.tag,
          icon: Laptop,
          badge: asset.status.toUpperCase(),
          action: () => handleEntitySelect('asset', asset.tag),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Assets Directory',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    if (matchedEmployees.length > 0) {
      const groupItems = matchedEmployees.slice(0, 4).map(emp => {
        const item = {
          id: emp.id,
          type: 'employee' as const,
          label: emp.name,
          subLabel: `(${emp.role})`,
          icon: User,
          badge: emp.departmentName,
          action: () => handleEntitySelect('employee', emp.name),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Employees / Operators',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    if (matchedDepartments.length > 0) {
      const groupItems = matchedDepartments.slice(0, 4).map(dept => {
        const item = {
          id: dept.id,
          type: 'department' as const,
          label: dept.name,
          icon: Building2,
          badge: `${dept.employeeCount} staff`,
          action: () => handleEntitySelect('department', dept.name),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Departments',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    if (matchedBookings.length > 0) {
      const groupItems = matchedBookings.slice(0, 4).map(book => {
        const item = {
          id: book.id,
          type: 'booking' as const,
          label: book.resourceName,
          subLabel: `by ${book.bookedBy}`,
          icon: CalendarDays,
          badge: book.status,
          action: () => handleEntitySelect('booking', book.id),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Resource Bookings',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    if (matchedMaintenance.length > 0) {
      const groupItems = matchedMaintenance.slice(0, 4).map(task => {
        const item = {
          id: task.id,
          type: 'maintenance' as const,
          label: task.issueTitle,
          subLabel: task.assetTag,
          icon: Wrench,
          badge: task.status,
          action: () => handleEntitySelect('maintenance', task.id),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Maintenance Tasks',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    if (matchedAudits.length > 0) {
      const groupItems = matchedAudits.slice(0, 4).map(au => {
        const item = {
          id: au.id,
          type: 'audit' as const,
          label: `Audit at ${au.location}`,
          subLabel: `by ${au.auditorName}`,
          icon: ClipboardCheck,
          badge: au.status,
          action: () => handleEntitySelect('audit', au.id),
          flatIndex: flatList.length
        };
        flatList.push(item);
        return item;
      });
      groupedResult.push({
        title: 'Facility Audits',
        colorClass: 'text-slate-400 dark:text-zinc-650',
        items: groupItems
      });
    }

    return { groups: groupedResult, flatItems: flatList };
  }, [paletteSearch, assets, employees, departments, bookings, maintenanceTasks, audits]);

  // Handle keyboard inputs for the command palette
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveFlatIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveFlatIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = flatItems[activeFlatIndex];
      if (activeItem) {
        activeItem.action();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveFlatIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveFlatIndex(flatItems.length - 1);
    }
  };

  // Keep selected item visible while scrolling
  React.useEffect(() => {
    if (isCommandPaletteOpen) {
      const element = document.getElementById(`cp-item-${activeFlatIndex}`);
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      }
    }
  }, [activeFlatIndex, isCommandPaletteOpen]);

  const navSections = [
    {
      type: 'single',
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      type: 'section',
      label: 'Organization',
      icon: Building2,
      items: [
        { id: 'departments', label: 'Departments' },
        { id: 'employees', label: 'Employees' },
        { id: 'categories', label: 'Categories' },
      ],
    },
    {
      type: 'section',
      label: 'Assets',
      icon: Boxes,
      items: [
        { id: 'assets', label: 'Asset Directory' },
        { id: 'allocations', label: 'Allocation' },
        { id: 'bookings', label: 'Resource Booking' },
      ],
    },
    {
      type: 'section',
      label: 'Operations',
      icon: Wrench,
      items: [
        { id: 'maintenance', label: 'Maintenance' },
        { id: 'audit', label: 'Audit' },
      ],
    },
    {
      type: 'section',
      label: 'Insights',
      icon: BarChart3,
      items: [
        { id: 'reports', label: 'Reports' },
        { id: 'notifications', label: 'Notifications' },
      ],
    },
  ];

  const compactNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Asset Directory', icon: Boxes },
    { id: 'allocations', label: 'Asset Allocation', icon: FolderTree },
    { id: 'bookings', label: 'Resource Bookings', icon: CalendarDays },
    { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench },
    { id: 'audit', label: 'Facility Audits', icon: ClipboardCheck },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'employees', label: 'Operators & Staff', icon: Users },
    { id: 'categories', label: 'Asset Categories', icon: Sparkles },
    { id: 'reports', label: 'Insights & Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Activity Logs', icon: Bell }
  ];

  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'assets': return 'Asset Directory';
      case 'allocations': return 'Asset Allocations';
      case 'bookings': return 'Resource Bookings';
      case 'maintenance': return 'Maintenance Hub';
      case 'audit': return 'Facility Audits';
      case 'departments': return 'Departments';
      case 'employees': return 'Operators & Staff';
      case 'categories': return 'Asset Categories';
      case 'reports': return 'Insights & Reports';
      case 'notifications': return 'Activity Logs';
      default: return 'AssetFlow Workspace';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-50 font-sans flex flex-col md:flex-row select-none">
      
      {/* SIDEBAR RAIL - DESKTOP */}
      <aside className="hidden md:flex w-[88px] bg-white border-r border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 flex-col justify-between items-center py-6 px-3 shrink-0 relative z-30">
        
        {/* Top Brand Logo Container */}
        <div className="flex flex-col items-center gap-1">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="h-11 w-11 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:border-zinc-800 flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          >
            <span className="text-slate-900 dark:text-white font-serif font-black text-lg group-hover:scale-110 transition-transform">A</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">v2.4</span>
        </div>

        {/* Navigation Items (Unified scrollable list of icons) */}
        <nav className="flex-1 my-6 flex flex-col gap-2 w-full overflow-y-auto scrollbar-none justify-center py-4">
          {compactNavItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentView(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`h-11 w-11 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm' 
                    : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />

                {/* Active Indicator bar */}
                {isActive && (
                  <span className="absolute left-1 h-2.5 w-1 rounded-full bg-slate-900 dark:bg-emerald-400" />
                )}
                
                {/* Tooltip bubble (Apple/Framer style) */}
                <span className="absolute left-16 scale-0 group-hover:scale-100 bg-white border border-slate-200 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shadow-md pointer-events-none z-50">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Controls / Help / Support */}
        <div className="flex flex-col items-center gap-4">
          {/* Help Hub */}
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 dark:bg-zinc-950 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer relative group transition-all"
            title="Command Palette (⌘K)"
          >
            <Command className="h-4 w-4" />
            <span className="absolute left-14 scale-0 group-hover:scale-100 bg-white border border-slate-200 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white text-[10px] font-semibold px-2 py-1 rounded-md transition-all whitespace-nowrap shadow-md pointer-events-none z-50">
              Command Palette (⌘K)
            </span>
          </button>
        </div>

      </aside>

      {/* MAIN BODY AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-zinc-950">
        
        {/* TOP NAV BAR - DESKTOP */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 px-8 items-center justify-between shrink-0 select-none relative z-20">
          
          {/* Breadcrumb Title */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">AssetFlow</span>
            <ChevronRight className="h-3 w-3 text-slate-300 dark:text-zinc-700" />
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide uppercase">{getViewTitle()}</span>
          </div>

          {/* Global Search trigger pill */}
          <div className="flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between h-9 px-4.5 rounded-full border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/30 hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2.5 text-slate-400 dark:text-zinc-500">
                <Search className="h-3.5 w-3.5" />
                <span className="text-xs font-normal">Search workspace...</span>
              </div>
              <div className="flex items-center space-x-0.5 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 font-mono shadow-sm dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-500">
                <span className="text-[8.5px] font-sans">⌘</span>K
              </div>
            </button>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Notification bell */}
            <button
              onClick={onOpenNotifications}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-850 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              )}
            </button>

            {/* Theme switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-850 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all cursor-pointer"
              title="Toggle Mode"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />

            {/* Profile Avatar Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-350">
                  {currentUser?.avatar || 'OP'}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 dark:bg-zinc-900 dark:border-zinc-800 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-850 text-left">
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{currentUser?.name || 'Om Patel'}</p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">{currentUser?.email || 'om.patel@assetflow.com'}</p>
                    </div>
                    
                    <button 
                      onClick={() => { setCurrentView('organization'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg mt-1 transition-all"
                    >
                      Organization Profile
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-zinc-800 my-1" />

                    {onSignOut && (
                      <button 
                        onClick={() => { onSignOut(); setShowProfileMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-all"
                      >
                        Sign Out Session
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* MOBILE HEADER BAR */}
        <header className="md:hidden flex h-14 items-center justify-between border-b border-slate-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 px-5 z-25 shrink-0 select-none">
          <div className="cursor-pointer text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center" onClick={() => setCurrentView('dashboard')}>
            assetflow<span className="text-emerald-500 font-extrabold ml-0.5 animate-pulse">●</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white text-base font-semibold"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-slate-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 z-20 flex flex-col px-5 py-4 space-y-1.5 shrink-0 select-none"
            >
              <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1 px-3">Navigation</div>
              <div className="grid grid-cols-2 gap-1.5">
                {compactNavItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCurrentView(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2.5 h-9 px-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
              <div className="flex justify-between items-center px-3">
                <button
                  onClick={() => {
                    onOpenNotifications();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  <Bell className="h-4 w-4" />
                  <span>Activity Notifications ({notificationCount})</span>
                </button>

                {onSignOut && (
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          {/* MAIN PAGE VIEW CONTENT CONTAINER (Beautifully scrollable) */}
          <div className="flex-1 overflow-y-auto scrollbar-thin relative z-10">
            {children}
          </div>

        </div>

      </div>

      {/* CTRL + K COMMAND PALETTE DIALOG (Premium Frosted Glass Design) */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommandPaletteOpen(false)}
              className="fixed inset-0 z-50 bg-[#070709]/80 backdrop-blur-sm"
            />

            {/* Palette Panel */}
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-[14vh] p-4 select-none">
              <motion.div
                initial={{ scale: 0.98, opacity: 0, y: -8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#161619]/90 backdrop-blur-2xl shadow-3xl"
              >
                {/* Search input field */}
                <div className="relative border-b border-white/5 px-5 py-4">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={paletteSearch}
                    onChange={(e) => setPaletteSearch(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Search views, asset tags, staff, or actions..."
                    className="h-8 w-full bg-transparent pl-8 pr-12 text-xs text-white outline-none placeholder:text-zinc-600 font-semibold tracking-wide"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsCommandPaletteOpen(false)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 flex h-5 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[9px] font-semibold text-zinc-400 cursor-pointer hover:bg-white/10"
                  >
                    ESC
                  </button>
                </div>

                {/* Commands list */}
                <div className="max-h-[380px] overflow-y-auto p-3 space-y-4 scrollbar-thin">
                  {groups.length > 0 ? (
                    groups.map((group) => (
                      <div key={group.title} className="space-y-1">
                        <p className="px-3.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                          {group.title}
                        </p>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isHighlighted = item.flatIndex === activeFlatIndex;
                          const isActionType = item.type === 'action';
                          
                          return (
                            <button
                              id={`cp-item-${item.flatIndex}`}
                              key={item.id}
                              onClick={() => {
                                setIsCommandPaletteOpen(false);
                                item.action();
                              }}
                              onMouseEnter={() => setActiveFlatIndex(item.flatIndex)}
                              className={`w-full flex items-center justify-between h-10 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left relative ${
                                isHighlighted
                                  ? isActionType
                                    ? 'bg-emerald-500/10 text-white border-l-2 border-emerald-400 pl-3'
                                    : 'bg-white/5 text-white border-l-2 border-white pl-3'
                                  : 'text-zinc-400 hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                {Icon && (
                                  <Icon
                                    className={`h-4 w-4 shrink-0 ${
                                      isActionType
                                        ? 'text-emerald-400'
                                        : item.type === 'asset'
                                        ? 'text-zinc-300'
                                        : item.type === 'employee'
                                        ? 'text-zinc-300'
                                        : item.type === 'department'
                                        ? 'text-zinc-300'
                                        : item.type === 'booking'
                                        ? 'text-zinc-300'
                                        : item.type === 'maintenance'
                                        ? 'text-zinc-300'
                                        : item.type === 'audit'
                                        ? 'text-zinc-300'
                                        : 'text-zinc-500'
                                    }`}
                                  />
                                )}
                                <div className="truncate flex items-baseline">
                                  <span className={isHighlighted ? 'font-bold text-white' : 'font-semibold text-zinc-300'}>
                                    {item.label}
                                  </span>
                                  {item.subLabel && (
                                    <span className="ml-2 text-[10px] text-zinc-500 font-medium">
                                      {item.subLabel}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0 ml-3">
                                {isHighlighted && (
                                  <span className="text-[10px] text-emerald-400 font-black">
                                    ↵
                                  </span>
                                )}
                                <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold tracking-tight uppercase ${
                                  isHighlighted
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-white/[0.02] border-white/5 text-zinc-500'
                                }`}>
                                  {item.badge}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <p className="px-3.5 py-8 text-center text-xs font-semibold text-zinc-600 italic">
                      No matching organization assets, operators, or dispatches.
                    </p>
                  )}
                </div>

                <div className="border-t border-white/5 bg-[#121214] px-5 py-3 flex items-center justify-between text-[10px] font-bold text-zinc-600">
                  <div className="flex items-center space-x-2">
                    <Command className="h-3.5 w-3.5" />
                    <span>Command Palette Active</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span>↑↓ Navigate</span>
                    <span>•</span>
                    <span>↵ Select</span>
                    <span>•</span>
                    <span>ESC Exit</span>
                  </div>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
