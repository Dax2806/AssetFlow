import { Department, Employee, AssetCategory, OrgInsight } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    headName: 'Sarah Jenkins',
    headId: 'emp-4',
    parentName: 'None',
    employeeCount: 48,
    assetCount: 142,
    status: 'Active',
    description: 'Core software engineering, platform infrastructure, and product development team.',
    notes: 'Handles 75% of overall hardware asset allocations including high-performance laptop fleets.',
    createdAt: '2024-01-15',
  },
  {
    id: 'dept-2',
    name: 'Marketing',
    headName: 'Vacant',
    parentName: 'None',
    employeeCount: 18,
    assetCount: 12,
    status: 'Active',
    description: 'Brand strategy, global campaigns, creative design, and growth operations.',
    notes: 'Requires design-tier workstations and color-accurate peripheral hardware.',
    createdAt: '2024-02-01',
  },
  {
    id: 'dept-3',
    name: 'Finance',
    headName: 'Rahul Patel',
    headId: 'emp-1',
    parentName: 'None',
    employeeCount: 12,
    assetCount: 8,
    status: 'Active',
    description: 'Corporate accounting, financial planning, analysis, and capital allocations.',
    notes: 'Accesses sensitive records; assets require encrypted security configurations.',
    createdAt: '2024-01-10',
  },
  {
    id: 'dept-4',
    name: 'Operations',
    headName: 'Marcus Liu',
    headId: 'emp-5',
    parentName: 'General Administration',
    employeeCount: 30,
    assetCount: 56,
    status: 'Active',
    description: 'Site operations, logistics, workspace facilities, and hardware fleet transit.',
    notes: 'Monitors vehicles, storage vaults, and heavy equipment items.',
    createdAt: '2024-03-12',
  },
  {
    id: 'dept-5',
    name: 'HR',
    headName: 'Om Patel',
    headId: 'emp-3',
    parentName: 'General Administration',
    employeeCount: 8,
    assetCount: 5,
    status: 'Active',
    description: 'People operations, recruitment, talent strategy, and workspace culture.',
    notes: 'Schedules physical office equipment and employee onboarding kits.',
    createdAt: '2024-01-20',
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Rahul Patel',
    email: 'rahul.patel@assetflow.com',
    departmentName: 'Finance',
    departmentId: 'dept-3',
    role: 'Department Head',
    status: 'Active',
    avatar: 'RP',
    lastLogin: '2 hours ago',
    employeeId: 'EMP-001',
    phone: '+1 (555) 019-2834',
    notes: 'Responsible for fiscal approvals and audit operations.',
  },
  {
    id: 'emp-2',
    name: 'Jash Borad',
    email: 'jash.borad@assetflow.com',
    departmentName: 'Engineering',
    departmentId: 'dept-1',
    role: 'Asset Manager',
    status: 'Active',
    avatar: 'JB',
    lastLogin: 'Just now',
    employeeId: 'EMP-002',
    phone: '+1 (555) 014-9831',
    notes: 'Manages core hardware inventory cycles for engineering hubs.',
  },
  {
    id: 'emp-3',
    name: 'Om Patel',
    email: 'om.patel@assetflow.com',
    departmentName: 'HR',
    departmentId: 'dept-5',
    role: 'Admin',
    status: 'Active',
    avatar: 'OP',
    lastLogin: 'Active Now',
    employeeId: 'EMP-003',
    phone: '+1 (555) 012-3456',
    notes: 'System Administrator with full master data access.',
  },
  {
    id: 'emp-4',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@assetflow.com',
    departmentName: 'Engineering',
    departmentId: 'dept-1',
    role: 'Department Head',
    status: 'Active',
    avatar: 'SJ',
    lastLogin: '1 day ago',
    employeeId: 'EMP-004',
    phone: '+1 (555) 017-4821',
    notes: 'Director of Systems Engineering and architecture.',
  },
  {
    id: 'emp-5',
    name: 'Marcus Liu',
    email: 'marcus.liu@assetflow.com',
    departmentName: 'Operations',
    departmentId: 'dept-4',
    role: 'Department Head',
    status: 'Active',
    avatar: 'ML',
    lastLogin: '3 days ago',
    employeeId: 'EMP-005',
    phone: '+1 (555) 015-2948',
    notes: 'Oversees site logistics, vehicle fleet, and physical facilities.',
  },
  {
    id: 'emp-6',
    name: 'Emily Chen',
    email: 'emily.chen@assetflow.com',
    departmentName: 'Marketing',
    departmentId: 'dept-2',
    role: 'Employee',
    status: 'Active',
    avatar: 'EC',
    lastLogin: '5 hours ago',
    employeeId: 'EMP-006',
    phone: '+1 (555) 013-1122',
    notes: 'Creative designer, utilizes high-performance hardware.',
  },
  {
    id: 'emp-7',
    name: 'David Kim',
    email: 'david.kim@assetflow.com',
    departmentName: 'Engineering',
    departmentId: 'dept-1',
    role: 'Employee',
    status: 'Inactive',
    avatar: 'DK',
    lastLogin: '2 weeks ago',
    employeeId: 'EMP-007',
    phone: '+1 (555) 018-7744',
    notes: 'External contractor, credentials currently suspended.',
  }
];

export const INITIAL_CATEGORIES: AssetCategory[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    icon: 'Laptop',
    description: 'Computing hardware, monitors, laptops, mobile devices, and servers.',
    assetCount: 124,
    warrantyEnabled: true,
    defaultWarranty: 36,
    status: 'Active',
    customFields: [
      { name: 'RAM (GB)', type: 'number', required: true },
      { name: 'Processor', type: 'text', required: true },
      { name: 'Storage Capacity', type: 'text', required: false }
    ]
  },
  {
    id: 'cat-2',
    name: 'Furniture',
    icon: 'Armchair',
    description: 'Office desks, ergonomic chairs, conference tables, and modular storage units.',
    assetCount: 48,
    warrantyEnabled: false,
    defaultWarranty: 0,
    status: 'Active',
    customFields: [
      { name: 'Material', type: 'text', required: false },
      { name: 'Dimensions', type: 'text', required: false }
    ]
  },
  {
    id: 'cat-3',
    name: 'Vehicles',
    icon: 'Car',
    description: 'Corporate fleet cars, electric shuttles, delivery vans, and logistics haulers.',
    assetCount: 14,
    warrantyEnabled: true,
    defaultWarranty: 60,
    status: 'Active',
    customFields: [
      { name: 'Engine / VIN', type: 'text', required: true },
      { name: 'Fuel Type', type: 'text', required: true }
    ]
  },
  {
    id: 'cat-4',
    name: 'Networking',
    icon: 'Network',
    description: 'Enterprise switches, routers, firewalls, and server rack accessories.',
    assetCount: 32,
    warrantyEnabled: true,
    defaultWarranty: 24,
    status: 'Active',
    customFields: [
      { name: 'Port Count', type: 'number', required: false },
      { name: 'IP Address Pool', type: 'text', required: false }
    ]
  },
  {
    id: 'cat-5',
    name: 'Office Equipment',
    icon: 'Printer',
    description: 'Scanners, enterprise printers, physical security locks, and projection gear.',
    assetCount: 18,
    warrantyEnabled: true,
    defaultWarranty: 12,
    status: 'Inactive',
    customFields: [
      { name: 'Power Rating (W)', type: 'number', required: false }
    ]
  }
];

export const INSIGHTS: OrgInsight[] = [
  { id: '1', text: '💡 Marketing currently has no Department Head.' },
  { id: '2', text: '💡 IT owns 42% of all assets.' },
  { id: '3', text: '💡 Electronics is the largest asset category.' },
  { id: '4', text: '💡 Sarah Jenkins manages the largest division by asset count.' }
];
