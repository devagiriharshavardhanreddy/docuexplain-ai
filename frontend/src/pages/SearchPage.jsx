import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ExternalLink, Bookmark, Sparkles, Filter, Layers } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { searchService } from '../services/searchService';
import { useToast } from '../context/ToastContext';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [minScore, setMinScore] = useState(0.25);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchService.semanticSearch({
        query: query.trim(),
        min_score: minScore,
        top_k: 12
      });
      setResults(data.results || []);
    } catch (err) {
      showToast('Semantic search failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Search className="w-7 h-7 text-primary-400" /> Semantic Document Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Perform natural language queries across all indexed vectors based on meaning rather than exact keywords.
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-primary-500/80 focus-within:ring-1 focus-within:ring-primary-500 rounded-2xl p-2 shadow-2xl">
          <Search className="w-5 h-5 ml-3 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across your documents (e.g., 'What are the cryptographic transition requirements?')..."
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={!query.trim()}
            className="rounded-xl px-6 font-bold shrink-0 shadow-glow-primary"
          >
            Search
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span>Minimum Relevance Threshold: {Math.round(minScore * 100)}%</span>
          <input
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={minScore}
            onChange={(e) => setMinScore(parseFloat(e.target.value))}
            className="w-36 accent-primary-500"
          />
        </div>
      </form>

      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-slate-800 animate-pulse space-y-2">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-12 bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No semantic matches found"
            description="Try lowering the relevance threshold or rephrasing your search query."
          />
        ) : (
          results.map((item, idx) => {
            const relPct = Math.round(item.relevance_score * 100);
            return (
              <Card
                key={idx}
                className="hover:border-primary-500/40 transition-all bg-slate-900/80"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-primary-500/10 text-primary-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate" title={item.document_name}>
                        {item.document_name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Page {item.page_number} • Chunk #{item.chunk_index}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      relPct >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-primary-500/10 text-primary-300 border-primary-500/30'
                    }`}>
                      Relevance: {relPct}%
                    </span>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/documents/${item.document_id}?page=${item.page_number}&chunk=${item.chunk_index}`)}
                      icon={ExternalLink}
                    >
                      Open Evidence
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                  {item.content}
                </div>

                {item.matched_terms && item.matched_terms.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Matched Concepts:
                    </span>
                    {item.matched_terms.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-primary-500/10 text-primary-300 border border-primary-500/20 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
