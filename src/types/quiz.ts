export interface Question {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizProgress {
  currentQuestion: number;
  score: number;
  answers: string[];
  timeLeft: number;
}

export interface QuizOptionedQuestion extends Question {
  options: string[];
}

export type QuizStatus = 'in-progress' | 'completed' | 'expired';

export interface QuizSessionState {
  username: string;
  status: QuizStatus;
  questions: QuizOptionedQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: string[];
  score: number;
  timeLeft: number;
  startedAt: string;
  updatedAt: string;
}

export interface QuizAnswerReview {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  category: string;
  difficulty: string;
}

export interface QuizSession {
  username: string;
  score: number;
  totalQuestions: number;
  timeLeft: number;
  answers: QuizAnswerReview[];
  finishedAt: string;
}
