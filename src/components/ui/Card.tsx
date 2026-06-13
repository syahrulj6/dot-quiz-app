import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: Props) => {
  return (
    <div
      className={`
        w-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-xl
        md:p-8
        ${className}
      `}
    >
      {children}
    </div>
  );
};
