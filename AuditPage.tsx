export type AssetStatus = 'available' | 'allocated' | 'reserved' | 'maintenance' | 'lost' | 'disposed';
export type AssetCategory = 'IT Hardware' | 'Facilities' | 'Vehicles' | 'Office Equipment';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type BookingStatus = 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Asset {
  id: string;
  name: string;
  tag: string; // e.g. "AF-102"
  category: AssetCategory;
  status: AssetStatus;
  location: string;
  assignedTo?: string;
  value: number;
  purchaseDate: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  purchaseCost?: number;
  supplier?: string;
  warrantyExpiry?: string;
  department?: string;
  condition?: 'New' | 'Good' | 'Fair' | 'Poor';
  bookable?: boolean;
  description?: string;
  attachments?: { name: string; size: string; type: string }[];
  images?: string[];
  healthScore?: number;
  qrCodeUrl?: string;
  specifications?: Record<string, string>;
  timeline?: { status: string; label: string; date: string; description: string; user?: string }[];
  maintenanceHistory?: { id: string; date: string; description: string; cost: number; status: string; technician: string }[];
  auditHistory?: { id: string; date: string; status: 'Passed' | 'Flagged'; auditor: string; notes: string }[];
}

export interface Activity {
  id: string;
  assetId?: string;
  assetName?: string;
  assetTag?: string;
  type: 'allocation' | 'booking' | 'maintenance' | 'audit' | 'transfer' | 'registration';
  description: string;
  timestamp: string; // ISO string
  user: {
    name: string;
    avatar?: string;
    email: string;
  };
}

export interface MaintenanceTask {
  id: string;
  assetName: string;
  assetTag: string;
  priority: PriorityLevel;
  dueDate: string;
  technician: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  description: string;
}

export interface Booking {
  id: string;
  resourceName: string; // e.g., "Boardroom A", "Tesla Model 3"
  resourceType: 'Room' | 'Vehicle' | 'Equipment';
  bookedBy: string;
  userEmail: string;
  userAvatar?: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionType?: 'transfer_approve' | 'booking_confirm' | 'maintenance_signoff';
  actionData?: Record<string, any>;
}

export interface UtilizationDataPoint {
  date: string;
  rate: number; // percentage
  allocatedCount: number;
  maintenanceCount: number;
}
