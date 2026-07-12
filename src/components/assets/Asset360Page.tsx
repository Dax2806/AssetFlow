import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Calendar, Shield, MapPin, Tag, User, DollarSign, Activity, 
  Clock, Award, Paperclip, ExternalLink, Hammer, CheckCircle, AlertTriangle, 
  Download, Image as ImageIcon, Trash2, Send, Heart, Wrench, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { Asset } from '../../types';

interface Asset360PageProps {
  asset: Asset;
  onBack: () => void;
  onOpenEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onUpdateAsset: (updated: Asset) => void;
}

export default function Asset360Page({ asset, onBack, onOpenEdit, onDelete, onUpdateAsset }: Asset360PageProps) {
  const [activeTab, setActiveTab] = React.useState<'specs' | 'timeline' | 'maintenance' | 'audits' | 'docs'>('timeline');
  const [activePhotoIdx, setActivePhotoIdx] = React.useState(0);
  const [feedbackMessage, setFeedbackMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSimulatingAction, setIsSimulatingAction] = React.useState(false);

  // Fallbacks for arrays
  const photos = asset.images && asset.images.length > 0 ? asset.images : [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  ];
  const attachments = asset.attachments || [
    { name: 'technical_manual.pdf', size: '1.2 MB', type: 'pdf' }
  ];
  const timeline = asset.timeline || [
    { status: 'Registered', label: 'Asset Registered', date: asset.purchaseDate, description: 'Added to inventory by Om Patel.' }
  ];
  const maintenance = asset.maintenanceHistory || [];
  const audits = asset.auditHistory || [];

  // Computed Values
  const purchaseCost = asset.purchaseCost || asset.value || 1200;
  const currentVal = React.useMemo(() => {
    // Basic depreciation helper
    const buyYear = new Date(asset.purchaseDate).getFullYear();
    const currentYear = 2026;
    const age = Math.max(0, currentYear - buyYear);
    const depRate = asset.category === 'IT Hardware' ? 0.25 : 0.12; // IT depreciates faster
    const depreciated = purchaseCost * Math.pow(1 - depRate, age);
    return Math.max(purchasedValueDepreciatedFloor(purchaseCost), Math.round(depreciated));
  }, [purchaseCost, asset.category, asset.purchaseDate]);

  function purchasedValueDepreciatedFloor(cost: number) {
    return Math.round(cost * 0.15); // Salvage floor is 15%
  }

  // Quick Action Simulation (Checkout/Service/Audit)
  const triggerSimulation = (actionType: 'checkout' | 'service' | 'audit') => {
    setIsSimulatingAction(true);
    setFeedbackMessage(null);

    setTimeout(() => {
      setIsSimulatingAction(false);
      let updatedAsset = { ...asset };
      
      if (actionType === 'service') {
        updatedAsset.status = 'maintenance';
        updatedAsset.timeline = [
          {
            status: 'Maintenance',
            label: 'Maintenance Dispatched',
            date: '2026-07-11',
            description: 'Triggered diagnostic check from Asset 360 command panel.',
            user: 'Om Patel'
          },
          ...(asset.timeline || [])
        ];
        onUpdateAsset(updatedAsset);
        setFeedbackMessage({ text: 'Asset successfully dispatched to maintenance service.', type: 'success' });
      } else if (actionType === 'checkout') {
        if (asset.status === 'allocated') {
          updatedAsset.status = 'available';
          updatedAsset.assignedTo = undefined;
          updatedAsset.timeline = [
            {
              status: 'Returned',
              label: 'Returned to Vault',
              date: '2026-07-11',
              description: 'Checked back in by custodian Sarah Jenkins.',
              user: 'Sarah Jenkins'
            },
            ...(asset.timeline || [])
          ];
          onUpdateAsset(updatedAsset);
          setFeedbackMessage({ text: 'Asset successfully checked back into Central Vault.', type: 'success' });
        } else {
          updatedAsset.status = 'allocated';
          updatedAsset.assignedTo = 'Sarah Jenkins';
          updatedAsset.timeline = [
            {
              status: 'Allocated',
              label: 'Assigned Custody',
              date: '2026-07-11',
              description: 'Provisioned for regional engineering sprints.',
              user: 'Sarah Jenkins'
            },
            ...(asset.timeline || [])
          ];
          onUpdateAsset(updatedAsset);
          setFeedbackMessage({ text: 'Asset successfully allocated to Sarah Jenkins.', type: 'success' });
        }
      } else if (actionType === 'audit') {
        const newAudit = {
          id: `au-${Math.floor(100+Math.random()*900)}`,
          date: '2026-07-11',
          status: 'Passed' as const,
          auditor: 'Om Patel',
          notes: 'Standard self-audit executed via Asset 360 detailed view. Hardware checks approved.'
        };
        updatedAsset.auditHistory = [newAudit, ...(asset.auditHistory || [])];
        updatedAsset.timeline = [
          {
            status: 'Audited',
            label: 'Instant Self-Audit Approved',
            date: '2026-07-11',
            description: 'Physical & digital tag verification passed.',
            user: 'Om Patel'
          },
          ...(asset.timeline || [])
        ];
        onUpdateAsset(updatedAsset);
        setFeedbackMessage({ text: 'Instant hardware audit passed and saved in ledger.', type: 'success' });
      }
    }, 850);
  };

  // Color mappings
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400';
      case 'allocated':
        return 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-400';
      case 'maintenance':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400';
      default:
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400';
    }
  };

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'Registered':
        return <Award className="h-4 w-4 text-emerald-600" />;
      case 'Allocated':
        return <User className="h-4 w-4 text-sky-600" />;
      case 'Maintenance':
        return <Hammer className="h-4 w-4 text-rose-600" />;
      case 'Returned':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'Audited':
        return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  // Health Ring Math
  const healthScore = asset.healthScore ?? 92;
  const radius = 38;
  const strokeDashoffset = 2 * Math.PI * radius * (1 - healthScore / 100);

  const getHealthRingColor = (score: number) => {
    if (score >= 90) return 'stroke-emerald-500';
    if (score >= 75) return 'stroke-sky-450';
    if (score >= 50) return 'stroke-amber-450';
    return 'stroke-rose-500';
  };

  const getHealthTextColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-sky-500';
    if (score >= 50) return 'text-amber-550';
    return 'text-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-6"
    >
      {/* 1. Page Header / Breadcrumb navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex h-8.5 items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenEdit(asset)}
            className="h-8.5 inline-flex items-center space-x-1.5 rounded-lg bg-white border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <span>Edit Profile</span>
          </button>
          
          <button
            onClick={() => {
              if (confirm(`Are you absolutely sure you want to decommission and remove ${asset.tag}?`)) {
                onDelete(asset.id);
                onBack();
              }
            }}
            className="h-8.5 inline-flex items-center space-x-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-3.5 text-xs font-bold text-white cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Decommission Asset</span>
          </button>
        </div>
      </div>

      {/* Action Simulation Feedback Banner */}
      {feedbackMessage && (
        <div className={`rounded-xl border p-4 flex items-center justify-between gap-4 text-xs font-semibold ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400' 
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMessage(null)} 
            className="text-[11px] font-bold underline hover:opacity-80 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Primary 360 Intel Hero Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Side: Photo Showcase & Gallery */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200/80 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="relative h-64 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900">
              <img
                src={photos[activePhotoIdx]}
                alt={asset.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                Photo {activePhotoIdx + 1} of {photos.length}
              </span>
            </div>

            {/* Thumbnails list */}
            {photos.length > 1 && (
              <div className="flex gap-2">
                {photos.map((ph, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`h-11 w-11 rounded border overflow-hidden transition-all bg-slate-100 cursor-pointer shrink-0 ${
                      activePhotoIdx === idx 
                        ? 'border-emerald-500 ring-1 ring-emerald-500' 
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={ph} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-900/60 pt-4 mt-4 space-y-2 text-center sm:text-left">
            <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Identity QR Identifier</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded bg-white p-1 border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${asset.tag}`}
                  alt=""
                  className="h-12 w-12"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">Scan code on site to load active specs into system directly.</p>
                <p className="text-[10px] font-mono font-bold text-slate-700 dark:text-zinc-300 mt-0.5">{asset.tag}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Info & Radial Health indicator */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200/80 bg-white p-6 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-zinc-900/60 pb-5">
              
              {/* Asset title information */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 text-[9.5px] font-mono font-bold text-slate-600 dark:text-zinc-400">
                    {asset.tag}
                  </span>
                  <span className={`rounded-md border px-2 py-0.2 text-[9.5px] font-bold uppercase tracking-wider ${getStatusStyle(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
                  {asset.name}
                </h1>
                <p className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-300" />
                  <span>Located at <strong>{asset.location}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Model: {asset.model || 'OEM Standard'}</span>
                </p>
              </div>

              {/* Radial health Score Circular Indicator */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 rounded-xl p-3 shrink-0">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="h-20 w-20 -rotate-90">
                    {/* Background Ring */}
                    <circle cx="40" cy="40" r={radius} className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth="4" fill="transparent" />
                    {/* Active Ring */}
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={radius} 
                      className={`transition-all duration-500 ${getHealthRingColor(healthScore)}`} 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * radius}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-sm font-black font-mono ${getHealthTextColor(healthScore)}`}>
                      {healthScore}%
                    </span>
                    <span className="text-[7.5px] text-slate-400 dark:text-zinc-500 uppercase font-bold">Health</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Intelligence Index</h4>
                  <p className="text-[9.5px] text-slate-400 dark:text-zinc-500 leading-normal max-w-[110px]">
                    {healthScore >= 90 ? 'Optimal state. Asset operating within factory variables.' : 'Degradation registered. Schedule self-audit review.'}
                  </p>
                </div>
              </div>

            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
              {asset.description || `${asset.name} is classified in the enterprise ${asset.category} category. Currently deployed within site logistics for dedicated engineering/facilities task flow. Operating under standard active lifecycle tracking.`}
            </p>

            {/* Quick action buttons command suite */}
            <div className="bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900 p-4 rounded-xl space-y-2.5">
              <h3 className="text-[10.5px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-wide">Live Asset Command Operations</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => triggerSimulation('checkout')}
                  disabled={isSimulatingAction}
                  className="h-8.5 inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-semibold text-white px-3.5 transition-colors cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{asset.status === 'allocated' ? 'Return to Vault' : 'Allocate / Checkout'}</span>
                </button>
                <button
                  onClick={() => triggerSimulation('service')}
                  disabled={isSimulatingAction}
                  className="h-8.5 inline-flex items-center space-x-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50 text-xs font-bold text-slate-700 px-3.5 transition-colors cursor-pointer"
                >
                  <Hammer className="h-3.5 w-3.5 text-slate-400" />
                  <span>Send to Maintenance</span>
                </button>
                <button
                  onClick={() => triggerSimulation('audit')}
                  disabled={isSimulatingAction}
                  className="h-8.5 inline-flex items-center space-x-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50 text-xs font-bold text-slate-700 px-3.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Run Audit Verification</span>
                </button>
              </div>
            </div>

          </div>

          {/* 3. KPI Metrics strip panel inside Hero */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-5 mt-5 border-t border-slate-100 dark:border-zinc-900/60">
            <div className="rounded-lg bg-slate-50/50 p-3.5 dark:bg-zinc-900/20 border border-slate-50/50 dark:border-zinc-900">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Depreciation Cost</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-zinc-200 mt-1">${currentVal.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">Original: ${purchaseCost.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-slate-50/50 p-3.5 dark:bg-zinc-900/20 border border-slate-50/50 dark:border-zinc-900">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Acquisition Date</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-1.5">{asset.purchaseDate}</p>
              <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1">Supplier: {asset.supplier || 'N/A'}</p>
            </div>
            <div className="rounded-lg bg-slate-50/50 p-3.5 dark:bg-zinc-900/20 border border-slate-50/50 dark:border-zinc-900">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Custodian Duty</span>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-1.5 truncate">{asset.assignedTo || 'Central Vault'}</p>
              <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1">Dept: {asset.department || 'General'}</p>
            </div>
            <div className="rounded-lg bg-slate-50/50 p-3.5 dark:bg-zinc-900/20 border border-slate-50/50 dark:border-zinc-900">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Warranty Expiry</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-1.5">{asset.warrantyExpiry || 'Lifetime Cover'}</p>
              <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1">Status: {asset.warrantyExpiry ? 'Active Contract' : 'Not Registered'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Tab Navigation and Details Modules */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-zinc-900 dark:bg-zinc-950 overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 dark:border-zinc-850 dark:bg-zinc-900/20 overflow-x-auto">
          {[
            { id: 'timeline', label: 'Asset Timeline' },
            { id: 'specs', label: 'Technical Specs' },
            { id: 'maintenance', label: 'Maintenance Ledger' },
            { id: 'audits', label: 'Audit Records' },
            { id: 'docs', label: 'Contracts & Invoices' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-6 py-3.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="p-6">
          
          {/* Tab 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Asset 360 Chronicles</h3>
              
              <div className="relative border-l-2 border-slate-100 dark:border-zinc-900 pl-6.5 ml-3.5 space-y-6.5">
                {timeline.map((evt, idx) => (
                  <div key={idx} className="relative">
                    {/* Ring indicator bubble */}
                    <div className="absolute -left-9.5 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-slate-100 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
                      {getTimelineIcon(evt.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{evt.label}</span>
                        <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-zinc-500">{evt.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">{evt.description}</p>
                      {evt.user && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] text-slate-400 dark:text-zinc-500">Authorized by:</span>
                          <span className="text-[9px] font-bold bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.2 rounded text-slate-700 dark:text-zinc-350">{evt.user}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Category Schema Fields</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Specific dynamic metadata fields saved in the database under schema definitions.</p>
              
              <div className="rounded-xl border border-slate-150 bg-slate-50/30 p-4 dark:border-zinc-900 dark:bg-zinc-900/10 max-w-xl">
                <table className="w-full text-xs">
                  <tbody>
                    {asset.specifications ? (
                      Object.entries(asset.specifications).map(([k, v]) => (
                        <tr key={k} className="border-b border-slate-100 last:border-0 dark:border-zinc-900/40">
                          <td className="py-3 font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-[10px] w-2/5">{k}</td>
                          <td className="py-3 font-semibold text-slate-800 dark:text-zinc-200 w-3/5">{v}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2 text-slate-400 italic">No specific schema specs registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: MAINTENANCE HISTORY */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Maintenance Workorders</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {maintenance.length} Events Total
                </span>
              </div>

              {maintenance.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-zinc-900/40 border-b border-slate-200 dark:border-zinc-850">
                      <tr>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Date</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Workorder / Job Description</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Technician</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400 text-right">Cost</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/40">
                      {maintenance.map((m) => (
                        <tr key={m.id}>
                          <td className="p-3 text-slate-500 dark:text-zinc-400 font-mono">{m.date}</td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-zinc-200">{m.description}</td>
                          <td className="p-3 text-slate-600 dark:text-zinc-300 font-medium">{m.technician}</td>
                          <td className="p-3 font-bold text-right font-mono">${m.cost}</td>
                          <td className="p-3 text-center">
                            <span className="rounded bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-emerald-750 dark:text-emerald-400 uppercase tracking-wide border border-emerald-200/30">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/35 p-8 text-center dark:border-zinc-900">
                  <Wrench className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-350">No maintenance events registered</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">This asset has never required server-side dispatching or part replacements.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: AUDIT RECORDS */}
          {activeTab === 'audits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Regulatory Audit History</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {audits.length} Audits Logged
                </span>
              </div>

              {audits.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-zinc-900/40 border-b border-slate-200 dark:border-zinc-850">
                      <tr>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Audit Date</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Compliance Status</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Verification Officer</th>
                        <th className="p-3 font-bold text-slate-650 dark:text-zinc-400">Officer Notes & Ledger Observations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/40">
                      {audits.map((au) => (
                        <tr key={au.id}>
                          <td className="p-3 text-slate-500 dark:text-zinc-400 font-mono">{au.date}</td>
                          <td className="p-3">
                            {au.status === 'Passed' ? (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/30">
                                <CheckCircle className="h-2.5 w-2.5" />
                                PASSED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[9.5px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/30">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                FLAG SENT
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-zinc-300 font-bold">{au.auditor}</td>
                          <td className="p-3 text-slate-500 dark:text-zinc-455 font-medium leading-relaxed">{au.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/35 p-8 text-center dark:border-zinc-900">
                  <ShieldCheck className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-350">No audit logs listed</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Physical scanner verification has not yet been requested on this specific asset tag.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: DOCUMENTS */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Verified Contract Attachments</h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">Legal paperwork, purchase warrants, and user manuals tied securely to this asset profile.</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {attachments.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4.5 rounded-xl border border-slate-200 bg-slate-50/20 hover:bg-slate-50 dark:border-zinc-900 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 font-mono text-[9px] font-bold">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[190px]" title={doc.name}>
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-slate-450 dark:text-zinc-550 mt-0.5">{doc.size}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setFeedbackMessage({ text: `Successfully downloaded secure file: ${doc.name}`, type: 'success' })}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-455 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
                      title="Download document PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </motion.div>
  );
}
