import { Asset } from '../types';

export const EXTENDED_MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3 Max',
    tag: 'AF-101',
    category: 'IT Hardware',
    status: 'allocated',
    location: 'HQ - 4th Floor',
    assignedTo: 'Sarah Jenkins',
    value: 3499,
    purchaseDate: '2025-11-12',
    serialNumber: 'C02FX5YQ05F9',
    manufacturer: 'Apple Inc.',
    model: 'MacBook Pro 16" (Late 2025)',
    purchaseCost: 3499,
    supplier: 'Apple Enterprise Direct',
    warrantyExpiry: '2028-11-12',
    department: 'Engineering',
    condition: 'New',
    bookable: false,
    description: 'Corporate-issued workstation for senior engineering leadership. Preloaded with specialized compiler toolchains, docker virtualization environments, and security profiles.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-101',
    healthScore: 96,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      RAM: '64GB Unified LPDDR5X',
      Processor: 'Apple M3 Max (16-core CPU, 40-core GPU)',
      Battery: '100-watt-hour Lithium-Polymer',
      OS: 'macOS Sonoma v14.2'
    },
    attachments: [
      { name: 'Apple_Business_Purchase_Order_101.pdf', size: '1.8 MB', type: 'pdf' },
      { name: 'AppleCare_Enterprise_Contract.pdf', size: '940 KB', type: 'pdf' },
      { name: 'Developer_Device_Policy_v4.pdf', size: '1.2 MB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Asset Registered', date: '2025-11-12', description: 'Onboarded into corporate IT registry by sysadmin Om Patel.', user: 'Om Patel' },
      { status: 'Audited', label: 'Hardware Audit Approved', date: '2025-11-15', description: 'Completed physical barcoding & serial verification.', user: 'Elena Rostova' },
      { status: 'Allocated', label: 'Deployed to Sarah Jenkins', date: '2025-11-16', description: 'Provisioned with corporate identity software & VPN credentials.', user: 'Sarah Jenkins' },
      { status: 'Current', label: 'Active - Optimal State', date: '2026-07-11', description: 'Device pinging central MDM server with 98% health index.' }
    ],
    maintenanceHistory: [
      { id: 'm-101', date: '2026-04-12', description: 'Keyboard debris clearing & keycap alignment under AppleCare+.', cost: 0, status: 'Completed', technician: 'Apple Authorized Service' }
    ],
    auditHistory: [
      { id: 'au-101', date: '2026-05-10', status: 'Passed', auditor: 'Om Patel', notes: 'Asset verified on desk. Minimal cosmetic wear.' }
    ]
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
    purchaseDate: '2026-01-15',
    serialNumber: 'C02G20X919AA',
    manufacturer: 'Apple Inc.',
    model: 'MacBook Pro 14" Space Black',
    purchaseCost: 1999,
    supplier: 'Apple Enterprise Direct',
    warrantyExpiry: '2029-01-15',
    department: 'Product & Design',
    condition: 'Good',
    bookable: false,
    description: 'Design consultant notebook provisioned with Adobe Creative Cloud and Figma enterprise licenses. Mobile workstation for remote product design sprints.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-102',
    healthScore: 92,
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      RAM: '36GB Unified',
      Processor: 'Apple M3 Pro (12-core CPU, 18-core GPU)',
      Battery: '72.4-watt-hour Lithium-Polymer',
      OS: 'macOS Sonoma v14.2'
    },
    attachments: [
      { name: 'Design_Hardware_Receipt.pdf', size: '1.1 MB', type: 'pdf' },
      { name: 'AppleCare_Design_Remote.pdf', size: '820 KB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Onboarded to Registry', date: '2026-01-15', description: 'Registered into database & MDM profiles uploaded.', user: 'Om Patel' },
      { status: 'Allocated', label: 'Dispatched to Rahul Mehta', date: '2026-01-18', description: 'Device securely shipped to remote home office via FedEx Priority.', user: 'Rahul Mehta' },
      { status: 'Current', label: 'Active - Remote Deployed', date: '2026-07-11', description: 'Active and healthy.' }
    ],
    maintenanceHistory: [],
    auditHistory: [
      { id: 'au-102', date: '2026-06-15', status: 'Passed', auditor: 'Self-Signed (Remote Portal)', notes: 'Figma MDM confirmation log uploaded successfully.' }
    ]
  },
  {
    id: '3',
    name: 'Dell UltraSharp 40" Curved',
    tag: 'AF-201',
    category: 'IT Hardware',
    status: 'available',
    location: 'HQ - 3rd Floor',
    value: 1499,
    purchaseDate: '2025-08-20',
    serialNumber: 'CN-0D40US-72819-A',
    manufacturer: 'Dell Technologies',
    model: 'U4021QW WUHD Curved Monitor',
    purchaseCost: 1499,
    supplier: 'Dell Premier Partner',
    warrantyExpiry: '2028-08-20',
    department: 'Finance & Analytics',
    condition: 'Good',
    bookable: false,
    description: 'Immersive curved monitor optimized for heavy financial spreadsheet work, database queries, and concurrent app views.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-201',
    healthScore: 88,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      RAM: 'N/A',
      Processor: 'N/A',
      Battery: '90W Power Delivery Hub Integration',
      OS: 'Firmware v1.0.9'
    },
    attachments: [
      { name: 'Dell_UltraSharp_Invoice_Finance.pdf', size: '2.1 MB', type: 'pdf' },
      { name: 'Dell_Warranty_Card_Curved.pdf', size: '450 KB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Registered', date: '2025-08-20', description: 'Registered.' },
      { status: 'Current', label: 'Available in Desk Pool 3B', date: '2026-07-11', description: 'Cleaned and made ready for walk-in desk assignment.' }
    ],
    maintenanceHistory: [],
    auditHistory: []
  },
  {
    id: '4',
    name: 'Boardroom A Conference System',
    tag: 'AF-501',
    category: 'Facilities',
    status: 'reserved',
    location: 'HQ - Room 4A',
    value: 8500,
    purchaseDate: '2024-05-10',
    serialNumber: 'LOGI-RALLY-99882',
    manufacturer: 'Logitech',
    model: 'Logitech Rally Plus Studio System',
    purchaseCost: 8500,
    supplier: 'ElectroMedia AV Integrations',
    warrantyExpiry: '2026-05-10',
    department: 'Operations',
    condition: 'Fair',
    bookable: true,
    description: 'Dual-camera smart conferencing setup including active speaker tracking cameras, dual-subwoofer audio modules, and unified wall-panel controller.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-501',
    healthScore: 74,
    images: [
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      Material: 'Premium Acoustic Mesh, Polycarbonate & Brushed Steel',
      Dimensions: '12" H x 36" W x 4.5" D',
      Weight: '24 lbs'
    },
    attachments: [
      { name: 'AV_Room_Installation_Schematic.pdf', size: '4.8 MB', type: 'pdf' },
      { name: 'Rally_Plus_Maintenance_Log.pdf', size: '1.2 MB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'System Registered', date: '2024-05-10', description: 'Unified meeting solution deployed in Room 4A.', user: 'Marcus Chen' },
      { status: 'Maintenance', label: 'Acoustic Balancing Service', date: '2025-03-22', description: 'Re-calibrated subwoofers and fixed microphone feedback glitch.', user: 'Technician Logan' },
      { status: 'Current', label: 'Reserved for Meeting Schedule', date: '2026-07-11', description: 'Available for scheduling. Next booking 10:00 AM.' }
    ],
    maintenanceHistory: [
      { id: 'm-202', date: '2025-03-22', description: 'Subwoofer replacement & DSP firmware balancing due to mic feedback issues.', cost: 450, status: 'Completed', technician: 'Dan Fitzpatrick' }
    ],
    auditHistory: [
      { id: 'au-202', date: '2026-02-14', status: 'Flagged', auditor: 'Elena Rostova', notes: 'Camera tracking lagging behind speaker movement. Needs driver update.' }
    ]
  },
  {
    id: '5',
    name: 'Tesla Model 3 Long Range',
    tag: 'AF-802',
    category: 'Vehicles',
    status: 'maintenance',
    location: 'Service Center - South',
    value: 47000,
    purchaseDate: '2024-10-01',
    serialNumber: '5YJ3E1EB8LF882910',
    manufacturer: 'Tesla Inc.',
    model: 'Model 3 Dual-Motor AWD',
    purchaseCost: 47000,
    supplier: 'Tesla Fleet Direct Store',
    warrantyExpiry: '2028-10-01',
    department: 'Executive Operations',
    condition: 'Good',
    bookable: true,
    description: 'Electric company fleet vehicle allocated to executives, sales teams, and visitors traveling between regional headquarters.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-802',
    healthScore: 82,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      'Registration Number': 'TX-FLEET-312',
      'Fuel Type': 'Electric (Lithium-Ion AWD Dual-Motor)',
      'Engine Number': 'DUAL-AWD-MTR-98218X',
      'Insurance Policy': 'Liberty Mutual Fleet #LM-9028-A1'
    },
    attachments: [
      { name: 'Tesla_Fleet_Purchase_Agreement.pdf', size: '3.4 MB', type: 'pdf' },
      { name: 'Vehicle_Insurance_Active_Policy.pdf', size: '1.5 MB', type: 'pdf' },
      { name: 'Tesla_Model_3_Manual_EN.pdf', size: '6.2 MB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Fleet Onboarding', date: '2024-10-01', description: 'Added to corporate transport registry.', user: 'Marcus Chen' },
      { status: 'Audited', label: 'Toll-tag and Registration Active', date: '2024-10-05', description: 'License plates attached, toll tracker mounted.', user: 'Dan Fitzpatrick' },
      { status: 'Maintenance', label: '15k-mile inspection initiated', date: '2026-07-11', description: 'Dispatched to service center for battery diagnostic and tier balance.', user: 'Dan Fitzpatrick' },
      { status: 'Current', label: 'Servicing Pending Sign-off', date: '2026-07-11', description: 'In-progress diagnostics.' }
    ],
    maintenanceHistory: [
      { id: 'm-301', date: '2025-06-18', description: 'Slight dent removal in front bumper panel. Completed.', cost: 350, status: 'Completed', technician: 'Tesla Body Shop' },
      { id: 'm-302', date: '2026-01-08', description: 'Cabin air filter replacement & software diagnostic. Passed.', cost: 80, status: 'Completed', technician: 'Tesla Ranger Mobile Unit' }
    ],
    auditHistory: [
      { id: 'au-301', date: '2026-03-30', status: 'Passed', auditor: 'Dan Fitzpatrick', notes: 'Vehicle clean. Odometer reading: 12,450 miles.' }
    ]
  },
  {
    id: '6',
    name: 'iPad Pro 12.9" (Cellular)',
    tag: 'AF-109',
    category: 'IT Hardware',
    status: 'available',
    location: 'HQ - IT Locker 4',
    value: 1099,
    purchaseDate: '2026-03-04',
    serialNumber: 'DLXFF129PROCELL',
    manufacturer: 'Apple Inc.',
    model: 'iPad Pro M2 12.9" 256GB',
    purchaseCost: 1099,
    supplier: 'Apple Enterprise Direct',
    warrantyExpiry: '2029-03-04',
    department: 'Sales & Field Marketing',
    condition: 'New',
    bookable: true,
    description: 'Field marketing asset preloaded with presentation files, smart sales decks, and cell data connection enabled for seamless rural client site pitches.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-109',
    healthScore: 98,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      RAM: '8GB Unified',
      Processor: 'Apple M2 (8-core CPU, 10-core GPU)',
      Battery: '40.88-watt-hour battery',
      OS: 'iPadOS v17.1'
    },
    attachments: [
      { name: 'Cellular_Plan_Activation_Verizon.pdf', size: '540 KB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Registered', date: '2026-03-04', description: 'Registered' },
      { status: 'Current', label: 'Stored in Tech Locker v4', date: '2026-07-11', description: 'Fully charged and wiped for general checkout.' }
    ],
    maintenanceHistory: [],
    auditHistory: []
  },
  {
    id: '7',
    name: 'Focus Pod Room 2B',
    tag: 'AF-512',
    category: 'Facilities',
    status: 'available',
    location: 'HQ - 2nd Floor',
    value: 6200,
    purchaseDate: '2025-02-18',
    serialNumber: 'FOC-POD-2B-9102',
    manufacturer: 'Framery',
    model: 'Framery Q "Meeting Pod"',
    purchaseCost: 6200,
    supplier: 'Acoustic Office Spaces Ltd',
    warrantyExpiry: '2028-02-18',
    department: 'Facilities',
    condition: 'New',
    bookable: true,
    description: 'Sound-isolated acoustic meeting booth featuring automated climate ventilation, task-lighting dimer levels, and dual charging portals.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-512',
    healthScore: 95,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      Material: 'Acoustic Felt, Birch Plywood & Triple Glazed Glass',
      Dimensions: '86" H x 48" W x 48" D',
      Weight: '720 lbs'
    },
    attachments: [
      { name: 'Framery_Q_Warranty_Terms.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Ventilation_Specs_Framery.pdf', size: '620 KB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Installed on Floor 2', date: '2025-02-18', description: 'Assembled by certified Framery technicians.' },
      { status: 'Current', label: 'Ready for booking', date: '2026-07-11', description: 'Air filter checked. Pristine condition.' }
    ],
    maintenanceHistory: [],
    auditHistory: []
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
    purchaseDate: '2025-09-30',
    serialNumber: 'L33-X1C11-99281B',
    manufacturer: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    purchaseCost: 1849,
    supplier: 'Lenovo Commercial Store',
    warrantyExpiry: '2028-09-30',
    department: 'Field Sales',
    condition: 'Fair',
    bookable: false,
    description: 'Corporate traveler laptop reported lost in transit at security checkpoint. MDM remote lock and wipe sequence has been initiated.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AF-103',
    healthScore: 0,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
    ],
    specifications: {
      RAM: '32GB LPDDR5',
      Processor: 'Intel Core i7-1365U vPro',
      Battery: '57-watt-hour Lithium-Ion',
      OS: 'Windows 11 Pro Enterprise'
    },
    attachments: [
      { name: 'Lenovo_Shipment_Invoice.pdf', size: '920 KB', type: 'pdf' }
    ],
    timeline: [
      { status: 'Registered', label: 'Asset Registered', date: '2025-09-30', description: 'Onboarded into registry.' },
      { status: 'Allocated', label: 'Assigned to David Miller', date: '2025-10-02', description: 'Issued for sales traveling duties.' },
      { status: 'Current', label: 'Lost Status Authorized', date: '2026-07-09', description: 'Lost reported in Paris Airport security. Lock command confirmed.', user: 'David Miller' }
    ],
    maintenanceHistory: [],
    auditHistory: []
  }
];
