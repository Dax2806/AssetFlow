import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Camera, Paperclip, QrCode, Download, Info, CheckCircle, 
  Sparkles, Layers, ShieldCheck, HeartPulse, HardDrive 
} from 'lucide-react';
import { Asset, AssetCategory } from '../../types';

interface AssetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Partial<Asset>) => void;
  mode: 'create' | 'edit';
  asset?: Asset | null;
}

export default function AssetDrawer({ isOpen, onClose, onSave, mode, asset }: AssetDrawerProps) {
  // --- Form States ---
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<AssetCategory>('IT Hardware');
  const [description, setDescription] = React.useState('');
  const [bookable, setBookable] = React.useState(false);
  const [serialNumber, setSerialNumber] = React.useState('');
  const [manufacturer, setManufacturer] = React.useState('');
  const [model, setModel] = React.useState('');
  const [department, setDepartment] = React.useState('Engineering');
  const [location, setLocation] = React.useState('HQ - 4th Floor');
  const [purchaseDate, setPurchaseDate] = React.useState('2026-07-11');
  const [purchaseCost, setPurchaseCost] = React.useState('');
  const [supplier, setSupplier] = React.useState('');
  const [warrantyExpiry, setWarrantyExpiry] = React.useState('');
  const [condition, setCondition] = React.useState<'New' | 'Good' | 'Fair' | 'Poor'>('New');
  
  // Dynamic specs based on category selection
  const [specRAM, setSpecRAM] = React.useState('16GB Unified');
  const [specProcessor, setSpecProcessor] = React.useState('Apple M3');
  const [specBattery, setSpecBattery] = React.useState('72 Wh');
  const [specOS, setSpecOS] = React.useState('macOS Sonoma');

  const [specRegNo, setSpecRegNo] = React.useState('CA-992-12X');
  const [specFuelType, setSpecFuelType] = React.useState('Electric');
  const [specEngineNo, setSpecEngineNo] = React.useState('MTR-88910A');
  const [specInsurance, setSpecInsurance] = React.useState('Policy #AM-9280');

  const [specMaterial, setSpecMaterial] = React.useState('Brushed Mesh & Aluminum');
  const [specDimensions, setSpecDimensions] = React.useState('40" H x 26" W');
  const [specWeight, setSpecWeight] = React.useState('38 lbs');

  // Multi-image state
  const [images, setImages] = React.useState<string[]>([
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  ]);
  const [attachments, setAttachments] = React.useState<{ name: string; size: string; type: string }[]>([
    { name: 'purchase_invoice.pdf', size: '1.4 MB', type: 'pdf' }
  ]);

  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const [generatedTag, setGeneratedTag] = React.useState('');

  // Auto-generate Tag based on mode & ID
  React.useEffect(() => {
    if (mode === 'create') {
      const randomId = Math.floor(100 + Math.random() * 900);
      setGeneratedTag(`AF-${randomId}`);
    } else if (asset) {
      setGeneratedTag(asset.tag);
    }
  }, [mode, asset, isOpen]);

  // Synchronize state when open
  React.useEffect(() => {
    if (isOpen) {
      setFormError('');
      setIsSaving(false);
      if (mode === 'edit' && asset) {
        setName(asset.name || '');
        setCategory(asset.category || 'IT Hardware');
        setDescription(asset.description || '');
        setBookable(asset.bookable || false);
        setSerialNumber(asset.serialNumber || '');
        setManufacturer(asset.manufacturer || '');
        setModel(asset.model || '');
        setDepartment(asset.department || 'Engineering');
        setLocation(asset.location || 'HQ - 4th Floor');
        setPurchaseDate(asset.purchaseDate || '2026-07-11');
        setPurchaseCost(asset.purchaseCost ? String(asset.purchaseCost) : '');
        setSupplier(asset.supplier || '');
        setWarrantyExpiry(asset.warrantyExpiry || '');
        setCondition(asset.condition || 'New');
        setImages(asset.images && asset.images.length > 0 ? asset.images : [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
        ]);
        setAttachments(asset.attachments || [{ name: 'purchase_invoice.pdf', size: '1.4 MB', type: 'pdf' }]);
        
        // Restore specs
        if (asset.specifications) {
          if (asset.category === 'IT Hardware') {
            setSpecRAM(asset.specifications.RAM || '');
            setSpecProcessor(asset.specifications.Processor || '');
            setSpecBattery(asset.specifications.Battery || '');
            setSpecOS(asset.specifications.OS || '');
          } else if (asset.category === 'Vehicles') {
            setSpecRegNo(asset.specifications['Registration Number'] || '');
            setSpecFuelType(asset.specifications['Fuel Type'] || '');
            setSpecEngineNo(asset.specifications['Engine Number'] || '');
            setSpecInsurance(asset.specifications['Insurance Policy'] || '');
          } else if (asset.category === 'Office Equipment') {
            setSpecMaterial(asset.specifications.Material || '');
            setSpecDimensions(asset.specifications.Dimensions || '');
            setSpecWeight(asset.specifications.Weight || '');
          }
        }
      } else {
        // Reset for Create
        setName('');
        setCategory('IT Hardware');
        setDescription('');
        setBookable(false);
        setSerialNumber('');
        setManufacturer('');
        setModel('');
        setDepartment('Engineering');
        setLocation('HQ - 4th Floor');
        setPurchaseDate(new Date().toISOString().split('T')[0]);
        setPurchaseCost('');
        setSupplier('');
        setWarrantyExpiry('');
        setCondition('New');
        setImages([
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
        ]);
        setAttachments([
          { name: 'purchase_invoice.pdf', size: '1.4 MB', type: 'pdf' }
        ]);
      }
    }
  }, [isOpen, mode, asset]);

  // Keyboard escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle saving
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Asset Name is required.');
      return;
    }
    if (!serialNumber.trim()) {
      setFormError('Serial Number is required.');
      return;
    }

    setFormError('');
    setIsSaving(true);

    // Build the specific specifications object based on chosen category
    let specs: Record<string, string> = {};
    if (category === 'IT Hardware') {
      specs = { RAM: specRAM, Processor: specProcessor, Battery: specBattery, OS: specOS };
    } else if (category === 'Vehicles') {
      specs = { 'Registration Number': specRegNo, 'Fuel Type': specFuelType, 'Engine Number': specEngineNo, 'Insurance Policy': specInsurance };
    } else if (category === 'Office Equipment') {
      specs = { Material: specMaterial, Dimensions: specDimensions, Weight: specWeight };
    } else {
      specs = { Note: 'General assets' };
    }

    // Health score base logic
    let calculatedHealth = 95;
    if (condition === 'Good') calculatedHealth = 85;
    else if (condition === 'Fair') calculatedHealth = 65;
    else if (condition === 'Poor') calculatedHealth = 35;

    const savedAssetData: Partial<Asset> = {
      name,
      category,
      tag: generatedTag,
      status: asset?.status || 'available',
      location,
      assignedTo: asset?.assignedTo,
      value: Number(purchaseCost) || 1200,
      purchaseDate,
      serialNumber,
      manufacturer,
      model,
      purchaseCost: Number(purchaseCost) || 1200,
      supplier,
      warrantyExpiry,
      department,
      condition,
      bookable,
      description,
      attachments,
      images,
      healthScore: calculatedHealth,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedTag}`,
      specifications: specs
    };

    setTimeout(() => {
      setIsSaving(false);
      onSave(savedAssetData);
    }, 600);
  };

  const handleImageUpload = () => {
    // Simulated upload - adds a default premium royalty-free visual
    const mockImageUrls = [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
    ];
    const nextImg = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    setImages(prev => [...prev, nextImg]);
  };

  const handleAttachmentUpload = () => {
    const mockFiles = [
      { name: 'technical_spec_datasheet.pdf', size: '2.1 MB', type: 'pdf' },
      { name: 'warranty_card_valid.pdf', size: '890 KB', type: 'pdf' },
      { name: 'device_user_manual.pdf', size: '4.3 MB', type: 'pdf' }
    ];
    const nextFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachments(prev => [...prev, nextFile]);
  };

  const downloadQR = () => {
    // Generate simulated print / download frame
    const link = document.createElement('a');
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${generatedTag}`;
    link.target = '_blank';
    link.download = `QR_${generatedTag}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-2xl dark:bg-zinc-950 border-l border-slate-100 dark:border-zinc-900"
          >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-slate-200/80 bg-white px-6 dark:border-zinc-900 dark:bg-zinc-900/40 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                    {mode === 'create' ? 'Register Physical Asset' : `Edit Asset - ${generatedTag}`}
                  </h2>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {mode === 'create' ? 'Allocate unique identifier and log specifications' : 'Update the 360 profile history and meta specs'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="flex items-center gap-2 bg-rose-50 px-6 py-2.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-b border-rose-100 dark:border-rose-950/30">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Content Form Scroll */}
            <form id="asset-drawer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Basic Information */}
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 space-y-4 shadow-2xs">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                  <HardDrive className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. MacBook Pro 16 M3 Max, Tesla Model 3"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Asset Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as AssetCategory)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:bg-zinc-900 px-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Office Equipment">Office Equipment</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="relative flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bookable}
                        onChange={(e) => setBookable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600" />
                      <span className="ml-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-300">
                        Allow Checkout & Booking
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                    Asset Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter complete functional specs, operating guides or team usage bounds..."
                    rows={2.5}
                    className="w-full rounded-lg border border-slate-200 bg-transparent p-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 2: Dynamic Category Specific Fields */}
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                      Dynamic Schema Specs
                    </h3>
                  </div>
                  <span className="rounded bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    {category}
                  </span>
                </div>

                {category === 'IT Hardware' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">RAM Capacity</label>
                      <input type="text" value={specRAM} onChange={(e) => setSpecRAM(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. 32GB LPDDR5X" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Processor</label>
                      <input type="text" value={specProcessor} onChange={(e) => setSpecProcessor(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. Intel Core i7, Apple M3" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Battery Rating</label>
                      <input type="text" value={specBattery} onChange={(e) => setSpecBattery(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. 100 Wh" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Operating System</label>
                      <input type="text" value={specOS} onChange={(e) => setSpecOS(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. macOS Sonoma" />
                    </div>
                  </motion.div>
                )}

                {category === 'Vehicles' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Registration Number</label>
                      <input type="text" value={specRegNo} onChange={(e) => setSpecRegNo(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. CA-3129-9" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Fuel & Battery Type</label>
                      <input type="text" value={specFuelType} onChange={(e) => setSpecFuelType(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. Electric (75 kWh)" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Engine Number / Motor ID</label>
                      <input type="text" value={specEngineNo} onChange={(e) => setSpecEngineNo(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. MTR-90281-Z" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Insurance Policy</label>
                      <input type="text" value={specInsurance} onChange={(e) => setSpecInsurance(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. Travelers #TR-9901" />
                    </div>
                  </motion.div>
                )}

                {category === 'Office Equipment' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Material Composition</label>
                      <input type="text" value={specMaterial} onChange={(e) => setSpecMaterial(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. Mesh & Steel" />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Dimensions (H x W x D)</label>
                      <input type="text" value={specDimensions} onChange={(e) => setSpecDimensions(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. 41 in x 27 in" />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">Dry Weight (lbs)</label>
                      <input type="text" value={specWeight} onChange={(e) => setSpecWeight(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200" placeholder="e.g. 45 lbs" />
                    </div>
                  </motion.div>
                )}

                {category === 'Facilities' && (
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                    Facilities use default space schematics: Standard spatial dimension profiles apply.
                  </p>
                )}
              </div>

              {/* Section 3: Identification */}
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                      Identification & QR Code
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Auto-Generated Asset Tag
                    </label>
                    <input
                      type="text"
                      disabled
                      value={generatedTag}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-slate-100 dark:bg-zinc-900/80 px-3 text-xs text-slate-500 font-mono select-none outline-none dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="e.g. CN-0D40US, C02FX5YQ"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="e.g. Apple, Dell, Framery"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Model SKU
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. U4021QW, AeroB"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                </div>

                {/* QR Code Card Frame */}
                <div className="flex flex-col sm:flex-row gap-4 rounded-lg bg-slate-50 dark:bg-zinc-900/40 p-4 border border-slate-100 dark:border-zinc-900">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-white p-2 border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 mx-auto sm:mx-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedTag}`}
                      alt="QR Code Preview"
                      className="h-20 w-20 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-between text-center sm:text-left">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Universal QR Code ID
                      </p>
                      <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 leading-normal">
                        This high-resolution token is auto-mapped to the hardware tag. Paste or print it for physical barcode scanning.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={downloadQR}
                      className="mt-2.5 inline-flex h-7.5 items-center justify-center gap-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10.5px] dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 cursor-pointer w-full sm:w-fit px-3 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download QR Asset Label</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 4: Ownership & Financials */}
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 space-y-4 shadow-2xs">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                    Ownership, Logistics & Cost
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Department Assignment
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:bg-zinc-900 px-2 text-xs text-slate-800 outline-none dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Finance & Analytics">Finance & Analytics</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                      <option value="Facilities">Facilities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Deployment Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. HQ - 4th Floor, Remote - London"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Purchase Cost (USD)
                    </label>
                    <input
                      type="number"
                      value={purchaseCost}
                      onChange={(e) => setPurchaseCost(e.target.value)}
                      placeholder="e.g. 1499"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Supplier Account
                    </label>
                    <input
                      type="text"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="e.g. Apple Enterprise Store"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Warranty Expiry Date
                    </label>
                    <input
                      type="date"
                      value={warrantyExpiry}
                      onChange={(e) => setWarrantyExpiry(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-xs text-slate-800 dark:border-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Condition & Integrity */}
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 space-y-4 shadow-2xs">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                  <HeartPulse className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                    Condition & Asset Status
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide mb-1">
                      Initial Condition State
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white dark:bg-zinc-900 px-2 text-xs text-slate-800 outline-none dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <option value="New">New (Factory Sealed)</option>
                      <option value="Good">Good (Pristine Deployed)</option>
                      <option value="Fair">Fair (Cosmetic Wear)</option>
                      <option value="Poor">Poor (Decommission Risk)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-normal">
                      Condition directly computes the initial **Health Index %** model for live maintenance forecasts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6: Image Gallery & Documents */}
              <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                  <div className="flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-300 uppercase tracking-wider">
                      Product Media & Contracts
                    </h3>
                  </div>
                </div>

                {/* Simulated drag uploader */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Images */}
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                      Product Images ({images.length})
                    </label>
                    <div 
                      onClick={handleImageUpload}
                      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-emerald-450 dark:border-zinc-800 dark:bg-zinc-900/30 transition-all"
                    >
                      <Camera className="h-5 w-5 text-slate-400 dark:text-zinc-500 mb-1" />
                      <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">Click to upload photos</p>
                      <p className="text-[9px] text-slate-400 dark:text-zinc-500">Supports JPG, PNG up to 10MB</p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto py-1">
                      {images.map((img, i) => (
                        <div key={i} className="relative h-12 w-12 shrink-0 rounded-lg border border-slate-200 overflow-hidden group bg-slate-100 dark:border-zinc-800">
                          <img src={img} alt="Product Thumbnail" className="h-full w-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImages(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="absolute top-0.5 right-0.5 rounded-full bg-slate-900/70 p-0.5 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-2">
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                      Invoices & Guides ({attachments.length})
                    </label>
                    <div 
                      onClick={handleAttachmentUpload}
                      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-emerald-450 dark:border-zinc-800 dark:bg-zinc-900/30 transition-all"
                    >
                      <Paperclip className="h-5 w-5 text-slate-400 dark:text-zinc-500 mb-1" />
                      <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">Attach contracts / PDF</p>
                      <p className="text-[9px] text-slate-400 dark:text-zinc-500">Max size 25MB per document</p>
                    </div>

                    <div className="space-y-1 max-h-16 overflow-y-auto pr-1">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-200/40 dark:border-zinc-800/45">
                          <span className="truncate max-w-[140px] font-mono">{file.name}</span>
                          <span className="text-[9px] text-slate-400 shrink-0">({file.size})</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttachments(prev => prev.filter((_, idx2) => idx2 !== idx));
                            }}
                            className="text-slate-400 hover:text-rose-500 ml-1 font-bold text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </form>

            {/* Footer buttons */}
            <div className="flex h-15 items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 dark:border-zinc-900 dark:bg-zinc-900 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="h-8.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="asset-drawer-form"
                disabled={isSaving}
                className="h-8.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving Asset...</span>
                  </>
                ) : (
                  <span>{mode === 'create' ? 'Register Asset' : 'Save Changes'}</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
