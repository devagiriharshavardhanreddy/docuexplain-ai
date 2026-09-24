import React, { useState } from 'react';
import { FileText, ExternalLink, ChevronDown, ChevronUp, Bookmark, Layers, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EvidenceCard = ({ citation, onOpenEvidence }) => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  const relevancePct = Math.round((citation.relevance_score > 1 ? citation.relevance_score : citation.relevance_score * 100));

  const handleOpenDoc = (e) => {
    e.stopPropagation();
    if (onOpenEvidence) {
      onOpenEvidence(citation);
    } else {
      navigate(`/documents/${citation.document_id}?page=${citation.page_number}&chunk=${citation.chunk_index}`);
    }
  };

  const renderHighlightedText = (text, terms = []) => {
    if (!terms || terms.length === 0) return text;
    
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escaped) return text;

    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark key={i} className="xai-highlight">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="cyber-card rounded-2xl border border-cyan-500/20 p-4 shadow-lg transition-all text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 truncate" title={citation.document_name}>
              {citation.document_name}
            </h4>
            <span className="text-[11px] font-mono text-cyan-400">
              Page {citation.page_number} • Chunk #{citation.chunk_index}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
            relevancePct >= 80 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' 
              : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
          }`}>
            {relevancePct}% Match
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Supporting Passage Excerpt */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-cyan-500/15 space-y-2.5">
          <div className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20 max-h-40 overflow-y-auto">
            {renderHighlightedText(citation.evidence_text, citation.highlight_terms)}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" /> Verbatim Source Excerpt
            </span>
            <button
              onClick={handleOpenDoc}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Inspect Passage <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
