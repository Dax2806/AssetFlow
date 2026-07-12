import React from 'react';
import { X, Calendar, User, Clock, Building2, AlignLeft, ShieldCheck, Trash2, Edit2, Users, CheckCircle2, ChevronRight, BarChart3, Star, Layers, Activity } from 'lucide-react';
import { BookingResource, ResourceBooking, ResourceCategory } from './types';
import ConflictPanel from './ConflictPanel';
import { DEPARTMENTS } from './mockData';
import { motion, AnimatePresence } from 'motion/react';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'view-booking' | 'view-resource';
  setMode: (mode: 'create' | 'view-booking' | 'view-resource') => void;
  resources: BookingResource[];
  
  // Create / Form States
  selectedResource: BookingResource | null;
  setSelectedResource: (res: BookingResource | null) => void;
  
  // Booking Selected for View / Edit
  selectedBooking: ResourceBooking | null;
  
  // Submit actions
  onSubmitBooking: (bookingData: Omit<ResourceBooking, 'id' | 'durationMinutes'>) => boolean | { conflict: ResourceBooking };
  onCancelBooking: (bookingId: string) => void;
  onUpdateBooking: (bookingId: string, updatedData: Partial<ResourceBooking>) => boolean | { conflict: ResourceBooking };
  
  // Suggested slots callback
  getSuggestedSlots: (resourceId: string, date: string, durationMin: number) => { startTime: string; endTime: string }[];
}

export default function BookingDrawer({
  isOpen,
  onClose,
  mode,
  setMode,
  resources,
  selectedResource,
  setSelectedResource,
  selectedBooking,
  onSubmitBooking,
  onCancelBooking,
  onUpdateBooking,
  getSuggestedSlots,
}: BookingDrawerProps) {

  // Form Fields State
  const [formResourceId, setFormResourceId] = React.useState('');
  const [bookedBy, setBookedBy] = React.useState('Om Patel');
  const [userEmail, setUserEmail] = React.useState('om.patel@assetflow.com');
  const [department, setDepartment] = React.useState('Executive');
  const [purpose, setPurpose] = React.useState('');
  const [date, setDate] = React.useState('2026-07-12');
  const [startTime, setStartTime] = React.useState('14:00');
  const [endTime, setEndTime] = React.useState('15:00');
  const [attendeeInput, setAttendeeInput] = React.useState('');
  const [attendees, setAttendees] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState('');

  // Conflict state
  const [conflictBooking, setConflictBooking] = React.useState<ResourceBooking | null>(null);
  const [suggestedSlots, setSuggestedSlots] = React.useState<{ startTime: string; endTime: string }[]>([]);

  // Track if we are editing an existing booking
  const [isEditing, setIsEditing] = React.useState(false);

  // Sync state when drawer mode changes
  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        setConflictBooking(null);
        setIsEditing(false);
        if (selectedResource) {
          setFormResourceId(selectedResource.id);
        } else if (resources.length > 0) {
          setFormResourceId(resources[0].id);
        }
        setPurpose('');
        setAttendees([]);
        setNotes('');
        setStartTime('14:00');
        setEndTime('15:00');
        setDate('2026-07-12');
      } else if (mode === 'view-booking' && selectedBooking) {
        setIsEditing(false);
        setConflictBooking(null);
        // Fill form fields in case we toggle edit
        setFormResourceId(selectedBooking.resourceId);
        setBookedBy(selectedBooking.bookedBy);
        setUserEmail(selectedBooking.userEmail);
        setDepartment(selectedBooking.department);
        setPurpose(selectedBooking.purpose);
        setDate(selectedBooking.date);
        setStartTime(selectedBooking.startTime);
        setEndTime(selectedBooking.endTime);
        setAttendees(selectedBooking.attendees || []);
        setNotes(selectedBooking.notes || '');
      }
    }
  }, [isOpen, mode, selectedResource, selectedBooking, resources]);

  if (!isOpen) return null;

  const activeRes = resources.find((r) => r.id === (mode === 'view-resource' ? selectedResource?.id : formResourceId));

  // Handle Add Attendee
  const handleAddAttendee = () => {
    if (attendeeInput.trim() && !attendees.includes(attendeeInput.trim())) {
      setAttendees([...attendees, attendeeInput.trim()]);
      setAttendeeInput('');
    }
  };

  const handleRemoveAttendee = (name: string) => {
    setAttendees(attendees.filter((a) => a !== name));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictBooking(null);

    // Validate inputs
    if (!formResourceId) return;
    const res = resources.find((r) => r.id === formResourceId);
    if (!res) return;

    const bookingPayload = {
      resourceId: formResourceId,
      resourceName: res.name,
      resourceCategory: res.category,
      bookedBy,
      department,
      userEmail,
      purpose: purpose || 'General booking',
      date,
      startTime,
      endTime,
      status: 'Confirmed' as const,
      attendees,
      notes,
    };

    if (isEditing && selectedBooking) {
      const result = onUpdateBooking(selectedBooking.id, bookingPayload);
      if (result === true) {
        setIsEditing(false);
        setMode('view-booking');
      } else if (result && typeof result === 'object' && result.conflict) {
        setConflictBooking(result.conflict);
        // Calculate duration to supply suggested slots
        const startH = parseInt(startTime.split(':')[0]);
        const startM = parseInt(startTime.split(':')[1]);
        const endH = parseInt(endTime.split(':')[0]);
        const endM = parseInt(endTime.split(':')[1]);
        const durationMin = (endH - startH) * 60 + (endM - startM);
        
        const suggestions = getSuggestedSlots(formResourceId, date, durationMin > 0 ? durationMin : 60);
        setSuggestedSlots(suggestions);
      }
    } else {
      const result = onSubmitBooking(bookingPayload);
      if (result === true) {
        onClose();
      } else if (result && typeof result === 'object' && result.conflict) {
        setConflictBooking(result.conflict);
        // Get suggested slots
        const startH = parseInt(startTime.split(':')[0]);
        const startM = parseInt(startTime.split(':')[1]);
        const endH = parseInt(endTime.split(':')[0]);
        const endM = parseInt(endTime.split(':')[1]);
        const durationMin = (endH - startH) * 60 + (endM - startM);
        
        const suggestions = getSuggestedSlots(formResourceId, date, durationMin > 0 ? durationMin : 60);
        setSuggestedSlots(suggestions);
      }
    }
  };

  // Conflict Resolution: Choose a suggested slot
  const handleSelectSuggestedSlot = (suggestedStart: string, suggestedEnd: string) => {
    setStartTime(suggestedStart);
    setEndTime(suggestedEnd);
    setConflictBooking(null); // clear conflict status to allow retry
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel Sliding from Right */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-900 flex flex-col h-full shadow-2xl relative">
          
          {/* Drawer Header */}
          <div className="h-16 border-b border-slate-100 dark:border-zinc-900/60 px-6 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-zinc-950/20">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450">
                <Calendar className="h-4.5 w-4.5" />
              </span>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  {mode === 'create'
                    ? (isEditing ? 'Modify Reservation' : 'New Reservation')
                    : mode === 'view-booking'
                    ? 'Reservation Details'
                    : 'Shared Asset Profile'}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  {mode === 'create'
                    ? 'Fill shared resource booking parameters'
                    : mode === 'view-booking'
                    ? `ID: ${selectedBooking?.id}`
                    : `${activeRes?.tag} Profile Overview`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-slate-200 text-slate-450 hover:bg-slate-50 hover:text-slate-700 dark:border-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            
            {/* 1. CONFLICT PANEL INSTANT FEEDBACK */}
            {conflictBooking && (
              <ConflictPanel
                conflictingBooking={conflictBooking}
                requestedStartTime={startTime}
                requestedEndTime={endTime}
                suggestedSlots={suggestedSlots}
                onSelectSlot={handleSelectSuggestedSlot}
                onCancel={() => setConflictBooking(null)}
              />
            )}

            {/* 2. CREATE / EDIT FORM */}
            {!conflictBooking && (mode === 'create' || isEditing) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Resource Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                    Target Shared Asset
                  </label>
                  <select
                    value={formResourceId}
                    onChange={(e) => setFormResourceId(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    required
                  >
                    {resources.map((res) => (
                      <option key={res.id} value={res.id}>
                        [{res.category}] {res.name} ({res.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Booked By */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                      Booked By
                    </label>
                    <input
                      type="text"
                      value={bookedBy}
                      onChange={(e) => setBookedBy(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                      Department Group
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Purpose */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                    Reservation Purpose
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Weekly Standup, Client VIP demo, Field testing"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                    required
                  />
                </div>

                {/* Date / Hours Range */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      required
                    />
                  </div>
                </div>

                {/* Attendees */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                    Attendees / Participants
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      placeholder="Add guest name..."
                      className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAttendee();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddAttendee}
                      className="h-9 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-350 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* List of active guest badges */}
                  {attendees.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {attendees.map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-full text-[10.5px] font-bold text-slate-650 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-350"
                        >
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttendee(name)}
                            className="text-rose-500 hover:text-rose-700 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">
                    Additional Instructions / Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Supply access instructions, equipment settings, or safety requirements..."
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  />
                </div>

                {/* Actions bottom */}
                <div className="pt-4 flex items-center space-x-2.5">
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                  >
                    <span>{isEditing ? 'Save Changes' : 'Confirm & Book Asset'}</span>
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 h-10 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-350 dark:hover:bg-zinc-850"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* 3. VIEW RESERVATION DETAILS (READ-ONLY VIEW) */}
            {mode === 'view-booking' && selectedBooking && !conflictBooking && !isEditing && (
              <div className="space-y-6">
                
                {/* Active resource summary */}
                <div className="bg-slate-50 border border-slate-200 dark:bg-zinc-900/40 dark:border-zinc-900 rounded-xl p-4.5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                      {selectedBooking.resourceCategory}
                    </span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white mt-0.5">
                      {selectedBooking.resourceName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1.5">
                      <span>Live Location:</span>
                      <span className="font-extrabold text-slate-700 dark:text-zinc-300">
                        {activeRes?.location || 'HQ Main'}
                      </span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 text-[9.5px] font-black uppercase rounded-lg border ${
                    selectedBooking.status === 'Confirmed'
                      ? 'bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/20 dark:text-blue-400'
                      : selectedBooking.status === 'In Progress'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/25 dark:text-emerald-400'
                      : selectedBooking.status === 'Completed'
                      ? 'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-400'
                      : 'bg-rose-50 text-rose-600 border-rose-150 dark:bg-rose-950/20 dark:text-rose-450'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-4">
                  {/* Purpose block */}
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider">
                      Booking Intent / Purpose
                    </span>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 leading-relaxed">
                      {selectedBooking.purpose}
                    </p>
                  </div>

                  {/* Scheduled Hours */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-900/60">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider flex items-center space-x-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>Scheduled Date</span>
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-250">
                        {selectedBooking.date}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider flex items-center space-x-1.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Allocated Hours</span>
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-250">
                        {selectedBooking.startTime} – {selectedBooking.endTime}
                      </p>
                    </div>
                  </div>

                  {/* Booked by profile */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-zinc-900/60">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider flex items-center space-x-1.5">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>Reservee Profile</span>
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                        {selectedBooking.bookedBy}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {selectedBooking.userEmail}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider flex items-center space-x-1.5">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <span>Department group</span>
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                        {selectedBooking.department}
                      </p>
                    </div>
                  </div>

                  {/* Guests list */}
                  {selectedBooking.attendees && selectedBooking.attendees.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-900/60">
                      <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider flex items-center space-x-1.5">
                        <Users className="h-3 w-3 text-slate-400" />
                        <span>Registered Guest Invites ({selectedBooking.attendees.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedBooking.attendees.map((a, i) => (
                          <span
                            key={i}
                            className="inline-block px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg text-[10.5px] font-semibold text-slate-650 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-350"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructions Notes */}
                  {selectedBooking.notes && (
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-900/60">
                      <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-650 tracking-wider flex items-center space-x-1.5">
                        <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
                        <span>Special Instructions / Notes</span>
                      </span>
                      <div className="bg-slate-50/50 border border-slate-150 dark:bg-zinc-900/20 dark:border-zinc-900 rounded-lg p-3 text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed italic">
                        "{selectedBooking.notes}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Operations Control Panel */}
                <div className="pt-6 border-t border-slate-100 dark:border-zinc-900/80 flex items-center space-x-2.5">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Edit Reservation</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to release this reservation?')) {
                        onCancelBooking(selectedBooking.id);
                        onClose();
                      }
                    }}
                    className="px-4.5 h-10 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-950/40 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer"
                    title="Release / Cancel booking"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. VIEW RESOURCE / ASSET DETAILS */}
            {mode === 'view-resource' && activeRes && (
              <div className="space-y-6">
                
                {/* Image Section */}
                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-900">
                  <img
                    src={activeRes.imageUrl}
                    alt={activeRes.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="bg-emerald-600 px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-widest border border-emerald-500/30">
                      {activeRes.category}
                    </span>
                    <h4 className="text-sm font-black mt-1 leading-tight tracking-tight">
                      {activeRes.name}
                    </h4>
                    <p className="text-[10px] text-zinc-300 flex items-center mt-0.5 space-x-1">
                      <Building2 className="h-3 w-3 text-zinc-400" />
                      <span>{activeRes.location}</span>
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-slate-450 dark:text-zinc-650 tracking-wider">
                    Shared Asset Description
                  </span>
                  <p className="text-xs text-slate-650 dark:text-zinc-350 leading-relaxed font-medium">
                    {activeRes.description}
                  </p>
                </div>

                {/* Capacity & Core specifications list */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-zinc-900/60 py-4">
                  <div>
                    <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-550 block">
                      Occupancy / Capacity
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 mt-1 block">
                      {activeRes.capacity ? `${activeRes.capacity} Seats / Slots` : 'N/A (Individual Equip)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9.5px] font-bold uppercase text-slate-400 dark:text-zinc-550 block">
                      System Tag / Identifier
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      {activeRes.tag}
                    </span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2">
                  <span className="text-[9.5px] font-black uppercase text-slate-450 dark:text-zinc-550 tracking-wider">
                    Equipment Features & Spec Check
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {activeRes.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-slate-650 dark:text-zinc-350">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-[11px] truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Utilization Metrics strip */}
                <div className="bg-slate-50 border border-slate-150 dark:bg-zinc-900/30 dark:border-zinc-900 p-4 rounded-xl space-y-3">
                  <span className="text-[9.5px] font-black uppercase text-slate-450 dark:text-zinc-550 tracking-wider flex items-center space-x-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Operational Utilization Stats</span>
                  </span>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white border border-slate-100 dark:bg-zinc-950 dark:border-zinc-900 p-2.5 rounded-lg">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Weekly Usage</span>
                      <p className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{activeRes.utilizationWeek}%</p>
                      
                      {/* Weekly progress bar */}
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          style={{ width: `${activeRes.utilizationWeek}%` }}
                          className="bg-emerald-600 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 dark:bg-zinc-950 dark:border-zinc-900 p-2.5 rounded-lg">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monthly Average</span>
                      <p className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{activeRes.utilizationMonth}%</p>
                      
                      {/* Monthly progress bar */}
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          style={{ width: `${activeRes.utilizationMonth}%` }}
                          className="bg-indigo-600 h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability hourly timeline strip */}
                <div className="space-y-2.5">
                  <span className="text-[9.5px] font-black uppercase text-slate-450 dark:text-zinc-550 tracking-wider flex items-center space-x-1.5">
                    <Activity className="h-3.5 w-3.5 text-slate-400" />
                    <span>Daily Access Hour Blocks (8:00 AM – 6:00 PM)</span>
                  </span>
                  
                  {/* Hourly progress boxes */}
                  <div className="flex w-full rounded-lg border border-slate-150 overflow-hidden divide-x divide-slate-150 h-7 text-[9px] font-bold text-center dark:border-zinc-900 dark:divide-zinc-900">
                    {Array.from({ length: 10 }, (_, i) => {
                      const h = i + 8;
                      const hourStr = `${h}:00`;
                      // check if booked now
                      return (
                        <div
                          key={h}
                          className={`flex-1 flex flex-col justify-center leading-none ${
                            h === 9 || h === 10 || h === 11 || h === 15
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                          }`}
                          title={`${hourStr}: ${h === 9 || h === 10 || h === 11 || h === 15 ? 'Booked' : 'Available'}`}
                        >
                          <span>{h}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions: Instantly triggers New Booking form with this resource pre-selected */}
                <button
                  type="button"
                  onClick={() => {
                    setFormResourceId(activeRes.id);
                    setMode('create');
                  }}
                  className="w-full h-10.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Instantly Reserve Asset</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
