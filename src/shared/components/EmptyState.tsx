import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-card backdrop-blur-xl">
      <p className="text-xl font-black text-white">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
