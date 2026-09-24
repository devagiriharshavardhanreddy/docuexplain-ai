import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Files,
  MessageSquareText,
  Search,
  FileCheck2,
  BarChart3,
  Settings,
  LogOut,
  UploadCloud,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Dropzone } from '../document/Dropzone';
import { useToast } from '../../context/ToastContext';

export const Sidebar = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const navItems = [
    { label: 'Control Center', path: '/dashboard', icon: LayoutDashboard, badge: 'HUD' },
    { label: 'Document Library', path: '/documents', icon: Files, badge: 'STORE' },
    { label: 'AI Chat Studio', path: '/chat', icon: MessageSquareText, badge: 'XAI' },
    { label: 'Neural Search', path: '/search', icon: Search, badge: 'VECTOR' },
    { label: 'Intelligence Summaries', path: '/summaries', icon: FileCheck2, badge: '6 MODES' },
    { label: 'Research Analytics', path: '/analytics', icon: BarChart3, badge: 'TELEMETRY' },
    { label: 'Model Settings', path: '/settings', icon: Settings, badge: 'CONFIG' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUploadSuccess = (doc) => {
    setUploadModalOpen(false);
    showToast(`"${doc.original_filename}" vectorized & ready for XAI inference!`, 'success');
    navigate(`/chat?doc=${doc.id}`);
  };

  return (
    <>
      <aside className="w-72 h-full flex flex-col bg-[#070B14] border-r border-cyan-500/15 select-none relative overflow-hidden">
        {/* Subtle decorative mesh background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Brand Command Header - Links directly to Home Page */}
        <div className="p-5 border-b border-cyan-500/15 relative z-10">
          <Link to="/" title="Click to Return to Home / Landing Page" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                DOCU<span className="text-cyan-400">EXPLAIN</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  AI
                </span>
              </h1>
              <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <span>← Return to Home Page</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Action Upload Trigger Station */}
        <div className="p-4 relative z-10">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-950/80 hover:shadow-cyan-500/25 transition-all active:scale-[0.98] border border-cyan-400/40 group"
          >
            <UploadCloud className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="tracking-wide">Ingest New Document</span>
          </button>
        </div>

        {/* Navigation Suite */}
        <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto relative z-10">
          {/* Quick Return to Home Link */}
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 transition-all mb-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Home className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Public Home / Landing</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 shrink-0">
              HOME
            </span>
          </Link>

          <div className="px-3 pb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest text-left flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>Modules & Suites</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-white border-l-4 border-l-cyan-400 border-y border-r border-cyan-500/20 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800 shrink-0">
                  {item.badge}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Live System Diagnostics Card */}
        <div className="p-3 mx-3 mb-3 rounded-2xl cyber-card text-left relative z-10 border border-cyan-500/20">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>XAI Grounding Active</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300">100% Verified</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Cosine vector distance + Claim overlap telemetry running on all queries.
          </p>
        </div>

        {/* User Profile Console */}
        <div className="p-3.5 border-t border-cyan-500/15 bg-slate-950/80 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-cyan-500/30">
              {user?.full_name?.charAt(0) || 'R'}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.full_name || 'AI Researcher'}</p>
              <p className="text-[10px] font-mono text-cyan-400 truncate">{user?.email || 'researcher@docuexplain.ai'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out to Login Page"
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Global Ingestion Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Ingest Document into Quantum Vector Memory"
        subtitle="Extract slides & text, generate semantic chunks, and build vector embeddings"
      >
        <Dropzone onUploadSuccess={handleUploadSuccess} />
      </Modal>
    </>
  );
};
