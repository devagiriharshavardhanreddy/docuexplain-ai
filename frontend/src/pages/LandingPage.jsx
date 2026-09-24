import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  ShieldCheck,
  FileText,
  Search,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Zap,
  Radio,
  FileCheck
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loginDemo, isAuthenticated } = useAuth();
  const [simulatorMode, setSimulatorMode] = useState('xai'); // 'xai' or 'blackbox'

  const handleStartAnalyzing = async () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      await loginDemo();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 selection:bg-cyan-500 selection:text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background Aurora Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-emerald-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Cyber Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-8 shadow-lg shadow-cyan-950/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>AI Answer + Evidence + Source + Confidence + Explainability</span>
          </div>

          {/* Epic Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Understand Your Documents. <br />
            <span className="gradient-cyber-text">Trust Every Single Answer.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The next-generation document intelligence platform that integrates <strong>Retrieval-Augmented Generation (RAG)</strong> with <strong>Explainable AI (XAI)</strong> to deliver mathematically calibrated, fully verifiable answers.
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartAnalyzing}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black px-8 shadow-lg shadow-cyan-500/25 border border-cyan-300/40 text-base"
            >
              Start Analyzing <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartAnalyzing}
              className="w-full sm:w-auto border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/50 text-base font-bold"
              icon={Sparkles}
            >
              Explore Live Demo
            </Button>
          </div>

          {/* Interactive Live XAI Evidence Simulator Studio */}
          <div className="mt-16 max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-slate-900/60 border border-cyan-500/30 shadow-2xl shadow-cyan-950/80">
            <div className="rounded-2xl bg-[#090E1A] border border-cyan-500/20 p-5 sm:p-7 text-left space-y-6">
              {/* Simulator Header & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Live Interactive Explainability Studio</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Compare black-box generative models against DocuExplain AI grounded verification
                  </p>
                </div>

                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSimulatorMode('xai')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      simulatorMode === 'xai'
                        ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    DocuExplain AI (XAI)
                  </button>
                  <button
                    onClick={() => setSimulatorMode('blackbox')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      simulatorMode === 'blackbox'
                        ? 'bg-rose-600/80 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Generic Black-Box LLM
                  </button>
                </div>
              </div>

              {/* Interactive Simulation Sandbox */}
              {simulatorMode === 'xai' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Chat synthesis */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                      <span className="font-mono text-cyan-400 block mb-1 font-bold">PROMPT QUERY</span>
                      "What is the final project submission and demonstration deadline?"
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Grounded AI Response
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-mono font-bold text-[11px]">
                          94.2% Verified
                        </span>
                      </div>
                      <p className="leading-relaxed text-slate-200">
                        Based on <strong>Project_Guidelines_AI_Defense.txt</strong> (<em>Page 1</em>), the final project submission and demonstration deadline is <mark className="xai-highlight">August 15, 2026</mark>.
                      </p>
                      <div className="pt-2 border-t border-cyan-500/20 text-[11px] font-mono text-cyan-400 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Source: <code>Project_Guidelines_AI_Defense.txt â€” Page 1</code></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: XAI Metrics Gauge */}
                  <div className="lg:col-span-5 space-y-3 bg-slate-900/90 rounded-2xl p-4 border border-cyan-500/30">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" /> Explainability Telemetry
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Zero Hallucination</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono">
                          <span className="text-slate-400">Confidence Calibration</span>
                          <span className="text-emerald-400 font-bold">94.2%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[94%]" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed space-y-1">
                        <span className="text-cyan-400 font-bold block">SUPPORTING EVIDENCE PASSAGE:</span>
                        <p>
                          "...Evaluation Criteria assigns 40% weightage... <mark className="xai-highlight-emerald">submission deadline is August 15, 2026</mark>."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Black-Box Model Output (Ungrounded Generative Guessing)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-mono">
                    "The submission deadline might be around November 2026 or whenever your university specifies."
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-rose-400 pt-2 border-t border-rose-500/20">
                    <span>Citations: <strong>0 (No source files cited)</strong></span>
                    <span>Confidence: <strong>Unknown / Hallucination Risk: HIGH</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Intelligence Architecture Pillars */}
      <section className="py-20 bg-[#080C16] border-t border-cyan-500/15 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Enterprise-Grade Document Intelligence Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Why DocuExplain AI Outperforms Generic Chatbots
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cyber-card rounded-2xl p-7 border border-cyan-500/20 hover:border-cyan-400/50">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Explainable AI (XAI) Telemetry</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Computes mathematical confidence metrics, exact cosine similarity scores, passage attribution, and transparent "Why this answer?" audits.
              </p>
            </div>

            <div className="cyber-card rounded-2xl p-7 border border-emerald-500/20 hover:border-emerald-400/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Neural Vector Search</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ChromaDB vector indexing with high-dimensional embeddings. Search across hundreds of pages conceptually, not just by exact keywords.
              </p>
            </div>

            <div className="cyber-card rounded-2xl p-7 border border-indigo-500/20 hover:border-indigo-400/50">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Format Ingestion</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Native parsing for PowerPoint (PPT/PPTX), PDF, Word (DOCX), and TXT files with slide and page-level preserving chunking algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#04060C] border-t border-cyan-500/15 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">DOCUEXPLAIN AI</span>
            <span>— Explainable AI Document Intelligence Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
