import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Activity, Cpu, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      await loginDemo();
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 pt-4 pb-2">
      <div className="max-w-7xl mx-auto h-16 rounded-2xl cyber-panel px-4 sm:px-6 flex items-center justify-between border border-cyan-500/20 shadow-2xl">
        {/* Brand Hologram */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-[#060811] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-neon-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                DOCU<span className="text-cyan-400">EXPLAIN</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                XAI v1.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 text-left">Neural Evidence & RAG Grounding</p>
          </div>
        </Link>

        {/* Live Status Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-slate-300">Grounded Engine:</span>
          <span className="text-emerald-400 font-bold">Zero-Hallucination Safe</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={Sparkles}
              className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 border border-cyan-400/30 shadow-lg shadow-cyan-500/20 font-bold"
            >
              Command Center
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-slate-300 hover:text-white"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleStart}
                className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 border border-cyan-400/40 shadow-lg shadow-cyan-500/25 font-bold"
              >
                Launch Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
