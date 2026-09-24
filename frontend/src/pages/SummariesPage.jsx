import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileCheck2,
  FileText,
  Copy,
  Check,
  Sparkles,
  ListOrdered,
  BookOpen,
  CheckCircle,
  Bookmark
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { docService } from '../services/docService';
import { summaryService } from '../services/summaryService';
import { useToast } from '../context/ToastContext';

export const SummariesPage = () => {
  const [searchParams] = useSearchParams();
  const initialDocId = searchParams.get('doc') ? parseInt(searchParams.get('doc'), 10) : null;

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [summaryType, setSummaryType] = useState('detailed');
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { showToast } = useToast();

  const summaryModes = [
    { id: 'short', label: 'Short Summary', icon: Sparkles, desc: 'Quick 2-3 sentence overview' },
    { id: 'detailed', label: 'Detailed Summary', icon: FileText, desc: 'Full structured breakdown' },
    { id: 'executive', label: 'Executive Summary', icon: BookOpen, desc: 'Strategic briefing for leadership' },
    { id: 'key_points', label: 'Key Points', icon: ListOrdered, desc: 'Bulleted core findings' },
    { id: 'terms', label: 'Important Terms', icon: Bookmark, desc: 'Domain glossary & definitions' },
    { id: 'action_items', label: 'Action Items', icon: CheckCircle, desc: 'Recommendations & next steps' },
  ];

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await docService.getDocuments();
        setDocuments(docs);
        if (!selectedDocId && docs.length > 0) {
          setSelectedDocId(docs[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, []);

  const handleGenerateSummary = async () => {
    if (!selectedDocId) return;
    setLoading(true);
    try {
      const data = await summaryService.summarizeDocument({
        document_id: selectedDocId,
        summary_type: summaryType
      });
      setSummaryData(data);
      showToast('Summary generated successfully!', 'success');
    } catch (err) {
      showToast('Failed to generate summary.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryData) return;
    navigator.clipboard.writeText(summaryData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-7 h-7 text-emerald-400" /> Multi-Mode Document Summarization
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Synthesize complex documents into executive briefings, key takeaways, glossary terms, and action plans.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Select Document to Summarize
          </label>
          <select
            value={selectedDocId || ''}
            onChange={(e) => setSelectedDocId(parseInt(e.target.value, 10))}
            className="w-full sm:w-96 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-primary-500"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.original_filename} ({doc.page_count} pages)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Summarization Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {summaryModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = summaryType === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSummaryType(mode.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-primary-600/20 text-white border-primary-500 shadow-md shadow-primary-950'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-primary-400' : 'text-slate-500'}`} />
                  <div className="text-xs font-bold truncate">{mode.label}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{mode.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="emerald"
            size="md"
            onClick={handleGenerateSummary}
            loading={loading}
            icon={Sparkles}
            disabled={!selectedDocId}
          >
            Generate {summaryModes.find(m => m.id === summaryType)?.label}
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-8 space-y-4">
          <Skeleton variant="title" />
          <Skeleton count={5} />
        </Card>
      ) : summaryData ? (
        <Card className="space-y-4 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                {summaryData.document_name}
              </h3>
              <span className="text-xs text-primary-400 font-semibold uppercase tracking-wider">
                {summaryData.summary_type.replace('_', ' ')} Summary
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              icon={copied ? Check : Copy}
            >
              {copied ? 'Copied' : 'Copy Summary'}
            </Button>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            {summaryData.content}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="Select a document to generate a summary"
          description="Choose from 6 structured modes including Executive Briefing, Key Points, Terms, and Action Items."
        />
      )}
    </div>
  );
};
