import type { ReactNode } from 'react';
import { PremiumPanel } from '../../../shared/components/PremiumPanel';

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
    <PremiumPanel className={`p-5 text-center ${active ? 'ring-2 ring-lime-300/50' : ''}`}>
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-[0.28em] text-slate-300">{label}</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-white">
            {score}
          </span>
        </div>
        {children}
      </section>
    </PremiumPanel>
  );
}
