import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Asset, AssetStatus } from '../types';

interface AssetStatusChartProps {
  assets: Asset[];
}

const STATUS_CONFIG: Record<AssetStatus, { label: string; color: string; desc: string }> = {
  available: { label: 'Available', color: '#10b981', desc: 'Ready for use' }, // Emerald
  allocated: { label: 'Allocated', color: '#6b7280', desc: 'Assigned to users' }, // Gray
  reserved: { label: 'Reserved', color: '#6366f1', desc: 'Booked in advance' }, // Indigo
  maintenance: { label: 'Maintenance', color: '#f59e0b', desc: 'Undergoing service' }, // Amber
  lost: { label: 'Lost / Missing', color: '#ef4444', desc: 'Investigation open' }, // Red
  disposed: { label: 'Disposed', color: '#9ca3af', desc: 'Scrapped or retired' } // Light Gray
};

export default function AssetStatusChart({ assets }: AssetStatusChartProps) {
  // Aggregate data
  const counts = React.useMemo(() => {
    const agg: Record<AssetStatus, number> = {
      available: 0,
      allocated: 0,
      reserved: 0,
      maintenance: 0,
      lost: 0,
      disposed: 0
    };
    assets.forEach(asset => {
      if (agg[asset.status] !== undefined) {
        agg[asset.status]++;
      }
    });
    return agg;
  }, [assets]);

  const total = assets.length;

  const data = React.useMemo(() => {
    return Object.keys(counts).map(status => {
      const s = status as AssetStatus;
      return {
        name: STATUS_CONFIG[s].label,
        value: counts[s],
        statusKey: s,
        color: STATUS_CONFIG[s].color
      };
    }).filter(d => d.value > 0); // Only render categories with items
  }, [counts]);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const activeItem = React.useMemo(() => {
    if (activeIndex !== null && data[activeIndex]) {
      return data[activeIndex];
    }
    return null;
  }, [activeIndex, data]);

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-900">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Asset Status Distribution
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500">
            Live inventory health breakdown
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {total} Total
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex flex-col items-center justify-center md:flex-row md:space-x-4">
        {/* The Pie Chart Container */}
        <div className="relative h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={74}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="outline-none transition-opacity hover:opacity-90"
                    style={{
                       filter: activeIndex === index ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-100 bg-white/95 p-2 shadow-md dark:border-zinc-900 dark:bg-zinc-950/95">
                        <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dataPoint.color }} />
                          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                            {dataPoint.name}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                          {dataPoint.value} asset{dataPoint.value > 1 ? 's' : ''} ({Math.round((dataPoint.value / total) * 100)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total / Active Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {activeItem ? (
              <>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-center max-w-[80px] truncate">
                  {activeItem.name}
                </span>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none mt-0.5">
                  {activeItem.value}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
                  {Math.round((activeItem.value / total) * 100)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-center">
                  Active
                </span>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-none mt-0.5">
                  {assets.filter(a => ['available', 'allocated', 'reserved'].includes(a.status)).length}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
                  in operation
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-1 flex-col space-y-2 md:mt-0">
          {Object.keys(STATUS_CONFIG).map((statusKey) => {
            const s = statusKey as AssetStatus;
            const config = STATUS_CONFIG[s];
            const count = counts[s] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            const isHighlighted = activeItem && activeItem.statusKey === s;

            return (
              <div
                key={s}
                className={`flex items-center justify-between rounded-lg px-2 py-1 transition-all ${
                  isHighlighted ? 'bg-slate-50/80 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900' : 'border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      {config.label}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500">
                      {config.desc}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                    {count}
                  </span>
                  <span className="ml-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-normal">
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
