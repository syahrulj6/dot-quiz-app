import { type Question, type QuizOptionedQuestion } from '../types/quiz';
import { decodeHtmlEntities, shuffleWithSeed } from '../utils/quizText';

export const TOTAL_QUIZ_TIME = 180;

export const createAnswerList = (length: number) => Array.from({ length }, () => '');

export const buildQuestionSet = (questions: Question[]): QuizOptionedQuestion[] => {
  return questions.map((question) => ({
    ...question,
    category: decodeHtmlEntities(question.category),
    question: decodeHtmlEntities(question.question),
    correct_answer: decodeHtmlEntities(question.correct_answer),
    incorrect_answers: question.incorrect_answers.map((answer) => decodeHtmlEntities(answer)),
    options: shuffleWithSeed(
      [question.correct_answer, ...question.incorrect_answers].map((answer) => decodeHtmlEntities(answer)),
      question.question,
    ),
  }));
};

export const getQuizCounts = (questions: QuizOptionedQuestion[], answers: string[]) => {
  let correctCount = 0;
  let wrongCount = 0;
  let answeredCount = 0;

  questions.forEach((question, index) => {
    const selectedAnswer = answers[index];

    if (!selectedAnswer) {
      return;
    }

    answeredCount += 1;

    if (selectedAnswer === question.correct_answer) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  });

  return {
    correctCount,
    wrongCount,
    answeredCount,
  };
};
