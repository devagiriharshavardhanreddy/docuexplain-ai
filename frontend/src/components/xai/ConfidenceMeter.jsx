import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export const ConfidenceMeter = ({ score = 0, level = 'Moderate' }) => {
  const percentage = Math.round((score > 1 ? score : score * 100));
  
  const getColorConfig = () => {
    if (percentage >= 80) {
      return {
        bar: 'from-cyan-500 to-emerald-400',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-950/20',
        glow: 'shadow-emerald-500/20',
        icon: ShieldCheck,
        label: 'High Grounding'
      };
    } else if (percentage >= 55) {
      return {
        bar: 'from-cyan-500 to-amber-400',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        bg: 'bg-amber-950/20',
        glow: 'shadow-amber-500/20',
        icon: Sparkles,
        label: 'Moderate Grounding'
      };
    } else {
      return {
        bar: 'from-amber-500 to-rose-500',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        bg: 'bg-rose-950/20',
        glow: 'shadow-rose-500/20',
        icon: ShieldAlert,
        label: 'Low / Guard Triggered'
      };
    }
  };

  const config = getColorConfig();
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-2xl border ${config.border} ${config.bg} shadow-lg transition-all text-left`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.text}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            XAI Confidence Metric
          </span>
        </div>
        <span className={`text-base font-mono font-black ${config.text}`}>
          {percentage}%
        </span>
      </div>

      {/* Cyber Progress Indicator */}
      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
        <div
          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${config.bar} ${config.glow}`}
          style={{ width: `${Math.max(5, percentage)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
        <span>RAG Cosine + Lexical Overlap</span>
        <span className={`font-bold uppercase ${config.text}`}>{config.label}</span>
      </div>
    </div>
  );
};
