import React from 'react';
import { Clock, MapPin, User, CalendarDays, ArrowRight } from 'lucide-react';
import { ResourceBooking } from './types';
import { CATEGORY_COLORS } from './BookingCalendar';

interface BookingCardProps {
  key?: React.Key;
  booking: ResourceBooking;
  onClick: () => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  const colors = CATEGORY_COLORS[booking.resourceCategory] || CATEGORY_COLORS['Equipment'];

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-150 rounded-xl p-4.5 space-y-3.5 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:border-zinc-800 transition-all shadow-2xs select-none cursor-pointer text-left"
    >
      {/* Category Tag & Status Row */}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold uppercase border ${colors.bg} ${colors.text} ${colors.border}`}>
          {booking.resourceCategory}
        </span>

        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase border ${
          booking.status === 'Confirmed'
            ? 'bg-blue-50 text-blue-750 border-blue-150 dark:bg-blue-950/25 dark:text-blue-400 dark:border-blue-900/30'
            : booking.status === 'In Progress'
            ? 'bg-emerald-50 text-emerald-750 border-emerald-150 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/30'
            : booking.status === 'Completed'
            ? 'bg-zinc-50 text-zinc-500 border-zinc-150 dark:bg-zinc-900/40 dark:text-zinc-450 dark:border-zinc-850'
            : 'bg-rose-50 text-rose-600 border-rose-150 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30'
        }`}>
          {booking.status}
        </span>
      </div>

      {/* Asset name & Purpose */}
      <div>
        <h5 className="text-[12.5px] font-black text-slate-800 dark:text-zinc-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
          {booking.resourceName}
        </h5>
        <p className="text-[11px] text-slate-550 dark:text-zinc-400 font-medium truncate mt-0.5 leading-relaxed">
          {booking.purpose}
        </p>
      </div>

      {/* Roster & Hours info footer */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-zinc-900/60 flex items-center justify-between text-[10.5px] text-slate-400 dark:text-zinc-500">
        <div className="flex items-center space-x-2 truncate">
          <div className="h-6 w-6 rounded-md bg-slate-50 border border-slate-150 text-slate-500 flex items-center justify-center font-bold text-[10px] uppercase shrink-0 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
            {booking.bookedBy.substring(0, 2)}
          </div>
          <div className="truncate">
            <span className="font-bold text-slate-700 dark:text-zinc-350 block truncate">
              {booking.bookedBy}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-555">
              {booking.department}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-extrabold text-slate-700 dark:text-zinc-300 block">
            {booking.startTime} – {booking.endTime}
          </span>
          <span className="text-[9px] font-bold text-slate-450 dark:text-zinc-555 flex items-center justify-end space-x-1 mt-0.5">
            <CalendarDays className="h-2.5 w-2.5" />
            <span>{booking.date}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
