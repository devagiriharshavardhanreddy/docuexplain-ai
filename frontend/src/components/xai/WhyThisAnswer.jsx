import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

export const WhyThisAnswer = ({ xai }) => {
  const [open, setOpen] = useState(true);

  if (!xai) return null;

  const avgRelPct = Math.round((xai.average_relevance || 0) * 100);
  const maxRelPct = Math.round((xai.max_relevance || 0) * 100);
  const consistencyPct = Math.round((xai.evidence_consistency || 0) * 100);

  return (
    <div className="cyber-card rounded-2xl border border-cyan-500/20 p-4 shadow-lg text-left">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-100"
      >
        <span className="flex items-center gap-2 text-cyan-300 font-mono">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>"WHY THIS ANSWER?" AUDIT TRAIL</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="mt-3.5 pt-3 border-t border-cyan-500/15 space-y-3.5 text-xs text-slate-300">
          <p className="leading-relaxed text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-cyan-500/20 font-mono text-[11px]">
            {xai.why_this_answer || "Synthesized strictly from retrieved evidence chunks with zero extrapolation."}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CHUNKS ANALYZED</span>
              <strong className="text-cyan-300 font-bold">{xai.chunks_analyzed || 0} chunks</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PEAK RELEVANCE</span>
              <strong className="text-emerald-400 font-bold">{maxRelPct}%</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">EVIDENCE HARMONY</span>
              <strong className="text-cyan-300 font-bold">{consistencyPct}%</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">HALLUCINATION RISK</span>
              <strong className={`font-bold ${xai.hallucination_risk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {xai.hallucination_risk || 'Low'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
