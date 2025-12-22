
import React, { useState, useRef } from 'react';
import { TreeData } from '../types';
import ChristmasTree from './ChristmasTree';
import PixelButton from './PixelButton';
import { encodeTreeData, copyToClipboard } from '../utils/helpers';
import { Share2, CheckCircle, Sparkles, AlertCircle, Loader2, Wand2, ExternalLink, Copy, ArrowLeft, MousePointer2, Smartphone } from 'lucide-react';

interface EditorProps {
  onGenerate: (url: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onGenerate }) => {
  const [data, setData] = useState<TreeData>({
    t: '⭐',
    c: '祝你圣诞快乐新年大吉心想事成万事如意平安喜乐',
    h: [],
    s: 1
  });
  const [highlightMode, setHighlightMode] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isRevealingPreview, setIsRevealingPreview] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [buildPhase, setBuildPhase] = useState<'idle' | 'scanning' | 'revealing'>('idle');
  
  const treeRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 500);
    setData(prev => ({ ...prev, c: text, h: [] }));
  };

  const handleTopperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 获取第一个完整字符（支持emoji）
    const value = e.target.value;
    const firstChar = value.length > 0 ? [...value][0] : '';
    setData(prev => ({ ...prev, t: firstChar }));
  };

  const toggleHighlight = (index: number) => {
    // 在预览模式下或生成后不允许编辑高亮
    if (isRevealingPreview || isGenerated) return;

    setData(prev => {
      const h = prev.h.includes(index)
        ? prev.h.filter(i => i !== index)
        : [...prev.h, index];
      return { ...prev, h };
    });
  };

  const handleGenerate = () => {
    setIsBuilding(true);
    setBuildPhase('scanning');
    
    // 生成链接
    const encoded = encodeTreeData(data);
    const baseUrl = window.location.href.split('#')[0].split('?')[0];
    const url = `${baseUrl}#tree=${encoded}`;
    setGeneratedUrl(url);

    // 构建流程动画
    setTimeout(() => {
      setBuildPhase('revealing');
      setTimeout(() => {
        setIsBuilding(false);
        setBuildPhase('idle');
        setIsGenerated(true);
        // 自动滚动到顶部预览
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }, 1000);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedUrl);
    if (success) {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  const handleBackToEdit = () => {
    setIsGenerated(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto pb-24 p-4 animate-in fade-in duration-700">
      
      {/* 预览/交互区域 */}
      <section className={`
        w-full p-10 rounded-3xl border-2 transition-all duration-700 relative overflow-hidden flex flex-col items-center
        ${isGenerated 
          ? 'bg-slate-900 border-green-500/30 shadow-[0_0_80px_rgba(34,197,94,0.15)] min-h-[400px]' 
          : 'bg-slate-900/40 border-slate-800 shadow-2xl'
        }
      `}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        
        <h2 className="pixel-font text-[10px] text-slate-500 mb-8 uppercase tracking-[0.3em] opacity-50">
          {isGenerated ? '魔法圣诞树预览' : '实时预览'}
        </h2>
        
        <div 
          className={`relative transition-transform duration-500 ${isGenerated ? 'scale-110' : ''}`}
          onPointerDown={() => isGenerated && setIsRevealingPreview(true)}
          onPointerUp={() => isGenerated && setIsRevealingPreview(false)}
          onPointerLeave={() => isGenerated && setIsRevealingPreview(false)}
        >
          <ChristmasTree
            data={data}
            highlightMode={!isGenerated && highlightMode}
            onCharClick={toggleHighlight}
            isRevealing={buildPhase === 'revealing' || isRevealingPreview}
            isBuilding={buildPhase === 'scanning'}
          />

        </div>

        {/*{isGenerated && (
          <p className="mt-8 pixel-font text-[9px] text-green-500/60 uppercase tracking-widest animate-pulse">
            {isRevealingPreview ? '灯光已点亮' : '长按预览点亮效果'}
          </p>
        )} */}

        {/* 交互提示 (编辑模式) */}
        {!isBuilding && !isGenerated && highlightMode && (
          <div className="mt-8 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3 animate-bounce">
            <Wand2 className="text-yellow-500 w-4 h-4" />
            <p className="text-xs text-yellow-200 mono-font tracking-wider">点击树上的字，留下祝福</p>
          </div>
        )}

        {isBuilding && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="pixel-font text-xs text-green-400">圣诞树正在生长...</p>
          </div>
        )}
      </section>

      {/* 预览长按按钮 */}
      {isGenerated && (
        <section className="w-full flex flex-col items-center gap-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col items-center gap-8 max-w-xs text-center">
            <div
              onPointerDown={() => setIsRevealingPreview(true)}
              onPointerUp={() => setIsRevealingPreview(false)}
              onPointerLeave={() => setIsRevealingPreview(false)}
              className={`
                group flex flex-col items-center gap-3 cursor-pointer touch-none select-none
                p-8 rounded-[2rem] border-2 transition-all duration-500
                ${isRevealingPreview
                  ? 'bg-yellow-500 border-yellow-300 scale-95 shadow-[0_0_50px_rgba(234,179,8,0.6)]'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 shadow-2xl backdrop-blur-sm'
                }
              `}
            >
              <div className={`
                 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                 ${isRevealingPreview ? 'bg-white text-yellow-600 scale-110 rotate-12' : 'bg-slate-700 text-slate-400'}
              `}>
                 <Smartphone size={32} className={isRevealingPreview ? 'animate-bounce' : ''} />
              </div>
              <div className="space-y-1">
                <p className={`
                  pixel-font text-[10px] sm:text-xs uppercase tracking-tighter transition-colors
                  ${isRevealingPreview ? 'text-black font-bold' : 'text-slate-200 animate-pulse'}
                `}>
                  {isRevealingPreview ? '圣诞快乐！' : '长按屏幕点灯'}
                </p>
                {!isRevealingPreview && <p className="text-[9px] mono-font text-slate-500 italic">Hidden message inside...</p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 结果/分享面板 */}
      {isGenerated ? (
        <section className="w-full flex flex-col gap-6 animate-in slide-in-from-bottom-6 duration-700">
          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-md">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="space-y-1">
                <h3 className="pixel-font text-sm text-green-400">这是独属于你的圣诞树!</h3>
                <p className="text-slate-500 text-[10px] mono-font uppercase tracking-tighter">复制下方链接分享给你的朋友</p>
              </div>

              <div className="flex flex-wrap gap-4 w-full">
                <PixelButton onClick={handleCopy} variant="accent" className="flex-1 min-w-[160px] py-4 text-sm">
                  <span className="flex items-center justify-center gap-2">
                    {copyStatus ? <CheckCircle size={16} /> : <Share2 size={16} />}
                    {copyStatus ? '链接已复制' : '复制魔法链接'}
                  </span>
                </PixelButton>
                <PixelButton onClick={handleBackToEdit} variant="secondary" className="min-w-[120px] px-6 py-4">
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft size={16} />
                    返回编辑
                  </span>
                </PixelButton>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* 编辑面板 */
        <section className={`w-full space-y-6 transition-all duration-500 ${isBuilding ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 hover:border-green-500/30 transition-colors group">
              <label className="block pixel-font text-[10px] text-slate-500 mb-3 uppercase group-hover:text-green-400">树顶装饰</label>
              <input
                type="text"
                value={data.t}
                onChange={handleTopperChange}
                className="w-14 h-14 text-center text-3xl bg-slate-950 border-2 border-slate-800 rounded-xl focus:outline-none focus:border-green-500 transition-all shadow-inner"
                style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "EmojiSymbols", "Symbola", sans-serif' }}
              />
            </div>

            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between hover:border-yellow-500/30 transition-colors">
              <div>
                <label className="block pixel-font text-[10px] text-slate-500 mb-1 uppercase">点亮灯光</label>
                <p className="text-[10px] text-slate-400 mono-font tracking-wide">点选树上的字隐藏惊喜</p>
              </div>
              <button
                onClick={() => setHighlightMode(!highlightMode)}
                className={`
                  w-14 h-7 rounded-full transition-all relative shadow-lg
                  ${highlightMode ? 'bg-yellow-500' : 'bg-slate-700'}
                `}
              >
                <div className={`
                  absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md
                  ${highlightMode ? 'left-8' : 'left-1'}
                `} />
              </button>
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 hover:border-green-500/30 transition-colors">
            <label className="block pixel-font text-[10px] text-slate-500 mb-3 uppercase">树体文本</label>
            <textarea
              value={data.c}
              onChange={handleTextChange}
              disabled={highlightMode}
              className={`
                w-full h-40 bg-slate-950 border-2 border-slate-800 rounded-xl p-4 text-lg mono-font focus:outline-none focus:border-green-500 transition-all
                ${highlightMode ? 'opacity-30 cursor-not-allowed grayscale' : ''}
              `}
              placeholder="在这里输入你的文字..."
            />
            <div className="flex justify-between items-center mt-3">
               <p className="text-[10px] text-slate-500 pixel-font opacity-50">{data.c.length} / 500</p>
               {highlightMode && (
                  <div className="flex items-center gap-2 text-[10px] text-yellow-500 pixel-font animate-pulse">
                     <AlertCircle size={14} />
                     <span>正在选择点亮文字</span>
                  </div>
               )}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <PixelButton onClick={handleGenerate} variant="accent" className="w-full sm:w-auto px-16 py-5 shadow-[0_10px_30px_rgba(250,204,21,0.2)]">
              <span className="flex items-center justify-center gap-3 text-base w-full text-center" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Wand2 size={20} className="animate-pulse" />
                注入魔法并完成
              </span>
            </PixelButton>
          </div>
        </section>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Editor;
