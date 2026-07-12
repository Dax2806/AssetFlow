export type AllocationStatus = 'Active' | 'Overdue' | 'Returned';
export type TransferStatus = 'Requested' | 'Approved' | 'Rejected' | 'Completed';
export type TransferPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type HistoryType = 'Registered' | 'Allocated' | 'Transferred' | 'Returned' | 'Reallocated';

export interface Allocation {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  assetCategory: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  allocatedSince: string;
  expectedReturn: string;
  purpose: string;
  notes?: string;
  status: AllocationStatus;
  healthScore: number;
}

export interface TransferRequest {
  id: string;
  assetId: string;
  assetName: string;
  assetTag: string;
  currentHolderId: string;
  currentHolderName: string;
  currentHolderDept: string;
  requestedById: string;
  requestedByName: string;
  requestedByDept: string;
  reason: string;
  priority: TransferPriority;
  requestedDate: string;
  status: TransferStatus;
}

export interface AllocationHistory {
  id: string;
  assetId: string;
  type: HistoryType;
  date: string;
  description: string;
  user: string;
  details?: string;
}

export interface EmployeeMock {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
}

export interface AssetMock {
  id: string;
  name: string;
  tag: string;
  category: string;
  status: 'available' | 'allocated' | 'reserved' | 'maintenance' | 'lost';
  healthScore: number;
}
