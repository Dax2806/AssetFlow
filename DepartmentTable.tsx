export type OrgTab = 'departments' | 'employees' | 'categories';

export interface Department {
  id: string;
  name: string;
  headName: string; // "vacant" or a person's name
  headId?: string;
  parentName: string; // "none" or name
  parentId?: string;
  employeeCount: number;
  assetCount: number;
  status: 'Active' | 'Inactive';
  description: string;
  notes?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentName: string;
  departmentId: string;
  role: 'Admin' | 'Asset Manager' | 'Department Head' | 'Employee';
  status: 'Active' | 'Inactive';
  avatar: string; // initials
  lastLogin: string;
  employeeId: string;
  phone: string;
  notes?: string;
}

export interface CustomField {
  name: string;
  type: 'text' | 'number' | 'boolean';
  required: boolean;
}

export interface AssetCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name as string
  description: string;
  assetCount: number;
  warrantyEnabled: boolean;
  defaultWarranty: number; // in months
  status: 'Active' | 'Inactive';
  customFields: CustomField[];
}

export interface OrgInsight {
  id: string;
  text: string;
}
