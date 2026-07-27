import type { ReactNode } from 'react';
import { useId } from 'react';
import { PremiumPanel } from '../../../shared/components/PremiumPanel';

export function PlayerPanel({
  label,
  score,
  active,
  statusLabel,
  winnerLabel,
  children,
}: {
  label: string;
  score: number;
  active: boolean;
  statusLabel?: string;
  winnerLabel?: string;
  children: ReactNode;
}) {
  const headingId = useId();

  return (
    <PremiumPanel className={`p-5 text-center ${active ? 'ring-2 ring-lime-300/50' : ''}`}>
      <section role="region" aria-labelledby={headingId}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2
            id={headingId}
            className="text-sm font-black uppercase tracking-[0.28em] text-slate-300"
          >
            {label}
          </h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-white">
            {score}
          </span>
        </div>
        {statusLabel || winnerLabel ? (
          <p className="mb-4 text-sm font-bold text-lime-100">
            {[statusLabel, winnerLabel].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        {children}
      </section>
    </PremiumPanel>
  );
}
