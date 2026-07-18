import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import InterviewPage from './pages/InterviewPage';
import ResultsPage from './pages/ResultsPage';
import { api } from './services/api';
import { ShieldCheck, HelpCircle, Terminal } from 'lucide-react';

const App = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.checkHealth();
        setBackendStatus('connected');
      } catch (err) {
        setBackendStatus('error');
      }
    };
    checkHealth();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Premium Dark Header */}
      <header className="glass-card sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group select-none">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center border border-indigo-400/20 group-hover:scale-105 transition-all">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-slate-100">
            Interview<span className="text-indigo-400 font-medium">Coach</span>
          </span>
        </Link>

        {/* Backend Connection Dot */}
        <div className="flex items-center gap-2">
          {backendStatus === 'checking' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] md:text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 animate-pulse"></span>
              Ping Server...
            </span>
          )}
          {backendStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] md:text-xs font-semibold text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              AI Core Online
            </span>
          )}
          {backendStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[10px] md:text-xs font-semibold text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              Server Offline
            </span>
          )}
        </div>
      </header>

      {/* Main Pages */}
      <main className="flex-grow flex items-center justify-center">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>

      {/* Modern Footer */}
      <footer className="w-full border-t border-slate-900/80 py-6 px-8 text-center bg-[#02050c]/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-650">
        <div>
          © {new Date().getFullYear()} AI Interview Coach. Built with React & Python.
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-slate-650" />
            Sandbox Verified
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-slate-650" />
            Help & Documentation
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
