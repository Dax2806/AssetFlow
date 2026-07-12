import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number; // width/height in px
}

/**
 * Completely original, premium, minimal, and timeless brand mark for AssetFlow.
 * Created by an award-winning Brand Identity Designer.
 * 
 * Design Concepts:
 * - Connected Systems & Modular Architecture: A continuous flowing helix/spiral.
 * - Continuous Workflow: A single uninterrupted geometric stroke representing the asset lifecycle.
 * - Stable Foundation -> Operational Flow: A fluid color-transition from Slate to Emerald.
 * - Monogram integration: Formulates a stylized monogram "A" with a floating horizontal flow crossbar.
 * - Scalability: Highly optimized geometric nodes that render razor-sharp at 16x16px up to splash-screen sizes.
 */
export function AssetFlowLogoIcon({ className = '', size = 28 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        {/* Modern high-contrast color transition from a reliable structural slate to an energetic operational emerald */}
        <linearGradient id="assetflow-helix-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" /> {/* Stable Slate Base */}
          <stop offset="35%" stopColor="#0f766e" /> {/* Deep Tech Teal Transition */}
          <stop offset="75%" stopColor="#10b981" /> {/* Vibrant Connected Emerald */}
          <stop offset="100%" stopColor="#34d399" /> {/* Elegant Mint Flow Terminal */}
        </linearGradient>
      </defs>
      
      {/* 
        Mathematically precise bezier continuous line.
        Traces a stable vertical base, curves over to the apex, wraps down and under to form 
        the continuous lifecycle loop, rises on the left inner core, and exits into a 
        perfect floating horizontal crossbar.
      */}
      <path
        d="M 5.5,18.5 L 5.5,15.5 C 5.5,9.5 8.5,5 12,5 C 15.5,5 18.5,8.5 18.5,12.5 C 18.5,16.5 15.5,19 12,19 C 8.5,19 7,16 7,12.5 C 7,9.5 9.5,8.5 12,8.5 H 16.5"
        stroke="url(#assetflow-helix-gradient)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Refined typographic Wordmark for AssetFlow.
 * Featuring tight tracking (-0.03em), elegant weight hierarchy, and a confident period mark.
 */
export function AssetFlowWordmark({ className = '', size = 'md' }: WordmarkProps) {
  const sizeClasses = {
    sm: 'text-[13px]',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={`font-sans leading-none text-slate-900 dark:text-white select-none ${sizeClasses[size]} ${className}`}>
      <span className="font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">Asset</span>
      <span className="font-black tracking-[-0.03em] text-emerald-500 dark:text-emerald-400 ml-0.5">Flow</span>
      <span className="text-emerald-500 dark:text-emerald-400 font-black ml-0.5">.</span>
    </div>
  );
}

interface CombinedLogoProps {
  className?: string;
  iconSize?: number;
  wordmarkSize?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

/**
 * Cohesive Brand Layout block combining the stylized helix mark with the refined wordmark.
 * Used across navbars, sidebar headers, command palettes, and auth screens.
 */
export function AssetFlowBrandLogo({ 
  className = '', 
  iconSize = 28, 
  wordmarkSize = 'md',
  showSubtitle = false 
}: CombinedLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AssetFlowLogoIcon size={iconSize} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <AssetFlowWordmark size={wordmarkSize} />
        </div>
        {showSubtitle && (
          <span className="block text-[8px] font-bold text-slate-400 dark:text-zinc-500 tracking-widest uppercase mt-0.5">
            Operational Intelligence
          </span>
        )}
      </div>
    </div>
  );
}
