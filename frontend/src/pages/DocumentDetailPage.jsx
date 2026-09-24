import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquareText, FileCheck2, Share2, Download, Info } from 'lucide-react';
import { DocumentViewer } from '../components/document/DocumentViewer';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { docService } from '../services/docService';
import { useToast } from '../context/ToastContext';

export const DocumentDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const chunkParam = searchParams.get('chunk');

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const data = await docService.getDocumentDetail(id);
        setDocument(data);
      } catch (err) {
        showToast('Failed to load document details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoc();
  }, [id]);

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col space-y-4 text-left max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
          >
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">
              {document?.original_filename || 'Document Evidence Viewer'}
            </h1>
            <span className="text-xs text-slate-400">
              Evidence Passage Inspection & Highlighting
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/chat?doc=${id}`)}
            icon={MessageSquareText}
          >
            Chat
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/summaries?doc=${id}`)}
            icon={FileCheck2}
          >
            Summarize
          </Button>
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="p-8 glass-card rounded-2xl h-full space-y-4">
            <Skeleton variant="card" className="h-full" />
          </div>
        ) : (
          <DocumentViewer
            document={document}
            activePage={pageParam}
            activeChunk={chunkParam}
          />
        )}
      </div>
    </div>
  );
};
