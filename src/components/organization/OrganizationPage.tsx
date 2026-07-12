import React from 'react';
import { Plus, Download, RotateCw, Sparkles, Building, Users, FolderTree, ArrowLeft, ArrowUpRight, Building2, UserCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents
import { OrgTab, Department, Employee, AssetCategory } from './types';
import { INITIAL_DEPARTMENTS, INITIAL_EMPLOYEES, INITIAL_CATEGORIES } from './mockData';
import SummaryStrip from '../common/SummaryStrip';
import InsightCard from '../common/InsightCard';
import EmptyState from '../common/EmptyState';
import DepartmentTable from './DepartmentTable';
import EmployeeDirectory from './EmployeeDirectory';
import CategoryGrid from './CategoryGrid';
import PageHeader from '../common/PageHeader';

// Drawers
import DepartmentDrawer from './DepartmentDrawer';
import EmployeeDrawer from './EmployeeDrawer';
import CategoryDrawer from './CategoryDrawer';

interface OrganizationPageProps {
  onBackToDashboard: () => void;
  departments?: Department[];
  setDepartments?: React.Dispatch<React.SetStateAction<Department[]>>;
  employees?: Employee[];
  setEmployees?: React.Dispatch<React.SetStateAction<Employee[]>>;
  categories?: AssetCategory[];
  setCategories?: React.Dispatch<React.SetStateAction<AssetCategory[]>>;
  initialTab?: OrgTab;
}

export default function OrganizationPage({
  onBackToDashboard,
  departments: propsDepartments,
  setDepartments: propsSetDepartments,
  employees: propsEmployees,
  setEmployees: propsSetEmployees,
  categories: propsCategories,
  setCategories: propsSetCategories,
  initialTab
}: OrganizationPageProps) {
  // --- Master States ---
  const [activeTab, setActiveTab] = React.useState<OrgTab>(initialTab || 'departments');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [localDepartments, setLocalDepartments] = React.useState<Department[]>(INITIAL_DEPARTMENTS);
  const [localEmployees, setLocalEmployees] = React.useState<Employee[]>(INITIAL_EMPLOYEES);
  const [localCategories, setLocalCategories] = React.useState<AssetCategory[]>(INITIAL_CATEGORIES);

  const departments = propsDepartments || localDepartments;
  const setDepartments = propsSetDepartments || setLocalDepartments;
  const employees = propsEmployees || localEmployees;
  const setEmployees = propsSetEmployees || setLocalEmployees;
  const categories = propsCategories || localCategories;
  const setCategories = propsSetCategories || setLocalCategories;

  // --- Search & Filters ---
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [deptFilter, setDeptFilter] = React.useState<string>('all');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [warrantyFilter, setWarrantyFilter] = React.useState<string>('all');

  // --- UI Toast / Action states ---
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isTabLoading, setIsTabLoading] = React.useState(false);
  const [dbConnectionError, setDbConnectionError] = React.useState(false);

  // --- Drawer States ---
  const [isDeptDrawerOpen, setIsDeptDrawerOpen] = React.useState(false);
  const [selectedDept, setSelectedDept] = React.useState<Department | null>(null);
  const [deptDrawerMode, setDeptDrawerMode] = React.useState<'view' | 'edit' | 'create'>('view');

  const [isEmpDrawerOpen, setIsEmpDrawerOpen] = React.useState(false);
  const [selectedEmp, setSelectedEmp] = React.useState<Employee | null>(null);
  const [empDrawerMode, setEmpDrawerMode] = React.useState<'view' | 'edit' | 'create'>('view');

  const [isCatDrawerOpen, setIsCatDrawerOpen] = React.useState(false);
  const [selectedCat, setSelectedCat] = React.useState<AssetCategory | null>(null);
  const [catDrawerMode, setCatDrawerMode] = React.useState<'create' | 'edit'>('create');

  // Trigger brief Toast feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Refresh / Simulate Data Fetch ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    setDbConnectionError(false);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Master organizational directories refreshed successfully.');
    }, 600);
  };

  // --- Export Action ---
  const handleExport = () => {
    showToast(`Master list [${activeTab}] exported as CSV schema successfully.`);
  };

  // --- Reset filters ---
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDeptFilter('all');
    setRoleFilter('all');
    setWarrantyFilter('all');
  };

  // --- Status Toggle Handlers (Table / Grid quick toggles) ---
  const handleToggleDeptStatus = (id: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d))
    );
    const updated = departments.find((d) => d.id === id);
    if (updated) {
      showToast(`Department "${updated.name}" status updated.`);
    }
  };

  const handleToggleEmpStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e))
    );
    const updated = employees.find((e) => e.id === id);
    if (updated) {
      showToast(`Employee "${updated.name}" account access updated.`);
    }
  };

  const handleToggleCatStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    );
    const updated = categories.find((c) => c.id === id);
    if (updated) {
      showToast(`Category Class "${updated.name}" access updated.`);
    }
  };

  // --- Saving Drawer Forms Handlers ---
  const handleSaveDept = (data: Partial<Department>) => {
    if (deptDrawerMode === 'create') {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: data.name || '',
        description: data.description || '',
        headName: data.headName || 'Vacant',
        parentName: data.parentName || 'None',
        employeeCount: 0,
        assetCount: 0,
        status: data.status || 'Active',
        notes: data.notes || '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setDepartments((prev) => [newDept, ...prev]);
      showToast(`Department "${newDept.name}" created.`);
    } else if (selectedDept) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === selectedDept.id ? { ...d, ...data } : d))
      );
      showToast(`Department details updated.`);
    }
    setIsDeptDrawerOpen(false);
  };

  const handleSaveEmp = (data: Partial<Employee>) => {
    if (empDrawerMode === 'create') {
      const firstInitial = (data.name || 'E').charAt(0);
      const lastInitial = (data.name || 'E').split(' ').slice(-1)[0]?.charAt(0) || '';
      const avatar = (firstInitial + lastInitial).toUpperCase();

      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: data.name || '',
        email: data.email || '',
        departmentId: data.departmentId || '',
        departmentName: data.departmentName || '',
        role: data.role || 'Employee',
        status: data.status || 'Active',
        avatar,
        lastLogin: 'Never logged in',
        employeeId: data.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
        phone: data.phone || '',
        notes: data.notes || '',
      };

      // Auto update employeeCount in related department
      setDepartments(prev =>
        prev.map(d => d.id === newEmp.departmentId ? { ...d, employeeCount: d.employeeCount + 1 } : d)
      );

      setEmployees((prev) => [newEmp, ...prev]);
      showToast(`Staff member "${newEmp.name}" added.`);
    } else if (selectedEmp) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === selectedEmp.id ? { ...e, ...data } : e))
      );
      showToast(`Employee details updated.`);
    }
    setIsEmpDrawerOpen(false);
  };

  const handleSaveCat = (data: Partial<AssetCategory>) => {
    if (catDrawerMode === 'create') {
      const newCat: AssetCategory = {
        id: `cat-${Date.now()}`,
        name: data.name || '',
        icon: data.icon || 'Laptop',
        description: data.description || '',
        assetCount: 0,
        warrantyEnabled: data.warrantyEnabled ?? false,
        defaultWarranty: data.defaultWarranty ?? 0,
        status: data.status || 'Active',
        customFields: data.customFields || [],
      };
      setCategories((prev) => [newCat, ...prev]);
      showToast(`Asset Category Class "${newCat.name}" added.`);
    } else if (selectedCat) {
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCat.id ? { ...c, ...data } : c))
      );
      showToast(`Category specifications updated.`);
    }
    setIsCatDrawerOpen(false);
  };

  // --- Filtering Logic ---
  const filteredDepartments = React.useMemo(() => {
    return departments.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.headName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [departments, searchQuery, statusFilter]);

  const filteredEmployees = React.useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesDept = deptFilter === 'all' || e.departmentId === deptFilter;
      const matchesRole = roleFilter === 'all' || e.role === roleFilter;
      return matchesSearch && matchesStatus && matchesDept && matchesRole;
    });
  }, [employees, searchQuery, statusFilter, deptFilter, roleFilter]);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesWarranty =
        warrantyFilter === 'all' ||
        (warrantyFilter === 'enabled' && c.warrantyEnabled) ||
        (warrantyFilter === 'disabled' && !c.warrantyEnabled);
      return matchesSearch && matchesStatus && matchesWarranty;
    });
  }, [categories, searchQuery, statusFilter, warrantyFilter]);

  // Handle CTA inside EmptyState or Page Header Click
  const handleCreateTrigger = () => {
    if (activeTab === 'departments') {
      setDeptDrawerMode('create');
      setSelectedDept(null);
      setIsDeptDrawerOpen(true);
    } else if (activeTab === 'employees') {
      setEmpDrawerMode('create');
      setSelectedEmp(null);
      setIsEmpDrawerOpen(true);
    } else if (activeTab === 'categories') {
      setCatDrawerMode('create');
      setSelectedCat(null);
      setIsCatDrawerOpen(true);
    }
  };

  // Compute live KPI counts based on active states for summary strip
  const orgKPIs = React.useMemo(() => {
    const deptCount = departments.length;
    const empCount = employees.length;
    const headCount = departments.filter((d) => d.headName !== 'Vacant').length;
    const catCount = categories.length;

    return [
      {
        title: 'Departments',
        value: deptCount,
        subText: `${departments.filter((d) => d.status === 'Active').length} Active divisions`,
        icon: Building2,
        type: 'info' as const,
      },
      {
        title: 'Employees',
        value: empCount,
        subText: `${employees.filter((e) => e.status === 'Active').length} Active members`,
        icon: Users,
        type: 'positive' as const,
      },
      {
        title: 'Department Heads',
        value: headCount,
        subText: `${departments.filter((d) => d.headName === 'Vacant').length} Positions vacant`,
        icon: UserCheck,
        type: 'neutral' as const,
      },
      {
        title: 'Asset Categories',
        value: catCount,
        subText: `${categories.filter((c) => c.status === 'Active').length} Active classes`,
        icon: FolderTree,
        type: 'info' as const,
      },
    ];
  }, [departments, employees, categories]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-6 space-y-6 select-none">
      {/* Toast feedback widget */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-slate-900 px-4.5 py-3 text-xs font-semibold text-white shadow-lg dark:bg-white dark:text-zinc-950"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Page Header with Breadcrumbs & CTAs */}
      <PageHeader
        title="Organization Setup"
        subtitle="Define organizational divisions, system roles, and schema specifications for asset categories."
        breadcrumbs={[
          { label: 'AssetFlow', onClick: onBackToDashboard },
          { label: 'Administration' },
          { label: 'Organization Setup' }
        ]}
        actions={
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={onBackToDashboard}
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer transition-all"
            >
              <span>View Fleet Operations</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleCreateTrigger}
              className="inline-flex h-8.5 items-center space-x-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>
                {activeTab === 'departments'
                  ? 'Create Department'
                  : activeTab === 'employees'
                  ? 'Add Employee'
                  : 'New Category Class'}
              </span>
            </button>
          </div>
        }
      />

      {/* Standardized Summary KPI Strip */}
      <SummaryStrip kpis={orgKPIs} isLoading={isRefreshing} />

      {/* Main Board Grid with Tab & Filters toolbar */}
      <div className="space-y-4">
        
        {/* Navigation Tabs and Smart Insights on same row */}
        <div className="flex flex-col space-y-3.5 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 border-b border-slate-100 pb-2 dark:border-zinc-900/60">
          
          {/* Organization Tabs switcher */}
          <div className="flex items-center space-x-1">
            {(['departments', 'employees', 'categories'] as OrgTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label =
                tab === 'departments'
                  ? 'Departments'
                  : tab === 'employees'
                  ? 'Employee Directory'
                  : 'Asset Categories';
              const Icon =
                tab === 'departments' ? Building : tab === 'employees' ? Users : FolderTree;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setIsTabLoading(true);
                    setActiveTab(tab);
                    handleResetFilters();
                    setTimeout(() => {
                      setIsTabLoading(false);
                    }, 400);
                  }}
                  className={`relative flex h-8 items-center space-x-1.5 rounded-lg px-3 text-xs font-semibold cursor-pointer transition-colors ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/60 dark:text-emerald-400 dark:bg-emerald-950/20'
                      : 'text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeOrgTabUnderline"
                      className="absolute -bottom-[10px] left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Smart Rotating Insights */}
          <InsightCard />
        </div>

        {/* Toolbar section: Search, Filters, Export, Refresh */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-slate-50/40 p-3 rounded-xl border border-slate-100/60 dark:bg-zinc-950/20 dark:border-zinc-900/40">
          {/* Left: Instant Search field */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'departments' ? 'departments, heads...' : activeTab === 'employees' ? 'staff names, emails...' : 'category, specs...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-3.5 pr-8 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 cursor-pointer text-[10px] font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Center: Contextual filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Common Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            {/* Tab specific employee filters */}
            {activeTab === 'employees' && (
              <>
                {/* Department filter */}
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-8.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-8.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Asset Manager">Asset Manager</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Employee">Employee</option>
                </select>
              </>
            )}

            {/* Tab specific category filters */}
            {activeTab === 'categories' && (
              <select
                value={warrantyFilter}
                onChange={(e) => setWarrantyFilter(e.target.value)}
                className="h-8.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <option value="all">All Warranty Options</option>
                <option value="enabled">Warranty Enabled</option>
                <option value="disabled">Warranty Disabled</option>
              </select>
            )}

            {/* Clear / Reset Filters trigger */}
            {(searchQuery || statusFilter !== 'all' || deptFilter !== 'all' || roleFilter !== 'all' || warrantyFilter !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="h-8 px-2.5 rounded text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Right: Export and Refresh buttons */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => {
                const newState = !dbConnectionError;
                setDbConnectionError(newState);
                if (newState) {
                  showToast('Database connection interrupted. Simulating offline limit error.');
                } else {
                  showToast('Database link restored. Synchronizing live directories...');
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 500);
                }
              }}
              className={`inline-flex h-8.5 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold cursor-pointer transition-all ${
                dbConnectionError
                  ? 'border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
              title="Toggle Live Database Connection Error Simulation"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dbConnectionError ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{dbConnectionError ? 'Sync Interrupted' : 'Database Active'}</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              title="Export Current Table as CSV schema"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-55 cursor-pointer transition-all"
              title="Refresh Master Directories"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* --- Content Area Conditional Render --- */}
        <div className="min-h-[400px]">
          {dbConnectionError ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-rose-200 bg-rose-50/20 p-8 dark:border-rose-950/30 dark:bg-rose-950/10"
            >
              <div className="flex flex-col items-center text-center max-w-xl mx-auto py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 mb-4 shadow-sm border border-rose-100 dark:border-rose-900/30">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                  Database Connection Limit Interrupted
                </h3>
                <p className="mt-2 text-xs text-rose-700/80 dark:text-rose-400/80 leading-relaxed font-semibold">
                  Error Code: <code className="bg-rose-100/50 dark:bg-rose-950/40 px-1 py-0.5 rounded text-[10px] font-mono">ER_CONN_LIMIT_EXCEEDED</code>. AssetFlow was temporarily blocked while attempting to fetch structural HR hierarchies from the production container.
                </p>
                <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500 leading-normal">
                  This state allows you to test AssetFlow's offline resiliency standards. Recover instantly by restoring connection below.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setDbConnectionError(false);
                      setIsRefreshing(true);
                      setTimeout(() => {
                        setIsRefreshing(false);
                        showToast('ERP connection successfully restored from container.');
                      }, 650);
                    }}
                    className="inline-flex h-8.5 items-center justify-center rounded-lg bg-rose-600 px-4 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-98 transition-all cursor-pointer"
                  >
                    Reconnect Database Link
                  </button>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex h-8.5 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                  >
                    Clear Search Filters
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {activeTab === 'departments' && (
                filteredDepartments.length === 0 ? (
                  <EmptyState
                    icon={Building}
                    title={searchQuery ? `No departments found matching "${searchQuery}"` : "No departments found matching criteria"}
                    description={searchQuery ? "Review the spelling criteria or reset the search input box to retrieve the full organizational listing." : "Create your first department or adjust current search filters to begin organizing hardware."}
                    actionText={searchQuery ? "Clear Search Query" : "Create Department"}
                    onAction={searchQuery ? () => setSearchQuery('') : handleCreateTrigger}
                  />
                ) : (
                  <DepartmentTable
                    departments={filteredDepartments}
                    searchQuery={searchQuery}
                    isLoading={isRefreshing || isTabLoading}
                    onViewDetails={(dept) => {
                      if ((window as any).openDepartmentByName) {
                        (window as any).openDepartmentByName(dept.name);
                      } else {
                        setSelectedDept(dept);
                        setDeptDrawerMode('view');
                        setIsDeptDrawerOpen(true);
                      }
                    }}
                    onEdit={(dept) => {
                      setSelectedDept(dept);
                      setDeptDrawerMode('edit');
                      setIsDeptDrawerOpen(true);
                    }}
                    onToggleStatus={handleToggleDeptStatus}
                  />
                )
              )}

              {activeTab === 'employees' && (
                filteredEmployees.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title={searchQuery ? `No employees found matching "${searchQuery}"` : "No employee accounts matched filters"}
                    description={searchQuery ? "Review the email address or username spellings, or reset search parameters below." : "Register a new employee and attach system roles, or reset the filtering parameters."}
                    actionText={searchQuery ? "Clear Search Query" : "Add Employee"}
                    onAction={searchQuery ? () => setSearchQuery('') : handleCreateTrigger}
                  />
                ) : (
                  <EmployeeDirectory
                    employees={filteredEmployees}
                    searchQuery={searchQuery}
                    isLoading={isRefreshing || isTabLoading}
                    onViewDetails={(emp) => {
                      if ((window as any).openEmployeeByName) {
                        (window as any).openEmployeeByName(emp.name);
                      } else {
                        setSelectedEmp(emp);
                        setEmpDrawerMode('view');
                        setIsEmpDrawerOpen(true);
                      }
                    }}
                    onEdit={(emp) => {
                      setSelectedEmp(emp);
                      setEmpDrawerMode('edit');
                      setIsEmpDrawerOpen(true);
                    }}
                    onToggleStatus={handleToggleEmpStatus}
                  />
                )
              )}

              {activeTab === 'categories' && (
                filteredCategories.length === 0 ? (
                  <EmptyState
                    icon={FolderTree}
                    title={searchQuery ? `No categories found matching "${searchQuery}"` : "No Category classes matched query"}
                    description={searchQuery ? "Verify the label prefix search criteria or reset search parameters below." : "Add structural category specs to dictate custom attributes schemas and warranty ranges."}
                    actionText={searchQuery ? "Clear Search Query" : "Create Class"}
                    onAction={searchQuery ? () => setSearchQuery('') : handleCreateTrigger}
                  />
                ) : (
                  <CategoryGrid
                    categories={filteredCategories}
                    searchQuery={searchQuery}
                    isLoading={isRefreshing || isTabLoading}
                    onEdit={(cat) => {
                      setSelectedCat(cat);
                      setCatDrawerMode('edit');
                      setIsCatDrawerOpen(true);
                    }}
                    onToggleStatus={handleToggleCatStatus}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* --- SIDE SLIDING SHEET DRAWERS --- */}

      {/* 1. Department Drawer */}
      <DepartmentDrawer
        isOpen={isDeptDrawerOpen}
        onClose={() => setIsDeptDrawerOpen(false)}
        department={selectedDept}
        mode={deptDrawerMode}
        employeesList={employees}
        departmentsList={departments}
        onSave={handleSaveDept}
        onToggleStatus={handleToggleDeptStatus}
      />

      {/* 2. Employee Drawer */}
      <EmployeeDrawer
        isOpen={isEmpDrawerOpen}
        onClose={() => setIsEmpDrawerOpen(false)}
        employee={selectedEmp}
        mode={empDrawerMode}
        departmentsList={departments}
        onSave={handleSaveEmp}
        onToggleStatus={handleToggleEmpStatus}
      />

      {/* 3. Category Drawer */}
      <CategoryDrawer
        isOpen={isCatDrawerOpen}
        onClose={() => setIsCatDrawerOpen(false)}
        category={selectedCat}
        mode={catDrawerMode}
        onSave={handleSaveCat}
      />
    </div>
  );
}
