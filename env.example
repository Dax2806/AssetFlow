import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit3, Eye, ToggleLeft, ToggleRight, Shield, Briefcase, Key, Award, User } from 'lucide-react';
import { Employee } from './types';
import { highlightText } from './utils';

interface EmployeeDirectoryProps {
  employees: Employee[];
  searchQuery: string;
  onViewDetails: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'name' | 'email' | 'departmentName' | 'role' | 'status';
type SortOrder = 'asc' | 'desc';

export default function EmployeeDirectory({
  employees,
  searchQuery,
  onViewDetails,
  onEdit,
  onToggleStatus,
  isLoading = false,
}: EmployeeDirectoryProps) {
  // Sorting state
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = React.useMemo(() => {
    return [...employees].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Case insensitive string comparison
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, sortField, sortOrder]);

  const paginatedEmployees = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEmployees, currentPage]);

  const totalPages = Math.ceil(employees.length / itemsPerPage) || 1;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, employees.length]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-700 border border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30">
            <Key className="h-2.5 w-2.5" />
            <span>Admin</span>
          </span>
        );
      case 'Asset Manager':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">
            <Shield className="h-2.5 w-2.5" />
            <span>Asset Manager</span>
          </span>
        );
      case 'Department Head':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700 border border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/30">
            <Award className="h-2.5 w-2.5" />
            <span>Dept Head</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 border border-slate-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800">
            <Briefcase className="h-2.5 w-2.5" />
            <span>Employee</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-100 bg-white shadow-xs dark:border-zinc-900 dark:bg-zinc-950 overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto min-h-[340px]">
        <table className="w-full min-w-[850px] table-auto border-collapse text-left text-xs">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-slate-50/70 dark:bg-zinc-900/60 backdrop-blur-xs border-b border-slate-100 dark:border-zinc-900 select-none">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Employee / Identity</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('departmentName')}>
                <div className="flex items-center gap-1">
                  <span>Department</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('role')}>
                <div className="flex items-center gap-1">
                  <span>System Role</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">Last Login</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-900/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`emp-skeleton-${idx}`} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8.5 w-8.5 rounded-full bg-slate-100 dark:bg-zinc-800" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3.5 w-28 rounded bg-slate-100 dark:bg-zinc-800" />
                        <div className="h-2.5 w-36 rounded bg-slate-100 dark:bg-zinc-800" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 rounded bg-slate-100 dark:bg-zinc-800" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-zinc-800" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-14 rounded-full bg-slate-100 dark:bg-zinc-800" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded bg-slate-100 dark:bg-zinc-800" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="h-7 w-7 rounded bg-slate-100 dark:bg-zinc-800" />
                      <div className="h-7 w-7 rounded bg-slate-100 dark:bg-zinc-800" />
                      <div className="h-7 w-7 rounded bg-slate-100 dark:bg-zinc-800" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              paginatedEmployees.map((emp) => (
              <tr
                key={emp.id}
                onClick={() => onViewDetails(emp)}
                className="group hover:bg-slate-50/40 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer"
              >
                {/* Employee / Identity */}
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2.5">
                    {/* Compact Avatar with specific styling */}
                    <div className="relative flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-2xs border border-emerald-100/50 dark:border-emerald-900/20">
                      {emp.avatar}
                      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white dark:border-zinc-950 ${
                        emp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                      }`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate max-w-[160px]">
                        {highlightText(emp.name, searchQuery)}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal mt-0.5 truncate max-w-[180px]">
                        {highlightText(emp.email, searchQuery)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    {highlightText(emp.departmentName, searchQuery)}
                  </span>
                </td>

                {/* System Role */}
                <td className="py-3.5 px-4">
                  {getRoleBadge(emp.role)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* Last Login */}
                <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-500 font-medium">
                  {emp.lastLogin}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onViewDetails(emp)}
                      className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                      title="View Profile Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(emp)}
                      className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Edit Employee Account"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(emp.id)}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        emp.status === 'Active'
                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400'
                      }`}
                      title={emp.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                    >
                      {emp.status === 'Active' ? (
                        <ToggleRight className="h-4.5 w-4.5" />
                      ) : (
                        <ToggleLeft className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-900 px-4 py-3 select-none">
        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
