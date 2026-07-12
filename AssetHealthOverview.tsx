import React from 'react';
import { Booking } from '../types';
import { Calendar, User2, Check, X } from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
  onCheckInBooking: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingTable({
  bookings,
  onCheckInBooking,
  onCancelBooking
}: BookingTableProps) {
  
  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
      case 'In Progress':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Completed':
        return 'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800';
      case 'Cancelled':
        return 'bg-red-50 text-red-500 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20';
    }
  };

  const formatBookingTime = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      
      const formatTimeOnly = (d: Date) => {
        return d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(/^0/, ''); // Remove leading zero if any
      };

      const dateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${dateStr}, ${formatTimeOnly(start)} - ${formatTimeOnly(end)}`;
    } catch {
      return 'Scheduled';
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-900">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Upcoming Bookings
          </h3>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Meeting rooms, collaborative booths, and transit vehicle schedules
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 dark:bg-zinc-900/60 dark:text-zinc-600">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">No scheduled bookings</p>
            <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 max-w-xs">
              No reservation logs or meetings are scheduled for the current selection.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[500px] table-auto border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:border-zinc-900 dark:text-zinc-500">
                <th className="pb-3 pt-1 font-semibold">Resource / Type</th>
                <th className="pb-3 pt-1 font-semibold">Booked By</th>
                <th className="pb-3 pt-1 font-semibold">Scheduled Time</th>
                <th className="pb-3 pt-1 font-semibold">Status</th>
                <th className="pb-3 pt-1 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-900">
              {bookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-slate-50/40 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="py-3.5 pr-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                        {booking.resourceName}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        {booking.resourceType}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600 dark:bg-zinc-850 dark:text-zinc-400">
                        {booking.bookedBy.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium leading-none">
                          {booking.bookedBy}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">
                          {booking.userEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                      {formatBookingTime(booking.startTime, booking.endTime)}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {booking.status === 'Confirmed' && (
                      <div className="inline-flex space-x-1">
                        <button
                          onClick={() => onCheckInBooking(booking.id)}
                          className="inline-flex h-6 items-center space-x-1 rounded bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 px-2 text-[10px] font-semibold text-slate-600 hover:text-emerald-700 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 dark:hover:border-emerald-900/40 cursor-pointer"
                          title="Check In Resource"
                        >
                          <Check className="h-2.5 w-2.5" />
                          <span>Start</span>
                        </button>
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="inline-flex h-6 items-center justify-center rounded bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 px-2 text-[10px] font-semibold text-slate-500 hover:text-red-650 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:hover:border-red-900/40 cursor-pointer"
                          title="Cancel Booking"
                        >
                          <X className="h-2.5 w-2.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                    {booking.status === 'In Progress' && (
                      <button
                        onClick={() => onCheckInBooking(booking.id)} // Will toggle complete
                        className="inline-flex h-6 items-center space-x-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-100 px-2 text-[10px] font-semibold text-slate-600 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        <span>End Session</span>
                      </button>
                    )}
                    {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium italic">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
