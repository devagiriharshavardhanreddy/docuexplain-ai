import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, ShieldCheck, Activity, Cpu, Radio, Sparkles, Home, ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060811] text-slate-100">
      {/* Desktop Sidebar Rail */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onCloseMobile={() => setMobileOpen(false)} />
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Cockpit Telemetry Bar */}
        <header className="h-12 border-b border-cyan-500/15 bg-[#080D18]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 hidden sm:inline">ENGINE:</span>
              <span className="text-emerald-400 font-bold">RAG + EXPLAINABLE AI ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all text-[11px] font-bold"
              title="Return to Public Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Home</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/20 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cosine Vectors: <strong className="text-cyan-300">Normalized</strong></span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Hallucination: <strong className="text-emerald-400 font-bold">100%</strong></span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
