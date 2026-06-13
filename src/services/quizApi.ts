import axios from 'axios';
import { type Question } from '../types/quiz';
import { decodeHtmlEntities } from '../utils/quizText';

const QUESTIONS_URL = 'https://opentdb.com/api.php?amount=10&category=22&difficulty=medium&type=multiple';
const CACHE_KEY = `quiz-questions-cache:${QUESTIONS_URL}`;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

interface OpenTdbResponse {
  response_code: number;
  results: Question[];
}

let inFlightRequest: Promise<Question[]> | null = null;

const readCachedQuestions = () => {
  const raw = localStorage.getItem(CACHE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const cached = JSON.parse(raw) as { savedAt: number; questions: Question[] };
    if (Date.now() - cached.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return cached.questions;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const writeCachedQuestions = (questions: Question[]) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      savedAt: Date.now(),
      questions,
    }),
  );
};

const normalizeQuestions = (questions: Question[]) => {
  return questions
    .filter((question) => question.question && question.correct_answer && question.incorrect_answers.length > 0)
    .map((question) => ({
      ...question,
      category: decodeHtmlEntities(question.category),
      question: decodeHtmlEntities(question.question),
      correct_answer: decodeHtmlEntities(question.correct_answer),
      incorrect_answers: question.incorrect_answers.map((answer) => decodeHtmlEntities(answer)),
    }));
};

export const getQuestions = async (): Promise<Question[]> => {
  const cachedQuestions = readCachedQuestions();
  if (cachedQuestions) {
    return cachedQuestions;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = axios
    .get(QUESTIONS_URL)
    .then((response) => {
      const payload = response.data as OpenTdbResponse;

      if (payload.response_code !== 0) {
        return [];
      }

      const questions = normalizeQuestions(payload.results);

      if (questions.length > 0) {
        writeCachedQuestions(questions);
        return questions;
      }

      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
};
