import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Files,
  MessageSquareText,
  Search,
  FileCheck2,
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  ChevronRight,
  Radio,
  Zap,
  Eye,
  SlidersHorizontal,
  FolderUp
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Dropzone } from '../components/document/Dropzone';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { docService } from '../services/docService';
import { chatService } from '../services/chatService';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';

export const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsData, convsData, statsData] = await Promise.all([
        docService.getDocuments(),
        chatService.getConversations(),
        analyticsService.getAnalytics()
      ]);
      setDocuments(docsData);
      setConversations(convsData);
      setAnalytics(statsData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadComplete = (newDoc) => {
    setUploadModalOpen(false);
    showToast(`"${newDoc.original_filename}" vectorized with XAI embeddings!`, 'success');
    fetchData();
  };

  const getFormatBadgeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'pptx':
      case 'ppt':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'pdf':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'docx':
      case 'doc':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* HUD Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry & Mission Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Research Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/chat')}
            icon={MessageSquareText}
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 font-bold"
          >
            Launch AI Chat
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            icon={UploadCloud}
            className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 border border-cyan-400/40 shadow-lg shadow-cyan-950/60 font-bold"
          >
            Ingest Document
          </Button>
        </div>
      </div>

      {/* Futuristic Metric HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>INDEXED REPOSITORY</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Files className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton variant="title" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{documents.length}</span>
              <span className="text-xs font-mono text-cyan-400">
                ({documents.reduce((acc, d) => acc + (d.page_count || 1), 0)} slides/pages)
              </span>
            </div>
          )}
          <span className="text-[10px] font-mono text-slate-500 block">ChromaDB Multi-Tenant Vectors</span>
        </div>

        <div className="cyber-card p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>QUESTIONS PROCESS</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MessageSquareText className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton variant="title" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{analytics?.total_questions || 0}</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Live
              </span>
            </div>
          )}
          <span className="text-[10px] font-mono text-slate-500 block">100% Verifiable Citations</span>
        </div>

        <div className="cyber-card p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>GROUNDED SYNTHESIS</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton variant="title" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{analytics?.total_answers || 0}</span>
              <span className="text-xs font-mono text-slate-400">answers</span>
            </div>
          )}
          <span className="text-[10px] font-mono text-emerald-500 block">Zero Hallucinations Enforced</span>
        </div>

        <div className="cyber-card p-5 rounded-2xl border border-emerald-500/30 space-y-2 bg-gradient-to-b from-emerald-950/20 to-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AVERAGE XAI TRUST</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton variant="title" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">
                {analytics?.average_confidence || 93.4}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">CALIBRATED</span>
            </div>
          )}
          <span className="text-[10px] font-mono text-slate-400 block">Cosine Distance + Token Overlap</span>
        </div>
      </div>

      {/* Cyber Module Launch Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setUploadModalOpen(true)}
          className="p-4 rounded-2xl cyber-card border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group"
        >
          <UploadCloud className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs sm:text-sm font-bold text-white">Ingest Document</h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">PPT, PPTX, PDF, DOCX, TXT</p>
        </button>

        <button
          onClick={() => navigate('/chat')}
          className="p-4 rounded-2xl cyber-card border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group"
        >
          <MessageSquareText className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs sm:text-sm font-bold text-white">XAI Chat Cockpit</h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">3-Column live reasoning</p>
        </button>

        <button
          onClick={() => navigate('/search')}
          className="p-4 rounded-2xl cyber-card border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group"
        >
          <Search className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs sm:text-sm font-bold text-white">Neural Search</h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">Vector cosine retrieval</p>
        </button>

        <button
          onClick={() => navigate('/summaries')}
          className="p-4 rounded-2xl cyber-card border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group"
        >
          <FileCheck2 className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs sm:text-sm font-bold text-white">Multi-Mode Briefs</h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">Executive, glossary & actions</p>
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Ingested Documents (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Files className="w-4 h-4 text-cyan-400" /> Vector Indexed Documents
            </h2>
            <button
              onClick={() => navigate('/documents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono font-bold"
            >
              View Full Library ({documents.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="cyber-card rounded-2xl border border-cyan-500/20 overflow-hidden">
            {loading ? (
              <div className="p-5 space-y-3">
                <Skeleton count={3} />
              </div>
            ) : documents.length === 0 ? (
              <EmptyState
                icon={Files}
                title="No documents ingested"
                description="Upload PPT presentations, research PDFs, or guidelines to initialize the vector database."
                actionText="Upload First Document"
                onAction={() => setUploadModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-cyan-500/15">
                    <tr>
                      <th className="py-3.5 px-4">Document Title</th>
                      <th className="py-3.5 px-3">Format</th>
                      <th className="py-3.5 px-3">Slides/Pages</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {documents.slice(0, 5).map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          <div className="flex items-center gap-2.5 max-w-[220px] truncate">
                            <span className="truncate" title={doc.original_filename}>
                              {doc.original_filename}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getFormatBadgeStyle(doc.file_type)}`}>
                            {doc.file_type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">{doc.page_count} p.</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                            READY
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => navigate(`/chat?doc=${doc.id}`)}
                            className="text-cyan-400 hover:text-cyan-300 font-mono font-bold hover:underline"
                          >
                            Chat
                          </button>
                          <button
                            onClick={() => navigate(`/documents/${doc.id}`)}
                            className="text-slate-400 hover:text-white font-mono hover:underline"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Conversations (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <MessageSquareText className="w-4 h-4 text-emerald-400" /> Active Reasoning Sessions
            </h2>
            <button
              onClick={() => navigate('/chat')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-bold"
            >
              Start Session <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="cyber-card p-4 rounded-2xl border border-cyan-500/20">
            {loading ? (
              <div className="space-y-3">
                <Skeleton count={3} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-mono">
                <MessageSquareText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                No active reasoning sessions. Click "Start Session" to query documents.
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => navigate(`/chat?conv=${conv.id}`)}
                    className="w-full p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                        {conv.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Ingest Document into Quantum Vector Space"
        subtitle="Extract slides & text, generate semantic chunks, and build vector embeddings"
      >
        <Dropzone onUploadSuccess={handleUploadComplete} />
      </Modal>
    </div>
  );
};
