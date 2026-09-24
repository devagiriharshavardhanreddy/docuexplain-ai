import React from 'react';
import { CheckCircle, Clock, AlertCircle, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon = true,
  className = ''
}) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  const variants = {
    ready: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    extracting: 'bg-primary-500/10 text-primary-400 border border-primary-500/30 animate-pulse',
    chunking: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse',
    embedding: 'bg-purple-500/10 text-purple-400 border border-purple-500/30 animate-pulse',
    indexing: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse',
    uploading: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
    error: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    
    // Confidence & XAI Badges
    high: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950',
    moderate: 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950',
    low: 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950',
    
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    primary: 'bg-primary-500/15 text-primary-300 border border-primary-500/30',
  };

  const renderIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'ready':
      case 'high':
        return <ShieldCheck className="w-3.5 h-3.5 shrink-0" />;
      case 'moderate':
        return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
      case 'error':
      case 'low':
        return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
      case 'extracting':
      case 'chunking':
      case 'embedding':
      case 'indexing':
        return <Clock className="w-3.5 h-3.5 shrink-0 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full select-none ${sizes[size]} ${variants[variant] || variants.default} ${className}`}
    >
      {renderIcon()}
      {children}
    </span>
  );
};
