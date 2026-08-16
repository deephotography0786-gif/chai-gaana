import React, { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
  const [stage, setStage] = useState<'pouring' | 'ready' | 'exit'>('pouring');

  useEffect(() => {
    // Fast, crisp cinematic feel without boring delay
    const timer1 = setTimeout(() => {
      setStage('ready');
    }, 700);

    const timer2 = setTimeout(() => {
      setStage('exit');
    }, 1400);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div
      id="vintage-loading-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#140a06] text-[#fef3c7] transition-opacity duration-700 select-none ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Soft Amber Radial Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />

      {/* Steaming Cutting Chai Cup Visual */}
      <div className="relative flex flex-col items-center mb-6">
        {/* Steam Waves */}
        <div className="flex space-x-2 h-10 items-end mb-2">
          <div className="w-1.5 h-6 bg-gradient-to-t from-amber-200/60 to-transparent rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-9 bg-gradient-to-t from-amber-200/80 to-transparent rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-7 bg-gradient-to-t from-amber-200/60 to-transparent rounded-full animate-bounce" />
        </div>

        {/* Vintage Chai Glass / Clay Kulhad */}
        <div className="relative w-20 h-24 rounded-b-2xl bg-gradient-to-b from-[#8c4217] to-[#451f0b] border-2 border-amber-500/50 shadow-2xl overflow-hidden flex items-end justify-center">
          {/* Chai Liquid Fill */}
          <div className="w-full h-16 bg-gradient-to-t from-[#692d0c] to-[#a3521b] flex items-start justify-center">
            {/* Foam/Malai Layer */}
            <div className="w-full h-2 bg-amber-200/40 border-b border-amber-300/30" />
          </div>
          {/* Glass Ribs / Vintage cutting texture */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(255,255,255,0.06)_6px,rgba(255,255,255,0.06)_8px)] pointer-events-none" />
        </div>

        {/* Saucer / Clay Base */}
        <div className="w-28 h-3.5 mt-1 rounded-full bg-stone-900 border border-amber-900/60 shadow-lg" />
      </div>

      {/* Nostalgic Branding & Status Text */}
      <div className="text-center space-y-2 z-10 px-4">
        <h1 className="font-['Yatra_One'] text-2xl sm:text-3xl text-amber-200 tracking-wider">
          CHAI & GAANA
        </h1>
        <p className="font-['Playfair_Display'] text-base sm:text-lg text-amber-300/90 italic transition-all duration-300">
          {stage === 'pouring' ? 'Pouring the nostalgia...' : 'Your chai is ready ☕'}
        </p>
        <span className="text-[11px] font-mono text-stone-400 block tracking-widest uppercase">
          {stage === 'pouring' ? 'ट्यूनिंग रेडियो...' : 'स्वागत है • WELCOME'}
        </span>
      </div>
    </div>
  );
};
