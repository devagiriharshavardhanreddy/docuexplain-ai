import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Layers, Search } from 'lucide-react';
import { Badge } from '../common/Badge';

export const DocumentViewer = ({ document, activePage = 1, activeChunk = null, highlightText = '' }) => {
  const [currentPage, setCurrentPage] = useState(activePage);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (activePage) {
      setCurrentPage(activePage);
    }
  }, [activePage]);

  if (!document) return null;

  const chunks = document.chunks || [];
  const totalPages = document.page_count || 1;

  // Filter chunks for current page
  const pageChunks = chunks.filter(c => c.page_number === currentPage);

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl border border-slate-800 overflow-hidden text-left">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate" title={document.original_filename}>
            {document.original_filename}
          </h3>
          <span className="text-xs text-slate-400">
            {document.file_type.toUpperCase()} • {totalPages} Pages • {document.chunk_count} Chunks
          </span>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-slate-200 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Page Viewer Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm leading-relaxed bg-[#0B0F19]">
        {pageChunks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-sans">
            No parsed text content on Page {currentPage}.
          </div>
        ) : (
          pageChunks.map((chunk) => {
            const isTargetChunk = activeChunk !== null && chunk.chunk_index === Number(activeChunk);
            return (
              <div
                key={chunk.id}
                id={`chunk-${chunk.chunk_index}`}
                className={`p-4 rounded-xl border transition-all ${
                  isTargetChunk
                    ? 'bg-primary-950/40 border-primary-500/80 shadow-glow-primary'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-sans">
                  <span className="flex items-center gap-1 text-primary-400 font-semibold">
                    <Bookmark className="w-3 h-3" /> Chunk #{chunk.chunk_index}
                  </span>
                  <span>{chunk.token_count} tokens</span>
                </div>

                <div className="text-slate-200 whitespace-pre-wrap">
                  {isTargetChunk ? (
                    <span className="xai-highlight bg-primary-500/25 text-primary-100 p-1 rounded font-medium border-b-2 border-primary-400">
                      {chunk.content}
                    </span>
                  ) : (
                    chunk.content
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
