import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronRight, Sparkles } from 'lucide-react';

const DEFAULT_INSIGHTS = [
  { id: '1', text: 'Engineering owns 43% of company hardware assets.' },
  { id: '2', text: 'Meeting Room B is booked 81% of the work week.' },
  { id: '3', text: '12 standard laptop units have been idle for over 45 days.' },
  { id: '4', text: 'Auto-depreciation scan indicates IT Hardware units lost 24.5% value.' },
  { id: '5', text: 'Facilities division holds the highest valued equipment inventory.' },
];

interface InsightCardProps {
  insights?: { id: string; text: string }[];
  className?: string;
}

export default function InsightCard({ insights = DEFAULT_INSIGHTS, className = '' }: InsightCardProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % insights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [insights]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % insights.length);
  };

  const currentInsight = insights[index];

  return (
    <div className={`relative flex items-center justify-between overflow-hidden rounded-xl border border-violet-100 bg-violet-50/20 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/40 select-none min-h-[46px] w-full lg:max-w-xs xl:max-w-md ${className}`}>
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
        <div className="relative flex-1 min-w-0 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentInsight?.id || 'empty'}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 text-[11px] font-bold text-slate-700 dark:text-zinc-300 truncate leading-relaxed"
            >
              {currentInsight?.text || 'Scanning asset registries for system optimization recommendations...'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      
      <button
        onClick={handleNext}
        className="ml-2 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded bg-violet-100/40 text-violet-600 hover:bg-violet-100/80 transition-colors dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        title="Next Recommendation"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
