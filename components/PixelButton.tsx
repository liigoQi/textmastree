
import React from 'react';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  disabled?: boolean;
}

const PixelButton: React.FC<PixelButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false
}) => {
  const variants = {
    primary: 'bg-green-600 hover:bg-green-500 border-green-800 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 border-slate-900 text-slate-200',
    accent: 'bg-yellow-500 hover:bg-yellow-400 border-yellow-700 text-black',
    danger: 'bg-rose-600 hover:bg-rose-500 border-rose-800 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-block px-4 py-2 border-b-4 active:border-b-0 active:translate-y-1
        transition-all duration-75 uppercase tracking-tighter pixel-font text-[10px] sm:text-xs
        min-w-[80px] w-auto
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PixelButton;
