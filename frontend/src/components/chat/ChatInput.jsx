import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CornerDownLeft } from 'lucide-react';
import { Button } from '../common/Button';

export const ChatInput = ({ onSendMessage, disabled = false, loading = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const samplePrompts = [
    "What is the final project submission deadline?",
    "Summarize the evaluation criteria and weightage.",
    "What are the mandatory functional requirements?",
    "Explain the post-quantum cryptography transition roadmap."
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || disabled || loading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="space-y-2.5">
      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary-400" /> Prompts:
        </span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePromptClick(p)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 transition-all text-[11px] truncate max-w-xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-900 border border-slate-800 focus-within:border-primary-500/60 focus-within:ring-1 focus-within:ring-primary-500/40 rounded-2xl p-2.5 shadow-xl transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your uploaded documents (with Explainable AI)..."
          disabled={disabled || loading}
          rows={1}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 py-1 max-h-32 min-h-[36px]"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!input.trim() || disabled || loading}
          loading={loading}
          className="rounded-xl px-3.5 py-2 shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
