import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

export const routes = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/quiz',
    element: <QuizPage />,
  },
  {
    path: '/result',
    element: <ResultPage />,
  },
];
