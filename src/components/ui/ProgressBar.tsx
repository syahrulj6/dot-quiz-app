interface Props {
  value: number;
  label?: string;
}

export const ProgressBar = ({ value, label }: Props) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
          <span>{label}</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      ) : null}

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-sky-600 duration-300" style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
};
