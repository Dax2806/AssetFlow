import React from 'react';
import { motion } from 'motion/react';
import { MapPin, User, ChevronRight, Activity, Cpu } from 'lucide-react';
import { Asset } from '../../types';

interface AssetCardProps {
  key?: string;
  asset: Asset;
  onOpenDetail: (asset: Asset) => void;
}

export default function AssetCard({ asset, onOpenDetail }: AssetCardProps) {
  // Determine status color configurations
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400';
      case 'allocated':
        return 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-400';
      case 'reserved':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400';
      case 'maintenance':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400';
      case 'lost':
        return 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-400';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
    }
  };

  // Determine condition quality colors
  const getHealthStyle = (score?: number) => {
    const val = score ?? 90;
    if (val >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (val >= 75) return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
    if (val >= 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const defaultImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
  const displayImage = asset.images && asset.images.length > 0 ? asset.images[0] : defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="flex flex-col rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-zinc-900 dark:bg-zinc-950 overflow-hidden group select-none hover:shadow-md transition-shadow"
    >
      {/* Aspect Ratio Image Container */}
      <div className="relative h-44 w-full bg-slate-50 overflow-hidden dark:bg-zinc-900">
        <img
          src={displayImage}
          alt={asset.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Pill Tag Overlay */}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wider">
          {asset.category}
        </span>

        {/* QR Scanner Badge Overlay */}
        <span className="absolute right-3 top-3 h-6 w-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white" title={asset.tag}>
          <span className="text-[8.5px] font-bold font-mono">{asset.tag.replace('AF-', '')}</span>
        </span>

        {/* Bottom Bar: Status */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className={`rounded-md border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${getStatusStyle(asset.status)}`}>
            {asset.status}
          </span>
          <span className={`rounded-md border px-2 py-0.5 text-[9.5px] font-bold inline-flex items-center gap-1 ${getHealthStyle(asset.healthScore)}`}>
            <Activity className="h-2.5 w-2.5" />
            <span>Health: {asset.healthScore ?? 92}%</span>
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="flex-1 p-4.5 space-y-3.5 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {asset.name}
            </h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 shrink-0">
              {asset.tag}
            </span>
          </div>
          
          <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 line-clamp-2 leading-relaxed h-8">
            {asset.description || `${asset.manufacturer || 'OEM'} standard fleet model, deployed under strict site security protocols.`}
          </p>
        </div>

        {/* Technical metadata */}
        <div className="border-t border-slate-100 dark:border-zinc-900/60 pt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <MapPin className="h-3 w-3 shrink-0 text-slate-450" />
              <span>{asset.location}</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-zinc-300">
              ${(asset.purchaseCost || asset.value || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <User className="h-3 w-3 shrink-0 text-slate-450" />
              <span className="truncate max-w-[120px] font-medium">
                {asset.assignedTo || 'Unassigned / Vault'}
              </span>
            </div>
            
            <button
              onClick={() => onOpenDetail(asset)}
              className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
            >
              <span>Explore 360</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
