
import React, { useState, useEffect, useCallback, useRef } from 'react';

const StudyTimer: React.FC = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isEditing, setIsEditing] = useState(false);

  // Refs to track previous values for flip triggers
  const prevHours = useRef(hours);
  const prevMinutes = useRef(minutes);
  const prevSeconds = useRef(seconds);

  const switchMode = useCallback(() => {
    if (mode === 'focus') {
      setMode('break');
      setHours(0);
      setMinutes(5);
    } else {
      setMode('focus');
      setHours(0);
      setMinutes(25);
    }
    setSeconds(0);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else if (minutes > 0) {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours(prev => prev - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          switchMode();
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, hours, minutes, seconds, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setHours(0);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const handleManualSet = (h: number, m: number, s: number) => {
    setHours(Math.max(0, h));
    setMinutes(Math.min(59, Math.max(0, m)));
    setSeconds(Math.min(59, Math.max(0, s)));
    setIsEditing(false);
  };

  const FlipUnit = ({ value, label, prevValue }: { value: number; label: string; prevValue: number }) => {
    const formattedValue = value.toString().padStart(2, '0');
    const formattedPrev = prevValue.toString().padStart(2, '0');
    const isChanging = value !== prevValue;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex flex-col items-center justify-center w-28 h-40 md:w-40 md:h-56 bg-slate-900 dark:bg-black rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
          {/* Top Static Part */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-800 to-slate-900 flex items-end justify-center overflow-hidden border-b border-black/40">
             <span className="text-6xl md:text-8xl font-black text-white translate-y-1/2 select-none">{formattedValue}</span>
          </div>
          
          {/* Bottom Static Part */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900 to-slate-800 flex items-start justify-center overflow-hidden">
             <span className="text-6xl md:text-8xl font-black text-white -translate-y-1/2 select-none">{formattedValue}</span>
          </div>

          {/* Animating Flip Card */}
          {isChanging && (
            <div className="absolute inset-0 z-30">
               {/* Top Flip Half */}
               <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-800 to-slate-900 flex items-end justify-center overflow-hidden border-b border-black/40 animate-flip origin-bottom">
                  <span className="text-6xl md:text-8xl font-black text-white translate-y-1/2 select-none">{formattedPrev}</span>
               </div>
            </div>
          )}

          {/* Divider Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-black/60 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
        </div>
        <span className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">{label}</span>
      </div>
    );
  };

  useEffect(() => {
    prevHours.current = hours;
    prevMinutes.current = minutes;
    prevSeconds.current = seconds;
  }, [hours, minutes, seconds]);

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className={`px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500 shadow-xl ${
          mode === 'focus' 
          ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none' 
          : 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none'
        }`}>
          {mode === 'focus' ? '🎯 Deep Work Session' : '🌿 Refreshing Break'}
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
        >
          {isEditing ? 'Cancel' : 'Set Time'}
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl flex flex-col items-center space-y-8 animate-in slide-in-from-top-4">
          <div className="flex space-x-6">
            <div className="flex flex-col items-center space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Hr</label>
              <input type="number" value={hours} onChange={e => setHours(parseInt(e.target.value) || 0)} className="w-20 p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-2xl font-black text-center focus:ring-4 focus:ring-indigo-100 outline-none" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Min</label>
              <input type="number" value={minutes} onChange={e => setMinutes(parseInt(e.target.value) || 0)} className="w-20 p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-2xl font-black text-center focus:ring-4 focus:ring-indigo-100 outline-none" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Sec</label>
              <input type="number" value={seconds} onChange={e => setSeconds(parseInt(e.target.value) || 0)} className="w-20 p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-2xl font-black text-center focus:ring-4 focus:ring-indigo-100 outline-none" />
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(false)}
            className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl"
          >
            Update Timer
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4 md:space-x-8">
          <FlipUnit value={hours} label="Hours" prevValue={prevHours.current} />
          <div className="flex flex-col space-y-4 pt-4">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
          <FlipUnit value={minutes} label="Minutes" prevValue={prevMinutes.current} />
          <div className="flex flex-col space-y-4 pt-4">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
          <FlipUnit value={seconds} label="Seconds" prevValue={prevSeconds.current} />
        </div>
      )}

      <div className="mt-16 flex items-center space-x-8">
        <button 
          onClick={resetTimer}
          className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] text-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-soft active:scale-95"
          title="Reset Timer"
        >
          🔄
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-28 h-28 rounded-[3rem] flex items-center justify-center text-3xl transition-all shadow-2xl active:scale-90 ${
            isActive 
            ? 'bg-rose-500 text-white shadow-rose-200 dark:shadow-none' 
            : 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none'
          }`}
        >
          {isActive ? '⏸' : '▶'}
        </button>

        <button 
          onClick={switchMode}
          className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] text-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-soft active:scale-95"
          title="Switch Mode"
        >
          ⚡
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-xs leading-relaxed opacity-60">
          Visualizing entropy through the mechanical flip. Stay present.
        </p>
      </div>
    </div>
  );
};

export default StudyTimer;
