import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Clock, List, User, Plus, Filter, RefreshCw } from 'lucide-react';
import { ResourceBooking, BookingResource } from './types';
import { motion } from 'motion/react';

interface BookingCalendarProps {
  bookings: ResourceBooking[];
  resources: BookingResource[];
  selectedResourceId: string | null;
  activeDate: Date;
  setActiveDate: (date: Date) => void;
  viewMode: 'day' | 'week' | 'month' | 'agenda';
  setViewMode: (mode: 'day' | 'week' | 'month' | 'agenda') => void;
  onSelectBooking: (booking: ResourceBooking) => void;
  onGridClick: (dateStr: string, hourStr: string) => void;
}

// Color schemes for each resource category
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  'Meeting Rooms': {
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-900/40',
    ring: 'ring-indigo-500/25'
  },
  'Vehicles': {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/40',
    ring: 'ring-amber-500/25'
  },
  'Equipment': {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-900/40',
    ring: 'ring-purple-500/25'
  },
  'Projectors': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/40',
    ring: 'ring-emerald-500/25'
  },
  'Labs': {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-900/40',
    ring: 'ring-rose-500/25'
  },
};

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 AM to 6:00 PM

export default function BookingCalendar({
  bookings,
  resources,
  selectedResourceId,
  activeDate,
  setActiveDate,
  viewMode,
  setViewMode,
  onSelectBooking,
  onGridClick,
}: BookingCalendarProps) {

  // Helper: Format a date to YYYY-MM-DD in local time
  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Filter bookings based on selected resource filter
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      const matchResource = !selectedResourceId || b.resourceId === selectedResourceId;
      const matchStatus = b.status !== 'Cancelled';
      return matchResource && matchStatus;
    });
  }, [bookings, selectedResourceId]);

  // Navigate dates
  const handlePrev = () => {
    const nextDate = new Date(activeDate);
    if (viewMode === 'day') {
      nextDate.setDate(activeDate.getDate() - 1);
    } else if (viewMode === 'week') {
      nextDate.setDate(activeDate.getDate() - 7);
    } else {
      nextDate.setMonth(activeDate.getMonth() - 1);
    }
    setActiveDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(activeDate);
    if (viewMode === 'day') {
      nextDate.setDate(activeDate.getDate() + 1);
    } else if (viewMode === 'week') {
      nextDate.setDate(activeDate.getDate() + 7);
    } else {
      nextDate.setMonth(activeDate.getMonth() + 1);
    }
    setActiveDate(nextDate);
  };

  const handleToday = () => {
    setActiveDate(new Date('2026-07-12')); // App base date
  };

  // Calculate week range (Sunday to Saturday) around activeDate
  const weekDays = React.useMemo(() => {
    const currentDayOfWeek = activeDate.getDay(); // 0 is Sunday
    const startOfWeek = new Date(activeDate);
    startOfWeek.setDate(activeDate.getDate() - currentDayOfWeek);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [activeDate]);

  // Format header text
  const headerText = React.useMemo(() => {
    if (viewMode === 'day') {
      return activeDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } else if (viewMode === 'week') {
      const startStr = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startStr} – ${endStr}`;
    } else {
      return activeDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }, [activeDate, viewMode, weekDays]);

  // Generate Month Grid Dates
  const monthGridDays = React.useMemo(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDay = firstDayOfMonth.getDay(); // index 0-6
    const totalDays = lastDayOfMonth.getDate();
    
    const days: (Date | null)[] = [];
    
    // Fill leading empty days
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Fill actual days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    // Fill trailing empty days to form multiple of 7
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    
    return days;
  }, [activeDate]);

  // Live indicator offset helper
  // Assuming our mock active timeline is Sunday, July 12, 2026.
  // We'll simulate 12:20 PM current indicator
  const isTargetDateToday = formatDateString(activeDate) === '2026-07-12';

  return (
    <div className="bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-900 rounded-2xl flex flex-col h-full overflow-hidden shadow-xs">
      
      {/* Calendar Header Tool Rail */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4.5 border-b border-slate-100 dark:border-zinc-900/60 gap-3 bg-slate-50/55 dark:bg-zinc-950/20">
        
        {/* Navigation block */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-550 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Today (July 12)
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-550 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 ml-1 bg-white border border-slate-150/70 px-3 py-1.5 rounded-lg dark:bg-zinc-900 dark:border-zinc-800">
            {headerText}
          </span>
        </div>

        {/* View Selection Segment */}
        <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl">
          {(['day', 'week', 'month', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-zinc-850 dark:text-zinc-100'
                  : 'text-slate-550 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid viewport */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        
        {/* DAY VIEW */}
        {viewMode === 'day' && (
          <div className="min-w-[450px]">
            {/* Hour columns layout */}
            <div className="grid grid-cols-[80px_1fr] divide-x divide-slate-100 dark:divide-zinc-900">
              
              {/* Hour strip left */}
              <div className="bg-slate-50/40 dark:bg-zinc-950/10 text-[10.5px] font-bold text-slate-400 dark:text-zinc-650 flex flex-col text-right pr-3.5 py-4 space-y-[45px]">
                {HOURS.map((h) => (
                  <div key={h} className="h-6">
                    {h === 12 ? '12:00 PM' : h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
                  </div>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="relative p-2 space-y-1">
                {/* Visual grid rows */}
                <div className="absolute inset-0 grid grid-rows-11 divide-y divide-slate-100/75 dark:divide-zinc-900/60 pointer-events-none">
                  {HOURS.map((h) => (
                    <div key={h} className="h-[71px]" />
                  ))}
                </div>

                {/* Plot bookings */}
                <div className="relative h-[781px] z-10">
                  {filteredBookings
                    .filter((b) => b.date === formatDateString(activeDate))
                    .map((booking) => {
                      const startHour = parseInt(booking.startTime.split(':')[0]);
                      const startMin = parseInt(booking.startTime.split(':')[1]);
                      const endHour = parseInt(booking.endTime.split(':')[0]);
                      const endMin = parseInt(booking.endTime.split(':')[1]);

                      // Calculate position based on hours (8 to 19)
                      const startPos = (startHour - 8) * 71 + (startMin / 60) * 71;
                      const durationHours = (endHour - startHour) + (endMin - startMin) / 60;
                      const height = durationHours * 71;

                      const colors = CATEGORY_COLORS[booking.resourceCategory] || CATEGORY_COLORS['Equipment'];

                      return (
                        <div
                          key={booking.id}
                          onClick={() => onSelectBooking(booking)}
                          style={{ top: `${startPos}px`, height: `${height}px` }}
                          className={`absolute left-2 right-4 rounded-xl border p-2.5 flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer select-none overflow-hidden ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          <div className="truncate">
                            <span className="text-[9px] font-extrabold uppercase opacity-80 tracking-wider">
                              {booking.startTime} – {booking.endTime} • {booking.resourceCategory}
                            </span>
                            <h6 className="text-[11.5px] font-black truncate mt-0.5">
                              {booking.resourceName} : {booking.purpose}
                            </h6>
                          </div>

                          <div className="flex items-center justify-between text-[10px] mt-2 font-medium opacity-90 truncate">
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3 opacity-60" />
                              <span>{booking.bookedBy} ({booking.department})</span>
                            </span>
                            <span className="bg-white/45 px-1.5 py-0.5 rounded text-[9px] font-extrabold border border-current/20 uppercase">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* Interactive Empty Grid Cells to create booking */}
                  {HOURS.map((h, i) => {
                    const cellTime = `${String(h).padStart(2, '0')}:00`;
                    const dateStr = formatDateString(activeDate);
                    return (
                      <div
                        key={h}
                        style={{ top: `${i * 71}px`, height: '71px' }}
                        onClick={() => onGridClick(dateStr, cellTime)}
                        className="absolute left-0 right-0 hover:bg-emerald-55/5 dark:hover:bg-emerald-950/5 group border-b border-transparent transition-colors flex items-start justify-end p-2 cursor-pointer z-0"
                      >
                        <span className="opacity-0 group-hover:opacity-100 bg-emerald-600 text-white rounded px-2 py-0.5 text-[9px] font-black flex items-center space-x-1 shadow-xs transition-opacity">
                          <Plus className="h-2.5 w-2.5" />
                          <span>Reserve at {cellTime}</span>
                        </span>
                      </div>
                    );
                  })}

                  {/* Current simulated time indicator line at July 12, 12:20 PM */}
                  {isTargetDateToday && (
                    <div
                      style={{ top: `${(12 - 8) * 71 + (20 / 60) * 71}px` }}
                      className="absolute left-0 right-0 border-t-2 border-rose-500 z-20 flex items-center pointer-events-none"
                    >
                      <span className="bg-rose-500 text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded -translate-y-1/2 ml-2 shadow-xs">
                        12:20 PM (Now)
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* WEEK VIEW */}
        {viewMode === 'week' && (
          <div className="min-w-[800px] select-none">
            {/* Headers row (Days labels) */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-100 dark:border-zinc-900 divide-x divide-slate-100 dark:divide-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 text-center py-2 shrink-0">
              <div />
              {weekDays.map((day) => {
                const dateStr = formatDateString(day);
                const isSelected = dateStr === formatDateString(activeDate);
                const isToday = dateStr === '2026-07-12';

                return (
                  <div
                    key={dateStr}
                    onClick={() => setActiveDate(day)}
                    className={`py-1 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-900/40 rounded-lg mx-1.5 transition-colors ${
                      isSelected ? 'bg-slate-150/50 dark:bg-zinc-900/60' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span
                      className={`text-sm font-black mt-1 h-7 w-7 rounded-full flex items-center justify-center leading-none ${
                        isToday
                          ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/25'
                          : 'text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid rows with Hours vertical strip */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] divide-x divide-slate-100 dark:divide-zinc-900 h-[781px] relative">
              
              {/* Hour tags column */}
              <div className="bg-slate-50/40 dark:bg-zinc-950/10 text-[10px] font-bold text-slate-400 dark:text-zinc-650 flex flex-col text-right pr-3.5 py-4 space-y-[45px] select-none pointer-events-none">
                {HOURS.map((h) => (
                  <div key={h} className="h-6">
                    {h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`}
                  </div>
                ))}
              </div>

              {/* Grid cell lines rendering under columns */}
              {weekDays.map((day) => {
                const dayStr = formatDateString(day);
                return (
                  <div key={dayStr} className="relative bg-white dark:bg-zinc-950 h-full">
                    {/* Background rows helper */}
                    <div className="absolute inset-0 grid grid-rows-11 divide-y divide-slate-100/70 dark:divide-zinc-900/50 pointer-events-none">
                      {HOURS.map((h) => (
                        <div key={h} className="h-[71px]" />
                      ))}
                    </div>

                    {/* Bookings mapped into this day column */}
                    {filteredBookings
                      .filter((b) => b.date === dayStr)
                      .map((booking) => {
                        const startHour = parseInt(booking.startTime.split(':')[0]);
                        const startMin = parseInt(booking.startTime.split(':')[1]);
                        const endHour = parseInt(booking.endTime.split(':')[0]);
                        const endMin = parseInt(booking.endTime.split(':')[1]);

                        const startPos = (startHour - 8) * 71 + (startMin / 60) * 71;
                        const durationHours = (endHour - startHour) + (endMin - startMin) / 60;
                        const height = durationHours * 71;

                        const colors = CATEGORY_COLORS[booking.resourceCategory] || CATEGORY_COLORS['Equipment'];

                        return (
                          <div
                            key={booking.id}
                            onClick={() => onSelectBooking(booking)}
                            style={{ top: `${startPos}px`, height: `${height}px` }}
                            className={`absolute left-1 right-1 rounded-lg border p-1.5 flex flex-col justify-between hover:shadow-xs cursor-pointer select-none overflow-hidden z-10 transition-all ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            <div className="truncate">
                              <span className="text-[8.5px] font-extrabold uppercase opacity-85 block truncate">
                                {booking.startTime} - {booking.endTime}
                              </span>
                              <h6 className="text-[10px] font-extrabold mt-0.5 truncate text-slate-900 dark:text-white leading-tight">
                                {booking.resourceName}
                              </h6>
                              <p className="text-[9.5px] truncate opacity-90 mt-0.5 font-medium leading-none">
                                {booking.purpose}
                              </p>
                            </div>

                            <span className="text-[8.5px] font-semibold truncate opacity-80 mt-1 block">
                              {booking.bookedBy}
                            </span>
                          </div>
                        );
                      })}

                    {/* Interactive cells for adding booking */}
                    {HOURS.map((h, i) => (
                      <div
                        key={h}
                        style={{ top: `${i * 71}px`, height: '71px' }}
                        onClick={() => onGridClick(dayStr, `${String(h).padStart(2, '0')}:00`)}
                        className="absolute left-0 right-0 hover:bg-emerald-500/5 transition-colors cursor-pointer z-0"
                      />
                    ))}

                    {/* Simulated live time horizontal line in Week view */}
                    {dayStr === '2026-07-12' && (
                      <div
                        style={{ top: `${(12 - 8) * 71 + (20 / 60) * 71}px` }}
                        className="absolute left-0 right-0 border-t border-rose-500 z-20 pointer-events-none"
                      />
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="select-none min-w-[650px]">
            {/* Weekdays Labels row */}
            <div className="grid grid-cols-7 border-b border-slate-150 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10 text-center py-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd) => (
                <span key={wd} className="text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  {wd}
                </span>
              ))}
            </div>

            {/* 5-6 week row grid cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-zinc-900 border-b border-slate-100 dark:border-zinc-900">
              {monthGridDays.map((day, idx) => {
                if (!day) {
                  return (
                    <div key={`empty-${idx}`} className="h-28 bg-slate-50/20 dark:bg-zinc-950/20" />
                  );
                }

                const dateStr = formatDateString(day);
                const isSelected = dateStr === formatDateString(activeDate);
                const isToday = dateStr === '2026-07-12';

                // Find bookings on this day
                const dayBookings = filteredBookings.filter((b) => b.date === dateStr);

                return (
                  <div
                    key={dateStr}
                    onClick={() => setActiveDate(day)}
                    className={`h-28 p-2 flex flex-col justify-between hover:bg-slate-50/40 dark:hover:bg-zinc-900/20 cursor-pointer transition-colors relative ${
                      isSelected ? 'bg-slate-50/60 dark:bg-zinc-900/20' : 'bg-white dark:bg-zinc-950'
                    }`}
                  >
                    {/* Day number header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11.5px] font-black h-5.5 w-5.5 rounded-full flex items-center justify-center leading-none ${
                          isToday
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        {day.getDate()}
                      </span>

                      {/* Display small dots or summary numbers if bookings count is high */}
                      {dayBookings.length > 0 && (
                        <span className="text-[9.5px] font-bold text-slate-400">
                          {dayBookings.length} {dayBookings.length === 1 ? 'res' : 'res'}
                        </span>
                      )}
                    </div>

                    {/* Bookings listed inside cell */}
                    <div className="mt-1.5 flex-1 overflow-y-auto space-y-1 scrollbar-none max-h-[64px]">
                      {dayBookings.slice(0, 3).map((b) => {
                        const colors = CATEGORY_COLORS[b.resourceCategory] || CATEGORY_COLORS['Equipment'];
                        return (
                          <div
                            key={b.id}
                            onClick={(e) => {
                              e.stopPropagation(); // prevent setting activeDate twice
                              onSelectBooking(b);
                            }}
                            className={`px-1.5 py-0.5 rounded border text-[9px] font-bold truncate leading-snug hover:shadow-2xs cursor-pointer ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {b.startTime} • {b.resourceName}
                          </div>
                        );
                      })}

                      {dayBookings.length > 3 && (
                        <div className="text-[8.5px] text-slate-400 dark:text-zinc-550 font-semibold pl-1">
                          + {dayBookings.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Fast add hook button on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGridClick(dateStr, '09:00');
                      }}
                      className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 group-hover:opacity-100 h-5 w-5 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-xs"
                      title="Quick Book"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AGENDA VIEW */}
        {viewMode === 'agenda' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-zinc-650">
                Weekly chronological schedule
              </h5>
              <div className="text-[11px] font-bold text-slate-550 dark:text-zinc-450">
                Found <span className="font-extrabold text-emerald-600">{filteredBookings.length}</span> active reservations
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="py-16 text-center">
                <List className="h-10 w-10 text-slate-200 dark:text-zinc-850 mx-auto stroke-1" />
                <p className="mt-2.5 text-xs font-bold text-slate-400 dark:text-zinc-550">
                  No reservations booked on this timeline filter
                </p>
                <button
                  onClick={() => onGridClick(formatDateString(activeDate), '09:00')}
                  className="mt-3.5 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10.5px] font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Reserve Asset Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Group bookings by Date */}
                {(Array.from(new Set(filteredBookings.map((b) => b.date))) as string[])
                  .sort()
                  .map((dateStr) => {
                    const dayBookings = filteredBookings.filter((b) => b.date === dateStr);
                    const formattedDayLabel = new Date(dateStr).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <div key={dateStr} className="space-y-2">
                        {/* Group Header Label */}
                        <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-lg px-3.5 py-1.5 border border-slate-150/60 dark:border-zinc-900 flex items-center justify-between">
                          <span className="text-[10.5px] font-extrabold text-slate-600 dark:text-zinc-350">
                            {formattedDayLabel}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {dayBookings.length} BOOKINGS
                          </span>
                        </div>

                        {/* Booking items list for this date */}
                        <div className="grid gap-2.5">
                          {dayBookings.map((booking) => {
                            const colors = CATEGORY_COLORS[booking.resourceCategory] || CATEGORY_COLORS['Equipment'];
                            return (
                              <div
                                key={booking.id}
                                onClick={() => onSelectBooking(booking)}
                                className={`group rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-xs transition-all cursor-pointer bg-white border-slate-150 dark:bg-zinc-950 dark:border-zinc-850 gap-4`}
                              >
                                <div className="flex items-start space-x-3 truncate">
                                  {/* Color accent category badge tag icon */}
                                  <div className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>
                                    <Clock className="h-4.5 w-4.5" />
                                  </div>
                                  <div className="truncate">
                                    <h6 className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                                      {booking.resourceName} : {booking.purpose}
                                    </h6>
                                    <div className="flex items-center space-x-2 mt-1 text-[10.5px] text-slate-400 dark:text-zinc-500">
                                      <span className="font-extrabold text-slate-650 dark:text-zinc-350 bg-slate-50 border border-slate-150 dark:bg-zinc-900 dark:border-zinc-800 px-1.5 py-0.5 rounded text-[9.5px]">
                                        {booking.startTime} – {booking.endTime}
                                      </span>
                                      <span>•</span>
                                      <span>Booked by {booking.bookedBy} ({booking.department})</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-50 pt-2.5 sm:pt-0">
                                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-550 uppercase tracking-widest">
                                    {booking.resourceCategory}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md border ${
                                    booking.status === 'Confirmed'
                                      ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/25 dark:text-blue-400 dark:border-blue-900/30'
                                      : booking.status === 'In Progress'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/30'
                                      : 'bg-zinc-50 text-zinc-500 border-zinc-150 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

      </div>
      
    </div>
  );
}
