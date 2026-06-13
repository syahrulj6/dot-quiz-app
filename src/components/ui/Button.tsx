import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-sky-600 text-white shadow-[0_12px_30px_rgba(2,132,199,0.18)] hover:bg-sky-700 focus-visible:ring-sky-300',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300',
  ghost: 'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300',
  success: 'bg-green-600 text-white shadow-[0_12px_30px_rgba(22,163,74,0.18)] hover:bg-green-700 focus-visible:ring-green-300',
  danger: 'bg-red-600 text-white shadow-[0_12px_30px_rgba(225,29,72,0.18)] hover:bg-red-700 focus-visible:ring-red-300',
};

export const Button = ({ children, className = '', variant = 'primary', ...props }: Props) => {
  return (
    <button
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        px-4
        py-3
        text-sm
        font-semibold
        border
        transition
        duration-200
        ease-out
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variantClasses[variant]}
        ${className}
        cursor-pointer
      `}
    >
      {children}
    </button>
  );
};
