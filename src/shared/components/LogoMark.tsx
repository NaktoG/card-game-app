import { motion, useReducedMotion } from 'framer-motion';

type LogoMarkProps = {
  size?: 'sm' | 'md';
};

const sizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
};

export function LogoMark({ size = 'md' }: LogoMarkProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      animate={prefersReducedMotion ? { rotate: 0 } : { rotate: [0, -4, 4, 0] }}
      transition={prefersReducedMotion ? undefined : { duration: 3.5 }}
      className={`relative grid ${sizes[size]} place-items-center rounded-2xl bg-lime-300 text-slate-950 shadow-glow`}
      aria-hidden="true"
    >
      <span className="absolute h-7 w-5 -rotate-12 rounded-[0.35rem] bg-slate-950" />
      <span className="absolute h-7 w-5 rotate-12 rounded-[0.35rem] bg-white" />
      <span className="relative text-lg font-black text-rose-500">♥</span>
    </motion.span>
  );
}
