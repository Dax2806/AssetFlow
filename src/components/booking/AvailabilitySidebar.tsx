import React from 'react';
import { Search, MapPin, Users, HelpCircle, Layers, Check, Clock, CalendarDays, Eye } from 'lucide-react';
import { BookingResource, ResourceCategory } from './types';
import { motion } from 'motion/react';

interface AvailabilitySidebarProps {
  resources: BookingResource[];
  selectedCategory: ResourceCategory | 'All';
  setSelectedCategory: (category: ResourceCategory | 'All') => void;
  selectedResourceId: string | null;
  onSelectResource: (resourceId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onViewResourceDetails: (resource: BookingResource) => void;
  // A helper to know if a resource is currently reserved at "this very moment"
  isResourceBookedNow: (resourceId: string) => boolean;
}

const CATEGORIES: { id: ResourceCategory | 'All'; label: string; icon: string }[] = [
  { id: 'All', label: 'All Resources', icon: 'Layers' },
  { id: 'Meeting Rooms', label: 'Meeting Rooms', icon: 'Building' },
  { id: 'Vehicles', label: 'Vehicles', icon: 'Car' },
  { id: 'Equipment', label: 'Equipment', icon: 'Camera' },
  { id: 'Projectors', label: 'Projectors', icon: 'Projector' },
  { id: 'Labs', label: 'Labs', icon: 'FlaskConical' },
];

export default function AvailabilitySidebar({
  resources,
  selectedCategory,
  setSelectedCategory,
  selectedResourceId,
  onSelectResource,
  searchQuery,
  setSearchQuery,
  onViewResourceDetails,
  isResourceBookedNow,
}: AvailabilitySidebarProps) {
  
  // Filter resources based on selectedCategory and searchQuery
  const filteredResources = React.useMemo(() => {
    return resources.filter((res) => {
      const matchCat = selectedCategory === 'All' || res.category === selectedCategory;
      const matchSearch =
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950/40 border-r border-slate-150 dark:border-zinc-900 select-none">
      {/* Sidebar Search */}
      <div className="p-4 border-b border-slate-100 dark:border-zinc-900/60 space-y-3 shrink-0">
        <p className="text-[10px] font-black text-slate-400 dark:text-zinc-650 uppercase tracking-widest">
          Resource Navigator
        </p>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-550" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shared assets..."
            className="h-9 w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus:bg-zinc-950 transition-all"
          />
        </div>
      </div>

      {/* Horizontal categories scroll */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-900/40 shrink-0 overflow-x-auto scrollbar-none flex space-x-1.5">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-7 px-3.5 rounded-full text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-450 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Resources List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {filteredResources.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Layers className="h-8 w-8 text-slate-300 dark:text-zinc-700 mx-auto stroke-1" />
            <p className="mt-2 text-xs font-bold text-slate-400 dark:text-zinc-500">
              No assets found
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-1">
              Try adjusting your category or search.
            </p>
          </div>
        ) : (
          filteredResources.map((res) => {
            const isSelected = selectedResourceId === res.id;
            const bookedNow = isResourceBookedNow(res.id);

            return (
              <div
                key={res.id}
                onClick={() => onSelectResource(isSelected ? null : res.id)}
                className={`group relative rounded-xl border p-3.5 space-y-3 transition-all cursor-pointer select-none text-left ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/20 dark:border-emerald-600 dark:bg-emerald-950/10'
                    : 'border-slate-150 hover:border-slate-300 hover:bg-slate-50/50 dark:border-zinc-850 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/10'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between space-x-2">
                  <div className="truncate">
                    <p className="text-[9.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      {res.category} • {res.tag}
                    </p>
                    <h5 className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 mt-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {res.name}
                    </h5>
                  </div>

                  {/* Status Indicator Badge */}
                  <span
                    className={`h-2 w-2 rounded-full mt-1 shrink-0 ring-4 ${
                      bookedNow
                        ? 'bg-rose-500 ring-rose-50 dark:ring-rose-950/40'
                        : 'bg-emerald-500 ring-emerald-50 dark:ring-emerald-950/40'
                    }`}
                    title={bookedNow ? 'Booked Now' : 'Available Now'}
                  />
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10.5px] text-slate-500 dark:text-zinc-450 border-t border-slate-100 dark:border-zinc-900/60 pt-2.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span className="truncate max-w-[120px]">{res.location}</span>
                  </span>

                  {res.capacity && (
                    <span className="flex items-center space-x-1 font-medium">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span>Seats {res.capacity}</span>
                    </span>
                  )}
                </div>

                {/* Quick actions row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9.5px] font-bold text-slate-400 dark:text-zinc-550">
                    Week Usage: <span className="text-slate-700 dark:text-zinc-300 font-extrabold">{res.utilizationWeek}%</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting the card
                      onViewResourceDetails(res);
                    }}
                    className="flex items-center space-x-1.5 px-2 py-1 rounded border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-[10px] font-semibold text-slate-500 hover:text-emerald-700 dark:border-zinc-800 dark:text-zinc-450 dark:hover:border-emerald-900/40 dark:hover:text-emerald-400 transition-all"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 border-t border-slate-100 dark:border-zinc-900 text-[10px] text-slate-400 dark:text-zinc-650 shrink-0">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Available Now</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>Booked Now</span>
          </span>
        </div>
      </div>
    </div>
  );
}
