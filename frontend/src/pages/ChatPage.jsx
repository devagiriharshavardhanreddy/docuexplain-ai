import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MessageSquareText,
  Plus,
  Trash2,
  Sparkles,
  Files,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  UploadCloud
} from 'lucide-react';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { DocSelector } from '../components/chat/DocSelector';
import { XAIPanel } from '../components/xai/XAIPanel';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Dropzone } from '../components/document/Dropzone';
import { chatService } from '../services/chatService';
import { docService } from '../services/docService';
import { useToast } from '../context/ToastContext';

export const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const initialDocId = searchParams.get('doc') ? [parseInt(searchParams.get('doc'), 10)] : [];
  const initialConvId = searchParams.get('conv') ? parseInt(searchParams.get('conv'), 10) : null;

  const [documents, setDocuments] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState(initialDocId);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(initialConvId);
  const [messages, setMessages] = useState([]);
  const [activeXAIMessage, setActiveXAIMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchDocsAndConvs = async () => {
    try {
      setLoading(true);
      const [docs, convs] = await Promise.all([
        docService.getDocuments(),
        chatService.getConversations()
      ]);
      setDocuments(docs);
      setConversations(convs);

      if (initialConvId) {
        loadConversation(initialConvId);
      } else if (convs.length > 0 && !activeConvId) {
        loadConversation(convs[0].id);
      }
    } catch (err) {
      console.error("Init chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocsAndConvs();
  }, []);

  const loadConversation = async (convId) => {
    try {
      setActiveConvId(convId);
      const data = await chatService.getConversationHistory(convId);
      
      const formatted = (data.messages || []).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        confidence: m.confidence,
        sources: m.sources_json || [],
        xai: m.explainability_json || null,
        created_at: m.created_at
      }));

      setMessages(formatted);

      const lastAi = formatted.filter(m => m.role === 'assistant').pop();
      if (lastAi) {
        setActiveXAIMessage(lastAi);
      } else {
        setActiveXAIMessage(null);
      }
    } catch (err) {
      showToast('Failed to load conversation history.', 'error');
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || sending) return;

    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const response = await chatService.sendChatMessage({
        message: text,
        conversation_id: activeConvId,
        document_ids: selectedDocIds.length > 0 ? selectedDocIds : null,
        include_xai: true
      });

      if (!activeConvId) {
        setActiveConvId(response.conversation_id);
        const updatedConvs = await chatService.getConversations();
        setConversations(updatedConvs);
      }

      const aiMsg = {
        id: response.message_id,
        role: 'assistant',
        content: response.answer,
        confidence: response.confidence,
        sources: response.sources || [],
        xai: response.xai || null,
        created_at: response.created_at
      };

      setMessages(prev => [...prev, aiMsg]);
      setActiveXAIMessage(aiMsg);
    } catch (err) {
      showToast('Failed to generate response. Please verify document status.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setActiveXAIMessage(null);
  };

  const handleDeleteConv = async (e, convId) => {
    e.stopPropagation();
    try {
      await chatService.deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConvId === convId) {
        handleNewChat();
      }
      showToast('Conversation deleted.', 'info');
    } catch (err) {
      showToast('Failed to delete conversation.', 'error');
    }
  };

  const handleUploadComplete = (newDoc) => {
    setUploadModalOpen(false);
    showToast(`"${newDoc.original_filename}" processed & ready for chat!`, 'success');
    fetchDocsAndConvs();
    setSelectedDocIds([newDoc.id]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-3 max-w-7xl mx-auto text-left">
      {/* Top Filter & Actions Bar */}
      <div className="shrink-0 flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="min-w-0 flex-1">
          <DocSelector
            documents={documents}
            selectedDocIds={selectedDocIds}
            onSelectionChange={setSelectedDocIds}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            icon={UploadCloud}
          >
            Upload PPT/Doc
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleNewChat}
            icon={Plus}
          >
            New Chat
          </Button>
        </div>
      </div>

      {/* 3-Column Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: Conversation History */}
        <div className="hidden lg:flex lg:col-span-3 flex-col glass-card rounded-2xl border border-slate-800 p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Conversations ({conversations.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No past chat threads.
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    activeConvId === conv.id
                      ? 'bg-primary-600/20 text-primary-200 border border-primary-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">{conv.title}</span>
                  <button
                    onClick={(e) => handleDeleteConv(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center Column: Messages & Input */}
        <div className="lg:col-span-5 flex flex-col glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-3 border border-primary-500/20 shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">
                  Ask AI with Verifiable Explanations
                </h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Submit a query to retrieve evidence chunks, generate grounded answers, and view transparent XAI confidence metrics.
                </p>
                {documents.length === 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setUploadModalOpen(true)}
                    icon={UploadCloud}
                    className="mt-4 shadow-glow-primary"
                  >
                    Upload Your First Document
                  </Button>
                )}
              </div>
            ) : (
              messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id || index}
                  message={msg}
                  isSelected={activeXAIMessage?.id === msg.id}
                  onSelectXAI={(m) => setActiveXAIMessage(m)}
                />
              ))
            )}

            {sending && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-primary-300 animate-pulse mr-8">
                <Sparkles className="w-4 h-4 animate-spin text-primary-400" />
                <span>Retrieving evidence passages and evaluating XAI metrics...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/80">
            <ChatInput
              onSendMessage={handleSendMessage}
              loading={sending}
              disabled={documents.length === 0}
            />
          </div>
        </div>

        {/* Right Column: XAI Panel */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <XAIPanel
            activeMessage={activeXAIMessage}
            onOpenEvidence={(citation) => {
              navigate(`/documents/${citation.document_id}?page=${citation.page_number}&chunk=${citation.chunk_index}`);
            }}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document (PPT, PPTX, PDF, DOCX, TXT)"
        subtitle="Extract slides & text, generate semantic chunks, and build vector embeddings"
      >
        <Dropzone onUploadSuccess={handleUploadComplete} />
      </Modal>
    </div>
  );
};
