import React from 'react';

export const Bottle = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
      {/* Precision Pointer at Mouth */}
      <div className="absolute -top-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-[#C5A059] drop-shadow-[0_0_5px_rgba(197,160,89,0.8)]" />
      
      {/* Bottle Cap */}
      <div className="w-4 h-6 bg-[#2A2D35] rounded-t-sm border-x border-t border-white/20 relative z-10" />
      
      {/* Bottle Neck */}
      <div className="w-6 h-12 bg-gradient-to-r from-[#1E2128] to-[#2A2D35] border-x border-white/10" />
      
      {/* Bottle Body */}
      <div className="w-14 flex-1 bg-gradient-to-r from-[#181A20] via-[#24272E] to-[#181A20] rounded-b-2xl border-x border-b border-white/10 relative overflow-hidden">
        {/* Label */}
        <div className="absolute top-1/3 left-0 w-full h-16 bg-[#C5A059] flex items-center justify-center">
          <div className="w-full h-[1px] bg-black/10 absolute top-1" />
          <span className="text-[8px] text-black font-extrabold uppercase tracking-tighter">Vintage</span>
          <div className="w-full h-[1px] bg-black/10 absolute bottom-1" />
        </div>
        
        {/* Light Highlight */}
        <div className="absolute left-1 top-0 w-1 h-full bg-white/5 blur-[1px]" />
      </div>
      
      {/* Central Pivot Visual */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-3 h-3 bg-[#C5A059] rounded-full border-2 border-[#0A0B0E] shadow-lg" />
    </div>
  );
};
