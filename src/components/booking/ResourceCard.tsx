import React from 'react';
import { Users, MapPin, Eye, Calendar, Sparkles, Check } from 'lucide-react';
import { BookingResource } from './types';

interface ResourceCardProps {
  key?: React.Key;
  resource: BookingResource;
  onViewDetails: () => void;
  onBookInstant: () => void;
  bookedNow: boolean;
}

export default function ResourceCard({
  resource,
  onViewDetails,
  onBookInstant,
  bookedNow,
}: ResourceCardProps) {
  return (
    <div className="bg-white border border-slate-150 rounded-xl overflow-hidden hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-850 dark:hover:border-zinc-800 transition-all shadow-2xs select-none flex flex-col h-full text-left">
      
      {/* Image frame */}
      <div className="relative h-40 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={resource.imageUrl}
          alt={resource.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform group-hover:scale-103"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          <span className="bg-emerald-600 text-white text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs self-start">
            {resource.category}
          </span>
          <span className="bg-slate-900/80 text-white text-[8.5px] font-mono px-1.5 py-0.5 rounded-md self-start">
            {resource.tag}
          </span>
        </div>

        {/* Live status badge */}
        <div className="absolute bottom-3 right-3">
          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ring-2 ${
            bookedNow
              ? 'bg-rose-500 text-white ring-rose-100/40'
              : 'bg-emerald-500 text-white ring-emerald-100/40'
          }`}>
            <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
            <span>{bookedNow ? 'Booked Now' : 'Available Now'}</span>
          </span>
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h5 className="text-[12.5px] font-black text-slate-800 dark:text-zinc-200 leading-tight">
            {resource.name}
          </h5>
          <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{resource.location}</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 pt-1 font-medium">
            {resource.description}
          </p>
        </div>

        {/* Specs summary & features */}
        <div className="space-y-3.5 pt-3 border-t border-slate-100 dark:border-zinc-900/60 flex-1 flex flex-col justify-end">
          
          {/* Features subset */}
          <div className="flex flex-wrap gap-1">
            {resource.features.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                className="bg-slate-50 border border-slate-150 text-slate-550 rounded px-1.5 py-0.5 text-[9px] font-bold dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-450"
              >
                {feat}
              </span>
            ))}
            {resource.features.length > 3 && (
              <span className="text-[9px] text-slate-400 font-semibold pl-1 self-center">
                + {resource.features.length - 3} more
              </span>
            )}
          </div>

          {/* Utilization progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Weekly Load</span>
              <span className="text-slate-700 dark:text-zinc-300 font-extrabold">{resource.utilizationWeek}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-850 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${resource.utilizationWeek}%` }}
                className="bg-emerald-600 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Button controls */}
        <div className="grid grid-cols-2 gap-2 pt-1 shrink-0">
          <button
            type="button"
            onClick={onViewDetails}
            className="h-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 text-[11px] font-bold flex items-center justify-center space-x-1 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={onBookInstant}
            className="h-8.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold flex items-center justify-center space-x-1 shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Book</span>
          </button>
        </div>
      </div>

    </div>
  );
}
