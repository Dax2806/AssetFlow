import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { INSIGHTS } from './mockData';

export default function InsightCard() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % INSIGHTS.length);
  };

  const currentInsight = INSIGHTS[index];

  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-amber-100 bg-amber-50/15 px-4 py-2.5 dark:border-amber-950/20 dark:bg-amber-950/5 select-none min-h-[46px] w-full lg:max-w-xs xl:max-w-sm">
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 animate-pulse" />
        <div className="relative flex-1 min-w-0 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentInsight.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 truncate leading-relaxed"
            >
              {currentInsight.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      
      <button
        onClick={handleNext}
        className="ml-2 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded bg-amber-100/40 text-amber-600 hover:bg-amber-100/80 transition-colors dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/60"
        title="Next Insight"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
