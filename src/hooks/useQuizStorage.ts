import { type QuizSessionState } from '../types/quiz';

const SESSION_KEY = 'quiz-session-state';

export const saveQuizSession = (session: QuizSessionState) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getQuizSession = () => {
  const data = localStorage.getItem(SESSION_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as QuizSessionState;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const clearQuizSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
