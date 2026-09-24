import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, FolderUp, Cpu, Radio } from 'lucide-react';
import { Button } from '../common/Button';
import { docService } from '../../services/docService';

export const Dropzone = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const stages = [
    'Uploading',
    'Extracting Slides & Text',
    'Normalizing Content',
    'Generating Semantic Chunks',
    'Building Neural Vectors',
    'Indexing ChromaDB',
    'XAI Grounding Ready'
  ];

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFileName(file.name);
    setError(null);
    setUploading(true);
    setPercent(10);
    setProgressStage('Uploading');

    const formData = new FormData();
    formData.append('file', file);

    const stageInterval = setInterval(() => {
      setProgressStage((prev) => {
        const currentIdx = stages.indexOf(prev);
        if (currentIdx < stages.length - 2) {
          const next = stages[currentIdx + 1];
          setPercent((currentIdx + 2) * 15);
          return next;
        }
        return prev;
      });
    }, 400);

    try {
      const response = await docService.uploadDocument(formData, (p) => {
        setPercent(Math.max(15, Math.min(p, 85)));
      });
      clearInterval(stageInterval);
      setProgressStage('XAI Grounding Ready');
      setPercent(100);

      setTimeout(() => {
        setUploading(false);
        setProgressStage('');
        setPercent(0);
        setSelectedFileName('');
        if (onUploadSuccess) onUploadSuccess(response.document);
      }, 700);
    } catch (err) {
      clearInterval(stageInterval);
      setUploading(false);
      setError(err.response?.data?.detail || 'Failed to process document. Please verify the format.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Cyber Drop Chamber */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative overflow-hidden ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/40 shadow-2xl shadow-cyan-500/20 scale-[1.01]'
            : 'border-cyan-500/30 hover:border-cyan-400 bg-slate-950/70 hover:bg-slate-900/90'
        } ${uploading ? 'pointer-events-none opacity-90' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md,.csv,.rtf"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-4 max-w-md mx-auto py-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Cpu className="w-12 h-12 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white truncate">
                {selectedFileName ? `Vectorizing "${selectedFileName}"` : `${progressStage}...`}
              </h4>
              <p className="text-xs font-mono text-cyan-400 mt-1 font-semibold">
                STAGE: {progressStage} ({percent}%)
              </p>
            </div>

            {/* Futuristic Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-cyan-500/30 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full transition-all duration-300 rounded-full shadow-lg shadow-cyan-500/50"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Pipeline Stage Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
              {stages.slice(0, 6).map((stg, i) => (
                <span
                  key={i}
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    stg === progressStage
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold animate-pulse'
                      : stages.indexOf(stg) < stages.indexOf(progressStage)
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold'
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  {stg}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-600 text-white flex items-center justify-center border border-cyan-400/40 shadow-xl shadow-cyan-950/80 group-hover:scale-105 transition-transform">
                <FolderUp className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-white">
                Select or Drop Any Document to Ingest
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Deep parsing for <span className="text-cyan-300 font-bold">PowerPoint (PPT/PPTX), PDF, Word (DOCX), and TXT</span>
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={UploadCloud}
              className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold px-6 shadow-lg shadow-cyan-950/80 border border-cyan-400/40"
            >
              Choose File from Computer
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
