import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { clearQuizSession, getQuizSession } from '../hooks/useQuizStorage';
import { getQuizCounts } from '../lib/quiz';

const ResultPage = () => {
  const navigate = useNavigate();

  const session = getQuizSession();

  if (!session || session.status === 'in-progress') {
    return (
      <div className="flex min-h-screen items-center justify-center  px-4 py-6 text-slate-900 md:px-6">
        <Card className="max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700/80">No result yet</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">There is no finished quiz to show.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Start a quiz first or resume your in-progress session from the login page.</p>
          <Button className="mt-6" onClick={() => navigate('/')}>
            Go to login
          </Button>
        </Card>
      </div>
    );
  }

  const questions = session.questions;
  const selectedAnswers = session.selectedAnswers;
  const { correctCount, wrongCount, answeredCount } = getQuizCounts(questions, selectedAnswers);
  const unansweredCount = questions.length - answeredCount;
  const percentage = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const finishedLabel = session.status === 'expired' ? 'Time expired' : 'Quiz completed';

  const finishedLabelColor = session.status === 'expired' ? 'text-red-700/80' : 'text-green-700/80';

  const restartQuiz = () => {
    clearQuizSession();
    navigate('/quiz');
  };

  const goHome = () => {
    clearQuizSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen md:mt-4 px-4 py-6 text-slate-900 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="space-y-6 h-fit">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide  ${finishedLabelColor} `}>{finishedLabel}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950">Nice work, {session.username}.</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Here is the complete summary of your attempt, including how many you answered, got right, and got wrong.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total questions</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{questions.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-sky-100 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Answered</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{answeredCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-green-100 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Correct</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{correctCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-red-100 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Wrong</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{wrongCount}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Unanswered</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{unansweredCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">Accuracy</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{percentage}%</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={restartQuiz}>Play again</Button>
              <Button variant="ghost" onClick={goHome}>
                Back to home
              </Button>
            </div>
          </Card>

          <Card className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700/80">Answer review</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Check your responses</h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                {answeredCount}/{questions.length} answered
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[index];
                const isCorrect = selectedAnswer === question.correct_answer;
                const hasAnswer = Boolean(selectedAnswer);

                return (
                  <div key={`${question.question}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">Question {index + 1}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hasAnswer ? (isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-slate-200 text-slate-600'}`}>
                        {hasAnswer ? (isCorrect ? 'Correct' : 'Wrong') : 'Unanswered'}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">{question.question}</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Your answer</p>
                        <p className="mt-2 text-sm text-slate-900">{hasAnswer ? selectedAnswer : 'Not answered'}</p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Correct answer</p>
                        <p className="mt-2 text-sm text-slate-900">{question.correct_answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
