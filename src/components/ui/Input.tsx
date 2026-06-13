import { type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ className = '', ...props }: Props) => {
  return (
    <input
      {...props}
      className={`
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-slate-900
        placeholder:text-slate-400
        outline-none
        transition
        duration-200
        focus:border-sky-500
        focus:ring-2
        focus:ring-sky-200
        ${className}
      `}
    />
  );
};
