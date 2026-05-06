import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { Bottle } from './components/Bottle';
import { OptionInput } from './components/OptionInput';

const MAX_OPTIONS = 5;
const MIN_OPTIONS = 2;

export default function App() {
  const [options, setOptions] = useState<string[]>(['Alexander', 'Julianna', 'Marcus', '', '']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(180);
  const controls = useAnimation();

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      // Responsive radius based on viewport and container max-widths
      if (width < 640) setRadius(135);
      else if (width < 1024) setRadius(170);
      else setRadius(210);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions[index] = '';
    setOptions(newOptions);
    setWinnerIndex(null);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setWinnerIndex(null);
  };

  const spin = async () => {
    if (isSpinning) return;
    
    // Calculate valid options once at the start
    const validWithIndices = options
      .map((o, i) => ({ val: o.trim(), originalIdx: i }))
      .filter(o => o.val !== '');

    if (validWithIndices.length < MIN_OPTIONS) return;

    setIsSpinning(true);
    setWinnerIndex(null);

    const randomIndexInFiltered = Math.floor(Math.random() * validWithIndices.length);
    const selected = validWithIndices[randomIndexInFiltered];
    
    const degreesPerOption = 360 / validWithIndices.length;
    
    // Each option i is centered at (i * degreesPerOption)
    // To point the bottle mouth (which starts at 0deg) at option i,
    // we need a rotation R such that (R % 360) == (i * degreesPerOption)
    const targetDegree = randomIndexInFiltered * degreesPerOption;
    
    const extraSpins = 10 + Math.floor(Math.random() * 5);
    
    // Absolute rotation calculation
    const currentRot = rotation;
    let newRotation = currentRot + (extraSpins * 360) + (targetDegree - (currentRot % 360));
    
    // Ensure we always spin forward
    if (newRotation <= currentRot) {
      newRotation += 360;
    }

    await controls.start({
      rotate: newRotation,
      transition: {
        duration: 4.5,
        ease: [0.12, 0, 0.1, 1], // Very controlled deceleration
      }
    });

    setRotation(newRotation);
    setWinnerIndex(randomIndexInFiltered);
    setIsSpinning(false);
  };

  const reset = () => {
    setWinnerIndex(null);
    setOptions(['', '', '', '', '']);
    setRotation(0);
    controls.set({ rotate: 0 });
  };

  const validOptions = options.map(o => o.trim()).filter(o => o !== '');
  const winnerName = winnerIndex !== null ? validOptions[winnerIndex] : null;

  return (
    <div className="min-h-screen w-full bg-[#0A0B0E] text-[#E0E0E0] font-sans flex flex-col selection:bg-[#C5A059]/30 overflow-x-hidden">
      {/* Top Navigation / Header */}
      <header className="w-full pt-6 md:pt-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 bg-gradient-to-b from-black/20 to-transparent gap-4">
        <div>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-1 font-semibold">The Midnight Collective</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight font-serif">Decision <span className="italic text-white">Bottle</span></h1>
        </div>
        <div className="flex gap-6 md:gap-8 text-[10px] md:text-[11px] uppercase tracking-widest text-white/40">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={reset}>Reset</span>
          <span className="text-[#C5A059]">Active Session</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 md:px-12 py-8 gap-16 items-center max-w-5xl mx-auto w-full">
        {/* Top Side: Inputs */}
        <div className="w-full flex flex-col gap-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-light text-white/90 font-serif italic">Set the Stakes</h2>
            <p className="text-[11px] text-[#C5A059] uppercase tracking-[0.4em] font-semibold opacity-80">Assign up to five outcomes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {options.map((opt, idx) => (
              <OptionInput
                key={idx}
                index={idx}
                value={opt}
                onChange={(val) => updateOption(idx, val)}
                onRemove={() => removeOption(idx)}
                disabled={isSpinning}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <button 
              onClick={spin}
              disabled={isSpinning || validOptions.length < MIN_OPTIONS}
              className={`
                w-full md:max-w-xs py-5 font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-2xl transform
                ${isSpinning || validOptions.length < MIN_OPTIONS
                  ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                  : 'bg-[#C5A059] text-[#0A0B0E] hover:bg-[#D4B475] active:scale-[0.98] shadow-[#C5A059]/20'}
              `}
            >
              {isSpinning ? 'The Fates Decide...' : 'Spin the Bottle'}
            </button>
          </div>
        </div>

        {/* Bottom Side: The Display */}
        <div className="flex-1 flex items-center justify-center relative py-8 lg:pt-20 lg:pb-32">
          <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] flex items-center justify-center">
            {/* The Decision Circle */}
            <div className="absolute inset-12 sm:inset-16 bg-[#111318] rounded-full shadow-[0_0_100px_rgba(197,160,89,0.05)] border border-white/10" />

            {/* Labels - Positioned outside overflow-hidden */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <AnimatePresence>
                {validOptions.map((opt, idx) => {
                  const angle = idx * (360 / validOptions.length);
                  // Dynamic radius calculation based on screen size
                  // On mobile (max-w 320px), radius should be around 140px
                  // On desktop (max-w 480px), radius should be around 220px
                  return (
                    <motion.div
                      key={`${idx}-${opt}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: winnerIndex !== null && winnerIndex !== idx ? 0.3 : 1, 
                        scale: winnerIndex === idx ? 1.1 : 1,
                        rotate: angle,
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute top-1/2 left-1/2 w-32 -ml-16 h-8 -mt-4 flex items-center justify-center transition-opacity duration-500"
                      style={{ originY: "50%", originX: "50%", pointerEvents: winnerIndex !== null && winnerIndex !== idx ? 'none' : 'auto' }}
                    >
                      <motion.div
                        animate={{ y: -radius }} 
                        className="relative"
                      >
                        <div 
                          className={`
                            text-center font-serif italic transition-all duration-700 whitespace-nowrap px-4 py-2 rounded-full border-2
                            ${winnerIndex === idx 
                              ? 'text-[#C5A059] scale-125 font-bold bg-black border-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.5)] z-50 ring-4 ring-[#C5A059]/10' 
                              : 'text-white/80 text-[11px] sm:text-xs md:text-sm bg-[#0E1015]/90 backdrop-blur-md border-white/10 shadow-2xl z-10'}
                          `}
                          style={{ transform: `rotate(${-angle}deg)` }}
                        >
                          {opt}
                        </div>
                        {/* Decorative line pointing to center */}
                        <div 
                          className={`absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-8 bg-gradient-to-b from-[#C5A059]/40 to-transparent -z-10`}
                          style={{ opacity: winnerIndex === idx ? 1 : 0 }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {validOptions.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-white/10 text-[9px] md:text-[10px] uppercase tracking-widest font-mono italic z-0">
                No Stakes Set
              </div>
            )}

            {/* The Bottle */}
            <motion.div
              animate={controls}
              className="relative z-10 w-12 h-56 sm:w-16 sm:h-72 cursor-grab active:cursor-grabbing"
              drag={!isSpinning}
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0}
              onDragEnd={(_, info) => {
                if (Math.abs(info.velocity.x) > 100 || Math.abs(info.velocity.y) > 100) spin();
              }}
            >
              <Bottle />
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
}
