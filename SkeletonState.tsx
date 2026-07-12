import { Allocation, TransferRequest, AllocationHistory, EmployeeMock, AssetMock } from './types';

export const MOCK_EMPLOYEES: EmployeeMock[] = [
  { id: 'emp-1', name: 'Rahul Patel', email: 'rahul.patel@assetflow.com', department: 'Finance', avatar: 'RP' },
  { id: 'emp-2', name: 'Sarah Jenkins', email: 'sarah.jenkins@assetflow.com', department: 'Engineering', avatar: 'SJ' },
  { id: 'emp-3', name: 'Marcus Liu', email: 'marcus.liu@assetflow.com', department: 'Operations', avatar: 'ML' },
  { id: 'emp-4', name: 'Elena Rostova', email: 'elena.rostova@assetflow.com', department: 'Marketing', avatar: 'ER' },
  { id: 'emp-5', name: 'Amara Diop', email: 'amara.diop@assetflow.com', department: 'Engineering', avatar: 'AD' },
  { id: 'emp-6', name: 'Jordan Vance', email: 'jordan.vance@assetflow.com', department: 'Finance', avatar: 'JV' },
  { id: 'emp-7', name: 'Chloe Chen', email: 'chloe.chen@assetflow.com', department: 'Marketing', avatar: 'CC' },
  { id: 'emp-8', name: 'David Miller', email: 'david.miller@assetflow.com', department: 'Operations', avatar: 'DM' },
  { id: 'emp-9', name: 'Tariq Al-Mansoor', email: 'tariq.a@assetflow.com', department: 'Engineering', avatar: 'TA' }
];

export const MOCK_ASSETS: AssetMock[] = [
  { id: 'as-101', name: 'MacBook Pro 16" M3 Max', tag: 'AF-0101', category: 'IT Hardware', status: 'allocated', healthScore: 98 },
  { id: 'as-102', name: 'Dell UltraSharp 38" Curved Monitor', tag: 'AF-0102', category: 'IT Hardware', status: 'allocated', healthScore: 95 },
  { id: 'as-103', name: 'iPad Pro 12.9" (Cellular)', tag: 'AF-0103', category: 'IT Hardware', status: 'available', healthScore: 92 },
  { id: 'as-104', name: 'ThinkPad P1 Gen 6 Workstation', tag: 'AF-0104', category: 'IT Hardware', status: 'allocated', healthScore: 89 },
  { id: 'as-105', name: 'Sony Alpha 7R V Camera kit', tag: 'AF-0105', category: 'Office Equipment', status: 'available', healthScore: 96 },
  { id: 'as-106', name: 'iPhone 15 Pro Max 512GB', tag: 'AF-0106', category: 'IT Hardware', status: 'allocated', healthScore: 87 },
  { id: 'as-107', name: 'Logitech MX Master 3S + Keys Combo', tag: 'AF-0107', category: 'IT Hardware', status: 'available', healthScore: 94 },
  { id: 'as-108', name: 'Tesla Model Y Long Range', tag: 'AF-0108', category: 'Vehicles', status: 'allocated', healthScore: 91 },
  { id: 'as-109', name: 'Wacom Cintiq Pro 27 Creative Pen', tag: 'AF-0109', category: 'Office Equipment', status: 'available', healthScore: 100 },
  { id: 'as-110', name: 'DJI Mavic 3 Pro Cine Premium Combo', tag: 'AF-0110', category: 'Office Equipment', status: 'allocated', healthScore: 82 }
];

export const INITIAL_ALLOCATIONS: Allocation[] = [
  {
    id: 'alloc-1',
    assetId: 'as-101',
    assetName: 'MacBook Pro 16" M3 Max',
    assetTag: 'AF-0101',
    assetCategory: 'IT Hardware',
    employeeId: 'emp-2',
    employeeName: 'Sarah Jenkins',
    departmentName: 'Engineering',
    allocatedSince: '2026-05-15',
    expectedReturn: '2026-11-15',
    purpose: 'Primary development workstation for senior engineering leadership.',
    notes: 'Configured with corporate VPN, security agents, and dev tooling.',
    status: 'Active',
    healthScore: 98
  },
  {
    id: 'alloc-2',
    assetId: 'as-104',
    assetName: 'ThinkPad P1 Gen 6 Workstation',
    assetTag: 'AF-0104',
    assetCategory: 'IT Hardware',
    employeeId: 'emp-1',
    employeeName: 'Rahul Patel',
    departmentName: 'Finance',
    allocatedSince: '2026-06-12',
    expectedReturn: '2026-07-10', // Overdue based on current time July 12, 2026
    purpose: 'Data crunching & financial modeling for corporate planning.',
    notes: 'Requires daily encrypted backups due to sensitive financial registers.',
    status: 'Overdue',
    healthScore: 89
  },
  {
    id: 'alloc-3',
    assetId: 'as-106',
    assetName: 'iPhone 15 Pro Max 512GB',
    assetTag: 'AF-0106',
    assetCategory: 'IT Hardware',
    employeeId: 'emp-4',
    employeeName: 'Elena Rostova',
    departmentName: 'Marketing',
    allocatedSince: '2026-04-10',
    expectedReturn: '2026-07-01', // Overdue
    purpose: 'Social media management, mobile testing, and high-fidelity video capture.',
    notes: 'Protective casing must remain attached at all times.',
    status: 'Overdue',
    healthScore: 87
  },
  {
    id: 'alloc-4',
    assetId: 'as-108',
    assetName: 'Tesla Model Y Long Range',
    assetTag: 'AF-0108',
    assetCategory: 'Vehicles',
    employeeId: 'emp-3',
    employeeName: 'Marcus Liu',
    departmentName: 'Operations',
    allocatedSince: '2026-01-15',
    expectedReturn: '2027-01-15',
    purpose: 'Client visits, inter-site logistics coordination, and administrative dispatch.',
    notes: 'Requires weekly maintenance logs. Fleet charge card authorized.',
    status: 'Active',
    healthScore: 91
  },
  {
    id: 'alloc-5',
    assetId: 'as-110',
    assetName: 'DJI Mavic 3 Pro Cine Premium Combo',
    assetTag: 'AF-0110',
    assetCategory: 'Office Equipment',
    employeeId: 'emp-7',
    employeeName: 'Chloe Chen',
    departmentName: 'Marketing',
    allocatedSince: '2026-06-25',
    expectedReturn: '2026-07-05', // Overdue
    purpose: 'Aerial video shoot for brand promotional campaign.',
    notes: 'Drone operator license on file.',
    status: 'Overdue',
    healthScore: 82
  },
  {
    id: 'alloc-6',
    assetId: 'as-102',
    assetName: 'Dell UltraSharp 38" Curved Monitor',
    assetTag: 'AF-0102',
    assetCategory: 'IT Hardware',
    employeeId: 'emp-5',
    employeeName: 'Amara Diop',
    departmentName: 'Engineering',
    allocatedSince: '2026-02-10',
    expectedReturn: '2026-10-10',
    purpose: 'High-density terminal view setup for systems architecture planning.',
    status: 'Active',
    healthScore: 95
  }
];

export const INITIAL_TRANSFERS: TransferRequest[] = [
  {
    id: 'tx-1',
    assetId: 'as-104',
    assetName: 'ThinkPad P1 Gen 6 Workstation',
    assetTag: 'AF-0104',
    currentHolderId: 'emp-1',
    currentHolderName: 'Rahul Patel',
    currentHolderDept: 'Finance',
    requestedById: 'emp-5',
    requestedByName: 'Amara Diop',
    requestedByDept: 'Engineering',
    reason: 'Need high-perf GPU capabilities to test local ML models in the engineering sandbox.',
    priority: 'High',
    requestedDate: '2026-07-11',
    status: 'Requested'
  },
  {
    id: 'tx-2',
    assetId: 'as-101',
    assetName: 'MacBook Pro 16" M3 Max',
    assetTag: 'AF-0101',
    currentHolderId: 'emp-2',
    currentHolderName: 'Sarah Jenkins',
    currentHolderDept: 'Engineering',
    requestedById: 'emp-4',
    requestedByName: 'Elena Rostova',
    requestedByDept: 'Marketing',
    reason: 'Need high-speed render hardware to process 8K product showcase videos.',
    priority: 'Medium',
    requestedDate: '2026-07-09',
    status: 'Approved'
  },
  {
    id: 'tx-3',
    assetId: 'as-108',
    assetName: 'Tesla Model Y Long Range',
    assetTag: 'AF-0108',
    currentHolderId: 'emp-3',
    currentHolderName: 'Marcus Liu',
    currentHolderDept: 'Operations',
    requestedById: 'emp-6',
    requestedByName: 'Jordan Vance',
    requestedByDept: 'Finance',
    reason: 'Inter-office transport requirement for visiting external capital audit partners.',
    priority: 'Low',
    requestedDate: '2026-07-08',
    status: 'Rejected'
  },
  {
    id: 'tx-4',
    assetId: 'as-103',
    assetName: 'iPad Pro 12.9" (Cellular)',
    assetTag: 'AF-0103',
    currentHolderId: 'emp-8',
    currentHolderName: 'David Miller',
    currentHolderDept: 'Operations',
    requestedById: 'emp-7',
    requestedByName: 'Chloe Chen',
    requestedByDept: 'Marketing',
    reason: 'On-site user experience research and live client feedback gathering.',
    priority: 'Medium',
    requestedDate: '2026-07-05',
    status: 'Completed'
  }
];

export const INITIAL_HISTORIES: AllocationHistory[] = [
  {
    id: 'hist-1',
    assetId: 'as-101',
    type: 'Registered',
    date: '2025-12-01',
    description: 'Hardware registered in AssetFlow ERP registry.',
    user: 'Om Patel',
    details: 'Received from supplier (CDW Direct LLC). Serial: Apple-MBP-90924.'
  },
  {
    id: 'hist-2',
    assetId: 'as-101',
    type: 'Allocated',
    date: '2026-05-15',
    description: 'Initial hardware allocation created.',
    user: 'Om Patel',
    details: 'Allocated to Sarah Jenkins (Engineering).'
  },
  {
    id: 'hist-3',
    assetId: 'as-104',
    type: 'Registered',
    date: '2026-01-10',
    description: 'Asset registered in system.',
    user: 'Om Patel'
  },
  {
    id: 'hist-4',
    assetId: 'as-104',
    type: 'Allocated',
    date: '2026-06-12',
    description: 'Allocated to Rahul Patel.',
    user: 'Om Patel',
    details: 'Project assignment for Q3 Planning.'
  },
  {
    id: 'hist-5',
    assetId: 'as-103',
    type: 'Registered',
    date: '2026-02-15',
    description: 'Device registered in IT Inventory.',
    user: 'Om Patel'
  },
  {
    id: 'hist-6',
    assetId: 'as-103',
    type: 'Allocated',
    date: '2026-03-01',
    description: 'Allocated to David Miller.',
    user: 'Om Patel'
  },
  {
    id: 'hist-7',
    assetId: 'as-103',
    type: 'Transferred',
    date: '2026-07-05',
    description: 'Transferred from David Miller to Chloe Chen.',
    user: 'Om Patel',
    details: 'Approved transfer request TX-4.'
  },
  {
    id: 'hist-8',
    assetId: 'as-103',
    type: 'Returned',
    date: '2026-07-10',
    description: 'Returned to general inventory pool.',
    user: 'Om Patel',
    details: 'Device returned in pristine condition.'
  }
];
