import type { ReactNode } from 'react';

export function PremiumPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.075] shadow-card backdrop-blur-2xl before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-lime-200/70 before:to-transparent ${className}`}
    >
      <div
        className="absolute -right-24 -top-24 h-52 w-52 rounded-full bg-lime-300/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
