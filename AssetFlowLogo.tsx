import React from 'react';
import { 
  Calendar, Layers, Filter, CheckCircle2, AlertCircle, Clock, 
  Plus, Search, SlidersHorizontal, Sparkles, Building2, Car, 
  Video, Laptop, RefreshCw, X, ArrowUpRight, Ban, ListFilter,
  BarChart2, ShieldAlert
} from 'lucide-react';
import PageHeader from '../common/PageHeader';
import SummaryStrip from '../common/SummaryStrip';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { SkeletonCards, SkeletonTable } from '../common/SkeletonState';

// Subcomponents
import AvailabilitySidebar from './AvailabilitySidebar';
import BookingCalendar from './BookingCalendar';
import BookingDrawer from './BookingDrawer';
import ResourceCard from './ResourceCard';
import BookingCard from './BookingCard';

// Mock Data & Types
import { MOCK_RESOURCES, INITIAL_RESOURCE_BOOKINGS, DEPARTMENTS } from './mockData';
import { BookingResource, ResourceBooking, ResourceCategory } from './types';
import { motion, AnimatePresence } from 'motion/react';

interface BookingPageProps {
  bookings?: ResourceBooking[];
  setBookings?: React.Dispatch<React.SetStateAction<ResourceBooking[]>>;
}

export default function BookingPage({ bookings: propsBookings, setBookings: propsSetBookings }: BookingPageProps = {}) {
  // Master states
  const [resources, setResources] = React.useState<BookingResource[]>(MOCK_RESOURCES);
  const [localBookings, setLocalBookings] = React.useState<ResourceBooking[]>(INITIAL_RESOURCE_BOOKINGS);
  
  const bookings = propsBookings || localBookings;
  const setBookings = propsSetBookings || setLocalBookings;
  const [activeTab, setActiveTab] = React.useState<'overview' | 'calendar' | 'bookings' | 'resources'>('overview');
  
  // UI Loading simulation for interactive actions
  const [isLoading, setIsLoading] = React.useState(false);

  // Search & Global filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<ResourceCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const [deptFilter, setDeptFilter] = React.useState<string>('All');
  const [dateFilter, setDateFilter] = React.useState<string>('');

  // Selected details targets
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | null>(null);
  const [selectedResourceForDetails, setSelectedResourceForDetails] = React.useState<BookingResource | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = React.useState<ResourceBooking | null>(null);
  
  // Drawer visibility & mode controller
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<'create' | 'view-booking' | 'view-resource'>('create');

  // Calendar parameters
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date('2026-07-12'));
  const [calendarView, setCalendarView] = React.useState<'day' | 'week' | 'month' | 'agenda'>('week');

  // Interactive loading simulator on tab switch to show skeletons
  const handleTabChange = (tab: 'overview' | 'calendar' | 'bookings' | 'resources') => {
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Helper to convert HH:MM to decimal minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // --- CONFLICT DETECTION ENGINE ---
  const checkBookingConflict = (
    resourceId: string,
    date: string,
    startStr: string,
    endStr: string,
    skipBookingId?: string
  ): ResourceBooking | null => {
    const requestedStart = parseTimeToMinutes(startStr);
    const requestedEnd = parseTimeToMinutes(endStr);

    for (const b of bookings) {
      if (b.id === skipBookingId) continue;
      if (b.status === 'Cancelled') continue;
      if (b.resourceId === resourceId && b.date === date) {
        const existingStart = parseTimeToMinutes(b.startTime);
        const existingEnd = parseTimeToMinutes(b.endTime);

        // Standard overlapping collision detection
        if (requestedStart < existingEnd && requestedEnd > existingStart) {
          return b; // Overlaps! Return the offender
        }
      }
    }
    return null; // Safe!
  };

  // --- DYNAMIC SLOT SUGGESTION GENERATOR ---
  const getSuggestedSlots = (
    resourceId: string,
    date: string,
    durationMin: number
  ): { startTime: string; endTime: string }[] => {
    const suggestions: { startTime: string; endTime: string }[] = [];
    
    // We scan standard business hours: 8:00 AM (480 mins) to 6:00 PM (1080 mins)
    const scanStart = 480; 
    const scanEnd = 1080;
    const stepSize = 30; // check slots in 30 minute offset increments

    const minutesToTimeStr = (totalMins: number): string => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    for (let currentStart = scanStart; currentStart + durationMin <= scanEnd; currentStart += stepSize) {
      const startStr = minutesToTimeStr(currentStart);
      const endStr = minutesToTimeStr(currentStart + durationMin);

      // Check if this potential block is completely free of conflicts
      const conflict = checkBookingConflict(resourceId, date, startStr, endStr);
      if (!conflict) {
        suggestions.push({ startTime: startStr, endTime: endStr });
        if (suggestions.length >= 4) break; // Limit suggestions to keep UI clean
      }
    }
    return suggestions;
  };

  // --- LIVE RESERVATION STATUS CHECKS ---
  // In July 12, 2026, 12:20 PM - checks if a resource is occupied at this current moment.
  const isResourceBookedNow = (resourceId: string): boolean => {
    const todayStr = '2026-07-12';
    const currentMins = parseTimeToMinutes('12:20');

    return bookings.some((b) => {
      if (b.status === 'Cancelled') return false;
      if (b.resourceId === resourceId && b.date === todayStr) {
        const start = parseTimeToMinutes(b.startTime);
        const end = parseTimeToMinutes(b.endTime);
        return currentMins >= start && currentMins < end;
      }
      return false;
    });
  };

  // --- KPI CARD COMPUTATIONS ---
  const kpis = React.useMemo(() => {
    const todayStr = '2026-07-12';
    
    // Total today's bookings
    const todays = bookings.filter((b) => b.date === todayStr && b.status !== 'Cancelled').length;
    
    // Ongoing (live right now at 12:20 PM)
    const ongoing = bookings.filter((b) => {
      if (b.status !== 'Confirmed' && b.status !== 'In Progress') return false;
      if (b.date !== todayStr) return false;
      const start = parseTimeToMinutes(b.startTime);
      const end = parseTimeToMinutes(b.endTime);
      const now = parseTimeToMinutes('12:20');
      return now >= start && now < end;
    }).length;

    // Upcoming bookings (confirmed on future dates or today after 12:20 PM)
    const upcoming = bookings.filter((b) => {
      if (b.status !== 'Confirmed') return false;
      if (b.date > todayStr) return true;
      if (b.date === todayStr) {
        const start = parseTimeToMinutes(b.startTime);
        const now = parseTimeToMinutes('12:20');
        return start > now;
      }
      return false;
    }).length;

    // Available resources (Total minus currently occupied)
    const occupiedCount = resources.filter((r) => isResourceBookedNow(r.id)).length;
    const availableResources = resources.length - occupiedCount;

    return {
      todays,
      availableResources,
      ongoing,
      upcoming,
    };
  }, [bookings, resources]);

  // --- SUBMIT WORKFLOWS ---
  const handleCreateBooking = (bookingData: Omit<ResourceBooking, 'id' | 'durationMinutes'>) => {
    // 1. Conflict assessment
    const conflict = checkBookingConflict(
      bookingData.resourceId,
      bookingData.date,
      bookingData.startTime,
      bookingData.endTime
    );

    if (conflict) {
      return { conflict }; // Conflict exists! Abort and display ConflictPanel
    }

    // 2. Success path
    const startMins = parseTimeToMinutes(bookingData.startTime);
    const endMins = parseTimeToMinutes(bookingData.endTime);
    const durationMinutes = endMins - startMins;

    const newBooking: ResourceBooking = {
      ...bookingData,
      id: `res-book-${Date.now()}`,
      durationMinutes: durationMinutes > 0 ? durationMinutes : 60,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return true; // successfully created
  };

  const handleUpdateBooking = (bookingId: string, updatedData: Partial<ResourceBooking>) => {
    const existing = bookings.find((b) => b.id === bookingId);
    if (!existing) return false;

    const finalResourceId = updatedData.resourceId || existing.resourceId;
    const finalDate = updatedData.date || existing.date;
    const finalStart = updatedData.startTime || existing.startTime;
    const finalEnd = updatedData.endTime || existing.endTime;

    // Validate conflict, ignoring the active booking itself
    const conflict = checkBookingConflict(finalResourceId, finalDate, finalStart, finalEnd, bookingId);
    if (conflict) {
      return { conflict };
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const startM = parseTimeToMinutes(finalStart);
          const endM = parseTimeToMinutes(finalEnd);
          return {
            ...b,
            ...updatedData,
            durationMinutes: endM - startM,
          } as ResourceBooking;
        }
        return b;
      })
    );
    
    // Sync current details target
    setSelectedBookingForDetails((prev) => prev ? { ...prev, ...updatedData } as ResourceBooking : null);
    return true;
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );
  };

  // --- DIRECT TRIGGERS FOR GRID CLICK ---
  const handleCalendarGridClick = (dateStr: string, hourStr: string) => {
    // Fill state
    setDateFilter(dateStr);
    
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  // --- FILTERED SELECTIONS FOR COMPONENT VISUALS ---
  const filteredBookingsList = React.useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'All' || b.resourceCategory === categoryFilter;
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchDept = deptFilter === 'All' || b.department === deptFilter;
      const matchDate = !dateFilter || b.date === dateFilter;

      return matchSearch && matchCat && matchStatus && matchDept && matchDate;
    });
  }, [bookings, searchQuery, categoryFilter, statusFilter, deptFilter, dateFilter]);

  const filteredResourcesList = React.useMemo(() => {
    return resources.filter((res) => {
      const matchCat = categoryFilter === 'All' || res.category === categoryFilter;
      const matchSearch =
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [resources, categoryFilter, searchQuery]);

  return (
    <div className="w-full px-6 py-8 md:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. COMPACT PAGE HEADER */}
      <PageHeader
        title="Resource Booking"
        subtitle="Reserve shared organizational assets and rooms without scheduling overlaps."
        actions={
          <button
            onClick={() => {
              setSelectedResourceForDetails(null);
              setDrawerMode('create');
              setIsDrawerOpen(true);
            }}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Booking</span>
          </button>
        }
      />

      {/* 2. SUMMARY STRIP KPIS */}
      <SummaryStrip
        kpis={[
          { title: "Today's Bookings", value: kpis.todays, subText: '+12% from yesterday', icon: Calendar, type: 'positive' },
          { title: 'Available Resources', value: kpis.availableResources, subText: 'Ready for use', icon: Layers, type: 'info' },
          { title: 'Ongoing Bookings', value: kpis.ongoing, subText: 'Active now', icon: Clock, type: 'positive' },
          { title: 'Upcoming Bookings', value: kpis.upcoming, subText: 'Next 7 days scheduled', icon: BarChart2, type: 'neutral' },
        ]}
      />

      {/* 3. PREMIUM SMART INSIGHTS BOX */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-150 bg-white p-5 dark:bg-zinc-950/20 dark:border-zinc-900 shadow-3xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-3 truncate">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="truncate">
            <h4 className="text-[11.5px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Asset Utilization Intelligence
            </h4>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5 text-[10.5px] text-slate-500 dark:text-zinc-450 font-medium leading-relaxed">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span><strong>Meeting Room B</strong> is booked 91% this week.</span>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center space-x-1">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Projector usage increased <strong>23%</strong>.</span>
              </span>
              <span className="hidden md:inline text-slate-300">•</span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                <span>Vehicle <strong>#3 (Tesla Model 3)</strong> is available today.</span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCategoryFilter('Meeting Rooms');
            setSearchQuery('Room B');
            setActiveTab('overview');
          }}
          className="px-3.5 h-8.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-650 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800 shrink-0 shadow-2xs flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <span>View Room B Load</span>
        </button>
      </motion.div>

      {/* 4. NAVIGATION BAR TABS SYSTEM */}
      <div className="flex border-b border-slate-200 dark:border-zinc-900/80 pb-px gap-1.5 select-none shrink-0 overflow-x-auto scrollbar-none">
        {(
          [
            { id: 'overview', label: 'Overview Dashboard', icon: Layers },
            { id: 'calendar', label: 'Interactive Calendar', icon: Calendar },
            { id: 'bookings', label: 'Roster & Bookings', icon: ListFilter },
            { id: 'resources', label: 'Shared Inventory', icon: BarChart2 },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`h-9.5 px-4 rounded-t-xl text-[11px] font-black uppercase tracking-wider flex items-center space-x-2 border-t border-x transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white border-slate-200 text-slate-800 border-b-white dark:bg-zinc-950 dark:border-zinc-900 dark:text-emerald-400 dark:border-b-zinc-950 translate-y-px z-10 font-black'
                  : 'bg-transparent border-transparent text-slate-450 hover:text-slate-850 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. SEARCH & FILTERING TOOLBAR RAIL */}
      {activeTab !== 'calendar' && (
        <div className="bg-white border border-slate-150 dark:bg-zinc-950/20 dark:border-zinc-900 rounded-2xl p-4.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 shadow-3xs select-none">
          {/* Live Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-550" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings or resources..."
              className="h-9 w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 text-xs outline-none focus:bg-white focus:border-emerald-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:focus:bg-zinc-950"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="All">All Categories</option>
            <option value="Meeting Rooms">Meeting Rooms</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Equipment">Equipment</option>
            <option value="Projectors">Projectors</option>
            <option value="Labs">Labs</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Date Picker Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. CONTENT WORKSPACES VIEWPORT (WITH LOADERS) */}
      <div className="flex-1 min-h-[500px]">
        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCards count={3} />
            <SkeletonTable rows={4} cols={5} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Visual split layout: Upcoming list & Grid of available assets */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                  
                  {/* Left Column: Today's chronological checklist */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-600">
                        Today's Timeline
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500">
                        July 12
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-none">
                      {bookings.filter((b) => b.date === '2026-07-12' && b.status !== 'Cancelled').length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl dark:border-zinc-900">
                          <p className="text-[11px] text-slate-450 italic">No bookings scheduled today</p>
                        </div>
                      ) : (
                        bookings
                          .filter((b) => b.date === '2026-07-12' && b.status !== 'Cancelled')
                          .sort((x, y) => parseTimeToMinutes(x.startTime) - parseTimeToMinutes(y.startTime))
                          .map((b) => (
                            <div
                              key={b.id}
                              onClick={() => {
                                if ((window as any).openBookingById) {
                                  (window as any).openBookingById(b.id);
                                } else {
                                  setSelectedBookingForDetails(b);
                                  setDrawerMode('view-booking');
                                  setIsDrawerOpen(true);
                                }
                              }}
                              className="rounded-xl border border-slate-150 p-3.5 bg-white space-y-2.5 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-900 transition-all cursor-pointer shadow-3xs"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-extrabold text-[11px] text-slate-750 dark:text-zinc-300">
                                  {b.startTime} – {b.endTime}
                                </span>
                                <span className={`h-1.5 w-1.5 rounded-full ${b.status === 'In Progress' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                              </div>

                              <div>
                                <h6 className="text-[11.5px] font-black text-slate-800 dark:text-zinc-200 truncate">
                                  {b.resourceName}
                                </h6>
                                <p className="text-[10px] text-slate-400 truncate leading-relaxed">
                                  {b.purpose}
                                </p>
                              </div>

                              <div className="flex items-center space-x-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                                <span>{b.bookedBy}</span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Cards Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-600">
                        Operational Shared Assets ({filteredResourcesList.length})
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">
                        Showing filtered
                      </span>
                    </div>

                    {filteredResourcesList.length === 0 ? (
                      <EmptyState
                        title="No Resources Found"
                        description="Try widening your search terms or choosing a different category filter."
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredResourcesList.map((res) => (
                          <ResourceCard
                            key={res.id}
                            resource={res}
                            bookedNow={isResourceBookedNow(res.id)}
                            onViewDetails={() => {
                              if ((window as any).openAssetByTag && res.tag) {
                                (window as any).openAssetByTag(res.tag);
                              } else {
                                setSelectedResourceForDetails(res);
                                setDrawerMode('view-resource');
                                setIsDrawerOpen(true);
                              }
                            }}
                            onBookInstant={() => {
                              setSelectedResourceForDetails(res);
                              setDrawerMode('create');
                              setIsDrawerOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB: INTERACTIVE CALENDAR WORKSPACE */}
            {activeTab === 'calendar' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-[300px_1fr] rounded-2xl overflow-hidden border border-slate-150 dark:border-zinc-900 bg-white dark:bg-zinc-950/20"
              >
                {/* Left Panel Category List */}
                <AvailabilitySidebar
                  resources={resources}
                  selectedCategory={categoryFilter}
                  setSelectedCategory={(cat) => setCategoryFilter(cat)}
                  selectedResourceId={selectedResourceId}
                  onSelectResource={(id) => setSelectedResourceId(id)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isResourceBookedNow={isResourceBookedNow}
                  onViewResourceDetails={(res) => {
                    setSelectedResourceForDetails(res);
                    setDrawerMode('view-resource');
                    setIsDrawerOpen(true);
                  }}
                />

                {/* Right Calendar viewport */}
                <div className="p-4 sm:p-5.5 min-w-0">
                  <BookingCalendar
                    bookings={bookings}
                    resources={resources}
                    selectedResourceId={selectedResourceId}
                    activeDate={calendarDate}
                    setActiveDate={setCalendarDate}
                    viewMode={calendarView}
                    setViewMode={setCalendarView}
                    onGridClick={handleCalendarGridClick}
                    onSelectBooking={(b) => {
                      if ((window as any).openBookingById) {
                        (window as any).openBookingById(b.id);
                      } else {
                        setSelectedBookingForDetails(b);
                        setDrawerMode('view-booking');
                        setIsDrawerOpen(true);
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* TAB: ROSTER & ACTIVE BOOKINGS */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-650">
                    Chronological Reservation Ledger ({filteredBookingsList.length} items)
                  </h4>
                </div>

                {filteredBookingsList.length === 0 ? (
                  <EmptyState
                    title="No Bookings Match Filters"
                    description="Clear search queries or reset date/status options to locate your bookings."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookingsList.map((b) => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onClick={() => {
                          if ((window as any).openBookingById) {
                            (window as any).openBookingById(b.id);
                          } else {
                            setSelectedBookingForDetails(b);
                            setDrawerMode('view-booking');
                            setIsDrawerOpen(true);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: INVENTORY ASSET DIRECTORY */}
            {activeTab === 'resources' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-650">
                    Bento Inventory Roster ({filteredResourcesList.length} assets)
                  </h4>
                </div>

                {filteredResourcesList.length === 0 ? (
                  <EmptyState
                    title="No Shared Inventory Assets Found"
                    description="Adjust filters to search across categories like labs, rooms, and tools."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResourcesList.map((res) => (
                      <ResourceCard
                        key={res.id}
                        resource={res}
                        bookedNow={isResourceBookedNow(res.id)}
                        onViewDetails={() => {
                          if ((window as any).openAssetByTag && res.tag) {
                            (window as any).openAssetByTag(res.tag);
                          } else {
                            setSelectedResourceForDetails(res);
                            setDrawerMode('view-resource');
                            setIsDrawerOpen(true);
                          }
                        }}
                        onBookInstant={() => {
                          setSelectedResourceForDetails(res);
                          setDrawerMode('create');
                          setIsDrawerOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* 7. MODULAR MASTER CONTROL DRAWER SLIDER */}
      <BookingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={drawerMode}
        setMode={setDrawerMode}
        resources={resources}
        selectedResource={selectedResourceForDetails}
        setSelectedResource={setSelectedResourceForDetails}
        selectedBooking={selectedBookingForDetails}
        onSubmitBooking={handleCreateBooking}
        onCancelBooking={handleCancelBooking}
        onUpdateBooking={handleUpdateBooking}
        getSuggestedSlots={getSuggestedSlots}
      />

    </div>
  );
}
