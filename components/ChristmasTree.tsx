
import React, { useMemo } from 'react';
import { TreeRow, TreeChar, TreeData } from '../types';
import { buildTreeLayout } from '../utils/helpers';

interface ChristmasTreeProps {
  data: TreeData;
  isRevealing?: boolean;
  onCharClick?: (index: number) => void;
  highlightMode?: boolean;
  isBuilding?: boolean;
}

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ 
  data, 
  isRevealing = false,
  onCharClick,
  highlightMode = false,
  isBuilding = false
}) => {
  const rows = useMemo(() => buildTreeLayout(data), [data.c, data.t]);

  return (
    <div className={`flex flex-col items-center select-none relative ${isBuilding ? 'scanline' : ''}`}>
      {/* 树顶 */}
      <div className={`
        mb-2 text-3xl sm:text-4xl transition-all duration-700
        ${isRevealing ? 'scale-150 rotate-[360deg] brightness-125' : 'animate-[twinkle_2s_infinite_ease-in-out]'}
      `}>
        {data.t || '⭐'}
      </div>

      {/* 树身 */}
      <div className="flex flex-col items-center">
        {rows.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex leading-tight h-[1.3rem] sm:h-[1.5rem]"
          >
            {row.map((item, colIndex) => {
              const isDecoration = item.index === -1; // 装饰物标记
              const isHighlight = !isDecoration && data.h.includes(item.index); // 动态计算高亮状态
              const isActive = isRevealing && isHighlight;
              const isHidden = isRevealing && !isHighlight;

              // 构建时的流动效果
              const buildDelay = (rowIndex * 0.1 + colIndex * 0.05).toFixed(2);

              return (
                <span
                  key={`${item.index}-${colIndex}`}
                  onClick={() => highlightMode && !isDecoration && onCharClick?.(item.index)}
                  style={{
                    animationDelay: `${buildDelay}s`,
                    transitionDelay: isRevealing ? `${colIndex * 0.02}s` : '0s'
                  }}
                  className={`
                    w-6 sm:w-7 flex items-center justify-center transition-all duration-500
                    text-base sm:text-xl
                    ${!isBuilding ? 'char-enter' : 'opacity-0'}
                    ${highlightMode && !isDecoration ? 'hover:bg-yellow-500/20 rounded-sm cursor-pointer scale-110' : 'cursor-default'}
                    ${isHighlight && highlightMode && !isDecoration ? 'text-yellow-300 font-bold scale-125 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] bg-yellow-500/20 rounded-sm border border-yellow-500/50 animate-pulse' : ''}

                    ${isHidden && !isDecoration ? 'opacity-10 blur-[1px] scale-75 rotate-12' : 'opacity-100'}
                    ${isActive ? 'text-yellow-300 scale-150 [text-shadow:0_0_15px_#facc15] font-bold z-10 rotate-0' : ''}
                    ${!isRevealing && !highlightMode && !isDecoration ? 'text-green-400 hover:text-green-300' : !isDecoration ? 'text-slate-400' : ''}

                    ${isBuilding ? 'animate-[pulse_1s_infinite]' : ''}
                    ${isDecoration ? `text-yellow-300 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] ${isActive ? 'animate-pulse [text-shadow:0_0_20px_#facc15,0_0_30px_#facc15]' : 'animate-pulse'}` : ''}
                  `}
                >
                  {item.char}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* 树干 */}
      <div className="flex flex-col items-center mt-2">
        <div className="text-amber-800 font-bold leading-none scale-x-125 drop-shadow-md">##</div>
        <div className="text-amber-800 font-bold leading-none scale-x-125 drop-shadow-md">##</div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          50% { opacity: 0.7; transform: scale(1.1); filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
};

export default ChristmasTree;
