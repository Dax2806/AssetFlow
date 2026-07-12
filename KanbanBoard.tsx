import React from 'react';
import { MaintenanceWorkflowTask, Technician, MaintenanceStatus } from './types';
import AppDrawer from '../common/AppDrawer';
import { 
  CheckCircle, XCircle, UserCheck, Play, ArrowRight, ShieldAlert, Clock, 
  MessageSquare, History, Paperclip, DollarSign, PenTool, User, AlertTriangle
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import TechnicianCard from './TechnicianCard';

interface ApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: MaintenanceWorkflowTask | null;
  technicians: Technician[];
  onUpdateTask: (updatedTask: MaintenanceWorkflowTask) => void;
}

export default function ApprovalDrawer({ isOpen, onClose, task, technicians, onUpdateTask }: ApprovalDrawerProps) {
  const [commentText, setCommentText] = React.useState('');
  const [showTechPicker, setShowTechPicker] = React.useState(false);
  const [actualCost, setActualCost] = React.useState<number>(0);
  const [replacementParts, setReplacementParts] = React.useState<string>('');

  React.useEffect(() => {
    if (task) {
      setActualCost(task.actualCost || task.estimatedCost);
      setReplacementParts('');
      setShowTechPicker(false);
    }
  }, [task]);

  if (!task) return null;

  // Render Status Timeline steps
  const steps: { label: string; status: MaintenanceStatus }[] = [
    { label: 'Pending', status: 'Pending' },
    { label: 'Approved', status: 'Approved' },
    { label: 'Assigned', status: 'Technician Assigned' },
    { label: 'In Progress', status: 'In Progress' },
    { label: 'Resolved', status: 'Resolved' }
  ];

  const currentStepIdx = steps.findIndex((s) => s.status === task.status);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      user: 'Marcus Chen', // Manager user
      avatar: 'MC',
      text: commentText.trim(),
      timestamp: new Date().toISOString()
    };

    const newTimelineEvent = {
      id: `t-${Date.now()}`,
      type: 'comment' as const,
      label: 'New Comment',
      text: commentText.trim(),
      user: 'Marcus Chen',
      timestamp: new Date().toISOString()
    };

    onUpdateTask({
      ...task,
      comments: [...task.comments, newComment],
      timeline: [...task.timeline, newTimelineEvent]
    });

    setCommentText('');
  };

  const updateStatus = (newStatus: MaintenanceStatus, detailText: string, auditLabel: string) => {
    const updatedTimeline = [
      ...task.timeline,
      {
        id: `t-${Date.now()}`,
        type: newStatus === 'Rejected' ? ('rejection' as const) : newStatus === 'Approved' ? ('approval' as const) : ('status_change' as const),
        label: auditLabel,
        text: detailText,
        user: 'Marcus Chen',
        timestamp: new Date().toISOString()
      }
    ];

    onUpdateTask({
      ...task,
      status: newStatus,
      timeline: updatedTimeline,
      approvedBy: newStatus === 'Approved' ? 'Marcus Chen' : task.approvedBy,
      approvedDate: newStatus === 'Approved' ? new Date().toISOString().split('T')[0] : task.approvedDate
    });
  };

  const handleAssignTechnician = (tech: Technician) => {
    const detailText = `Technician assigned: ${tech.name} (${tech.specialty})`;
    const updatedTimeline = [
      ...task.timeline,
      {
        id: `t-${Date.now()}`,
        type: 'assignment' as const,
        label: 'Technician Assigned',
        text: detailText,
        user: 'Marcus Chen',
        timestamp: new Date().toISOString()
      }
    ];

    onUpdateTask({
      ...task,
      status: 'Technician Assigned',
      technicianId: tech.id,
      technicianName: tech.name,
      timeline: updatedTimeline
    });

    setShowTechPicker(false);
  };

  const handleResolve = () => {
    const detailText = `Issue resolved. Replacement parts: ${replacementParts || 'None'}. Final Cost: $${actualCost}`;
    const updatedTimeline = [
      ...task.timeline,
      {
        id: `t-${Date.now()}`,
        type: 'status_change' as const,
        label: 'Maintenance Resolved',
        text: detailText,
        user: 'Marcus Chen',
        timestamp: new Date().toISOString()
      }
    ];

    onUpdateTask({
      ...task,
      status: 'Resolved',
      actualCost,
      timeline: updatedTimeline
    });
  };

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Maintenance Workflow Console"
      description={`Ticket: ${task.id} | Asset Tag: ${task.assetTag}`}
    >
      <div className="space-y-6.5 select-none text-left">
        
        {/* 1. VISUAL WORKFLOW TIMELINE PATHWAY */}
        <div className="rounded-2xl border border-slate-150/80 bg-slate-50/50 p-4.5 dark:border-zinc-900 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-zinc-500 mb-3 select-none">
            <span>Workflow Status</span>
            {task.status === 'Rejected' && (
              <span className="text-rose-600 dark:text-rose-400 font-extrabold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/10">
                Rejected
              </span>
            )}
          </div>

          {task.status !== 'Rejected' ? (
            <div className="flex items-center justify-between relative mt-2">
              {/* Connecting line */}
              <div className="absolute top-2 inset-x-0 h-[3px] bg-slate-200 dark:bg-zinc-900 -z-10" />
              <div 
                className="absolute top-2 left-0 h-[3px] bg-emerald-600 dark:bg-emerald-500 -z-10 transition-all duration-300"
                style={{ width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%` }}
              />

              {/* Status nodes */}
              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="flex flex-col items-center gap-1.5 select-none">
                    <div 
                      className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 scale-125 shadow-xs'
                          : isActive
                          ? 'bg-emerald-100 border-emerald-600 dark:bg-emerald-950 dark:border-emerald-500 text-emerald-600'
                          : 'bg-white border-slate-300 text-slate-400 dark:bg-zinc-950 dark:border-zinc-800'
                      }`}
                    >
                      {isActive && <div className="h-1.5 w-1.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />}
                    </div>
                    <span className={`text-[8.5px] font-bold uppercase tracking-wider ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>This request has been rejected. It is marked closed-inactive.</span>
            </div>
          )}
        </div>

        {/* 2. CORE WORKFLOW DECISION BUTTONS */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Operational Actions
          </label>
          <div className="flex flex-wrap gap-2.5">
            {task.status === 'Pending' && (
              <>
                <button
                  onClick={() => updateStatus('Approved', 'Maintenance request approved. Ready for technician assignment.', 'Request Approved')}
                  className="flex-1 min-w-[120px] h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md cursor-pointer transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => updateStatus('Rejected', 'Maintenance request rejected by Marcus Chen.', 'Request Rejected')}
                  className="flex-1 min-w-[120px] h-10 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-zinc-900 dark:hover:bg-rose-950/20 text-slate-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 border border-slate-200 dark:border-zinc-800 dark:hover:border-rose-900/40 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {(task.status === 'Approved' || (task.status === 'Technician Assigned' && !showTechPicker)) && (
              <button
                onClick={() => setShowTechPicker(true)}
                className="flex-1 h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md cursor-pointer transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>{task.technicianName ? 'Reassign Technician' : 'Assign Technician'}</span>
              </button>
            )}

            {task.status === 'Technician Assigned' && (
              <button
                onClick={() => updateStatus('In Progress', `Maintenance initialized by technician ${task.technicianName}.`, 'In Progress')}
                className="flex-1 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md cursor-pointer transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Begin Repair Work</span>
              </button>
            )}
          </div>
        </div>

        {/* 2b. REPAIR WORK COMPLETION RESOLUTION INPUTS */}
        {task.status === 'In Progress' && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/5 dark:bg-emerald-950/5 p-4 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold text-xs">
              <CheckCircle className="w-4.5 h-4.5" />
              <span>Complete Servicing & Close Ticket</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
                  Final Actual Cost ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={actualCost}
                    onChange={(e) => setActualCost(Math.max(0, Number(e.target.value)))}
                    className="w-full h-9.5 pl-7 pr-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
                  Replacement Parts Replaced
                </label>
                <input
                  type="text"
                  value={replacementParts}
                  onChange={(e) => setReplacementParts(e.target.value)}
                  placeholder="e.g., fuser roller kit, active TB4 cable"
                  className="w-full h-9.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleResolve}
              className="w-full h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md cursor-pointer transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Resolving & Sync Asset status</span>
            </button>
          </div>
        )}

        {/* 2c. TECHNICIAN ASSIGNMENT SELECTOR PANEL */}
        {showTechPicker && (
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-950/80 bg-indigo-50/5 dark:bg-indigo-950/5 p-4.5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Assign Technician Panel</span>
              </span>
              <button 
                onClick={() => setShowTechPicker(false)}
                className="text-[10px] text-slate-450 hover:text-slate-700 dark:hover:text-zinc-200 uppercase font-black tracking-wider"
              >
                Close Picker
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {technicians.map((tech) => (
                <TechnicianCard
                  key={tech.id}
                  technician={tech}
                  isSelectable
                  onAssign={() => handleAssignTechnician(tech)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. ASSET & TICKET CORE SPECIFICATIONS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200/60 p-3.5 space-y-2 dark:border-zinc-900/60">
            <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              Reported Details
            </span>
            <div className="space-y-1 text-xs font-semibold">
              <p className="text-slate-450">By: <span className="text-slate-800 dark:text-zinc-200 font-extrabold">{task.reportedBy}</span></p>
              <p className="text-slate-450">Date: <span className="text-slate-800 dark:text-zinc-200">{task.reportedDate}</span></p>
              <p className="text-slate-450">Target SLA: <span className="text-slate-800 dark:text-zinc-200">{task.dueDate}</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 p-3.5 space-y-2 dark:border-zinc-900/60">
            <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              Financial Status
            </span>
            <div className="space-y-1 text-xs font-semibold">
              <p className="text-slate-450">Est. Budget: <span className="text-slate-800 dark:text-zinc-200 font-extrabold">${task.estimatedCost}</span></p>
              {task.actualCost !== undefined && (
                <p className="text-emerald-600 dark:text-emerald-400">Actual Cost: <span className="font-extrabold">${task.actualCost}</span></p>
              )}
              <p className="text-slate-450">Category: <span className="text-slate-800 dark:text-zinc-200">{task.category}</span></p>
            </div>
          </div>
        </div>

        {/* 4. ATTACHMENTS LISTING */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
              Attachments ({task.attachments.length})
            </label>
            <div className="space-y-2">
              {task.attachments.map((file, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between rounded-lg border border-slate-150/80 bg-slate-50/20 px-3 py-2 dark:border-zinc-900 dark:bg-zinc-950/20 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-extrabold text-slate-700 dark:text-zinc-300 truncate">{file.name}</span>
                    <span className="text-[9px] text-slate-450 font-medium">({file.size})</span>
                  </div>
                  <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()} 
                    className="text-[10px] font-black text-emerald-600 hover:text-emerald-750 dark:text-emerald-400 uppercase tracking-wider shrink-0"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TICKET AUDIT HISTORY TIMELINE */}
        <div className="space-y-3 select-none">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-400" />
            <span>Operational Audit Trail</span>
          </label>
          
          <div className="border-l-2 border-slate-100 dark:border-zinc-900 ml-2.5 pl-4.5 space-y-4">
            {task.timeline.map((event) => (
              <div key={event.id} className="relative select-none text-xs">
                {/* Visual Circle Node */}
                <span className="absolute -left-7.5 top-0.5 h-3 w-3 rounded-full bg-slate-200 border-2 border-white dark:bg-zinc-800 dark:border-zinc-950" />
                
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 dark:text-zinc-200 uppercase text-[9.5px] tracking-wider">
                      {event.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-medium leading-relaxed">
                    {event.text}
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold italic">
                    Actor: {event.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. COMMENTS FORUM */}
        <div className="space-y-3.5 select-none pt-4 border-t border-slate-100 dark:border-zinc-900/60">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Comments Forum ({task.comments.length})</span>
          </label>

          {/* Comment input form */}
          <form onSubmit={handleAddComment} className="flex gap-2.5">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post an update, mention replacement parts, or request sign-off..."
              className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-3.5 text-xs font-medium text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 dark:focus:border-emerald-600 transition-all"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
            >
              Post
            </button>
          </form>

          {/* List of comments */}
          {task.comments.length > 0 ? (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {task.comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="rounded-xl border border-slate-150/60 bg-slate-50/20 p-3.5 space-y-1.5 dark:border-zinc-900/60"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-emerald-600 flex items-center justify-center text-[9px] font-black text-white uppercase">
                        {comment.avatar || comment.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-extrabold text-slate-750 dark:text-zinc-300">
                        {comment.user}
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-zinc-500 font-medium">
                      {new Date(comment.timestamp).toLocaleDateString()} {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-650 dark:text-zinc-450 text-[11px] font-medium leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold italic py-1">
              No comments posted on this repair yet.
            </p>
          )}
        </div>

      </div>
    </AppDrawer>
  );
}
