import React from 'react';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import { 
  TrendingUp, Download, FileText, Calendar, Filter, RefreshCw, 
  Sparkles, ShieldCheck, HelpCircle, ArrowRightLeft, DollarSign, ListFilter,
  PieChart as PieIcon, BarChart3, Clock, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { Asset, Booking, Activity } from '../../types';

interface ReportsPageProps {
  assets: Asset[];
  bookings: Booking[];
  activities: Activity[];
}

export default function ReportsPage({ assets, bookings, activities }: ReportsPageProps) {
  // Page filters
  const [dateRange, setDateRange] = React.useState('30d');
  const [selectedDept, setSelectedDept] = React.useState('All');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedLocation, setSelectedLocation] = React.useState('All');
  const [isExporting, setIsExporting] = React.useState<string | null>(null);

  // Lists for dropdown filters based on actual assets
  const departments = React.useMemo(() => {
    const depts = new Set<string>();
    assets.forEach(a => { if (a.department) depts.add(a.department); });
    return ['All', ...Array.from(depts)];
  }, [assets]);

  const categories = React.useMemo(() => {
    return ['All', 'IT Hardware', 'Facilities', 'Vehicles', 'Office Equipment'];
  }, []);

  const locations = React.useMemo(() => {
    const locs = new Set<string>();
    assets.forEach(a => { if (a.location) locs.add(a.location.split(' - ')[0]); });
    return ['All', ...Array.from(locs)];
  }, [assets]);

  // Filtered Assets list
  const filteredAssets = React.useMemo(() => {
    return assets.filter(asset => {
      const matchesDept = selectedDept === 'All' || asset.department === selectedDept || (!asset.department && selectedDept === 'Unassigned');
      const matchesCat = selectedCategory === 'All' || asset.category === selectedCategory;
      const matchesLoc = selectedLocation === 'All' || asset.location.startsWith(selectedLocation);
      return matchesDept && matchesCat && matchesLoc;
    });
  }, [assets, selectedDept, selectedCategory, selectedLocation]);

  // Total Value of Filtered Assets
  const totalValue = React.useMemo(() => {
    return filteredAssets.reduce((sum, a) => sum + (a.value || 0), 0);
  }, [filteredAssets]);

  // Average Health Score of Filtered Assets
  const averageHealth = React.useMemo(() => {
    const hasHealth = filteredAssets.filter(a => a.healthScore !== undefined);
    if (hasHealth.length === 0) return 85;
    return Math.round(hasHealth.reduce((sum, a) => sum + (a.healthScore || 0), 0) / hasHealth.length);
  }, [filteredAssets]);

  // 1. Asset Utilization Rate (Historical data, simulated over the selected date range)
  const utilizationChartData = React.useMemo(() => {
    const baseRates = {
      '30d': [
        { date: 'Jun 15', rate: 76.5, allocated: 60, maintenance: 5 },
        { date: 'Jun 20', rate: 78.1, allocated: 62, maintenance: 4 },
        { date: 'Jun 25', rate: 79.8, allocated: 65, maintenance: 3 },
        { date: 'Jun 30', rate: 82.4, allocated: 68, maintenance: 4 },
        { date: 'Jul 05', rate: 84.0, allocated: 71, maintenance: 2 },
        { date: 'Jul 10', rate: 85.5, allocated: 73, maintenance: 3 },
        { date: 'Jul 12', rate: 86.2, allocated: 74, maintenance: 2 }
      ],
      '90d': [
        { date: 'Apr 15', rate: 72.0, allocated: 55, maintenance: 6 },
        { date: 'Apr 30', rate: 74.5, allocated: 58, maintenance: 5 },
        { date: 'May 15', rate: 76.1, allocated: 60, maintenance: 5 },
        { date: 'May 30', rate: 78.4, allocated: 63, maintenance: 4 },
        { date: 'Jun 15', rate: 81.2, allocated: 67, maintenance: 4 },
        { date: 'Jun 30', rate: 83.9, allocated: 71, maintenance: 3 },
        { date: 'Jul 12', rate: 86.2, allocated: 74, maintenance: 2 }
      ],
      '12m': [
        { date: 'Aug 25', rate: 68.4, allocated: 48, maintenance: 8 },
        { date: 'Oct 25', rate: 71.2, allocated: 52, maintenance: 6 },
        { date: 'Dec 25', rate: 74.8, allocated: 57, maintenance: 5 },
        { date: 'Feb 26', rate: 76.9, allocated: 61, maintenance: 4 },
        { date: 'Apr 26', rate: 79.5, allocated: 65, maintenance: 4 },
        { date: 'Jun 26', rate: 83.2, allocated: 71, maintenance: 3 },
        { date: 'Jul 12', rate: 86.2, allocated: 74, maintenance: 2 }
      ]
    };
    return baseRates[dateRange as '30d' | '90d' | '12m'] || baseRates['30d'];
  }, [dateRange]);

  // 2. Maintenance Spending Trends by Asset Category
  const maintenanceTrendData = React.useMemo(() => {
    const categoryCost: Record<string, { count: number, cost: number }> = {
      'IT Hardware': { count: 12, cost: 4850 },
      'Facilities': { count: 4, cost: 11200 },
      'Vehicles': { count: 5, cost: 7400 },
      'Office Equipment': { count: 8, cost: 1950 }
    };

    // Incorporate filtered attributes
    return Object.keys(categoryCost).map(cat => ({
      category: cat,
      ticketsCount: selectedCategory === 'All' || selectedCategory === cat ? categoryCost[cat].count : 0,
      totalCost: selectedCategory === 'All' || selectedCategory === cat ? categoryCost[cat].cost : 0
    }));
  }, [selectedCategory]);

  // 3. Department Allocation Value
  const departmentAllocationData = React.useMemo(() => {
    const deptTotals: Record<string, { value: number, count: number }> = {};
    assets.forEach(a => {
      const dept = a.department || 'Unassigned';
      if (!deptTotals[dept]) deptTotals[dept] = { value: 0, count: 0 };
      deptTotals[dept].value += a.value || 0;
      deptTotals[dept].count += 1;
    });

    return Object.keys(deptTotals)
      .map(dept => ({
        name: dept,
        totalValue: deptTotals[dept].value,
        assetCount: deptTotals[dept].count
      }))
      .filter(d => selectedDept === 'All' || d.name === selectedDept);
  }, [assets, selectedDept]);

  // 4. Asset Health Distribution
  const healthDistributionData = React.useMemo(() => {
    let excellent = 0; // 90-100
    let good = 0;      // 70-89
    let fair = 0;      // 50-69
    let poor = 0;      // <50

    filteredAssets.forEach(a => {
      const score = a.healthScore ?? 85;
      if (score >= 90) excellent++;
      else if (score >= 70) good++;
      else if (score >= 50) fair++;
      else poor++;
    });

    return [
      { name: 'Excellent (90-100)', value: excellent, color: '#059669' }, // emerald-600
      { name: 'Good (70-89)', value: good, color: '#3b82f6' },      // blue-500
      { name: 'Fair (50-69)', value: fair, color: '#f59e0b' },      // amber-500
      { name: 'Poor (<50)', value: poor, color: '#ef4444' }         // red-500
    ].filter(segment => segment.value > 0);
  }, [filteredAssets]);

  // 5. Lifecycle Depreciation Analysis
  const lifecycleAnalysisData = React.useMemo(() => {
    return [
      { year: 'Year 0', original: totalValue, depreciated: totalValue },
      { year: 'Year 1', original: totalValue, depreciated: Math.round(totalValue * 0.82) },
      { year: 'Year 2', original: totalValue, depreciated: Math.round(totalValue * 0.68) },
      { year: 'Year 3', original: totalValue, depreciated: Math.round(totalValue * 0.55) },
      { year: 'Year 4', original: totalValue, depreciated: Math.round(totalValue * 0.44) },
      { year: 'Year 5', original: totalValue, depreciated: Math.round(totalValue * 0.32) }
    ];
  }, [totalValue]);

  // 6. Booking Heatmap Simulation (Github Commit style 2D Grid)
  // Rows are Days (Mon-Sun), Columns are Time Brackets (8am, 10am, 12pm, 2pm, 4pm, 6pm, 8pm)
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hoursOfDay = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  
  // Create a pseudo-random stable distribution of booking density
  const getBookingDensity = (dayIdx: number, hourIdx: number) => {
    // Generate a semi-stable formula representing bookings
    const weight = ((dayIdx * 3) + (hourIdx * 2)) % 5;
    if (dayIdx >= 5) return Math.max(0, weight - 2); // Less bookings on weekends
    return weight; // scale from 0 to 4
  };

  // Live insights generator based on current filters
  const smartInsights = React.useMemo(() => {
    const list = [];
    if (filteredAssets.length === 0) return ["No assets fit selection. Broaden filters to compute insights."];

    // Insight 1: Asset Health
    if (averageHealth < 80) {
      list.push(`Alert: Average health score is critical (${averageHealth}%). Immediate preventive hardware sweeps required.`);
    } else {
      list.push(`Healthy Stack: Current asset group shows robust reliability with an average health of ${averageHealth}%.`);
    }

    // Insight 2: Category distribution recommendation
    const vehiclesInMaint = filteredAssets.filter(a => a.category === 'Vehicles' && a.status === 'maintenance').length;
    if (vehiclesInMaint > 0) {
      list.push(`Fleet Alert: ${vehiclesInMaint} logistics vehicles are offline. Reschedule pending transfers to avoid shipping delays.`);
    }

    // Insight 3: High utilization or budget allocations
    const itValue = filteredAssets.filter(a => a.category === 'IT Hardware').reduce((sum, a) => sum + a.value, 0);
    if (itValue > 25000) {
      list.push(`Budget Insight: IT Hardware represents $${itValue.toLocaleString()} in equity. Introduce automated firmware patching to extend life.`);
    }

    // Insight 4: General booking load
    list.push(`Workflow Forecast: Mid-week bookings peak on Wednesdays between 12:00 and 16:00. Prioritize key room allocations.`);

    return list;
  }, [filteredAssets, averageHealth]);

  // Export functions
  const handleCSVExport = () => {
    setIsExporting('csv');
    setTimeout(() => {
      // Create real CSV string
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Asset ID,Name,Asset Tag,Category,Status,Location,Value,Department,Health Score\r\n';
      
      filteredAssets.forEach(a => {
        const row = [
          a.id,
          `"${a.name.replace(/"/g, '""')}"`,
          a.tag,
          a.category,
          a.status,
          `"${a.location}"`,
          a.value || 0,
          a.department || 'Unassigned',
          a.healthScore ?? 85
        ].join(',');
        csvContent += row + '\r\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `asset_utilization_report_${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(null);
    }, 1200);
  };

  const handleExcelExport = () => {
    setIsExporting('excel');
    setTimeout(() => {
      // Formatted spreadsheet-style CSV
      let excelContent = 'data:text/csv;charset=utf-8,';
      excelContent += 'EXECUTIVE ANALYTICS REPORT - ASSETFLOW\r\n';
      excelContent += `Generated On, 2026-07-12, Period, ${dateRange}, Department, ${selectedDept}\r\n\r\n`;
      excelContent += 'METRICS SUMMARY\r\n';
      excelContent += `Total Audited Assets, ${filteredAssets.length}\r\n`;
      excelContent += `Total Portfolio Value, $${totalValue}\r\n`;
      excelContent += `Average Health Rating, ${averageHealth}%\r\n\r\n`;
      excelContent += 'ASSET REGISTRY\r\n';
      excelContent += 'Asset ID,Tag,Name,Category,Current Location,Valuation USD,Department,Condition\r\n';

      filteredAssets.forEach(a => {
        const row = [
          a.id,
          a.tag,
          `"${a.name}"`,
          a.category,
          `"${a.location}"`,
          a.value || 0,
          a.department || 'Unassigned',
          a.condition || 'Good'
        ].join(',');
        excelContent += row + '\r\n';
      });

      const encodedUri = encodeURI(excelContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `executive_ledger_${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(null);
    }, 1500);
  };

  const handlePDFExport = () => {
    setIsExporting('pdf');
    setTimeout(() => {
      window.print();
      setIsExporting(null);
    }, 1000);
  };

  return (
    <div className="w-full px-6 py-8 md:px-8 space-y-8 select-none text-left print:p-0 print:bg-white print:text-black">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-150 pb-5 dark:border-zinc-900 select-none print:border-b-2">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-zinc-500 mb-1 select-none">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-450" />
            <span>Executive Analytics Ledger</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Reports & Insights
          </h1>
          <p className="text-[11px] font-medium text-slate-450 dark:text-zinc-500 mt-1 print:hidden">
            Cross-examine real-time depreciation, health indices, and department booking heatmaps.
          </p>
        </div>

        {/* Action Export Group */}
        <div className="flex flex-wrap items-center gap-2 print:hidden select-none">
          <button
            onClick={handleCSVExport}
            disabled={isExporting !== null}
            className="h-9.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-350 dark:border-zinc-850 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-650 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{isExporting === 'csv' ? 'Exporting...' : 'CSV'}</span>
          </button>

          <button
            onClick={handleExcelExport}
            disabled={isExporting !== null}
            className="h-9.5 px-3.5 rounded-xl border border-slate-200 hover:border-slate-350 dark:border-zinc-850 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-650 dark:text-zinc-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{isExporting === 'excel' ? 'Structuring...' : 'Excel'}</span>
          </button>

          <button
            onClick={handlePDFExport}
            disabled={isExporting !== null}
            className="h-9.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-250 text-white dark:text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isExporting === 'pdf' ? 'Generating...' : 'PDF / Print'}</span>
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC CONTROLS & FILTER BAR */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 dark:border-zinc-900/80 dark:bg-zinc-950/40 grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden select-none">
        
        {/* Date Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Report Horizon *
          </label>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              <option value="30d">Last 30 Days (Standard)</option>
              <option value="90d">Last 90 Days (Quarterly)</option>
              <option value="12m">Last 12 Months (Fiscal)</option>
            </select>
            <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-zinc-550 pointer-events-none" />
          </div>
        </div>

        {/* Department Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Cost Department
          </label>
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <ListFilter className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-zinc-550 pointer-events-none" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Hardware Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Layers className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-zinc-550 pointer-events-none" />
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-wider">
            Regional Campus
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-10.5 rounded-xl border border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 px-3.5 text-xs font-bold text-slate-850 dark:text-zinc-200 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Campuses' : `${loc} Campus`}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-zinc-550 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC METRICS SUMMARY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40">
          <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
            Audited Ledger Assets
          </span>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {filteredAssets.length}
            </span>
            <span className="text-[10px] font-bold text-slate-450 uppercase">items</span>
          </div>
          <p className="text-[9.5px] text-emerald-600 font-extrabold mt-1">
            Active under monitoring
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40">
          <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
            Total Capital Equity
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ${totalValue.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-450 uppercase">USD</span>
          </div>
          <p className="text-[9.5px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-1">
            Current replacement valuation
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40">
          <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
            Mean Health Score
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {averageHealth}%
            </span>
            <span className="text-[10px] font-bold text-slate-450 uppercase">Score</span>
          </div>
          <p className="text-[9.5px] text-emerald-600 font-extrabold mt-1">
            Excellent reliability index
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40">
          <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
            Asset Utilization Rate
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {utilizationChartData[utilizationChartData.length - 1].rate}%
            </span>
            <span className="text-[10px] font-bold text-slate-450 uppercase">Live</span>
          </div>
          <p className="text-[9.5px] text-slate-400 dark:text-zinc-500 font-bold mt-1">
            Up +1.4% this week
          </p>
        </div>
      </div>

      {/* 4. SMART INSIGHTS & LOGICAL RECOMMENDATIONS */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/15 dark:border-indigo-950/45 dark:bg-indigo-950/5 p-5.5 space-y-3">
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-400">
          <Sparkles className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-450 animate-pulse shrink-0" />
          <span>Operational AI Insights (Dynamic Workspace Telemetry)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 text-[11px] font-bold text-indigo-950 dark:text-indigo-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HERO CHARTS GRID LAYOUT (Bento-style Power BI meets Stripe) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
        
        {/* CHART 1: Asset Utilization Over Time (8 Columns wide) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 h-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                Asset Utilization Over Time
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                Proportion of active allocated workspace nodes against inactive inventory.
              </p>
            </div>
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded font-black text-slate-500 dark:text-zinc-400 tracking-wider">
              LINE RATE %
            </span>
          </div>

          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="utilizationColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-900/60" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" domain={[50, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area type="monotone" dataKey="rate" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#utilizationColor)" name="Utilization Rate (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Asset Health Distribution (4 Columns wide) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 h-[360px] flex flex-col">
          <div className="mb-2">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Asset Health Distribution
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
              Live conditions segmented from hardware logs.
            </p>
          </div>

          <div className="flex-1 min-h-0 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {healthDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Indicator */}
            <div className="absolute text-center select-none pointer-events-none">
              <span className="text-2xl font-black text-slate-800 dark:text-white leading-none block">
                {averageHealth}%
              </span>
              <span className="text-[8.5px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                AVG HEALTH
              </span>
            </div>
          </div>

          {/* Map legend labels */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-zinc-900 text-[10px] font-black">
            {healthDistributionData.map((entry, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-slate-650 dark:text-zinc-400 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="truncate">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: Maintenance Expenditure Trends (6 Columns wide) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 h-[360px] flex flex-col">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Maintenance Costs & Tickets
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
              Accumulated billing costs paired with repair ticket volume per category.
            </p>
          </div>

          <div className="flex-1 min-h-0 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={maintenanceTrendData} margin={{ top: 10, right: -5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-900/60" vertical={false} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={9} fontWeight="bold" tickLine={false} label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '9px', fontWeight: 'bold', fill: '#3b82f6' } }} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={9} fontWeight="bold" tickLine={false} label={{ value: 'Tickets', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: '9px', fontWeight: 'bold', fill: '#ef4444' } }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar yAxisId="left" dataKey="totalCost" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={25} name="Total Cost ($)" />
                <Line yAxisId="right" type="monotone" dataKey="ticketsCount" stroke="#ef4444" strokeWidth={3} name="Tickets Volume" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Lifecycle Depreciation Curve (6 Columns wide) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 h-[360px] flex flex-col">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Asset Equity Depreciation Curve
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
              5-year straight-line depreciation forecasts of portfolio asset group values.
            </p>
          </div>

          <div className="flex-1 min-h-0 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lifecycleAnalysisData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-900/60" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area type="monotone" dataKey="depreciated" stroke="#312e81" strokeWidth={2.5} fill="#4f46e5" fillOpacity={0.1} name="Depreciated Value ($)" />
                <Area type="monotone" dataKey="original" stroke="#059669" strokeWidth={1} strokeDasharray="5 5" fill="none" name="Purchase Capital ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: Department Allocation value bar chart (6 Columns wide) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 h-[360px] flex flex-col">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Department Capital Allocation
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-zinc-550 mt-0.5">
              Aggregate valuation value of hardware allocated among corporate divisions.
            </p>
          </div>

          <div className="flex-1 min-h-0 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAllocationData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-900/60" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }} 
                />
                <Bar dataKey="totalValue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} name="Valuation USD ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 6: Booking Heatmap (6 Columns wide - stripe / github activity grid) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-900 dark:bg-zinc-950/40 h-[360px] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
              Room & Vehicle Booking Heatmap
            </h3>
            <p className="text-[10px] text-slate-450 dark:text-zinc-550 mt-0.5">
              Live heatmap tracking peak utilization periods of rooms and fleet keys over day and time.
            </p>
          </div>

          {/* GitHub style 2D Contribution Heatmap Grid */}
          <div className="flex-1 flex flex-col justify-center py-2 min-h-0">
            {/* Headers for hours */}
            <div className="grid grid-cols-[80px_1fr] gap-2 mb-1.5">
              <div />
              <div className="grid grid-cols-7 gap-1 text-[8.5px] font-black text-slate-400 dark:text-zinc-500 uppercase text-center select-none">
                {hoursOfDay.map(hour => <span key={hour}>{hour}</span>)}
              </div>
            </div>

            {/* Matrix rows */}
            <div className="space-y-1.5">
              {daysOfWeek.map((day, dayIdx) => (
                <div key={day} className="grid grid-cols-[80px_1fr] gap-2 items-center">
                  <span className="text-[9.5px] font-extrabold text-slate-500 dark:text-zinc-400 leading-none truncate">
                    {day.slice(0, 3)}
                  </span>
                  
                  <div className="grid grid-cols-7 gap-1 h-6">
                    {hoursOfDay.map((hour, hourIdx) => {
                      const density = getBookingDensity(dayIdx, hourIdx);
                      
                      // Assign color weight class
                      let bgClass = 'bg-slate-50 dark:bg-zinc-900 border-slate-100 dark:border-zinc-800/40';
                      if (density === 1) bgClass = 'bg-emerald-100 border-emerald-200/50 dark:bg-emerald-950/40 dark:border-emerald-900/10';
                      else if (density === 2) bgClass = 'bg-emerald-300 border-emerald-400/50 dark:bg-emerald-900/50 dark:border-emerald-800/20';
                      else if (density === 3) bgClass = 'bg-emerald-500 border-emerald-600/50 dark:bg-emerald-750 dark:border-emerald-700/20';
                      else if (density >= 4) bgClass = 'bg-emerald-700 border-emerald-800/50 dark:bg-emerald-650 dark:border-emerald-600/30';

                      return (
                        <div
                          key={hour}
                          className={`w-full h-full rounded border flex items-center justify-center transition-all cursor-help relative group ${bgClass}`}
                        >
                          {/* Rich Interactive Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-40 bg-slate-900 text-white rounded px-2.5 py-1.5 text-[10px] font-black whitespace-nowrap shadow-md uppercase tracking-wider border border-zinc-800">
                            <p className="leading-none">{day}</p>
                            <p className="text-emerald-400 mt-1 leading-none font-mono">{density} Active Bookings @ {hour}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase border-t border-slate-100 dark:border-zinc-900 pt-2 shrink-0">
            <span>Low booking frequency</span>
            <div className="flex items-center space-x-1">
              <span>Less</span>
              <span className="h-3.5 w-3.5 rounded bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850" />
              <span className="h-3.5 w-3.5 rounded bg-emerald-100 dark:bg-emerald-950/40" />
              <span className="h-3.5 w-3.5 rounded bg-emerald-300 dark:bg-emerald-900/50" />
              <span className="h-3.5 w-3.5 rounded bg-emerald-500 dark:bg-emerald-750" />
              <span className="h-3.5 w-3.5 rounded bg-emerald-700 dark:bg-emerald-650" />
              <span>More</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
