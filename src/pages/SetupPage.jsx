import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { api } from '../services/api';
import { Sparkles, User, Briefcase, Plus, X, ListTodo, Sliders, Play } from 'lucide-react';

const SetupPage = () => {
  const navigate = useNavigate();
  const { profile, setProfile, config, setConfig, setQuestions } = useInterview();

  // Local state for tags and validation
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(profile.skills || []);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [apiError, setApiError] = useState('');

  const [formName, setFormName] = useState(profile.fullName || '');
  const [formRole, setFormRole] = useState(profile.jobRole || '');
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel || 'Experienced');
  const [interviewType, setInterviewType] = useState(config.interviewType || 'Mixed');
  const [difficulty, setDifficulty] = useState(config.difficulty || 'Medium');
  const [numQuestions, setNumQuestions] = useState(config.numQuestions || 5);

  // Add skill pill
  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanInput = skillInput.trim();
    if (cleanInput && !skills.includes(cleanInput)) {
      const updated = [...skills, cleanInput];
      setSkills(updated);
      setErrors((prev) => ({ ...prev, skills: null }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(e);
    }
  };

  // Run form validation
  const validateForm = () => {
    const tempErrors = {};
    if (!formName.trim()) tempErrors.fullName = "Please enter your name.";
    if (!formRole.trim()) tempErrors.jobRole = "Please enter the target job role.";
    if (skills.length === 0) tempErrors.skills = "Please list at least one skill.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit and Call API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    
    // Animate stage updates
    const stages = [
      "Analyzing target job role...",
      "Mapping selected skill set...",
      "Configuring experience level parameters...",
      "Generating dynamic questions...",
      "Compiling interview configuration..."
    ];
    
    let stageIdx = 0;
    setLoadingStage(stages[0]);
    const stageInterval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setLoadingStage(stages[stageIdx]);
      }
    }, 1800);

    const updatedProfile = {
      fullName: formName,
      jobRole: formRole,
      experienceLevel,
      skills
    };

    const updatedConfig = {
      interviewType,
      difficulty,
      numQuestions
    };

    setProfile(updatedProfile);
    setConfig(updatedConfig);

    try {
      const response = await api.generateInterview(updatedProfile, updatedConfig);
      clearInterval(stageInterval);
      setQuestions(response.questions);
      navigate('/interview');
    } catch (err) {
      clearInterval(stageInterval);
      setApiError(err.message || "Failed to generate interview questions. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Generating Interview</h2>
        <p className="text-indigo-400 text-sm animate-pulse font-medium">{loadingStage}</p>
        <p className="text-slate-500 text-xs mt-6 text-center max-w-sm">This can take up to 20 seconds as the AI curates customized challenges for you.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 mb-2">Configure Simulation Settings</h2>
        <p className="text-slate-400">Setup your job criteria. The AI will customize coding, HR, and situational questions dynamically.</p>
      </div>

      {apiError && (
        <div className="mb-8 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Candidate Profile */}
        <div className="glass-card p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-200">Candidate Information</h3>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-600 outline-none transition-colors w-full"
            />
            {errors.fullName && <span className="text-red-400 text-xs font-medium">{errors.fullName}</span>}
          </div>

          {/* Job Role */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              Target Job Role
            </label>
            <input
              type="text"
              placeholder="e.g. React Developer, Data Analyst"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-600 outline-none transition-colors w-full"
            />
            {errors.jobRole && <span className="text-red-400 text-xs font-medium">{errors.jobRole}</span>}
          </div>

          {/* Experience Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">Experience Level</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setExperienceLevel('Fresher')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  experienceLevel === 'Fresher'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                }`}
              >
                Fresher
              </button>
              <button
                type="button"
                onClick={() => setExperienceLevel('Experienced')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  experienceLevel === 'Experienced'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                }`}
              >
                Experienced
              </button>
            </div>
          </div>

          {/* Skills Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">Skills / Focus Areas</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. React, JavaScript, SQL, CSS"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-600 outline-none transition-colors flex-1"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.skills && <span className="text-red-400 text-xs font-medium">{errors.skills}</span>}

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-slate-600 text-xs italic">No skills added yet. Press Enter or click + after typing.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Interview Options */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-6 flex-1">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-slate-200">Interview Parameters</h3>
            </div>

            {/* Interview Type */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">Interview Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['Technical', 'HR', 'Mixed'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInterviewType(type)}
                    className={`py-3 px-2 rounded-xl border text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      interviewType === type
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">Difficulty Grade</label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      difficulty === lvl
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                        : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                <span>Number of Questions</span>
                <span className="text-indigo-400 font-bold">{numQuestions} Questions</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 my-4 focus:outline-none"
              />
              <div className="flex justify-between text-slate-600 text-xs px-1">
                <span>3 (Short)</span>
                <span>5 (Medium)</span>
                <span>10 (Full)</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            Initialize Simulation
          </button>
        </div>

      </form>
    </div>
  );
};

export default SetupPage;
