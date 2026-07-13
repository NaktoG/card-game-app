import { useTranslation } from 'react-i18next';

export function Scoreboard({
  playerCards,
  cpuCards,
  potCards,
  remaining,
}: {
  playerCards: number;
  cpuCards: number;
  potCards: number;
  remaining: number;
}) {
  const { t } = useTranslation();
  const items = [
    [t('game.player'), playerCards],
    [t('game.cpu'), cpuCards],
    [t('game.pot'), potCards],
    [t('game.deck'), remaining],
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-card backdrop-blur-xl"
        >
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-black text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
