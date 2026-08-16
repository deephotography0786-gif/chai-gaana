import React from 'react';
import { TimeOfDay, AnimationLevel } from '../types/music';

interface Props {
  timeOfDay: TimeOfDay;
  animationLevel: AnimationLevel;
  isPlaying: boolean;
}

export const TeaStallDecor: React.FC<Props> = ({
  animationLevel,
  isPlaying,
}) => {
  if (animationLevel === 'off') return null;

  return (
    <div
      id="tea-stall-ambient-decor"
      className="pointer-events-none absolute inset-0 overflow-hidden z-5 select-none"
    >
      {/* Discreet Live Nostalgic Status Badge */}
      <div className="absolute top-16 right-4 sm:right-8 hidden lg:flex items-center space-x-2 text-xs font-['Cormorant_Garamond'] text-amber-200/80 bg-stone-950/60 px-3 py-1 rounded-full border border-amber-900/40 backdrop-blur-md shadow-md">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPlaying ? 'bg-amber-400 animate-ping' : 'bg-amber-600'
          }`}
        />
        <span className="tracking-wide">ताज़ा चाय और पुराने नगमे 📻</span>
      </div>
    </div>
  );
};
