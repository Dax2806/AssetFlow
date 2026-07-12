import { MaintenanceWorkflowTask, Technician } from './types';

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    specialty: 'A/V & Facilities Hardware',
    status: 'Active',
    workloadScore: 65,
    activeJobs: 1,
    assignedTaskIds: ['maint-2']
  },
  {
    id: 'tech-2',
    name: 'Dan Fitzpatrick',
    avatar: 'DF',
    specialty: 'Facilities & Fleet Systems',
    status: 'On Field',
    workloadScore: 85,
    activeJobs: 2,
    assignedTaskIds: ['maint-1', 'maint-3']
  },
  {
    id: 'tech-3',
    name: 'Alex Rivera',
    avatar: 'AR',
    specialty: 'Fleet Management & Vehicles',
    status: 'Active',
    workloadScore: 30,
    activeJobs: 1,
    assignedTaskIds: ['maint-4']
  },
  {
    id: 'tech-4',
    name: 'Marcus Chen',
    avatar: 'MC',
    specialty: 'IT & Infrastructure Hardware',
    status: 'Available',
    workloadScore: 0,
    activeJobs: 0,
    assignedTaskIds: []
  }
];

export const INITIAL_WORKFLOW_TASKS: MaintenanceWorkflowTask[] = [
  {
    id: 'maint-1',
    assetId: '5',
    assetName: 'Tesla Model 3 Long Range',
    assetTag: 'AF-802',
    category: 'Vehicles',
    priority: 'High',
    issueTitle: 'Tire Rotation & Battery Health Check',
    description: 'Routine 15k-mile inspection, dual-motor tire rotation, and full traction battery health diagnostic check.',
    status: 'In Progress',
    reportedBy: 'Sarah Jenkins',
    reportedDate: '2026-07-10',
    dueDate: '2026-07-12',
    technicianId: 'tech-2',
    technicianName: 'Dan Fitzpatrick',
    approvedBy: 'Marcus Chen',
    approvedDate: '2026-07-11',
    estimatedCost: 350,
    slaHours: 48,
    attachments: [
      { name: 'tire_inspection_specs.pdf', size: '1.4 MB', type: 'application/pdf' },
      { name: 'battery_log_710.csv', size: '420 KB', type: 'text/csv' }
    ],
    comments: [
      {
        id: 'c-1',
        user: 'Dan Fitzpatrick',
        avatar: 'DF',
        text: 'Treads are slightly worn on the rear outer edges. Recommend checking alignment as well.',
        timestamp: '2026-07-11T14:30:00-07:00'
      }
    ],
    timeline: [
      {
        id: 't-1',
        type: 'creation',
        label: 'Request Raised',
        text: 'Maintenance request created by Sarah Jenkins',
        user: 'Sarah Jenkins',
        timestamp: '2026-07-10T09:15:00-07:00'
      },
      {
        id: 't-2',
        type: 'approval',
        label: 'Request Approved',
        text: 'Approved for repair by Marcus Chen with estimated budget of $350',
        user: 'Marcus Chen',
        timestamp: '2026-07-11T08:30:00-07:00'
      },
      {
        id: 't-3',
        type: 'assignment',
        label: 'Technician Assigned',
        text: 'Assigned to Dan Fitzpatrick',
        user: 'Marcus Chen',
        timestamp: '2026-07-11T08:35:00-07:00'
      },
      {
        id: 't-4',
        type: 'status_change',
        label: 'Moved to In Progress',
        text: 'Work initiated at Service Center - South',
        user: 'Dan Fitzpatrick',
        timestamp: '2026-07-11T10:00:00-07:00'
      }
    ]
  },
  {
    id: 'maint-2',
    assetId: '4',
    assetName: 'Boardroom A Conference System',
    assetTag: 'AF-501',
    category: 'Facilities',
    priority: 'Critical',
    issueTitle: 'Audio Distortion & VC Crackle',
    description: 'Cracking audio reported on both the primary soundbar and auxiliary table microphones during executive Zoom sessions. Overlaps with video lag.',
    status: 'Pending',
    reportedBy: 'Sarah Jenkins',
    reportedDate: '2026-07-11',
    dueDate: '2026-07-12',
    estimatedCost: 150,
    slaHours: 12,
    attachments: [
      { name: 'boardroom_audio_crackle_recording.m4a', size: '2.8 MB', type: 'audio/mp4' }
    ],
    comments: [
      {
        id: 'c-2',
        user: 'Sarah Jenkins',
        avatar: 'SJ',
        text: 'This is blocking our Q3 Board Meeting on Monday. Need this diagnosed and fixed immediately.',
        timestamp: '2026-07-11T16:20:00-07:00'
      }
    ],
    timeline: [
      {
        id: 't-5',
        type: 'creation',
        label: 'Request Raised',
        text: 'Critical request raised by Sarah Jenkins',
        user: 'Sarah Jenkins',
        timestamp: '2026-07-11T16:15:00-07:00'
      }
    ]
  },
  {
    id: 'maint-3',
    assetId: '9',
    assetName: 'Xerox VersaLink C405',
    assetTag: 'AF-401',
    category: 'Office Equipment',
    priority: 'Low',
    issueTitle: 'Fuser Roller Cleaning',
    description: 'Paper feeding makes squeaking noise, and minor toner lines are visible on black & white printouts. Routine cleaning and toner cartridge swap requested.',
    status: 'Approved',
    reportedBy: 'Emma Watson',
    reportedDate: '2026-07-08',
    dueDate: '2026-07-15',
    approvedBy: 'Om Patel',
    approvedDate: '2026-07-09',
    estimatedCost: 65,
    slaHours: 168,
    attachments: [],
    comments: [],
    timeline: [
      {
        id: 't-6',
        type: 'creation',
        label: 'Request Raised',
        text: 'Maintenance request created by Emma Watson',
        user: 'Emma Watson',
        timestamp: '2026-07-08T11:00:00-07:00'
      },
      {
        id: 't-7',
        type: 'approval',
        label: 'Request Approved',
        text: 'Approved by Om Patel',
        user: 'Om Patel',
        timestamp: '2026-07-09T09:30:00-07:00'
      }
    ]
  },
  {
    id: 'maint-4',
    assetId: '1',
    assetName: 'MacBook Pro 16" M3 Max',
    assetTag: 'AF-101',
    category: 'IT Hardware',
    priority: 'Medium',
    issueTitle: 'Sticky Spacebar & Keyboard Service',
    description: 'Spacebar does not rebound properly after being pressed, causing double spaces or missed spaces. Needs compressed air cleaning or switch membrane replacement.',
    status: 'Technician Assigned',
    reportedBy: 'Sarah Jenkins',
    reportedDate: '2026-07-09',
    dueDate: '2026-07-13',
    technicianId: 'tech-1',
    technicianName: 'Sarah Jenkins',
    approvedBy: 'Elena Rostova',
    approvedDate: '2026-07-10',
    estimatedCost: 120,
    slaHours: 72,
    attachments: [],
    comments: [
      {
        id: 'c-3',
        user: 'Sarah Jenkins',
        avatar: 'SJ',
        text: 'I will take this unit to the tech bench tomorrow morning to run diagnostics.',
        timestamp: '2026-07-10T17:45:00-07:00'
      }
    ],
    timeline: [
      {
        id: 't-8',
        type: 'creation',
        label: 'Request Raised',
        text: 'Maintenance request created by Sarah Jenkins',
        user: 'Sarah Jenkins',
        timestamp: '2026-07-09T14:00:00-07:00'
      },
      {
        id: 't-9',
        type: 'approval',
        label: 'Request Approved',
        text: 'Approved by Elena Rostova',
        user: 'Elena Rostova',
        timestamp: '2026-07-10T10:15:00-07:00'
      },
      {
        id: 't-10',
        type: 'assignment',
        label: 'Technician Assigned',
        text: 'Assigned to Sarah Jenkins',
        user: 'Elena Rostova',
        timestamp: '2026-07-10T10:20:00-07:00'
      }
    ]
  },
  {
    id: 'maint-5',
    assetId: '3',
    assetName: 'Dell UltraSharp 40" Curved',
    assetTag: 'AF-201',
    category: 'IT Hardware',
    priority: 'Medium',
    issueTitle: 'Display Flickering over Thunderbolt',
    description: 'Display occasionally flickers black for 2-3 seconds when connected via Thunderbolt 4. Testing with alternate cables is needed.',
    status: 'Resolved',
    reportedBy: 'Sarah Jenkins',
    reportedDate: '2026-07-06',
    dueDate: '2026-07-09',
    technicianId: 'tech-1',
    technicianName: 'Sarah Jenkins',
    approvedBy: 'Marcus Chen',
    approvedDate: '2026-07-06',
    estimatedCost: 80,
    actualCost: 75,
    slaHours: 72,
    attachments: [],
    comments: [
      {
        id: 'c-4',
        user: 'Sarah Jenkins',
        avatar: 'SJ',
        text: 'Replaced Thunderbolt 4 cable with a high-bandwidth active cable. Flicker resolved completely in continuous 48-hour testing.',
        timestamp: '2026-07-08T15:30:00-07:00'
      }
    ],
    timeline: [
      {
        id: 't-11',
        type: 'creation',
        label: 'Request Raised',
        text: 'Request created by Sarah Jenkins',
        user: 'Sarah Jenkins',
        timestamp: '2026-07-06T10:00:00-07:00'
      },
      {
        id: 't-12',
        type: 'approval',
        label: 'Request Approved',
        text: 'Approved by Marcus Chen',
        user: 'Marcus Chen',
        timestamp: '2026-07-06T11:45:00-07:00'
      },
      {
        id: 't-13',
        type: 'assignment',
        label: 'Technician Assigned',
        text: 'Assigned to Sarah Jenkins',
        user: 'Marcus Chen',
        timestamp: '2026-07-06T11:50:00-07:00'
      },
      {
        id: 't-14',
        type: 'status_change',
        label: 'Moved to In Progress',
        text: 'Work initiated',
        user: 'Sarah Jenkins',
        timestamp: '2026-07-07T09:00:00-07:00'
      },
      {
        id: 't-15',
        type: 'status_change',
        label: 'Request Resolved',
        text: 'Repair finished and signed off. Swapped active TB4 cables.',
        user: 'Sarah Jenkins',
        timestamp: '2026-07-08T15:35:00-07:00'
      }
    ]
  }
];
