import React from 'react';
import { X, Calendar, User, Shield, Hammer, ClipboardCheck, ArrowUpRight, Check } from 'lucide-react';
import { Asset, AssetCategory, PriorityLevel, BookingStatus } from '../types';

interface RegisterAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: AssetCategory; location: string; value: number }) => void;
}

export function RegisterAssetModal({ isOpen, onClose, onSubmit }: RegisterAssetModalProps) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<AssetCategory>('IT Hardware');
  const [location, setLocation] = React.useState('HQ - 4th Floor');
  const [value, setValue] = React.useState('1200');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      category,
      location,
      value: Number(value) || 0
    });
    setName('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Register New Asset">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Asset Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., MacBook Pro 16"'
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200 dark:focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as AssetCategory)}
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200 dark:focus:border-emerald-500"
          >
            <option value="IT Hardware">IT Hardware</option>
            <option value="Facilities">Facilities</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Office Equipment">Office Equipment</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Storage Location
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., HQ - IT Locker 4"
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Purchase Value (USD)
          </label>
          <input
            type="number"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1200"
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          />
        </div>

        <div className="pt-4 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium transition-all"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

interface AllocateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAssets: Asset[];
  onSubmit: (data: { assetId: string; assignee: string; location: string }) => void;
}

export function AllocateAssetModal({ isOpen, onClose, availableAssets, onSubmit }: AllocateAssetModalProps) {
  const [selectedAssetId, setSelectedAssetId] = React.useState('');
  const [assignee, setAssignee] = React.useState('');
  const [location, setLocation] = React.useState('Remote - US East');

  React.useEffect(() => {
    if (availableAssets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(availableAssets[0].id);
    }
  }, [availableAssets, selectedAssetId]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assetId = selectedAssetId || (availableAssets[0]?.id);
    if (!assetId || !assignee.trim()) return;
    onSubmit({
      assetId,
      assignee,
      location
    });
    setAssignee('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Allocate Asset to User">
      {availableAssets.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">No assets available to allocate</p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
            Register or release some assets to enable allocations.
          </p>
          <button
            onClick={onClose}
            className="mt-4 rounded bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 border border-zinc-100 hover:bg-zinc-100"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Select Available Asset
            </label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200 dark:focus:border-emerald-500"
            >
              {availableAssets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.tag}) — {asset.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Assignee Full Name
            </label>
            <input
              type="text"
              required
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="e.g., Jessica Alpert"
              className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Deployment Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., HQ - 3rd Floor or Remote"
              className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium transition-all"
            >
              Assign Asset
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
}

interface BookResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { resourceName: string; resourceType: 'Room' | 'Vehicle' | 'Equipment'; bookedBy: string; email: string; durationHours: number }) => void;
}

export function BookResourceModal({ isOpen, onClose, onSubmit }: BookResourceModalProps) {
  const [resourceName, setResourceName] = React.useState('Boardroom B');
  const [resourceType, setResourceType] = React.useState<'Room' | 'Vehicle' | 'Equipment'>('Room');
  const [bookedBy, setBookedBy] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [durationHours, setDurationHours] = React.useState('2');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookedBy.trim() || !email.trim()) return;
    onSubmit({
      resourceName,
      resourceType,
      bookedBy,
      email,
      durationHours: Number(durationHours) || 2
    });
    setBookedBy('');
    setEmail('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Book Resource or Space">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Resource Type
            </label>
            <select
              value={resourceType}
              onChange={(e) => {
                const type = e.target.value as 'Room' | 'Vehicle' | 'Equipment';
                setResourceType(type);
                if (type === 'Room') setResourceName('Boardroom B');
                else if (type === 'Vehicle') setResourceName('Tesla Model 3 Long Range');
                else setResourceName('Fuji GFX 100II Camera');
              }}
              className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
            >
              <option value="Room">Meeting Space</option>
              <option value="Vehicle">Fleet Vehicle</option>
              <option value="Equipment">Specialist Gear</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Resource Name
            </label>
            {resourceType === 'Room' ? (
              <select
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              >
                <option value="Boardroom B">Boardroom B (HQ-4A)</option>
                <option value="Focus Pod 2B">Focus Pod 2B (HQ-2B)</option>
                <option value="Auditorium Main">Auditorium Main (HQ-1st)</option>
              </select>
            ) : resourceType === 'Vehicle' ? (
              <select
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              >
                <option value="Tesla Model Y">Tesla Model Y Fleet (#804)</option>
                <option value="Tesla Model 3">Tesla Model 3 Long Range (#802)</option>
                <option value="Ford F-150 Lightning">Ford F-150 Lightning (#809)</option>
              </select>
            ) : (
              <select
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              >
                <option value="Fuji GFX 100II">Fuji GFX 100II Studio kit</option>
                <option value="DJI Mavic Drone">DJI Mavic Enterprise Drone</option>
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Reservoir Full Name
          </label>
          <input
            type="text"
            required
            value={bookedBy}
            onChange={(e) => setBookedBy(e.target.value)}
            placeholder="e.g., Jane Cooper"
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane.cooper@assetflow.com"
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Duration (Hours)
          </label>
          <select
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          >
            <option value="1">1 Hour</option>
            <option value="2">2 Hours</option>
            <option value="4">4 Hours (Half Day)</option>
            <option value="8">8 Hours (Full Day)</option>
          </select>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium transition-all"
          >
            Confirm Reservation
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

interface RaiseMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSubmit: (data: { assetId: string; priority: PriorityLevel; technician: string; description: string }) => void;
}

export function RaiseMaintenanceModal({ isOpen, onClose, assets, onSubmit }: RaiseMaintenanceModalProps) {
  const [selectedAssetId, setSelectedAssetId] = React.useState('');
  const [priority, setPriority] = React.useState<PriorityLevel>('Medium');
  const [technician, setTechnician] = React.useState('Dan Fitzpatrick');
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assetId = selectedAssetId || assets[0]?.id;
    if (!assetId || !description.trim()) return;
    onSubmit({
      assetId,
      priority,
      technician,
      description
    });
    setDescription('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Raise Maintenance Ticket">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Select Asset
          </label>
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200 dark:focus:border-emerald-500"
          >
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                [{asset.tag}] {asset.name} (Status: {asset.status})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Priority level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
              Assign Technician
            </label>
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
            >
              <option value="Dan Fitzpatrick">Dan Fitzpatrick (Field)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Hardware Lab)</option>
              <option value="Alex Rivera">Alex Rivera (Fleet Specialist)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Issue Description
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the failure, crack, crackle, or required maintenance details..."
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          />
        </div>

        <div className="pt-4 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium transition-all"
          >
            Dispatch Order
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

interface CreateAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { location: string; auditorName: string }) => void;
}

export function CreateAuditModal({ isOpen, onClose, onSubmit }: CreateAuditModalProps) {
  const [location, setLocation] = React.useState('Dublin HQ');
  const [auditorName, setAuditorName] = React.useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorName.trim()) return;
    onSubmit({
      location,
      auditorName
    });
    setAuditorName('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Initiate Inventory Audit">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Audit Region / Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          >
            <option value="Dublin HQ">Dublin HQ (Grand Canal)</option>
            <option value="London Tech Hub">London Tech Hub (Soho)</option>
            <option value="New York HQ">New York Office (Chelsea)</option>
            <option value="Remote Workforce">Global Remote Hardware</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
            Lead Auditor Name
          </label>
          <input
            type="text"
            required
            value={auditorName}
            onChange={(e) => setAuditorName(e.target.value)}
            placeholder="e.g., Marcus Chen"
            className="w-full rounded border border-zinc-200/80 bg-zinc-50/50 p-2 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
          />
        </div>

        <div className="rounded bg-zinc-50 p-3.5 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-850">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Audit Guideline
          </p>
          <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            This will initiate an offline reconciliation event. All local supervisors in the {location} zone will receive validation prompts on their mobile hardware trackers.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium transition-all"
          >
            Authorize Audit
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

/* Base Modal wrapper layout with elegant slide overlay styles */
function ModalWrapper({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Content Body */}
      <div className="relative w-full max-w-md overflow-hidden rounded-md border border-zinc-100 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 transition-all transform scale-100">
        {/* Header bar */}
        <div className="flex h-12 items-center justify-between border-b border-zinc-50 px-5 dark:border-zinc-900">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            {title}
          </span>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Inner Elements */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
