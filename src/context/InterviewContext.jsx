import React, { createContext, useContext, useState } from 'react';

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    fullName: '',
    jobRole: '',
    experienceLevel: 'Fresher',
    skills: []
  });

  const [config, setConfig] = useState({
    interviewType: 'Mixed',
    difficulty: 'Medium',
    numQuestions: 5
  });

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [report, setReport] = useState(null);

  const resetInterview = () => {
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setReport(null);
  };

  return (
    <InterviewContext.Provider value={{
      profile,
      setProfile,
      config,
      setConfig,
      questions,
      setQuestions,
      answers,
      setAnswers,
      currentQuestionIdx,
      setCurrentQuestionIdx,
      report,
      setReport,
      resetInterview
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
