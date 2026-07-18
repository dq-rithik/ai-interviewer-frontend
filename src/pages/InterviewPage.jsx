import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { api } from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle, Code, HelpCircle, FileText, Settings, Loader2 } from 'lucide-react';

const InterviewPage = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    config, 
    questions, 
    answers, 
    setAnswers, 
    currentQuestionIdx, 
    setCurrentQuestionIdx,
    setReport 
  } = useInterview();

  // If questions are not generated, redirect back to setup
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/setup');
    }
  }, [questions, navigate]);

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const currentQuestion = questions[currentQuestionIdx] || null;

  // Load saved answer for current question when index changes
  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswer(answers[currentQuestion.id] || '');
    }
  }, [currentQuestionIdx, questions]);

  if (!currentQuestion) {
    return null;
  }

  // Update answer in state
  const handleAnswerChange = (val) => {
    setCurrentAnswer(val);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val
    }));
  };

  // Support Tab key indent in code editor textarea
  const handleCodeEditorTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newVal = val.substring(0, start) + "    " + val.substring(end);
      
      handleAnswerChange(newVal);
      
      // Reset cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleSubmitInterview = async () => {
    setSubmitting(true);
    setSubmitError('');

    const stages = [
      "Reviewing communication patterns...",
      "Validating technical correctness...",
      "Analyzing architectural depth...",
      "Formulating hiring recommendations...",
      "Drafting professional feedback report..."
    ];

    let stageIdx = 0;
    setSubmitStage(stages[0]);
    const stageInterval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setSubmitStage(stages[stageIdx]);
      }
    }, 2200);

    try {
      const response = await api.submitInterview(profile, config, questions, answers);
      clearInterval(stageInterval);
      setReport(response.report);
      navigate('/results');
    } catch (err) {
      clearInterval(stageInterval);
      setSubmitError(err.message || "Failed to compile report. Check server config and keys.");
      setSubmitting(false);
    }
  };

  // Render proper input fields based on question type
  const renderAnswerInput = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <div className="flex flex-col gap-4 mt-6">
            {(currentQuestion.options || []).map((option, idx) => {
              // Extract option indicator e.g. "A"
              const optionLetter = option.trim().substring(0, 1).toUpperCase();
              const isSelected = currentAnswer === optionLetter || currentAnswer === option;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(optionLetter)}
                  className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 text-slate-100'
                      : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-500'
                  }`}>
                    {optionLetter}
                  </span>
                  <span className="font-medium text-sm md:text-base">{option}</span>
                </button>
              );
            })}
          </div>
        );

      case 'coding':
        return (
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span>Code Sandbox (Tab supported)</span>
              <span>Monospace Font</span>
            </div>
            <div className="relative font-mono rounded-xl border border-slate-800 bg-slate-950 overflow-hidden glow-indigo">
              <div className="flex bg-slate-900 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400 items-center justify-between">
                <span>solution.js / solution.py</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                onKeyDown={handleCodeEditorTab}
                placeholder="// Write your solution here...&#10;function solve() {&#10;  // your code&#10;}"
                className="w-full h-80 px-4 py-3 bg-slate-950 text-emerald-400 placeholder-slate-700 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                spellCheck="false"
              />
            </div>
          </div>
        );

      case 'scenario':
      case 'descriptive':
      default:
        return (
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span>Answer Editor</span>
              <span>{currentAnswer.length} characters</span>
            </div>
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Structure your answer clearly. Explain key steps, frameworks, or justifications..."
              className="w-full h-64 p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-200 placeholder-slate-600 focus:border-indigo-500 outline-none resize-none text-base leading-relaxed transition-colors"
            />
          </div>
        );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'coding': return <Code className="w-5 h-5 text-indigo-400" />;
      case 'mcq': return <HelpCircle className="w-5 h-5 text-purple-400" />;
      case 'scenario': return <Settings className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-emerald-400" />;
    }
  };

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-indigo-500/10 border-b-indigo-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Analyzing Responses</h2>
        <p className="text-purple-400 text-sm animate-pulse font-medium">{submitStage}</p>
        <p className="text-slate-500 text-xs mt-6 text-center max-w-sm">Please stand by. The AI is evaluating correctness, communication style, and formulating career roadmaps.</p>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercent = Math.round(((currentQuestionIdx + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Details & Progress */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 uppercase">
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-xs font-semibold text-slate-400 border border-slate-800">
              {getIcon(currentQuestion.type)}
              <span className="capitalize">{currentQuestion.type}</span>
            </span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium">
          {submitError}
        </div>
      )}

      {/* Main Question Display */}
      <div className="glass-card p-6 rounded-2xl flex flex-col gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-3 leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          {/* Expected Topics tags */}
          {currentQuestion.expected_topics && currentQuestion.expected_topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-500 font-semibold mr-1">Expected:</span>
              {currentQuestion.expected_topics.map((topic, i) => (
                <span key={i} className="text-[10px] md:text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium">
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answer Input Area */}
        {renderAnswerInput()}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className={`flex items-center gap-1 px-5 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
            currentQuestionIdx === 0
              ? 'border-slate-800 bg-slate-900/10 text-slate-600 cursor-not-allowed'
              : 'border-slate-800 bg-slate-900/40 text-slate-350 hover:border-slate-700 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {currentQuestionIdx === questions.length - 1 ? (
          <button
            onClick={handleSubmitInterview}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm md:text-base shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <CheckCircle className="w-4.5 h-4.5" />
            Finish & Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm md:text-base shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
