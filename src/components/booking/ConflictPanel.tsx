import React from 'react';
import { AlertCircle, Calendar, User, Clock, Check, ArrowRight } from 'lucide-react';
import { ResourceBooking } from './types';
import { motion } from 'motion/react';

interface ConflictPanelProps {
  conflictingBooking: ResourceBooking;
  requestedStartTime: string;
  requestedEndTime: string;
  suggestedSlots: { startTime: string; endTime: string }[];
  onSelectSlot: (startTime: string, endTime: string) => void;
  onCancel: () => void;
}

export default function ConflictPanel({
  conflictingBooking,
  requestedStartTime,
  requestedEndTime,
  suggestedSlots,
  onSelectSlot,
  onCancel,
}: ConflictPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="rounded-xl border border-rose-100 bg-rose-50/40 p-5 dark:border-rose-950/30 dark:bg-rose-950/10 space-y-4"
    >
      <div className="flex items-start space-x-3">
        <div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 dark:bg-rose-950/45 dark:text-rose-450 shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-rose-950 dark:text-rose-200 tracking-tight">
            Schedule Conflict Detected
          </h4>
          <p className="text-[10.5px] text-rose-700/80 dark:text-rose-400/80 leading-relaxed mt-0.5">
            The resource <strong>{conflictingBooking.resourceName}</strong> is already reserved during your requested slot ({requestedStartTime} – {requestedEndTime}).
          </p>
        </div>
      </div>

      {/* Conflicting Booking Card */}
      <div className="bg-white border border-rose-100 dark:bg-zinc-900/60 dark:border-rose-950/20 rounded-lg p-3.5 space-y-3 shadow-xs">
        <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">
          Existing Conflicting Reservation
        </p>
        
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px]">
          <div className="flex items-center space-x-2 text-slate-650 dark:text-zinc-300">
            <User className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-550 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-800 dark:text-zinc-200 block">
                {conflictingBooking.bookedBy}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-zinc-500">
                {conflictingBooking.department}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-650 dark:text-zinc-300">
            <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-550 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-zinc-200 block">
                {conflictingBooking.startTime} – {conflictingBooking.endTime}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-zinc-500">
                {conflictingBooking.date}
              </span>
            </div>
          </div>
        </div>

        {conflictingBooking.purpose && (
          <div className="pt-2 border-t border-rose-50 dark:border-rose-950/10 text-[10.5px] text-slate-550 dark:text-zinc-400 leading-relaxed italic">
            " {conflictingBooking.purpose} "
          </div>
        )}
      </div>

      {/* Suggested Slots Section */}
      <div className="space-y-2">
        <p className="text-[9.5px] font-bold text-slate-550 dark:text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
          <span>Suggested Conflict-Free Slots</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </p>

        {suggestedSlots.length === 0 ? (
          <p className="text-[10px] text-slate-450 dark:text-zinc-550 italic">
            No alternative spots found during standard working hours. Please change the date.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {suggestedSlots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectSlot(slot.startTime, slot.endTime)}
                className="group flex items-center justify-between px-3 h-10 rounded-lg border border-slate-150 bg-white hover:bg-emerald-50/40 hover:border-emerald-200 text-[11px] text-slate-700 font-semibold dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-900/40 dark:text-zinc-300 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500 dark:text-zinc-500 transition-colors" />
                  <span>{slot.startTime} – {slot.endTime}</span>
                </div>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-emerald-600 dark:text-emerald-400 transition-all -translate-x-1 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-1 flex items-center space-x-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-9.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800 cursor-pointer"
        >
          Cancel & Edit Form
        </button>
      </div>
    </motion.div>
  );
}
