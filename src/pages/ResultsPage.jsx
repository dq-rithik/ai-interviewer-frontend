import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { 
  Award, CheckCircle2, AlertTriangle, XOctagon, BookOpen, 
  Clock, TrendingUp, RefreshCw, BarChart2, Star, ListCollapse 
} from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { report, resetInterview } = useInterview();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect back if no report is present
  useEffect(() => {
    if (!report) {
      navigate('/setup');
    }
  }, [report, navigate]);

  if (!report) {
    return null;
  }

  // Handle case variance in AI response keys
  const getOverallScore = () => report.overall_score ?? report.overallScore ?? 0;
  const getRating = () => report.interview_rating ?? report.interviewRating ?? 'Borderline';
  
  const getSkills = () => {
    const s = report.skills_assessment ?? report.skillsAssessment ?? {};
    return {
      communication: s.communication_score ?? s.communicationScore ?? 50,
      technical: s.technical_score ?? s.technicalScore ?? 50,
      confidence: s.confidence_score ?? s.confidenceScore ?? 50,
      problemSolving: s.problem_solving_score ?? s.problemSolvingScore ?? 50
    };
  };

  const getQuestionEvals = () => report.question_evaluations ?? report.questionEvaluations ?? [];
  const getStrengths = () => report.strengths ?? [];
  const getWeaknesses = () => report.weaknesses ?? report.weak_areas ?? report.weakAreas ?? [];
  const getSkillsToImprove = () => report.skills_to_improve ?? report.skillsToImprove ?? [];
  const getRecommendedTopics = () => report.recommended_topics ?? report.recommendedTopics ?? [];
  
  const getLearningPlan = () => {
    const lp = report.learning_plan ?? report.learningPlan ?? {};
    return {
      immediate: lp.immediate_focus ?? lp.immediateFocus ?? 'No details provided.',
      short: lp.short_term ?? lp.shortTerm ?? 'No details provided.',
      long: lp.long_term ?? lp.longTerm ?? 'No details provided.'
    };
  };

  const getFeedback = () => report.feedback ?? 'No feedback provided.';
  const getHiringRecommendation = () => report.hiring_recommendation ?? report.hiringRecommendation ?? 'Borderline';
  const getJustification = () => report.recommendation_justification ?? report.recommendationJustification ?? '';

  const skills = getSkills();
  const score = getOverallScore();
  const rating = getRating();
  const rec = getHiringRecommendation();

  // Style helper for hiring recommendations
  const getRecStyles = (recommendation) => {
    const val = recommendation.toLowerCase();
    if (val.includes('strong hire')) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/25',
        text: 'text-emerald-400',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      };
    } else if (val.includes('hire')) {
      return {
        bg: 'bg-teal-500/10 border-teal-500/25',
        text: 'text-teal-400',
        icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />
      };
    } else if (val.includes('borderline')) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/25',
        text: 'text-amber-400',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
      };
    } else if (val.includes('improvement')) {
      return {
        bg: 'bg-orange-500/10 border-orange-500/25',
        text: 'text-orange-400',
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />
      };
    } else {
      return {
        bg: 'bg-red-500/10 border-red-500/25',
        text: 'text-red-400',
        icon: <XOctagon className="w-5 h-5 text-red-400" />
      };
    }
  };

  const recStyle = getRecStyles(rec);

  const handleRestart = () => {
    resetInterview();
    navigate('/setup');
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Top Banner Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Radial Overall Score */}
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Overall Score</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-100 text-glow">{score}</span>
              <span className="text-slate-500 text-xs mt-0.5">Rating: {rating}</span>
            </div>
          </div>
        </div>

        {/* Hiring Recommendation */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Hiring Recommendation</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${recStyle.bg} ${recStyle.text} text-sm font-bold mb-4`}>
              {recStyle.icon}
              {rec}
            </div>
            <p className="text-slate-350 text-sm leading-relaxed mb-4">
              {getJustification() || "Assessment complete. Review specific score meters and question breakdowns below to plan your study sessions."}
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 self-start px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 hover:text-white font-bold text-sm transition-all cursor-pointer shadow-sm shadow-indigo-500/5 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Start New Interview
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-850 gap-2 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Performance Summary', icon: <BarChart2 className="w-4 h-4" /> },
          { id: 'qa', label: 'Detailed Q&A Evaluation', icon: <ListCollapse className="w-4 h-4" /> },
          { id: 'roadmap', label: 'Targeted Roadmap', icon: <BookOpen className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Skill Assessments Progress Meters */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Skill Assessments
            </h3>
            
            {[
              { label: "Technical Knowledge", val: skills.technical, color: "bg-indigo-500" },
              { label: "Communication Ability", val: skills.communication, color: "bg-purple-500" },
              { label: "Problem Solving Capability", val: skills.problemSolving, color: "bg-emerald-500" },
              { label: "Confidence", val: skills.confidence, color: "bg-amber-500" }
            ].map((m, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-300">{m.label}</span>
                  <span className="text-slate-100">{m.val}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color}`} style={{ width: `${m.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative Feedback Card */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Professional Feedback
            </h3>
            <p className="text-slate-350 text-sm leading-relaxed overflow-y-auto max-h-56 pr-2">
              {getFeedback()}
            </p>
          </div>

          {/* Key Strengths */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-200 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Key Strengths
            </h3>
            <ul className="flex flex-col gap-2.5">
              {getStrengths().map((str, idx) => (
                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  {str}
                </li>
              ))}
              {getStrengths().length === 0 && (
                <span className="text-slate-500 text-xs italic">No major strengths recorded. Keep studying.</span>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-200 text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Areas to Improve
            </h3>
            <ul className="flex flex-col gap-2.5">
              {getWeaknesses().map((wk, idx) => (
                <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                  {wk}
                </li>
              ))}
              {getWeaknesses().length === 0 && (
                <span className="text-slate-500 text-xs italic">No critical weak areas noted. Excellent job!</span>
              )}
            </ul>
          </div>

        </div>
      )}

      {/* 2. Q&A EVALUATION TAB */}
      {activeTab === 'qa' && (
        <div className="flex flex-col gap-6">
          {getQuestionEvals().map((item, idx) => {
            const scoreVal = item.score ?? 50;
            let scoreColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            if (scoreVal < 50) scoreColor = 'text-red-400 bg-red-500/10 border-red-500/20';
            else if (scoreVal < 75) scoreColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col gap-4 border-l-4 border-l-indigo-500">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-lg font-bold text-slate-100 leading-relaxed">
                    Q{idx + 1}: {item.question}
                  </h4>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-bold shrink-0 ${scoreColor}`}>
                    {scoreVal}% Score
                  </span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 font-mono text-sm leading-relaxed text-slate-400 max-h-48 overflow-y-auto">
                  <div className="text-xs text-slate-600 font-bold mb-1.5 uppercase font-sans">Your Response:</div>
                  <pre className="whitespace-pre-wrap font-mono">{item.user_answer || item.userAnswer || "[Skipped / Blank]"}</pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-wider">Answer Strengths</div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{item.strengths || "Correct conceptual base."}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="text-xs text-amber-400 font-bold mb-1 uppercase tracking-wider">Suggested Improvements</div>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{item.improvements || item.improvement || "Elaborate with examples."}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. ROADMAP TAB */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Priority Skills & Recommended Topics */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* Priority Skills to Improve */}
            <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Priority Skills
              </h3>
              <div className="flex flex-col gap-3">
                {getSkillsToImprove().map((item, i) => {
                  const pri = (item.priority ?? "Medium").toLowerCase();
                  let badge = "bg-slate-800 text-slate-400 border-slate-700";
                  if (pri === "high") badge = "bg-red-500/10 text-red-400 border-red-500/20";
                  else if (pri === "medium") badge = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                  
                  return (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-850">
                      <span className="text-slate-200 text-sm font-semibold">{item.skill}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${badge}`}>
                        {item.priority}
                      </span>
                    </div>
                  );
                })}
                {getSkillsToImprove().length === 0 && (
                  <span className="text-slate-500 text-xs italic">No skills listed. Great foundation!</span>
                )}
              </div>
            </div>

            {/* Recommended Learning Topics */}
            <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Recommended Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {getRecommendedTopics().map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-350 text-xs font-semibold">
                    {topic}
                  </span>
                ))}
                {getRecommendedTopics().length === 0 && (
                  <span className="text-slate-500 text-xs italic text-center w-full">Standard topics approved.</span>
                )}
              </div>
            </div>

          </div>

          {/* Learning Plan Timeline */}
          <div className="glass-card p-6 rounded-2xl lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Personalized Learning Plan
            </h3>

            <div className="relative border-l border-slate-800 ml-4 flex flex-col gap-8">
              
              {/* Timeline Point 1: 1-2 Weeks */}
              <div className="relative pl-6">
                <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 glow-indigo"></span>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Immediate Focus (1–2 Weeks)</div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-900 mt-2">
                  {getLearningPlan().immediate}
                </p>
              </div>

              {/* Timeline Point 2: 1 Month */}
              <div className="relative pl-6">
                <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 glow-purple"></span>
                <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Short-Term Plan (1 Month)</div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-900 mt-2">
                  {getLearningPlan().short}
                </p>
              </div>

              {/* Timeline Point 3: 3 Months */}
              <div className="relative pl-6">
                <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Long-Term Plan (3 Months)</div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-900 mt-2">
                  {getLearningPlan().long}
                </p>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ResultsPage;
