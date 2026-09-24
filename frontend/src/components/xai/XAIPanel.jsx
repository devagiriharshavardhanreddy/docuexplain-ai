import React from 'react';
import { Sparkles, Shield, Layers, FileSearch, Radio } from 'lucide-react';
import { ConfidenceMeter } from './ConfidenceMeter';
import { EvidenceCard } from './EvidenceCard';
import { WhyThisAnswer } from './WhyThisAnswer';

export const XAIPanel = ({ activeMessage, onOpenEvidence }) => {
  if (!activeMessage || !activeMessage.xai) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 cyber-panel rounded-3xl border border-cyan-500/20">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-emerald-600/30 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/40 shadow-lg shadow-cyan-950/60">
          <Sparkles className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Explainable AI (XAI) Cockpit</h4>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-mono">
          Select or send an AI query to stream real-time confidence scores, evidence passages, and attribution metrics.
        </p>
      </div>
    );
  }

  const { confidence, sources = [], xai } = activeMessage;
  const coverageLevel = xai?.evidence_coverage || 'Moderate';

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-white font-mono">XAI EXPLAINER</h3>
            <span className="text-[10px] font-mono text-cyan-400">Verifiable RAG Grounding</span>
          </div>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
          coverageLevel === 'High'
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
            : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
        }`}>
          {coverageLevel} Coverage
        </span>
      </div>

      {/* Confidence Score Meter */}
      <ConfidenceMeter
        score={confidence || xai?.confidence_score || 0.85}
        level={xai?.confidence_level || 'Moderate'}
      />

      {/* Why This Answer Audit Breakdown */}
      <WhyThisAnswer xai={xai} />

      {/* Source & Evidence Section */}
      <div className="space-y-3 pt-1 text-left">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            SUPPORTING EVIDENCE ({sources.length})
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Exact Excerpts</span>
        </div>

        {sources.length === 0 ? (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400 font-mono">
            <FileSearch className="w-6 h-6 mx-auto mb-2 text-slate-600" />
            No matching evidence found. Anti-hallucination fallback was triggered.
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((src, index) => (
              <EvidenceCard
                key={index}
                citation={src}
                onOpenEvidence={onOpenEvidence}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
