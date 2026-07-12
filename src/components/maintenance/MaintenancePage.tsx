import React from 'react';
import { 
  Plus, Calendar, ShieldAlert, CheckCircle, TrendingUp, SlidersHorizontal, 
  Sparkles, Clock, Coins, Hammer, Search, Filter, Activity, FileText, 
  LayoutGrid, List, Layers, ShieldCheck, UserCheck, PlayCircle, ClipboardList, CheckCircle2, XCircle
} from 'lucide-react';
import { Asset, Activity as GlobalActivity } from '../../types';
import { MaintenanceWorkflowTask, Technician } from './types';
import { INITIAL_WORKFLOW_TASKS, INITIAL_TECHNICIANS } from './mockData';
import SummaryStrip from '../common/SummaryStrip';
import KanbanBoard from './KanbanBoard';
import RequestDrawer from './RequestDrawer';
import ApprovalDrawer from './ApprovalDrawer';
import PriorityBadge from './PriorityBadge';
import TechnicianCard from './TechnicianCard';

interface MaintenancePageProps {
  assets: Asset[];
  tasks?: MaintenanceWorkflowTask[];
  setTasks?: React.Dispatch<React.SetStateAction<MaintenanceWorkflowTask[]>>;
  onUpdateAsset?: (updated: Asset) => void;
  onAddActivity?: (activity: GlobalActivity) => void;
}

export default function MaintenancePage({ assets, tasks: propsTasks, setTasks: propsSetTasks, onUpdateAsset, onAddActivity }: MaintenancePageProps) {
  // Page state
  const [localTasks, setLocalTasks] = React.useState<MaintenanceWorkflowTask[]>(() => {
    const saved = localStorage.getItem('assetflow_maintenance_tasks');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOW_TASKS;
  });

  const tasks = propsTasks || localTasks;
  const setTasks = propsSetTasks || setLocalTasks;

  const [technicians, setTechnicians] = React.useState<Technician[]>(() => {
    const saved = localStorage.getItem('assetflow_technicians');
    return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
  });

  const [viewMode, setViewMode] = React.useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('All');
  const [statusFilter, setStatusFilter] = React.useState<string>('All');

  // Drawer states
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = React.useState(false);
  const [isApprovalDrawerOpen, setIsApprovalDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<MaintenanceWorkflowTask | null>(null);

  // Selected Asset for History Timeline section
  const [selectedHistoryAssetId, setSelectedHistoryAssetId] = React.useState<string>('');

  // Persist local state
  React.useEffect(() => {
    localStorage.setItem('assetflow_maintenance_tasks', JSON.stringify(tasks));
  }, [tasks]);

  React.useEffect(() => {
    localStorage.setItem('assetflow_technicians', JSON.stringify(technicians));
  }, [technicians]);

  // Compute live KPIs for SummaryStrip
  const kpis = React.useMemo(() => {
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const approved = tasks.filter(t => t.status === 'Approved' || t.status === 'Technician Assigned').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const resolved = tasks.filter(t => t.status === 'Resolved').length;

    return [
      { title: 'Pending Approval', value: pending, subText: 'SLA ticking down', icon: ClipboardList, type: 'info' as const },
      { title: 'Approved Repairs', value: approved, subText: 'Awaiting tech/work', icon: ShieldAlert, type: 'positive' as const },
      { title: 'Active Repairs', value: inProgress, subText: 'Live in labs now', icon: Hammer, type: 'info' as const },
      { title: 'Resolved Repairs', value: resolved, subText: 'Returned to service', icon: CheckCircle2, type: 'positive' as const }
    ];
  }, [tasks]);

  // Filtered Tasks for table/Kanban list
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = 
        task.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.technicianName && task.technicianName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  // Handle raise new request
  const handleRaiseRequest = (data: {
    assetId: string;
    issueTitle: string;
    description: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    estimatedCost: number;
    attachments: { name: string; size: string; type: string }[];
  }) => {
    const targetAsset = assets.find(a => a.id === data.assetId);
    if (!targetAsset) return;

    const newId = `maint-${tasks.length + 1 + Date.now().toString().slice(-4)}`;
    const newWorkflowTask: MaintenanceWorkflowTask = {
      id: newId,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      assetTag: targetAsset.tag,
      category: targetAsset.category,
      priority: data.priority,
      issueTitle: data.issueTitle,
      description: data.description,
      status: 'Pending',
      reportedBy: 'Elena Rostova', // Reporter context
      reportedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 48h from now
      estimatedCost: data.estimatedCost,
      slaHours: data.priority === 'Critical' ? 12 : data.priority === 'High' ? 48 : data.priority === 'Medium' ? 72 : 168,
      attachments: data.attachments,
      comments: [],
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: 'creation',
          label: 'Request Raised',
          text: `Maintenance ticket raised for ${targetAsset.name}`,
          user: 'Elena Rostova',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setTasks(prev => [newWorkflowTask, ...prev]);

    // Push standard activity feed
    if (onAddActivity) {
      onAddActivity({
        id: `act-${Date.now()}`,
        assetId: targetAsset.id,
        assetName: targetAsset.name,
        assetTag: targetAsset.tag,
        type: 'maintenance',
        description: `New maintenance request raised: "${data.issueTitle}" (${targetAsset.tag})`,
        timestamp: new Date().toISOString(),
        user: { name: 'Elena Rostova', email: 'elena.r@assetflow.com' }
      });
    }
  };

  // Handle updating a task inside the workflow (approval, tech assignment, status changes)
  const handleUpdateTask = (updatedTask: MaintenanceWorkflowTask) => {
    // 1. If status is changing, enforce the BUSINESS RULE
    const previousTask = tasks.find(t => t.id === updatedTask.id);
    if (previousTask && previousTask.status !== updatedTask.status) {
      const targetAsset = assets.find(a => a.id === updatedTask.assetId);
      
      if (targetAsset && onUpdateAsset) {
        // Approving maintenance automatically changes Asset Status -> Under Maintenance
        if (updatedTask.status === 'Approved' || updatedTask.status === 'In Progress' || updatedTask.status === 'Technician Assigned') {
          if (targetAsset.status !== 'maintenance') {
            onUpdateAsset({
              ...targetAsset,
              status: 'maintenance'
            });
          }
        }
        // Resolving maintenance automatically changes Asset Status -> Available
        if (updatedTask.status === 'Resolved') {
          onUpdateAsset({
            ...targetAsset,
            status: 'available'
          });
        }
        // If rejected, ensure the asset remains in its previous state
        if (updatedTask.status === 'Rejected') {
          if (targetAsset.status === 'maintenance') {
            onUpdateAsset({
              ...targetAsset,
              status: 'available'
            });
          }
        }
      }

      // Log to Global Activity feed
      if (onAddActivity && targetAsset) {
        onAddActivity({
          id: `act-${Date.now()}`,
          assetId: targetAsset.id,
          assetName: targetAsset.name,
          assetTag: targetAsset.tag,
          type: 'maintenance',
          description: `Maintenance ticket ${updatedTask.id} moved from ${previousTask.status} to ${updatedTask.status}`,
          timestamp: new Date().toISOString(),
          user: { name: 'Marcus Chen', email: 'marcus.c@assetflow.com' }
        });
      }

      // 2. Adjust technician workload capacity if assigned or re-assigned
      if (updatedTask.technicianId && updatedTask.technicianId !== previousTask.technicianId) {
        setTechnicians(prevTechs => prevTechs.map(tech => {
          if (tech.id === updatedTask.technicianId) {
            const isCritical = updatedTask.priority === 'Critical';
            const extraWork = isCritical ? 35 : 20;
            return {
              ...tech,
              activeJobs: tech.activeJobs + 1,
              workloadScore: Math.min(100, tech.workloadScore + extraWork),
              status: tech.status === 'Available' ? 'Active' : tech.status
            };
          }
          if (previousTask.technicianId && tech.id === previousTask.technicianId) {
            return {
              ...tech,
              activeJobs: Math.max(0, tech.activeJobs - 1),
              workloadScore: Math.max(0, tech.workloadScore - (updatedTask.priority === 'Critical' ? 35 : 20))
            };
          }
          return tech;
        }));
      }

      // 3. Clear technician workload when ticket is resolved
      if (updatedTask.status === 'Resolved' && previousTask.status !== 'Resolved' && updatedTask.technicianId) {
        setTechnicians(prevTechs => prevTechs.map(tech => {
          if (tech.id === updatedTask.technicianId) {
            const isCritical = updatedTask.priority === 'Critical';
            const subWork = isCritical ? 35 : 20;
            const newJobs = Math.max(0, tech.activeJobs - 1);
            return {
              ...tech,
              activeJobs: newJobs,
              workloadScore: Math.max(0, tech.workloadScore - subWork),
              status: newJobs === 0 ? 'Available' : tech.status
            };
          }
          return tech;
        }));
      }
    }

    // Update master tasks list
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    
    // Update active selected task in drawer
    setSelectedTask(updatedTask);
  };

  // Asset history selection computer
  const selectedHistoryAsset = React.useMemo(() => {
    return assets.find(a => a.id === selectedHistoryAssetId);
  }, [assets, selectedHistoryAssetId]);

  const selectedAssetMaintTasks = React.useMemo(() => {
    if (!selectedHistoryAssetId) return [];
    return tasks.filter(t => t.assetId === selectedHistoryAssetId);
  }, [tasks, selectedHistoryAssetId]);

  return (
    <div className="w-full px-6 py-8 md:px-8 space-y-8 select-none">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-zinc-900 select-none">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Maintenance Management
          </h1>
          <p className="text-[11px] font-medium text-slate-450 dark:text-zinc-500 mt-1">
            Track and manage asset repairs through structured approval workflows.
          </p>
        </div>
        <button
          onClick={() => setIsRequestDrawerOpen(true)}
          className="h-10 px-4.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Raise Request</span>
        </button>
      </div>

      {/* 2. SUMMARY STRIP */}
      <SummaryStrip kpis={kpis} />

      {/* 3. SMART INSIGHTS CARD */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/15 dark:border-indigo-950/40 dark:bg-indigo-950/5 p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="space-y-1 text-left">
          <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
            Operational Insights & Intelligence
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1.5 text-[11px] font-semibold text-indigo-750 dark:text-indigo-400">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span>Printers account for 37% of maintenance requests.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span>Vehicle maintenance increased this month.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span>Laptop repairs dropped by 12% across London office.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. WORKFLOW VIEW TOGGLES & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        {/* Sliders Horizontal */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full md:w-64 h-9.5">
            <input
              type="text"
              placeholder="Search assets, issues or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-9.5 pr-4 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none focus:border-emerald-500"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-450 dark:text-zinc-500" />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status filter (List view only) */}
          {viewMode === 'list' && (
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-3.5 text-xs font-bold text-slate-700 dark:text-zinc-300 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Technician Assigned">Tech Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 self-end md:self-auto bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-zinc-850 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-450 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-850 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-450 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List Grid</span>
          </button>
        </div>
      </div>

      {/* 5. HERO KANBAN WORKFLOW BOARD OR MAINTENANCE LIST */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onCardClick={(task) => {
            if ((window as any).openMaintenanceById) {
              (window as any).openMaintenanceById(task.id);
            } else {
              setSelectedTask(task);
              setIsApprovalDrawerOpen(true);
            }
          }}
        />
      ) : (
        <div className="border border-slate-200 dark:border-zinc-900 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/40 select-none text-left">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 bg-slate-50/50 dark:border-zinc-900 dark:bg-zinc-950/50 text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-zinc-500 h-11 select-none">
                <th className="pl-6 py-3">Asset / Tag</th>
                <th className="py-3">Issue Title</th>
                <th className="py-3">Priority</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3">SLA Status</th>
                <th className="py-3">Assigned Technician</th>
                <th className="py-3 pr-6 text-right">Est. Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                    No active maintenance tickets found matching filters
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => {
                      if ((window as any).openMaintenanceById) {
                        (window as any).openMaintenanceById(task.id);
                      } else {
                        setSelectedTask(task);
                        setIsApprovalDrawerOpen(true);
                      }
                    }}
                    className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer text-xs font-semibold text-slate-700 dark:text-zinc-300 h-13"
                  >
                    {/* Asset / Tag */}
                    <td className="pl-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 dark:text-white">{task.assetName}</span>
                        <span className="text-[9.5px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{task.assetTag}</span>
                      </div>
                    </td>
                    
                    {/* Issue */}
                    <td className="py-3 pr-4 max-w-[200px] truncate">
                      <span className="font-extrabold text-slate-800 dark:text-zinc-200 line-clamp-1">{task.issueTitle}</span>
                    </td>

                    {/* Priority */}
                    <td className="py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.status === 'Pending' ? 'bg-slate-100 text-slate-600 dark:bg-zinc-900' :
                        task.status === 'Approved' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' :
                        task.status === 'Technician Assigned' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                        task.status === 'In Progress' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                        task.status === 'Resolved' ? 'bg-slate-100 text-slate-450 dark:bg-zinc-900 dark:text-zinc-500' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                      }`}>
                        {task.status}
                      </span>
                    </td>

                    {/* SLA Progress */}
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.status === 'Resolved' ? 'Completed' : `${task.slaHours} hrs remaining`}</span>
                      </div>
                    </td>

                    {/* Technician */}
                    <td className="py-3 text-slate-500 dark:text-zinc-400">
                      {task.technicianName ? (
                        <span className="font-bold text-slate-700 dark:text-zinc-300">{task.technicianName}</span>
                      ) : (
                        <span className="font-medium italic text-slate-400">Unassigned</span>
                      )}
                    </td>

                    {/* Cost */}
                    <td className="py-3 pr-6 text-right font-black text-slate-900 dark:text-white">
                      ${task.estimatedCost}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. TECHNICIAN WORKLOAD & ASSIGNMENTS PANEL */}
      <div className="space-y-4 text-left select-none">
        <div>
          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Technician Dispatch Control Panel
          </h2>
          <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-medium">
            Monitor real-time repair capacities, workloads, and specialties of engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {technicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      </div>

      {/* 7. ASSET MAINTENANCE HISTORY SEARCH VIEWER */}
      <div className="border border-slate-200 dark:border-zinc-900 rounded-2xl p-6.5 bg-white dark:bg-zinc-950/20 select-none text-left grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4 select-none">
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Asset History Analyzer
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-zinc-500 font-medium">
              Analyze the historical repairs, replacement parts, and comments logged on specific assets.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              Choose Asset
            </label>
            <select
              value={selectedHistoryAssetId}
              onChange={(e) => setSelectedHistoryAssetId(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-3.5 text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="" className="text-slate-450">-- Select asset to analyze --</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  [{asset.tag}] {asset.name}
                </option>
              ))}
            </select>
          </div>

          {selectedHistoryAsset && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/35 p-4.5 dark:border-zinc-900 dark:bg-zinc-950/40 text-xs font-medium space-y-2">
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Asset Properties</p>
              <p className="text-slate-500">Category: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{selectedHistoryAsset.category}</span></p>
              <p className="text-slate-500">Asset Tag: <span className="font-extrabold text-slate-800 dark:text-zinc-200">{selectedHistoryAsset.tag}</span></p>
              <p className="text-slate-500">Current Status: <span className="font-extrabold text-slate-800 dark:text-zinc-200 capitalize">{selectedHistoryAsset.status}</span></p>
              <p className="text-slate-500">Purchase Cost: <span className="font-extrabold text-slate-800 dark:text-zinc-200">${selectedHistoryAsset.value}</span></p>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center border-l border-slate-100 dark:border-zinc-900 pl-0 lg:pl-6">
          {!selectedHistoryAssetId ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
              Select an asset on the left to review its complete repair timeline
            </div>
          ) : selectedAssetMaintTasks.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
              No historical maintenance records or tickets logged for this asset
            </div>
          ) : (
            <div className="space-y-5 overflow-y-auto max-h-[340px] pr-2 scrollbar-thin">
              <h4 className="text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
                Historic Repair Tickets ({selectedAssetMaintTasks.length})
              </h4>
              <div className="space-y-4">
                {selectedAssetMaintTasks.map((t) => (
                  <div key={t.id} className="rounded-xl border border-slate-150 bg-white dark:border-zinc-900 dark:bg-zinc-950/40 p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-2 dark:border-zinc-900/60">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white uppercase">Ticket {t.id}</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 ml-2">({t.reportedDate})</span>
                      </div>
                      <PriorityBadge priority={t.priority} />
                    </div>

                    <div className="space-y-1">
                      <h5 className="font-black text-xs text-slate-800 dark:text-zinc-200">{t.issueTitle}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{t.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-450 dark:text-zinc-500">
                      <p>SLA Target: <span className="text-slate-700 dark:text-zinc-300">{t.dueDate}</span></p>
                      <p>Technician: <span className="text-slate-700 dark:text-zinc-300">{t.technicianName || 'Unassigned'}</span></p>
                      <p>Est. Cost: <span className="text-slate-700 dark:text-zinc-300">${t.estimatedCost}</span></p>
                      {t.actualCost !== undefined && <p className="text-emerald-600">Actual Cost: <span className="font-extrabold">${t.actualCost}</span></p>}
                    </div>

                    {t.comments && t.comments.length > 0 && (
                      <div className="mt-2 border-t border-slate-50 pt-2 dark:border-zinc-900/30">
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-1">Last Logged Comment</span>
                        <div className="text-[10.5px] bg-slate-50 dark:bg-zinc-900/40 p-2.5 rounded-lg text-slate-650 italic">
                          "{t.comments[t.comments.length - 1].text}" – <span className="font-extrabold not-italic text-slate-700 dark:text-zinc-400">{t.comments[t.comments.length - 1].user}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8. REQUEST DRAWER VIEW */}
      <RequestDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        assets={assets}
        onRaiseRequest={handleRaiseRequest}
      />

      {/* 9. APPROVAL WORKFLOW DRAWER VIEW */}
      <ApprovalDrawer
        isOpen={isApprovalDrawerOpen}
        onClose={() => {
          setIsApprovalDrawerOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        technicians={technicians}
        onUpdateTask={handleUpdateTask}
      />

    </div>
  );
}
