import { Asset, Activity, MaintenanceTask, Booking, SystemNotification, UtilizationDataPoint } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3 Max',
    tag: 'AF-101',
    category: 'IT Hardware',
    status: 'allocated',
    location: 'HQ - 4th Floor',
    assignedTo: 'Sarah Jenkins',
    value: 3499,
    purchaseDate: '2025-11-12'
  },
  {
    id: '2',
    name: 'MacBook Pro 14" M3 Pro',
    tag: 'AF-102',
    category: 'IT Hardware',
    status: 'allocated',
    location: 'Remote - US East',
    assignedTo: 'Rahul Mehta',
    value: 1999,
    purchaseDate: '2026-01-15'
  },
  {
    id: '3',
    name: 'Dell UltraSharp 40" Curved',
    tag: 'AF-201',
    category: 'IT Hardware',
    status: 'available',
    location: 'HQ - 3rd Floor',
    value: 1499,
    purchaseDate: '2025-08-20'
  },
  {
    id: '4',
    name: 'Boardroom A Conference System',
    tag: 'AF-501',
    category: 'Facilities',
    status: 'reserved',
    location: 'HQ - Room 4A',
    value: 8500,
    purchaseDate: '2024-05-10'
  },
  {
    id: '5',
    name: 'Tesla Model 3 Long Range',
    tag: 'AF-802',
    category: 'Vehicles',
    status: 'maintenance',
    location: 'Service Center - South',
    value: 47000,
    purchaseDate: '2024-10-01'
  },
  {
    id: '6',
    name: 'iPad Pro 12.9" (Cellular)',
    tag: 'AF-109',
    category: 'IT Hardware',
    status: 'available',
    location: 'HQ - IT Locker 4',
    value: 1099,
    purchaseDate: '2026-03-04'
  },
  {
    id: '7',
    name: 'Focus Pod Room 2B',
    tag: 'AF-512',
    category: 'Facilities',
    status: 'available',
    location: 'HQ - 2nd Floor',
    value: 6200,
    purchaseDate: '2025-02-18'
  },
  {
    id: '8',
    name: 'ThinkPad X1 Carbon Gen 11',
    tag: 'AF-103',
    category: 'IT Hardware',
    status: 'lost',
    location: 'Transit - Airport',
    assignedTo: 'David Miller',
    value: 1849,
    purchaseDate: '2025-09-30'
  },
  {
    id: '9',
    name: 'Xerox VersaLink C405',
    tag: 'AF-401',
    category: 'Office Equipment',
    status: 'allocated',
    location: 'HQ - Reception Desk',
    assignedTo: 'Emma Watson',
    value: 899,
    purchaseDate: '2023-11-04'
  },
  {
    id: '10',
    name: 'Herman Miller Aeron Chair (Size B)',
    tag: 'AF-420',
    category: 'Office Equipment',
    status: 'disposed',
    location: 'Scrap Facility',
    value: 1250,
    purchaseDate: '2020-04-12'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    assetId: '2',
    assetName: 'MacBook Pro 14" M3 Pro',
    assetTag: 'AF-102',
    type: 'allocation',
    description: 'Laptop AF-102 allocated to Rahul Mehta',
    timestamp: '2026-07-11T10:45:00-07:00',
    user: { name: 'Elena Rostova', email: 'elena.r@assetflow.com' }
  },
  {
    id: 'act-2',
    assetId: '4',
    assetName: 'Boardroom A Conference System',
    assetTag: 'AF-501',
    type: 'booking',
    description: 'Meeting Room Boardroom A booked for Board Review',
    timestamp: '2026-07-11T09:15:00-07:00',
    user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
  },
  {
    id: 'act-3',
    assetId: '5',
    assetName: 'Tesla Model 3 Long Range',
    assetTag: 'AF-802',
    type: 'maintenance',
    description: 'Maintenance approved for Tesla Model 3: 15k-mile inspection',
    timestamp: '2026-07-11T08:30:00-07:00',
    user: { name: 'Marcus Chen', email: 'marcus.c@assetflow.com' }
  },
  {
    id: 'act-4',
    type: 'audit',
    description: 'Quarterly hardware audit completed for Dublin HQ office',
    timestamp: '2026-07-10T16:00:00-07:00',
    user: { name: 'Elena Rostova', email: 'elena.r@assetflow.com' }
  },
  {
    id: 'act-5',
    type: 'transfer',
    description: 'Transfer request created: MacBook Pro 16" (AF-105) Dublin to London',
    timestamp: '2026-07-10T11:20:00-07:00',
    user: { name: 'Liam Hughes', email: 'liam.h@assetflow.com' }
  },
  {
    id: 'act-6',
    assetId: '6',
    assetName: 'iPad Pro 12.9" (Cellular)',
    assetTag: 'AF-109',
    type: 'registration',
    description: 'Asset registered: iPad Pro (AF-109)',
    timestamp: '2026-07-09T14:15:00-07:00',
    user: { name: 'Om Patel', email: 'om.patel@assetflow.com' }
  }
];

export const INITIAL_MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'maint-1',
    assetName: 'Tesla Model 3 Long Range',
    assetTag: 'AF-802',
    priority: 'High',
    dueDate: '2026-07-12',
    technician: 'Dan Fitzpatrick',
    status: 'In Progress',
    description: '15k-mile inspection & tire rotation.'
  },
  {
    id: 'maint-2',
    assetName: 'Boardroom A Conference System',
    assetTag: 'AF-501',
    priority: 'Critical',
    dueDate: '2026-07-11',
    technician: 'Sarah Jenkins',
    status: 'Pending',
    description: 'Audio cracking issue reported during VC call.'
  },
  {
    id: 'maint-3',
    assetName: 'Xerox VersaLink C405',
    assetTag: 'AF-401',
    priority: 'Low',
    dueDate: '2026-07-18',
    technician: 'Dan Fitzpatrick',
    status: 'Pending',
    description: 'Routine roller cleaning and toner reload.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    resourceName: 'Boardroom A',
    resourceType: 'Room',
    bookedBy: 'Sarah Jenkins',
    userEmail: 'sarah.j@assetflow.com',
    startTime: '2026-07-12T10:00:00-07:00',
    endTime: '2026-07-12T12:00:00-07:00',
    status: 'Confirmed'
  },
  {
    id: 'book-2',
    resourceName: 'Tesla Model Y',
    resourceType: 'Vehicle',
    bookedBy: 'Alex Rivera',
    userEmail: 'alex.r@assetflow.com',
    startTime: '2026-07-12T13:30:00-07:00',
    endTime: '2026-07-12T18:00:00-07:00',
    status: 'Confirmed'
  },
  {
    id: 'book-3',
    resourceName: 'Focus Pod Room 2B',
    resourceType: 'Room',
    bookedBy: 'Chen Wei',
    userEmail: 'chen.w@assetflow.com',
    startTime: '2026-07-11T14:00:00-07:00',
    endTime: '2026-07-11T16:00:00-07:00',
    status: 'In Progress'
  },
  {
    id: 'book-4',
    resourceName: 'Podcast Studio',
    resourceType: 'Room',
    bookedBy: 'Maya Lin',
    userEmail: 'maya.l@assetflow.com',
    startTime: '2026-07-13T09:00:00-07:00',
    endTime: '2026-07-13T11:30:00-07:00',
    status: 'Confirmed'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Transfer Approved',
    message: 'Transfer of MacBook Pro (AF-105) from Dublin to London has been approved.',
    type: 'success',
    timestamp: '10m ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Booking Confirmed',
    message: 'Your reservation for Boardroom A on July 12 is successfully confirmed.',
    type: 'info',
    timestamp: '45m ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Maintenance Completed',
    message: 'Server Rack #4 cooling system repair has been signed off as completed.',
    type: 'success',
    timestamp: '2h ago',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Overdue Return Alert',
    message: 'DJI Mavic Drone (AF-043) is overdue by 2 days from borrower Dan Fitzpatrick.',
    type: 'alert',
    timestamp: '1d ago',
    read: false,
    actionable: true,
    actionType: 'maintenance_signoff',
    actionData: { assetTag: 'AF-043', borrower: 'Dan Fitzpatrick' }
  }
];

export const HISTORICAL_UTILIZATION: UtilizationDataPoint[] = [
  { date: 'Jul 05', rate: 78.4, allocatedCount: 65, maintenanceCount: 4 },
  { date: 'Jul 06', rate: 79.2, allocatedCount: 66, maintenanceCount: 4 },
  { date: 'Jul 07', rate: 81.0, allocatedCount: 68, maintenanceCount: 3 },
  { date: 'Jul 08', rate: 80.5, allocatedCount: 68, maintenanceCount: 5 },
  { date: 'Jul 09', rate: 82.1, allocatedCount: 70, maintenanceCount: 5 },
  { date: 'Jul 10', rate: 84.8, allocatedCount: 72, maintenanceCount: 2 },
  { date: 'Jul 11', rate: 85.5, allocatedCount: 73, maintenanceCount: 3 }
];
