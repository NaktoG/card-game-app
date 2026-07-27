import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-lime-300 text-slate-950 shadow-glow hover:bg-lime-200',
  secondary: 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
  ghost: 'bg-transparent text-white/80 hover:bg-white/10',
  danger: 'bg-rose-500/90 text-white hover:bg-rose-400',
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const isDisabled = Boolean(props.disabled);

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      aria-disabled={isDisabled || undefined}
      className={`min-h-11 rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-[0.2em] transition disabled:cursor-not-allowed disabled:opacity-60 disabled:ring-2 disabled:ring-white/30 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
