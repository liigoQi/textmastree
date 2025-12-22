
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Receiver from './components/Receiver';
import { decodeTreeData } from './utils/helpers';
import { TreeData } from './types';
// Fix: Add Sparkles to the lucide-react imports
import { TreePine, Github, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) {
        setTreeData(null);
        setLoading(false);
        return;
      }

      // 使用 URLSearchParams 处理 hash 更加稳健
      // hash 格式可能是 #tree=...
      const searchParams = new URLSearchParams(hash.replace(/^#/, '?'));
      const treeParam = searchParams.get('tree');

      if (treeParam) {
        const decoded = decodeTreeData(treeParam);
        if (decoded) {
          setTreeData(decoded);
        } else {
          console.error("无法解析圣诞树数据");
          setTreeData(null);
        }
      } else {
        setTreeData(null);
      }
      setLoading(false);
    };

    // 初始加载
    handleHashChange();
    
    // 监听 hash 变化
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleReset = () => {
    // 清空 hash 以返回编辑模式
    window.location.hash = '';
    setTreeData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <TreePine className="text-green-500 w-16 h-16 animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
          </div>
          <p className="pixel-font text-xs text-green-500 tracking-widest animate-pulse">正在唤醒魔法树...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 selection:bg-green-500/30 overflow-x-hidden">
      {/* 顶部标题 */}
      <header className="p-8 flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={handleReset}>
          <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 group-hover:border-green-500/50 transition-all shadow-lg">
             <TreePine className="text-green-500 group-hover:scale-110 transition-transform" size={28} />
          </div>
          <div>
            <h1 className="pixel-font text-base sm:text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">
              TEXTMAS TREE
            </h1>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center z-10 w-full">
        {treeData ? (
          <Receiver data={treeData} onReset={handleReset} />
        ) : (
          <Editor onGenerate={() => {}} />
        )}
      </main>

    </div>
  );
};

export default App;
