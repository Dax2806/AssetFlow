import React from 'react';
import { Search, Bell, Sun, Moon, Database, ChevronRight, User, Settings, LogOut, Check } from 'lucide-react';

interface TopNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  onOpenRegisterModal: () => void;
  currentView: 'dashboard' | 'organization' | 'assets';
  setCurrentView: (view: 'dashboard' | 'organization' | 'assets') => void;
}

export default function TopNav({
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  notificationCount,
  onOpenNotifications,
  onOpenRegisterModal,
  currentView,
  setCurrentView,
}: TopNavProps) {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="flex h-14 w-full items-center justify-between px-6 md:px-8">
        
        {/* Left Side: Logo & Breadcrumbs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600 text-white transition-transform hover:scale-105 cursor-pointer"
            title="Go to Dashboard"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <div className="hidden items-center space-x-2 text-xs font-semibold text-slate-400 dark:text-zinc-500 sm:flex select-none">
            <span className="font-bold text-slate-500 dark:text-zinc-400">AssetFlow</span>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'font-medium'
              }`}
            >
              Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => setCurrentView('assets')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                currentView === 'assets'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'font-medium'
              }`}
            >
              Asset Directory
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => setCurrentView('organization')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
                currentView === 'organization'
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'font-medium'
              }`}
            >
              Organization Setup
            </button>
          </div>
        </div>

        {/* Center Side: Global Search */}
        <div className="relative flex max-w-md flex-1 px-4">
          <div className="pointer-events-none absolute inset-y-0 left-7 flex items-center pr-3">
            <Search className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
          </div>
          <input
            id="global-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets, bookings... (⌘K)"
            className="h-8.5 w-full rounded-md border-none bg-slate-100 pl-8.5 pr-10 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-slate-200/60 focus:ring-1 focus:ring-emerald-500 dark:bg-zinc-900/80 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900"
          />
          <div className="absolute right-7 top-1/2 -translate-y-1/2">
            <kbd className="hidden rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-medium text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 md:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Side: Quick Actions, Theme, Notifications, Profile */}
        <div className="flex items-center space-x-2">
          
          {/* Quick Register Shortcut */}
          <button
            onClick={onOpenRegisterModal}
            className="hidden h-8 items-center rounded bg-emerald-600 px-3 text-xs font-semibold text-white transition-all hover:bg-emerald-700 sm:flex"
          >
            + Register Asset
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            title="Notifications Panel"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex h-8 items-center space-x-2 rounded-md pl-1.5 pr-1 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="relative flex h-6.5 w-6.5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                OP
              </div>
              <span className="hidden text-xs font-medium text-zinc-700 dark:text-zinc-300 md:inline">Om Patel</span>
            </button>

            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 origin-top-right rounded-md border border-zinc-100 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-20">
                  <div className="px-2.5 py-1.5">
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Signed in as</p>
                    <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">om.patel@assetflow.com</p>
                  </div>
                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
                  
                  <button 
                    onClick={() => { setShowProfileMenu(false); }}
                    className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-left text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>My Profile</span>
                  </button>

                  <button 
                    onClick={() => { setCurrentView('organization'); setShowProfileMenu(false); }}
                    className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-left text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Organization Setup</span>
                  </button>

                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                  <button 
                    onClick={() => { setShowProfileMenu(false); }}
                    className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
