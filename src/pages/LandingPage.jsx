import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Code, CheckCircle, MessageSquare, Terminal, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-400" />,
      title: "Simulated Dialogues",
      desc: "Practice behavior, HR, and scenario questions specific to your background."
    },
    {
      icon: <Code className="w-6 h-6 text-purple-400" />,
      title: "Interactive Coding",
      desc: "Solve programming challenges in a streamlined sandbox optimized for technical positions."
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: "Comprehensive Scoring",
      desc: "Receive immediate assessments of technical knowledge, communication, and readiness."
    },
    {
      icon: <Terminal className="w-6 h-6 text-amber-400" />,
      title: "Custom Roadmaps",
      desc: "Get personalized 1-week, 1-month, and 3-month skill roadmaps generated just for you."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-12 px-4 select-none">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6 animate-pulse-slow">
        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
        Powered by Advanced Large Language Models
      </div>

      {/* Hero Header */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-slate-100 to-purple-200 max-w-4xl mb-6">
        Refine your responses with <span className="text-indigo-400 text-glow">AI Interview Coach</span>
      </h1>

      <p className="text-slate-400 text-lg md:text-xl text-center max-w-2xl mb-10 leading-relaxed">
        Conduct mock interviews tailored directly to your target role, experience, and skillset. Receive detailed feedback, score metrics, and prioritized learning paths.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
        <button
          onClick={() => navigate('/setup')}
          className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Start Mock Interview
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {features.map((f, i) => (
          <div key={i} className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col items-start">
            <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl mb-4">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
