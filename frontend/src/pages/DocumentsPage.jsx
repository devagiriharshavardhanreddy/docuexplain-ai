import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Files,
  UploadCloud,
  Trash2,
  MessageSquareText,
  FileCheck2,
  Eye,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Dropzone } from '../components/document/Dropzone';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { docService } from '../services/docService';
import { useToast } from '../context/ToastContext';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const data = await docService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load document library.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async () => {
    if (!selectedDocToDelete) return;
    setDeleting(true);
    try {
      await docService.deleteDocument(selectedDocToDelete.id);
      showToast(`Document "${selectedDocToDelete.original_filename}" deleted.`, 'success');
      setSelectedDocToDelete(null);
      fetchDocs();
    } catch (err) {
      showToast('Failed to delete document.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredDocs = documents.filter(d =>
    d.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.file_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Document Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your document knowledge base, vector chunks, and XAI indexing status
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setUploadModalOpen(true)}
          icon={UploadCloud}
          className="shadow-glow-primary"
        >
          Upload Document
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name or file format..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Document Library Table */}
      <Card className="bg-slate-900/60 p-0 overflow-hidden border-slate-800">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton count={4} />
          </div>
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            icon={Files}
            title={searchQuery ? "No matching documents found" : "Your document library is empty"}
            description={
              searchQuery
                ? "Try searching for a different keyword or file name."
                : "Upload PDF, DOCX, PPTX, or TXT documents to generate embeddings and enable Explainable AI chat."
            }
            actionText={searchQuery ? "Clear Search" : "Upload Document"}
            onAction={searchQuery ? () => setSearchQuery('') : () => setUploadModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Document Name</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Pages / Chunks</th>
                  <th className="py-3.5 px-3">File Size</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Uploaded</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDocs.map((doc) => {
                  const sizeKB = Math.round(doc.file_size / 1024);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-2 max-w-xs truncate" title={doc.original_filename}>
                          <Files className="w-4 h-4 text-primary-400 shrink-0" />
                          <span className="truncate">{doc.original_filename}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-mono uppercase">
                          {doc.file_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {doc.page_count} pages • {doc.chunk_count} chunks
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge variant={doc.status} size="sm">
                          {doc.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => navigate(`/documents/${doc.id}`)}
                          title="Open Document Evidence Viewer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/chat?doc=${doc.id}`)}
                          title="Ask AI about this document"
                          className="p-1.5 rounded-lg text-primary-400 hover:text-primary-300 hover:bg-primary-950/40 transition-colors"
                        >
                          <MessageSquareText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/summaries?doc=${doc.id}`)}
                          title="Generate structured summary"
                          className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                        >
                          <FileCheck2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedDocToDelete(doc)}
                          title="Delete document and vector index"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document to Knowledge Base"
        subtitle="7-stage processing: parsing, cleaning, chunking, embeddings, and vector indexing"
      >
        <Dropzone
          onUploadSuccess={(doc) => {
            setUploadModalOpen(false);
            showToast(`Document "${doc.original_filename}" processed successfully!`, 'success');
            fetchDocs();
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!selectedDocToDelete}
        onClose={() => setSelectedDocToDelete(null)}
        title="Delete Document"
        subtitle="This action will remove the document, its chunks, and ChromaDB vector index."
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Are you sure you want to permanently delete{' '}
            <strong className="text-white">"{selectedDocToDelete?.original_filename}"</strong>?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedDocToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
