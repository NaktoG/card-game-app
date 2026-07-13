import type { ReactNode } from 'react';

export function PlayerPanel({
  label,
  score,
  active,
  children,
}: {
  label: string;
  score: number;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[2rem] border p-5 text-center shadow-card backdrop-blur-xl ${active ? 'border-lime-300/50 bg-lime-300/10' : 'border-white/10 bg-white/[0.06]'}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.28em] text-slate-300">{label}</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-white">
          {score}
        </span>
      </div>
      {children}
    </section>
  );
}
