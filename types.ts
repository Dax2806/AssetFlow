import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { UtilizationDataPoint } from '../types';

interface UtilizationChartProps {
  data: UtilizationDataPoint[];
}

export default function UtilizationChart({ data }: UtilizationChartProps) {
  const [timeframe, setTimeframe] = React.useState<'7d' | '30d'>('7d');

  // Generate mock 30d data if selected to show full interactivity
  const chartData = React.useMemo(() => {
    if (timeframe === '7d') {
      return data;
    }
    // Generate simulated 30d data backing off from current values
    const extendedData: UtilizationDataPoint[] = [];
    const baseDates = [
      'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20', 'Jun 21',
      'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29', 'Jun 30', 'Jul 01',
      'Jul 02', 'Jul 03', 'Jul 04'
    ];
    
    // Add baseline
    baseDates.forEach((date, i) => {
      // Simulate random slight fluctuations upwards
      const randomRate = 72 + Math.sin(i * 0.5) * 4 + (i / baseDates.length) * 8 + Math.random() * 2;
      extendedData.push({
        date,
        rate: Math.min(Math.round(randomRate * 10) / 10, 100),
        allocatedCount: Math.round(55 + (i / baseDates.length) * 15 + Math.random() * 3),
        maintenanceCount: Math.round(2 + Math.random() * 3)
      });
    });

    // Add actual 7d data
    return [...extendedData, ...data];
  }, [data, timeframe]);

  const latestRate = data[data.length - 1]?.rate || 0;
  const previousRate = data[data.length - 2]?.rate || 0;
  const difference = (latestRate - previousRate).toFixed(1);
  const isPositive = latestRate >= previousRate;

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex flex-col justify-between border-b border-slate-100 pb-3 dark:border-zinc-900 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Resource Utilization
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500">
            Daily active allocation and workspace booking rates
          </p>
        </div>

        {/* Filters */}
        <div className="mt-2 flex items-center space-x-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {latestRate}%
            </span>
            <span className={`text-[10px] font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{difference}%
            </span>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-zinc-900">
            <button
              onClick={() => setTimeframe('7d')}
              className={`rounded px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer ${
                timeframe === '7d'
                  ? 'bg-white text-slate-800 shadow-xs dark:bg-zinc-800 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`rounded px-2.5 py-1 text-[10px] font-medium transition-all cursor-pointer ${
                timeframe === '30d'
                  ? 'bg-white text-slate-800 shadow-xs dark:bg-zinc-800 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 h-56 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-900" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              className="dark:stroke-zinc-600"
              style={{ fontSize: '10px', fontWeight: '500' }}
              dy={10}
            />
            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              className="dark:stroke-zinc-600"
              style={{ fontSize: '10px', fontWeight: '500' }}
              dx={5}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-100 bg-white/95 p-2 shadow-md dark:border-zinc-900 dark:bg-zinc-950/95">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        {dataPoint.date}
                      </p>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                          {dataPoint.rate}%
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">Utilization</span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        Allocated: {dataPoint.allocatedCount} • Maint: {dataPoint.maintenanceCount}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 2, stroke: '#10b981', strokeWidth: 1, fill: '#ffffff' }}
              activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
