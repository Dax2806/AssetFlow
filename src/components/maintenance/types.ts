import { Asset } from '../../types';

export type MaintenanceStatus = 'Pending' | 'Approved' | 'Technician Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export interface MaintenanceComment {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface MaintenanceTimelineEvent {
  id: string;
  type: 'status_change' | 'comment' | 'assignment' | 'approval' | 'rejection' | 'cost_update' | 'creation';
  label: string;
  text: string;
  user: string;
  timestamp: string;
}

export interface MaintenanceWorkflowTask {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  issueTitle: string;
  description: string;
  status: MaintenanceStatus;
  reportedBy: string;
  reportedDate: string;
  dueDate: string;
  technicianId?: string;
  technicianName?: string;
  approvedBy?: string;
  approvedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  attachments?: { name: string; size: string; type: string; url?: string }[];
  comments: MaintenanceComment[];
  timeline: MaintenanceTimelineEvent[];
  slaHours: number; // e.g. 24, 48, 72
}

export interface Technician {
  id: string;
  name: string;
  avatar: string; // Initials or image path
  specialty: string;
  status: 'Available' | 'Active' | 'On Field' | 'Offline';
  workloadScore: number; // 0-100 percentage
  activeJobs: number;
  assignedTaskIds: string[];
}
