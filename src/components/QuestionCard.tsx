import { Button } from './ui/Button';

interface Props {
  question: string;
  options: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  isLocked?: boolean;
}

export const QuestionCard = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onAnswer,
  isLocked = false,
}: Props) => {
  const isRevealed = selectedAnswer !== null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700/80">Question</p>
        <h2 className="text-2xl font-semibold leading-tight text-slate-900">{question}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswer;
          const variant = isRevealed
            ? isCorrectOption
              ? 'success'
              : isSelected
                ? 'danger'
                : 'secondary'
            : isSelected
              ? 'primary'
              : 'ghost';

          return (
            <Button
              key={option}
              variant={variant}
              disabled={isLocked || isRevealed}
              className="min-h-14 justify-start whitespace-normal px-5 py-4 text-left leading-snug"
              onClick={() => onAnswer(option)}
            >
              <span>{option}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
