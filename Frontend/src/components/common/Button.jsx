import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const baseStyle = "px-4 py-2 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed select-none cursor-pointer";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600 shadow-md shadow-emerald-500/5",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-700"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
