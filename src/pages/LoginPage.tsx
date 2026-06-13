import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { clearQuizSession, getQuizSession } from '../hooks/useQuizStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  const storedSession = getQuizSession();
  const canResume = Boolean(storedSession && storedSession.status === 'in-progress' && storedSession.questions.length > 0);
  const storedName = localStorage.getItem('username') || storedSession?.username || '';
  const [name, setName] = useState(storedName);

  const handleLogin = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    localStorage.setItem('username', trimmedName);
    clearQuizSession();
    navigate('/quiz');
  };

  const handleResume = () => {
    const resumedName = storedSession?.username || storedName || name.trim();

    if (resumedName) {
      localStorage.setItem('username', resumedName);
    }

    navigate('/quiz');
  };

  return (
    <div className="min-h-screen  px-4 py-6 text-slate-900 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-700/80">Smart quiz experience</div>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">A cleaner way to take fast, focused quizzes.</h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">Answer one question at a time, see instant feedback, and finish with a clean score summary.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Focus</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">One question at a time</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-100 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Feedback</p>
              <p className="mt-2 text-lg font-semibold text-green-500">Immediate answer review</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-100 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Progress</p>
              <p className="mt-2 text-lg font-semibold text-amber-500">Saved locally</p>
            </div>
          </div>
        </div>

        <Card className="mx-auto max-w-xl">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700/80">Start here</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Enter your name</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">We use your name to personalize the quiz and your results screen.</p>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">Display name</span>
                <Input
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button className="w-full" onClick={handleLogin} disabled={!name.trim()}>
                  Start quiz
                </Button>

                <Button variant="ghost" className="w-full" onClick={handleResume} disabled={!canResume}>
                  Resume quiz
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">You will get 10 multiple choice questions with a timer and a final score review.</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
