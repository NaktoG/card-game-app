import { motion, useReducedMotion } from 'framer-motion';
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
  const prefersReducedMotion = useReducedMotion();
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
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-card backdrop-blur-xl before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-lime-200/60 before:to-transparent"
        >
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <motion.p
            key={String(value)}
            initial={prefersReducedMotion ? false : { scale: 1, opacity: 1 }}
            animate={
              prefersReducedMotion
                ? { scale: 1, opacity: 1 }
                : { scale: [1, 1.08, 1], opacity: [1, 0.7, 1] }
            }
            transition={{ duration: 0.2 }}
            className="mt-2 font-display text-3xl font-black text-white"
          >
            {value}
          </motion.p>
        </div>
      ))}
    </div>
  );
}
