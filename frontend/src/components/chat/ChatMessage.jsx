import React, { useState } from 'react';
import { User, Sparkles, Copy, Check, ShieldCheck, ShieldAlert, Layers } from 'lucide-react';

export const ChatMessage = ({ message, isLatest = false, onSelectXAI, isSelected = false }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confidencePct = message.confidence ? Math.round(message.confidence * 100) : null;

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-2xl transition-all ${
        isUser
          ? 'bg-slate-900/60 border border-slate-800/60 ml-8'
          : `bg-slate-900/90 border ${isSelected ? 'border-primary-500/80 shadow-glow-primary' : 'border-slate-800'} mr-4`
      }`}
    >
      {/* Avatar */}
      <div className={`p-2 rounded-xl shrink-0 ${
        isUser
          ? 'bg-slate-800 text-slate-300'
          : 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-300">
            {isUser ? 'You' : 'DocuExplain AI'}
          </span>

          {!isUser && confidencePct !== null && (
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                confidencePct >= 80
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : confidencePct >= 55
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {confidencePct >= 80 ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                {confidencePct}% Confidence
              </span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {message.content}
        </div>

        {/* Source Citations Badges */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
              <Layers className="w-3 h-3" /> Sources:
            </span>
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-primary-300 flex items-center gap-1"
              >
                {src.document_name} • Page {src.page_number}
              </span>
            ))}
          </div>
        )}

        {/* Action toolbar */}
        {!isUser && (
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            {onSelectXAI && (
              <button
                onClick={() => onSelectXAI(message)}
                className={`inline-flex items-center gap-1 font-medium transition-colors ${
                  isSelected ? 'text-primary-400 font-bold underline' : 'text-slate-400 hover:text-primary-300'
                }`}
              >
                Inspect XAI Audit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
