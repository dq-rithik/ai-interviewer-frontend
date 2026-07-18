import axios from 'axios';

const API_BASE_URL = 'https://ai-interviewer-backend-1-1dsw.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60s timeout for large AI requests
});

export const api = {
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error(error.response?.data?.message || 'Backend server is not reachable.');
    }
  },

  generateInterview: async (profile, config) => {
    try {
      const response = await apiClient.post('/interview/generate', {
        fullName: profile.fullName,
        jobRole: profile.jobRole,
        experienceLevel: profile.experienceLevel,
        skills: profile.skills,
        interviewType: config.interviewType,
        difficulty: config.difficulty,
        numQuestions: config.numQuestions
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate interview:', error);
      const details = error.response?.data?.details;
      let msg = error.response?.data?.message || 'Failed to connect to the interview generator.';
      if (details) {
        msg = Object.values(details).join(' ');
      }
      throw new Error(msg);
    }
  },

  submitInterview: async (profile, config, questions, answers) => {
    try {
      const response = await apiClient.post('/interview/submit', {
        userProfile: profile,
        config: config,
        questions: questions,
        answers: answers
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit interview evaluation:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit interview answers for evaluation. Check your internet connection and AI API keys.');
    }
  }
};
