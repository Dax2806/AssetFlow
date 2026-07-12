import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit3, MoreHorizontal, Eye, ShieldAlert, ToggleLeft, ToggleRight, Building } from 'lucide-react';
import { Department } from './types';
import { highlightText } from './utils';

interface DepartmentTableProps {
  departments: Department[];
  searchQuery: string;
  onViewDetails: (dept: Department) => void;
  onEdit: (dept: Department) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'name' | 'headName' | 'employeeCount' | 'assetCount' | 'status';
type SortOrder = 'asc' | 'desc';

export default function DepartmentTable({
  departments,
  searchQuery,
  onViewDetails,
  onEdit,
  onToggleStatus,
  isLoading = false,
}: DepartmentTableProps) {
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

  const sortedDepts = React.useMemo(() => {
    return [...departments].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle case insensitivity for strings
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [departments, sortField, sortOrder]);

  const paginatedDepts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDepts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDepts, currentPage]);

  const totalPages = Math.ceil(departments.length / itemsPerPage) || 1;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, departments.length]);

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-100 bg-white shadow-xs dark:border-zinc-900 dark:bg-zinc-950 overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto min-h-[340px]">
        <table className="w-full min-w-[800px] table-auto border-collapse text-left text-xs">
          {/* Sticky Header */}
          <thead className="sticky top-0 bg-slate-50/70 dark:bg-zinc-900/60 backdrop-blur-xs border-b border-slate-100 dark:border-zinc-900 select-none">
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Department Name</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('headName')}>
                <div className="flex items-center gap-1">
                  <span>Department Head</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">Parent Department</th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('employeeCount')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Employees</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('assetCount')}>
                <div className="flex items-center justify-end gap-1 font-semibold">
                  <span>Assets</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-600 dark:hover:text-zinc-300" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-900/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`dept-skeleton-${idx}`} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-slate-100 dark:bg-zinc-800" />
                      <div className="h-4 w-32 rounded bg-slate-100 dark:bg-zinc-800" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded bg-slate-100 dark:bg-zinc-800" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-20 rounded bg-slate-100 dark:bg-zinc-800" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 w-8 rounded bg-slate-100 dark:bg-zinc-800 ml-auto" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 w-8 rounded bg-slate-100 dark:bg-zinc-800 ml-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-14 rounded-full bg-slate-100 dark:bg-zinc-800" />
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
              paginatedDepts.map((dept) => (
              <tr
                key={dept.id}
                onClick={() => onViewDetails(dept)}
                className="group hover:bg-slate-50/40 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer"
              >
                {/* Name */}
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-zinc-900 dark:text-zinc-500 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400 transition-colors">
                      <Building className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate max-w-[180px]">
                      {highlightText(dept.name, searchQuery)}
                    </span>
                  </div>
                </td>

                {/* Head */}
                <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">
                  {dept.headName === 'Vacant' ? (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30">
                      Vacant
                    </span>
                  ) : (
                    <span className="font-medium">
                      {highlightText(dept.headName, searchQuery)}
                    </span>
                  )}
                </td>

                {/* Parent */}
                <td className="py-3 px-4 text-slate-500 dark:text-zinc-500">
                  {dept.parentName === 'None' ? (
                    <span className="italic text-slate-400 dark:text-zinc-600">—</span>
                  ) : (
                    <span className="font-medium">{dept.parentName}</span>
                  )}
                </td>

                {/* Employees count */}
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 dark:text-zinc-300">
                  {dept.employeeCount}
                </td>

                {/* Assets count */}
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 dark:text-zinc-300">
                  {dept.assetCount}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                      dept.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                    }`}
                  >
                    {dept.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onViewDetails(dept)}
                      className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(dept)}
                      className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Edit Department"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(dept.id)}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        dept.status === 'Active'
                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400'
                      }`}
                      title={dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      {dept.status === 'Active' ? (
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
