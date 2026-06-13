import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { clearQuizSession, getQuizSession, saveQuizSession } from '../hooks/useQuizStorage';
import { buildQuestionSet, createAnswerList, getQuizCounts, TOTAL_QUIZ_TIME } from '../lib/quiz';
import { getQuestions } from '../services/quizApi';
import { type QuizOptionedQuestion, type QuizSessionState, type QuizStatus } from '../types/quiz';

const AUTO_ADVANCE_MS = 850;

const QuizPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username')?.trim() || '';

  const [questions, setQuestions] = useState<QuizOptionedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_QUIZ_TIME);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionStatus, setQuestionStatus] = useState<'idle' | 'answered'>('idle');

  const autoAdvanceRef = useRef<number | null>(null);
  const isHydratingRef = useRef(true);
  const finishedRef = useRef(false);
  const questionsRef = useRef<QuizOptionedQuestion[]>([]);
  const selectedAnswersRef = useRef<string[]>([]);
  const currentQuestionIndexRef = useRef(0);
  const timeLeftRef = useRef(TOTAL_QUIZ_TIME);
  const startedAtRef = useRef(new Date().toISOString());

  const currentQuestion = questions[currentQuestionIndex];
  const quizCounts = useMemo(() => getQuizCounts(questions, selectedAnswers), [questions, selectedAnswers]);
  const progressValue = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const currentAnswer = selectedAnswers[currentQuestionIndex] || '';
  const isAnswered = currentAnswer !== '';
  const feedback = isAnswered ? (currentAnswer === currentQuestion?.correct_answer ? 'Correct answer.' : `Correct answer: ${currentQuestion?.correct_answer ?? ''}`) : 'Select one answer to continue automatically.';

  const clearAutoAdvance = () => {
    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  };

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const finishQuiz = (status: QuizStatus) => {
    if (!questionsRef.current.length || finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    clearAutoAdvance();

    const summary = getQuizCounts(questionsRef.current, selectedAnswersRef.current);
    const session: QuizSessionState = {
      username: username || 'Guest',
      status,
      questions: questionsRef.current,
      currentQuestionIndex: currentQuestionIndexRef.current,
      selectedAnswers: selectedAnswersRef.current,
      score: summary.correctCount,
      timeLeft: timeLeftRef.current,
      startedAt: startedAtRef.current,
      updatedAt: new Date().toISOString(),
    };

    saveQuizSession(session);
    localStorage.setItem('score', String(summary.correctCount));
    navigate('/result');
  };

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [navigate, username]);

  useEffect(() => {
    let isActive = true;

    const loadQuiz = async () => {
      setIsLoading(true);
      setError('');
      isHydratingRef.current = true;
      finishedRef.current = false;
      clearAutoAdvance();

      try {
        const savedSession = getQuizSession();

        if (savedSession && savedSession.status === 'in-progress' && savedSession.questions.length > 0) {
          const restoredQuestions = buildQuestionSet(savedSession.questions);
          const restoredIndex = Math.min(savedSession.currentQuestionIndex, Math.max(restoredQuestions.length - 1, 0));

          if (!isActive) {
            return;
          }

          startedAtRef.current = savedSession.startedAt;
          setQuestions(restoredQuestions);
          setCurrentQuestionIndex(restoredIndex);
          setSelectedAnswers(savedSession.selectedAnswers.length ? savedSession.selectedAnswers.slice(0, restoredQuestions.length) : createAnswerList(restoredQuestions.length));
          setTimeLeft(Math.max(0, Math.min(savedSession.timeLeft, TOTAL_QUIZ_TIME)));
          setQuestionStatus(savedSession.selectedAnswers[restoredIndex] ? 'answered' : 'idle');
          isHydratingRef.current = false;

          if (savedSession.selectedAnswers[restoredIndex]) {
            autoAdvanceRef.current = window.setTimeout(() => {
              setQuestionStatus('idle');

              const nextIndex = restoredIndex + 1;

              if (nextIndex >= restoredQuestions.length) {
                finishQuiz('completed');
                return;
              }

              setCurrentQuestionIndex(nextIndex);
            }, 300);
          }

          return;
        }

        const fetchedQuestions = await getQuestions();

        if (!isActive) {
          return;
        }

        const preparedQuestions = buildQuestionSet(fetchedQuestions);
        const initialAnswers = createAnswerList(preparedQuestions.length);
        const startedAt = new Date().toISOString();

        startedAtRef.current = startedAt;
        setQuestions(preparedQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers(initialAnswers);
        setTimeLeft(TOTAL_QUIZ_TIME);
        setQuestionStatus('idle');

        saveQuizSession({
          username: username || 'Guest',
          status: 'in-progress',
          questions: preparedQuestions,
          currentQuestionIndex: 0,
          selectedAnswers: initialAnswers,
          score: 0,
          timeLeft: TOTAL_QUIZ_TIME,
          startedAt,
          updatedAt: startedAt,
        });

        isHydratingRef.current = false;
      } catch {
        if (isActive) {
          setError('Unable to load quiz questions.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      isActive = false;
      clearAutoAdvance();
    };
  }, [username]);

  useEffect(() => {
    if (!questions.length || isLoading || isHydratingRef.current) {
      return;
    }

    const snapshot = getQuizCounts(questions, selectedAnswers);

    saveQuizSession({
      username: username || 'Guest',
      status: 'in-progress',
      questions,
      currentQuestionIndex,
      selectedAnswers,
      score: snapshot.correctCount,
      timeLeft,
      startedAt: startedAtRef.current,
      updatedAt: new Date().toISOString(),
    });
  }, [currentQuestionIndex, isLoading, questions, selectedAnswers, timeLeft, username]);

  useEffect(() => {
    if (!questions.length || isLoading) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLoading, questions.length]);

  useEffect(() => {
    if (!questions.length || isLoading || timeLeft > 0) {
      return;
    }

    finishQuiz('expired');
  }, [isLoading, questions.length, timeLeft]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || questionStatus === 'answered') {
      return;
    }

    clearAutoAdvance();
    setQuestionStatus('answered');

    setSelectedAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];
      nextAnswers[currentQuestionIndex] = answer;
      return nextAnswers;
    });

    autoAdvanceRef.current = window.setTimeout(() => {
      setQuestionStatus('idle');

      const nextIndex = currentQuestionIndexRef.current + 1;

      if (nextIndex >= questionsRef.current.length) {
        finishQuiz('completed');
        return;
      }

      setCurrentQuestionIndex(nextIndex);
    }, AUTO_ADVANCE_MS);
  };

  const handleExit = () => {
    clearQuizSession();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center  p-4 text-slate-900">
        <Card className="max-w-xl text-center">
          <div className="mx-auto mb-6 h-14 w-14 animate-pulse rounded-full bg-sky-100" />
          <h1 className="text-3xl font-semibold">Loading your quiz</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">We are preparing your questions and restoring your progress if a previous session exists.</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center  p-4 text-slate-900">
        <Card className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Quiz error</p>
          <h1 className="mt-3 text-3xl font-semibold">{error}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Please go back and try again. If this keeps happening, the API may be rate limiting temporarily.</p>
          <Button className="mt-6" onClick={handleExit}>
            Back to home
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen md:mt-4 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-700/80">Quiz mode</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 md:text-3xl">Welcome back, {username || 'Guest'}</h1>
            <p className="mt-1 text-sm text-slate-600">One question at a time, auto-advance enabled, and your progress is saved locally.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Timer timeLeft={timeLeft} />
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800">Score {quizCounts.correctCount}</div>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.5fr_0.75fr]">
          <main className="space-y-6">
            <Card className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question progress</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  Answered {quizCounts.answeredCount}/{questions.length}
                </div>
              </div>

              <ProgressBar value={progressValue} />

              <QuestionCard question={currentQuestion.question} options={currentQuestion.options} selectedAnswer={currentAnswer || null} correctAnswer={currentQuestion.correct_answer} onAnswer={handleAnswer} isLocked={isAnswered} />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{feedback}</div>
            </Card>
          </main>

          <aside className="space-y-6">
            <Card className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question details</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{currentQuestion.category}</h2>
                <p className="mt-1 text-sm capitalize text-slate-600">{currentQuestion.difficulty} difficulty</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Total questions</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{questions.length}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-sky-100 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Answered</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{quizCounts.answeredCount}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-green-100 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Correct</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{quizCounts.correctCount}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-red-100 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Wrong</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{quizCounts.wrongCount}</p>
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How it works</p>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                <li>Choose an answer and the app automatically moves to the next question.</li>
                <li>If the timer reaches zero, the quiz closes and shows your result summary.</li>
                <li>Your current progress is stored in local, so reopening the browser can resume it.</li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
