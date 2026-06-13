interface Props {
  timeLeft: number;
}

export const Timer = ({ timeLeft }: Props) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
      <span className="mr-2 h-2 w-2 rounded-full bg-rose-500" />
      Time left {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};
