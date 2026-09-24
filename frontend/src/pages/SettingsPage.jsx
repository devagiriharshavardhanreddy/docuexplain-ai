import React, { useState } from 'react';
import { Settings, Cpu, User, Check, Save } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [llmProvider, setLlmProvider] = useState('local');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    showToast('Settings saved successfully!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary-400" /> Platform & AI Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure AI LLM inference providers, embedding models, and profile credentials.
        </p>
      </div>

      <Card className="bg-slate-900/60 border-slate-800 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Researcher Profile</h3>
            <p className="text-xs text-slate-400">Authenticated user identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Full Name</span>
            <input
              type="text"
              disabled
              value={user?.full_name || ''}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 cursor-not-allowed"
            />
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Email Address</span>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 cursor-not-allowed"
            />
          </div>
        </div>
      </Card>

      <form onSubmit={handleSave}>
        <Card className="bg-slate-900/60 border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">LLM Provider & Inference Mode</h3>
              <p className="text-xs text-slate-400">Choose between local deterministic or cloud models</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-2">
                Active Inference Engine
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setLlmProvider('local')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    llmProvider === 'local'
                      ? 'bg-primary-600/20 text-white border-primary-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-sm">Local Grounded</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">100% offline & reproducible</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLlmProvider('openai')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    llmProvider === 'openai'
                      ? 'bg-primary-600/20 text-white border-primary-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-sm">OpenAI GPT-4o</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Cloud LLM API</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLlmProvider('gemini')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    llmProvider === 'gemini'
                      ? 'bg-primary-600/20 text-white border-primary-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-sm">Google Gemini</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Cloud Multi-modal API</span>
                </button>
              </div>
            </div>

            {llmProvider === 'openai' && (
              <div>
                <label className="block text-slate-400 mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500"
                />
              </div>
            )}

            {llmProvider === 'gemini' && (
              <div>
                <label className="block text-slate-400 mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-primary-500"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={saved ? Check : Save}
            >
              {saved ? 'Saved!' : 'Save AI Preferences'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
