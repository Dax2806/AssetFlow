import React from 'react';
import { 
  X, Laptop, User, Building2, CalendarDays, Wrench, ClipboardCheck, 
  ArrowUpRight, Clock, ShieldCheck, HeartPulse, QrCode, Paperclip, 
  AlertCircle, ShieldAlert, CheckCircle2, DollarSign, Activity as ActivityIcon,
  Check, UserCheck, Shield, MapPin, Calendar, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Asset, Activity, SystemNotification } from '../../types';
import { Employee, Department } from '../organization/types';
import { ResourceBooking } from '../booking/types';
import { MaintenanceWorkflowTask } from '../maintenance/types';

export interface Audit {
  id: string;
  location: string;
  auditorName: string;
  status: 'In Progress' | 'Completed';
  startDate: string;
  endDate?: string;
  reviewedAssetIds: string[]; // asset IDs physical verified
  notes?: string;
}

interface UniversalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'asset' | 'employee' | 'department' | 'booking' | 'maintenance' | 'audit' | null;
  entityId: string | null;
  
  // Data lists
  assets: Asset[];
  bookings: ResourceBooking[];
  maintenanceTasks: MaintenanceWorkflowTask[];
  employees: Employee[];
  departments: Department[];
  audits: Audit[];
  activities: Activity[];

  // Mutators
  onUpdateAsset: (asset: Asset) => void;
  onUpdateBooking: (booking: ResourceBooking) => void;
  onUpdateMaintenance: (task: MaintenanceWorkflowTask) => void;
  onUpdateAudit: (audit: Audit) => void;
  onAddActivity: (activity: Activity) => void;
  onAddNotification: (notif: SystemNotification) => void;
}

export default function UniversalDrawer({
  isOpen,
  onClose,
  type,
  entityId,
  assets,
  bookings,
  maintenanceTasks,
  employees,
  departments,
  audits,
  activities,
  onUpdateAsset,
  onUpdateBooking,
  onUpdateMaintenance,
  onUpdateAudit,
  onAddActivity,
  onAddNotification,
}: UniversalDrawerProps) {

  // Global triggers inside the window context for clickability
  const triggerOpen = (targetType: 'asset' | 'employee' | 'department' | 'booking' | 'maintenance' | 'audit', id: string) => {
    const w = window as any;
    if (targetType === 'asset' && w.openAssetByTag) w.openAssetByTag(id);
    else if (targetType === 'employee' && w.openEmployeeByName) w.openEmployeeByName(id);
    else if (targetType === 'department' && w.openDepartmentByName) w.openDepartmentByName(id);
    else if (targetType === 'booking' && w.openBookingById) w.openBookingById(id);
    else if (targetType === 'maintenance' && w.openMaintenanceById) w.openMaintenanceById(id);
    else if (targetType === 'audit' && w.openAuditById) w.openAuditById(id);
  };

  // Esc close listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !type || !entityId) return null;

  // --- ENTITY MATCHING ENGINE ---
  let title = '';
  let icon = <Laptop className="h-4 w-4" />;
  let content = null;

  // 1. ASSET TARGET
  if (type === 'asset') {
    const asset = assets.find(a => a.id === entityId || a.tag === entityId || a.name.toLowerCase() === entityId.toLowerCase());
    if (asset) {
      title = `Asset details • ${asset.tag}`;
      icon = <Laptop className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;

      // Match relationships
      const currentAllocation = asset.status === 'allocated' && asset.assignedTo
        ? {
            employee: employees.find(e => e.name.toLowerCase() === asset.assignedTo?.toLowerCase()),
            departmentName: asset.department || 'Unspecified'
          }
        : null;

      const assetBookings = bookings.filter(b => b.resourceName.toLowerCase() === asset.name.toLowerCase() || b.resourceId === asset.id);
      const assetMaintenance = maintenanceTasks.filter(t => t.assetTag === asset.tag || t.assetId === asset.id);
      const assetAudits = audits.filter(aud => aud.location.toLowerCase() === asset.location.toLowerCase() || asset.auditHistory?.some(h => h.auditor === aud.auditorName));
      const assetActivities = activities.filter(act => act.assetId === asset.id || act.assetTag === asset.tag);

      // Simple rating calculation
      const healthScore = asset.healthScore || 95;

      content = (
        <div className="space-y-6 text-slate-800 dark:text-zinc-200">
          {/* Main Card Summary */}
          <div className="flex items-start gap-4 border-b border-slate-100 pb-5 dark:border-zinc-900/60">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shrink-0">
              {asset.images && asset.images[0] ? (
                <img src={asset.images[0]} alt={asset.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                  <Laptop className="h-6 w-6 text-zinc-300 dark:text-zinc-700" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {asset.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                  {asset.tag}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                  asset.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' :
                  asset.status === 'allocated' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30' :
                  asset.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' :
                  'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                }`}>
                  {asset.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-450 dark:text-zinc-500 font-semibold">
                <MapPin className="h-3.5 w-3.5" />
                <span>{asset.location}</span>
              </div>
            </div>
          </div>

          {/* Health Score & QR Code Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-4 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-550">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Health Score</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {healthScore}%
                </span>
                <span className={`text-[10px] font-bold ${healthScore >= 90 ? 'text-emerald-600' : healthScore >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {healthScore >= 90 ? 'Optimal' : healthScore >= 70 ? 'Warning' : 'Critical'}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${healthScore >= 90 ? 'bg-emerald-500' : healthScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                  style={{ width: `${healthScore}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 p-4 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-550">
                  <QrCode className="h-4 w-4 text-slate-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">System ID Tag</span>
                </div>
                <p className="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400 mt-2">
                  Scan to physical audit
                </p>
                <p className="text-[9px] font-mono text-slate-450 dark:text-zinc-500 mt-0.5">
                  UID: {asset.serialNumber || 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-white rounded border border-slate-250 p-1 dark:bg-zinc-900 dark:border-zinc-800">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${asset.tag}`} alt="QR Code" className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* Current Allocation Section */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Current Assignment
            </h4>
            {currentAllocation ? (
              <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-950 dark:border-emerald-900/40 flex items-center justify-center font-bold text-emerald-700 text-xs">
                    {currentAllocation.employee?.avatar || 'U'}
                  </div>
                  <div>
                    <button
                      onClick={() => triggerOpen('employee', currentAllocation.employee?.name || '')}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-left block"
                    >
                      {asset.assignedTo}
                    </button>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                      Department: {' '}
                      <button 
                        onClick={() => triggerOpen('department', currentAllocation.departmentName)}
                        className="font-bold hover:underline"
                      >
                        {currentAllocation.departmentName}
                      </button>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase">Allocated On</p>
                  <p className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 mt-0.5">{asset.purchaseDate}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center dark:border-zinc-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Available in Inventory Pool</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">No operator currently assigned</p>
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Booking History
            </h4>
            {assetBookings.length === 0 ? (
              <p className="text-xs text-slate-450 dark:text-zinc-500 italic px-1">No shared resources bookings on record.</p>
            ) : (
              <div className="space-y-2">
                {assetBookings.map(b => (
                  <div key={b.id} className="rounded-lg border border-slate-100 p-2.5 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-zinc-200">{b.purpose}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                        Booked by: <button onClick={() => triggerOpen('employee', b.bookedBy)} className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">{b.bookedBy}</button>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-600 dark:text-zinc-300">{b.date}</p>
                      <p className="text-[10px] text-slate-450 dark:text-zinc-500">{b.startTime} - {b.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Logs */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Maintenance History
            </h4>
            {assetMaintenance.length === 0 ? (
              <p className="text-xs text-slate-455 dark:text-zinc-500 italic px-1">No technician service records found.</p>
            ) : (
              <div className="space-y-2">
                {assetMaintenance.map(task => (
                  <div key={task.id} className="rounded-lg border border-slate-100 p-2.5 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div>
                      <button onClick={() => triggerOpen('maintenance', task.id)} className="font-bold text-slate-800 dark:text-zinc-200 hover:underline hover:text-emerald-600 text-left">
                        {task.issueTitle}
                      </button>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                        Technician: <span className="font-bold">{task.technicianName || 'Unassigned'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                      }`}>
                        {task.status}
                      </span>
                      <p className="text-[10px] font-mono text-slate-450 dark:text-zinc-500 mt-1">${task.estimatedCost}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          {asset.specifications && Object.keys(asset.specifications).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                Technical Specifications
              </h4>
              <div className="rounded-xl border border-slate-100 dark:border-zinc-900 p-3 bg-zinc-50/40 dark:bg-zinc-900/10 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {Object.entries(asset.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-100 pb-1.5 dark:border-zinc-900/40">
                    <span className="text-slate-400 dark:text-zinc-500 font-semibold">{key}</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[140px]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Leases & Legal Documents
            </h4>
            {asset.attachments && asset.attachments.length > 0 ? (
              <div className="space-y-1.5">
                {asset.attachments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-150/60 dark:bg-zinc-900/30 dark:border-zinc-900 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-700 dark:text-zinc-300 truncate">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-450 dark:text-zinc-500 shrink-0 font-semibold">{doc.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 dark:text-zinc-500 italic px-1">No attachments on file.</p>
            )}
          </div>

          {/* Activity Logs */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Asset Lifecycle Timeline
            </h4>
            <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-4.5 ml-1.5 space-y-4">
              {assetActivities.length === 0 ? (
                <p className="text-xs text-slate-450 dark:text-zinc-500 italic -ml-4.5">No recorded activities.</p>
              ) : (
                assetActivities.map(act => (
                  <div key={act.id} className="relative text-xs">
                    {/* Ring dot */}
                    <span className="absolute -left-[23px] top-1 h-2 w-2 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-zinc-950" />
                    <p className="font-bold text-slate-800 dark:text-zinc-200 leading-none">{act.description}</p>
                    <p className="text-[9.5px] text-slate-400 dark:text-zinc-500 mt-1">
                      {new Date(act.timestamp).toLocaleString()} • Operator:{' '}
                      <button onClick={() => triggerOpen('employee', act.user.name)} className="font-bold hover:underline text-slate-550 dark:text-zinc-400">
                        {act.user.name}
                      </button>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // 2. EMPLOYEE TARGET
  else if (type === 'employee') {
    const emp = employees.find(e => e.id === entityId || e.name.toLowerCase() === entityId.toLowerCase());
    if (emp) {
      title = `Employee profile • ${emp.employeeId}`;
      icon = <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;

      // Relationships
      const allocatedAssets = assets.filter(a => a.assignedTo?.toLowerCase() === emp.name.toLowerCase());
      const employeeBookings = bookings.filter(b => b.bookedBy.toLowerCase() === emp.name.toLowerCase());
      const raisedMaintenance = maintenanceTasks.filter(t => t.reportedBy.toLowerCase() === emp.name.toLowerCase());
      const employeeActivities = activities.filter(act => act.user.email.toLowerCase() === emp.email.toLowerCase() || act.user.name.toLowerCase() === emp.name.toLowerCase());

      content = (
        <div className="space-y-6">
          {/* Identity block */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-zinc-900/60">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 shadow-xs select-none">
              {emp.avatar || emp.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {emp.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                  {emp.role}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                  emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-700'
                }`}>
                  {emp.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-450 dark:text-zinc-550 font-semibold">
                Division:{' '}
                <button onClick={() => triggerOpen('department', emp.departmentName)} className="font-bold hover:underline text-emerald-600">
                  {emp.departmentName}
                </button>
              </p>
            </div>
          </div>

          {/* Bio information */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Identity & Contact Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 text-xs">
                <span className="text-slate-400 dark:text-zinc-550 font-bold block text-[10px] uppercase">Corporate Email</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200 block mt-1 truncate">{emp.email}</span>
              </div>
              <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 text-xs">
                <span className="text-slate-400 dark:text-zinc-550 font-bold block text-[10px] uppercase">Phone Line</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300 block mt-1">{emp.phone}</span>
              </div>
            </div>
          </div>

          {/* Allocated Assets */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Allocated Physical Assets ({allocatedAssets.length})
            </h4>
            {allocatedAssets.length === 0 ? (
              <p className="text-xs text-slate-450 dark:text-zinc-550 italic px-1">No company-owned hardware assigned.</p>
            ) : (
              <div className="space-y-2">
                {allocatedAssets.map(asset => (
                  <div key={asset.id} className="rounded-lg border border-slate-100 p-3 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <Laptop className="h-4 w-4 text-emerald-600 dark:text-emerald-450" />
                      <div>
                        <button onClick={() => triggerOpen('asset', asset.tag)} className="font-bold hover:underline text-slate-800 dark:text-zinc-200">
                          {asset.name}
                        </button>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">{asset.tag}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-450 dark:text-zinc-500">{asset.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Booking History ({employeeBookings.length})
            </h4>
            {employeeBookings.length === 0 ? (
              <p className="text-xs text-slate-450 dark:text-zinc-550 italic px-1">No shared conference rooms or gear bookings.</p>
            ) : (
              <div className="space-y-2">
                {employeeBookings.map(b => (
                  <div key={b.id} className="rounded-lg border border-slate-100 p-3 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-zinc-200 block">{b.resourceName}</span>
                      <p className="text-[10px] text-slate-450 dark:text-zinc-500 mt-0.5">{b.purpose}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-600 dark:text-zinc-400">{b.date}</span>
                      <p className="text-[10px] text-slate-450 mt-0.5">{b.startTime} - {b.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Requests Raised */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Maintenance Requests Raised
            </h4>
            {raisedMaintenance.length === 0 ? (
              <p className="text-xs text-slate-450 dark:text-zinc-550 italic px-1">No ongoing technician service tickets raised.</p>
            ) : (
              <div className="space-y-2">
                {raisedMaintenance.map(task => (
                  <div key={task.id} className="rounded-lg border border-slate-100 p-3 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div>
                      <button onClick={() => triggerOpen('maintenance', task.id)} className="font-bold text-slate-800 hover:underline dark:text-zinc-200 text-left block">
                        {task.issueTitle}
                      </button>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Asset: {task.assetName} ({task.assetTag})</p>
                    </div>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${
                      task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Administrative Notes */}
          {emp.notes && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                System Notes
              </h4>
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-zinc-50/20 text-xs">
                <p className="text-slate-500 leading-relaxed dark:text-zinc-400">{emp.notes}</p>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              User Activity Stream
            </h4>
            <div className="relative border-l border-slate-200 dark:border-zinc-800 pl-4 ml-1.5 space-y-4">
              {employeeActivities.length === 0 ? (
                <p className="text-xs text-slate-450 dark:text-zinc-500 italic -ml-4">No recent activity logs found.</p>
              ) : (
                employeeActivities.map(act => (
                  <div key={act.id} className="relative text-xs">
                    <span className="absolute -left-[21px] top-1 h-1.5 w-1.5 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-zinc-950" />
                    <p className="font-bold text-slate-850 dark:text-zinc-200">{act.description}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{new Date(act.timestamp).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // 3. DEPARTMENT TARGET
  else if (type === 'department') {
    const dept = departments.find(d => d.id === entityId || d.name.toLowerCase() === entityId.toLowerCase());
    if (dept) {
      title = `Department Card • ${dept.name}`;
      icon = <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;

      // Match relationships
      const deptEmployees = employees.filter(e => e.departmentName.toLowerCase() === dept.name.toLowerCase() || e.departmentId === dept.id);
      const deptAllocatedAssets = assets.filter(a => a.department?.toLowerCase() === dept.name.toLowerCase() || deptEmployees.some(e => e.name.toLowerCase() === a.assignedTo?.toLowerCase()));
      const deptSharedResources = bookings.filter(b => b.department?.toLowerCase() === dept.name.toLowerCase() || b.userEmail.endsWith(`@${dept.name.toLowerCase()}.com`));
      
      // Maintenance Stats
      const deptAssetsTags = deptAllocatedAssets.map(a => a.tag);
      const deptMaintenance = maintenanceTasks.filter(t => deptAssetsTags.includes(t.assetTag));
      const activeMaintCount = deptMaintenance.filter(t => t.status !== 'Resolved' && t.status !== 'Rejected').length;
      const resolvedMaintCount = deptMaintenance.filter(t => t.status === 'Resolved').length;
      const totalMaintSpent = deptMaintenance.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost || 0), 0);

      // Audit Results
      const deptAudits = audits.filter(aud => aud.location.toLowerCase() === dept.name.toLowerCase() || aud.notes?.toLowerCase().includes(dept.name.toLowerCase()));

      content = (
        <div className="space-y-6">
          {/* Identity banner */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-zinc-900/60">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900/40 shadow-xs select-none">
              <Building2 className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                {dept.name} Division
              </h3>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                dept.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-700'
              }`}>
                {dept.status}
              </span>
              <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-semibold">
                Established:{' '}<span className="font-bold">{dept.createdAt}</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 dark:border-zinc-900 dark:bg-zinc-900/10">
            <p className="text-xs font-semibold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">Division Focus</p>
            <p className="text-xs text-slate-600 dark:text-zinc-350 leading-relaxed mt-1.5">{dept.description}</p>
          </div>

          {/* Leader block */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Department Executive (Head)
            </h4>
            {dept.headName && dept.headName !== 'Vacant' ? (
              <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs">
                  <User className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <button onClick={() => triggerOpen('employee', dept.headName)} className="font-extrabold text-emerald-600 hover:underline dark:text-emerald-400 text-left block">
                      {dept.headName}
                    </button>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-medium">Head of {dept.name}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-550 px-2 py-0.5 rounded dark:bg-zinc-900 dark:text-zinc-400">
                  Authority Card
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-slate-200 text-center text-xs dark:border-zinc-800">
                <p className="font-bold text-slate-450 dark:text-zinc-500">Leadership Vacant</p>
              </div>
            )}
          </div>

          {/* Employees List */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Team Operators ({deptEmployees.length})
            </h4>
            {deptEmployees.length === 0 ? (
              <p className="text-xs text-slate-450 italic">No operators mapped to division.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {deptEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => triggerOpen('employee', emp.name)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-emerald-250 hover:bg-slate-50/50 dark:border-zinc-900 dark:hover:border-emerald-900 dark:hover:bg-zinc-900/20 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-all text-left truncate"
                  >
                    <div className="h-6 w-6 rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-700 flex items-center justify-center shrink-0">
                      {emp.avatar}
                    </div>
                    <div className="truncate">
                      <span className="font-bold truncate block leading-none">{emp.name}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block truncate leading-none">{emp.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Allocated Assets */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Division Hardware Pool ({deptAllocatedAssets.length})
            </h4>
            {deptAllocatedAssets.length === 0 ? (
              <p className="text-xs text-slate-450 italic px-1">No hardware fleet registered to this department.</p>
            ) : (
              <div className="space-y-2">
                {deptAllocatedAssets.map(asset => (
                  <div key={asset.id} className="rounded-lg border border-slate-100 p-2.5 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-emerald-600 dark:text-emerald-450 shrink-0" />
                      <button onClick={() => triggerOpen('asset', asset.tag)} className="font-bold hover:underline text-slate-800 dark:text-zinc-200 truncate max-w-[200px]">
                        {asset.name}
                      </button>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded dark:bg-zinc-900">
                      {asset.tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Statistics */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Technical Maintenance Statistics
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-slate-100 p-2.5 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Active Jobs</span>
                <span className="block text-lg font-black text-slate-800 dark:text-zinc-200 mt-1">{activeMaintCount}</span>
              </div>
              <div className="rounded-xl border border-slate-100 p-2.5 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Resolved</span>
                <span className="block text-lg font-black text-slate-800 dark:text-zinc-200 mt-1">{resolvedMaintCount}</span>
              </div>
              <div className="rounded-xl border border-slate-100 p-2.5 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Total Cost</span>
                <span className="block text-lg font-black text-slate-800 dark:text-zinc-200 mt-1">${totalMaintSpent}</span>
              </div>
            </div>
          </div>

          {/* Shared resources / conference booking stats */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Corporate Spaces Booking Activity
            </h4>
            {deptSharedResources.length === 0 ? (
              <p className="text-xs text-slate-450 italic px-1">No conference or logistics records booked.</p>
            ) : (
              <div className="space-y-2">
                {deptSharedResources.map(b => (
                  <div key={b.id} className="rounded-lg border border-slate-100 p-2 dark:border-zinc-900 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-zinc-200">{b.resourceName}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">Booker: {b.bookedBy}</p>
                    </div>
                    <span className="font-mono text-slate-500">{b.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // 4. BOOKING TARGET
  else if (type === 'booking') {
    const booking = bookings.find(b => b.id === entityId);
    if (booking) {
      title = `Booking Details • ${booking.id.substring(0, 8)}`;
      icon = <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-450" />;

      // Relationships
      const bookerEmployee = employees.find(e => e.name.toLowerCase() === booking.bookedBy.toLowerCase());
      const relatedAsset = assets.find(a => a.name.toLowerCase() === booking.resourceName.toLowerCase());

      // Conflict Check: filter other bookings of same resource with overlapping times on same date
      const parseMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const bStart = parseMinutes(booking.startTime);
      const bEnd = parseMinutes(booking.endTime);

      const conflicts = bookings.filter(b => 
        b.id !== booking.id && 
        b.resourceId === booking.resourceId && 
        b.date === booking.date &&
        b.status !== 'Cancelled' && (
          (parseMinutes(b.startTime) < bEnd && parseMinutes(b.endTime) > bStart)
        )
      );

      content = (
        <div className="space-y-6">
          {/* Booking main info card */}
          <div className="rounded-xl border border-slate-100 p-4.5 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase">Meeting Resource</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${
                booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                booking.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-slate-50 text-slate-700'
              }`}>
                {booking.status}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 leading-none">
              {booking.resourceName}
            </h3>
            <p className="text-xs text-slate-450 dark:text-zinc-500 mt-1 font-semibold">
              Category: {booking.resourceCategory}
            </p>
          </div>

          {/* Time & Duration Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold uppercase">Date Reservation</span>
              </div>
              <span className="font-mono font-bold text-slate-800 dark:text-zinc-200 block mt-1.5">{booking.date}</span>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[9px] font-bold uppercase">Scheduled Block</span>
              </div>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 block mt-1.5">
                {booking.startTime} - {booking.endTime} <span className="text-slate-400 font-normal">({booking.durationMinutes} mins)</span>
              </span>
            </div>
          </div>

          {/* Booker */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Reserved By (Operator)
            </h4>
            <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
                  {bookerEmployee?.avatar || 'U'}
                </div>
                <div>
                  <button onClick={() => triggerOpen('employee', booking.bookedBy)} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-700">
                    {booking.bookedBy}
                  </button>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Department: {booking.department}</p>
                </div>
              </div>
              <div className="text-right text-[10px]">
                <p className="font-semibold text-slate-450 dark:text-zinc-500 uppercase">Booker Email</p>
                <p className="font-medium text-slate-500 truncate max-w-[150px] mt-0.5">{booking.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Purpose & Notes */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Booking Intention / Scope
            </h4>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-zinc-50/25 text-xs space-y-2">
              <div>
                <p className="text-slate-450 font-bold uppercase text-[9px]">Meeting Agenda</p>
                <p className="font-bold text-slate-850 dark:text-zinc-200 mt-1 leading-normal">{booking.purpose}</p>
              </div>
              {booking.notes && (
                <div className="border-t border-slate-100 pt-2 dark:border-zinc-900">
                  <p className="text-slate-450 font-bold uppercase text-[9px]">Administrative Comments</p>
                  <p className="text-slate-500 dark:text-zinc-400 mt-1 font-medium leading-relaxed">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Asset details */}
          {relatedAsset && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                Related Physical Asset
              </h4>
              <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Laptop className="h-4 w-4 text-emerald-600" />
                  <button onClick={() => triggerOpen('asset', relatedAsset.tag)} className="font-bold text-emerald-600 hover:underline">
                    {relatedAsset.name}
                  </button>
                </div>
                <div className="text-right text-[10px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-550 uppercase">Asset tag</span>
                  <span className="block font-mono mt-0.5">{relatedAsset.tag}</span>
                </div>
              </div>
            </div>
          )}

          {/* Conflict Check */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              System Schedule Conflict Check
            </h4>
            {conflicts.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50/40 p-3.5 dark:bg-emerald-950/20 text-xs border border-emerald-100 dark:border-emerald-900/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-800 dark:text-emerald-400">Zero Schedule Conflicts Detected</span>
              </div>
            ) : (
              <div className="rounded-xl bg-rose-50/40 p-3.5 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold">
                  <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>Warning: Schedule Conflict Found ({conflicts.length})</span>
                </div>
                {conflicts.map(c => (
                  <div key={c.id} className="border-t border-rose-100/50 pt-2 dark:border-rose-900/20 text-[11px] text-rose-700 dark:text-rose-400 leading-normal">
                    Overlaps with reservation by <span className="font-bold">{c.bookedBy}</span> ({c.startTime} - {c.endTime}) for "{c.purpose}" on {c.date}.
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // 5. MAINTENANCE TARGET
  else if (type === 'maintenance') {
    const task = maintenanceTasks.find(t => t.id === entityId);
    if (task) {
      title = `Servicing Order • ${task.id}`;
      icon = <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;

      // Action Handler: Approve servicing order
      const handleApproveTask = () => {
        const updated: MaintenanceWorkflowTask = {
          ...task,
          status: 'Approved',
          approvedBy: 'Om Patel',
          approvedDate: new Date().toISOString().split('T')[0]
        };
        onUpdateMaintenance(updated);

        // Generate activity log
        const activity: Activity = {
          id: `act-${Date.now()}`,
          assetId: task.assetId,
          assetName: task.assetName,
          assetTag: task.assetTag,
          type: 'maintenance',
          description: `Maintenance approved for ${task.assetName}: "${task.issueTitle}"`,
          timestamp: new Date().toISOString(),
          user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
        };
        onAddActivity(activity);

        // Generate system notification
        const notification: SystemNotification = {
          id: `notif-${Date.now()}`,
          title: 'Servicing Order Approved',
          message: `Servicing request for ${task.assetName} (${task.assetTag}) approved & scheduled.`,
          type: 'success',
          timestamp: 'Just now',
          read: false
        };
        onAddNotification(notification);
      };

      // Action Handler: Resolve servicing order
      const handleResolveTask = () => {
        const updated: MaintenanceWorkflowTask = {
          ...task,
          status: 'Resolved',
          actualCost: task.estimatedCost
        };
        onUpdateMaintenance(updated);

        // Restore asset availability automatically
        const relatedAsset = assets.find(a => a.id === task.assetId || a.tag === task.assetTag);
        if (relatedAsset) {
          onUpdateAsset({
            ...relatedAsset,
            status: 'available'
          });
        }

        // Generate activity log
        const activity: Activity = {
          id: `act-${Date.now()}`,
          assetId: task.assetId,
          assetName: task.assetName,
          assetTag: task.assetTag,
          type: 'maintenance',
          description: `Servicing ticket closed as RESOLVED: ${task.assetName}`,
          timestamp: new Date().toISOString(),
          user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
        };
        onAddActivity(activity);
      };

      content = (
        <div className="space-y-6">
          {/* Main maintenance header card */}
          <div className="rounded-xl border border-slate-100 p-4.5 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-550 dark:bg-zinc-900 dark:text-zinc-400">
                {task.priority} Priority
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${
                task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {task.status}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 leading-snug">
              {task.issueTitle}
            </h3>
            <p className="text-[10.5px] text-slate-450 dark:text-zinc-500 mt-1 font-semibold">
              Asset Category: {task.category}
            </p>
          </div>

          {/* Related Asset */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Associated Corporate Asset
            </h4>
            <div className="rounded-xl border border-slate-100 p-3.5 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Laptop className="h-4 w-4 text-emerald-600" />
                <div>
                  <button onClick={() => triggerOpen('asset', task.assetTag)} className="text-xs font-bold text-emerald-600 hover:underline">
                    {task.assetName}
                  </button>
                  <p className="text-[9.5px] font-mono text-slate-400 mt-0.5">Tag: {task.assetTag}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-650 font-mono">UID: {task.assetId}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Issue Diagnosis Description
            </h4>
            <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-zinc-50/25 text-xs">
              <p className="text-slate-600 leading-relaxed dark:text-zinc-350">{task.description}</p>
            </div>
          </div>

          {/* Personnel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Reported By</span>
              <button onClick={() => triggerOpen('employee', task.reportedBy)} className="font-extrabold text-emerald-600 hover:underline mt-1 block">
                {task.reportedBy}
              </button>
              <span className="text-[10px] text-slate-450 mt-0.5 block">{task.reportedDate}</span>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Assigned Technician</span>
              <span className="font-bold text-slate-700 dark:text-zinc-300 mt-1 block">
                {task.technicianName || 'Unassigned'}
              </span>
              <span className="text-[10px] text-slate-450 mt-0.5 block">Due by: {task.dueDate}</span>
            </div>
          </div>

          {/* Approvals and Financials */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Fiscal Approver</span>
              <span className="font-bold text-slate-700 dark:text-zinc-300 mt-1 block">
                {task.approvedBy || 'Pending Executive Approval'}
              </span>
              {task.approvedDate && <span className="text-[10px] text-slate-450 mt-0.5 block">Approved: {task.approvedDate}</span>}
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Financial Servicing Cost</span>
              <span className="font-extrabold text-slate-800 mt-1 block dark:text-zinc-200">
                Budget: ${task.estimatedCost}
              </span>
              {task.actualCost && <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">Actual: ${task.actualCost}</span>}
            </div>
          </div>

          {/* Interactive Actions block */}
          <div className="border-t border-slate-100 pt-5 dark:border-zinc-900 space-y-2">
            {task.status === 'Pending' && (
              <button
                onClick={handleApproveTask}
                className="flex w-full h-9.5 items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs cursor-pointer transition-all"
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Approve & Assign Servicing</span>
              </button>
            )}

            {task.status !== 'Resolved' && task.status !== 'Pending' && (
              <button
                onClick={handleResolveTask}
                className="flex w-full h-9.5 items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs tracking-wider uppercase shadow-xs dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer transition-all"
              >
                <Check className="h-4 w-4" />
                <span>Close Ticket (RESOLVE)</span>
              </button>
            )}
          </div>
        </div>
      );
    }
  }

  // 6. AUDIT TARGET
  else if (type === 'audit') {
    const audit = audits.find(aud => aud.id === entityId);
    if (audit) {
      title = `Inventory Audit • ${audit.location}`;
      icon = <ClipboardCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-450" />;

      // Match all assets registered in this location
      const locationAssets = assets.filter(a => a.location.toLowerCase().includes(audit.location.toLowerCase()) || (audit.location === 'Remote Workforce' && a.location.toLowerCase().includes('remote')));
      const allAssetsReviewed = locationAssets.every(a => audit.reviewedAssetIds.includes(a.id));

      // Checkoff handler
      const toggleAssetReview = (assetId: string) => {
        let nextReviewed = [...audit.reviewedAssetIds];
        if (nextReviewed.includes(assetId)) {
          nextReviewed = nextReviewed.filter(id => id !== assetId);
        } else {
          nextReviewed.push(assetId);
        }
        onUpdateAudit({
          ...audit,
          reviewedAssetIds: nextReviewed
        });
      };

      // Close Audit handler
      const handleCloseAudit = () => {
        if (!allAssetsReviewed) return; // Strict business rule: Cannot close until all assets reviewed!
        
        onUpdateAudit({
          ...audit,
          status: 'Completed',
          endDate: new Date().toISOString().split('T')[0]
        });

        // Add activity log
        const activity: Activity = {
          id: `act-${Date.now()}`,
          type: 'audit',
          description: `Inventory Audit successfully CLOSED for: ${audit.location}`,
          timestamp: new Date().toISOString(),
          user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
        };
        onAddActivity(activity);

        // Add system notification
        const notification: SystemNotification = {
          id: `notif-${Date.now()}`,
          title: 'Inventory Audit Closed',
          message: `Reconciliation completed successfully for ${audit.location} warehouse.`,
          type: 'success',
          timestamp: 'Just now',
          read: false
        };
        onAddNotification(notification);
      };

      content = (
        <div className="space-y-6">
          {/* Main Audit summary card */}
          <div className="rounded-xl border border-slate-100 p-4.5 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase">Audit Target Location</span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${
                audit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}>
                {audit.status}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 leading-none">
              {audit.location}
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-zinc-500 mt-1 font-semibold">
              Authorized Lead: {audit.auditorName}
            </p>
          </div>

          {/* Time Span details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Commencement</span>
              <span className="font-mono font-bold text-slate-750 block mt-1 dark:text-zinc-350">{audit.startDate}</span>
            </div>
            <div className="rounded-xl border border-slate-100 p-3 dark:border-zinc-900 text-xs">
              <span className="text-slate-400 font-bold block text-[9px] uppercase">Sign-Off Date</span>
              <span className="font-mono font-bold text-slate-750 block mt-1 dark:text-zinc-350">{audit.endDate || 'Ongoing / In Progress'}</span>
            </div>
          </div>

          {/* Progress reconciliation bar */}
          <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-zinc-50/20 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-[10px] text-slate-450 uppercase">Verification Progress</span>
              <span className="text-slate-800 dark:text-zinc-200">
                {audit.reviewedAssetIds.length} / {locationAssets.length} verified
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${locationAssets.length > 0 ? (audit.reviewedAssetIds.length / locationAssets.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Physical Verification checkoffs */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              Verification Checksheets
            </h4>
            {locationAssets.length === 0 ? (
              <p className="text-xs text-slate-450 italic px-1">No corporate hardware mapped to {audit.location} currently.</p>
            ) : (
              <div className="space-y-2">
                {locationAssets.map(asset => {
                  const isReviewed = audit.reviewedAssetIds.includes(asset.id);
                  return (
                    <div 
                      key={asset.id} 
                      className={`rounded-xl border p-3 flex justify-between items-center text-xs transition-all ${
                        isReviewed 
                          ? 'bg-emerald-50/25 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/40' 
                          : 'bg-white border-slate-100 dark:bg-zinc-950 dark:border-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={isReviewed}
                          onChange={() => toggleAssetReview(asset.id)}
                          disabled={audit.status === 'Completed'}
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 dark:bg-zinc-900 cursor-pointer"
                        />
                        <div>
                          <button onClick={() => triggerOpen('asset', asset.tag)} className="font-bold hover:underline text-slate-800 dark:text-zinc-200 text-left block">
                            {asset.name}
                          </button>
                          <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-mono mt-0.5">{asset.tag}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500 dark:bg-zinc-900">
                        {asset.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guidelines & Business Rules */}
          <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/20 p-4 dark:border-amber-900/40 dark:bg-amber-950/10 text-xs text-amber-800 dark:text-amber-400 leading-normal space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Strict Fiscal Rule Checklist</span>
            </div>
            <p>
              In accordance with company standard protocols, this physical reconciliation event cannot be signed off or closed until **100% of the mapped assets ({locationAssets.length})** have been thoroughly reviewed and audited.
            </p>
          </div>

          {/* Discrepancy Comments */}
          {audit.notes && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
                Auditing Notes / Discrepancies
              </h4>
              <div className="p-3 rounded-xl border border-slate-100 bg-zinc-50/25 text-xs">
                <p className="text-slate-500 leading-relaxed dark:text-zinc-400">{audit.notes}</p>
              </div>
            </div>
          )}

          {/* Action Button: Close Audit */}
          {audit.status === 'In Progress' && (
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-900">
              <button
                disabled={!allAssetsReviewed}
                onClick={handleCloseAudit}
                className={`flex w-full h-9.5 items-center justify-center gap-2 rounded-lg text-xs font-bold tracking-wider uppercase shadow-xs transition-all cursor-pointer ${
                  allAssetsReviewed 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-650 dark:border-zinc-800 cursor-not-allowed'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>Submit Reconciled Audit</span>
              </button>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs cursor-pointer"
      />

      {/* Drawer content */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[560px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-zinc-900 dark:bg-zinc-950"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-150/80 px-6 py-5 dark:border-zinc-900 shrink-0 select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50">
              {icon}
            </div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-450 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          {content}
        </div>

        {/* Universal Footer */}
        <div className="border-t border-slate-150/80 bg-slate-50/50 px-6 py-3 dark:border-zinc-900 dark:bg-zinc-950 shrink-0 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-650 select-none">
          <span>AssetFlow Connected System</span>
          <span>Press ESC to Close</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
