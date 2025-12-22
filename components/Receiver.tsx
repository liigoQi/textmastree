
import React, { useState, useEffect, useCallback } from 'react';
import { TreeData } from '../types';
import ChristmasTree from './ChristmasTree';
import PixelButton from './PixelButton';
import { Sparkles, MousePointer2, Smartphone } from 'lucide-react';

interface ReceiverProps {
  data: TreeData;
  onReset: () => void;
}

const Receiver: React.FC<ReceiverProps> = ({ data, onReset }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleStart = () => {
    setIsRevealing(true);
    setHasInteracted(true);
  };

  const handleEnd = () => {
    setIsRevealing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full p-4 gap-12 animate-in fade-in duration-1000">
      <div className="relative group perspective-1000">
        <ChristmasTree data={data} isRevealing={isRevealing} />
        
        {/* 交互提示 */}
        {!hasInteracted && !isRevealing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="bg-black/60 backdrop-blur-md p-6 rounded-full animate-pulse border border-white/20 shadow-2xl">
                <MousePointer2 className="text-white w-10 h-10" />
             </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 max-w-xs text-center">
        <div
          onPointerDown={handleStart}
          onPointerUp={handleEnd}
          onPointerLeave={handleEnd}
          className={`
            group flex flex-col items-center gap-3 cursor-pointer touch-none select-none
            p-8 rounded-[2rem] border-2 transition-all duration-500
            ${isRevealing
              ? 'bg-yellow-500 border-yellow-300 scale-95 shadow-[0_0_50px_rgba(234,179,8,0.6)]'
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 shadow-2xl backdrop-blur-sm'
            }
          `}
        >
          <div className={`
             w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
             ${isRevealing ? 'bg-white text-yellow-600 scale-110 rotate-12' : 'bg-slate-700 text-slate-400'}
          `}>
             <Smartphone size={32} className={isRevealing ? 'animate-bounce' : ''} />
          </div>
          <div className="space-y-1">
            <p className={`
              pixel-font text-[10px] sm:text-xs uppercase tracking-tighter transition-colors
              ${isRevealing ? 'text-black font-bold' : 'text-slate-200 animate-pulse'}
            `}>
              {isRevealing ? '圣诞快乐！' : '长按屏幕点灯'}
            </p>
            {!isRevealing && <p className="text-[9px] mono-font text-slate-500 italic">Hidden message inside...</p>}
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6 w-full">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <PixelButton onClick={onReset} variant="secondary" className="w-full">
            <span className="flex items-center justify-center gap-3">
              <Sparkles size={16} />
              点亮我的文字圣诞树
            </span>
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default Receiver;
