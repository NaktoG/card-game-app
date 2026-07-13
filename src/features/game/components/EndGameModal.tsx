import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import type { GameResult } from '../domain/types';

const confetti = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: index * 0.03,
}));

export function EndGameModal({
  open,
  result,
  onPlayAgain,
  onRanking,
}: {
  open: boolean;
  result: GameResult;
  onPlayAgain: () => void;
  onRanking: () => void;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-xl"
      role="presentation"
    >
      {confetti.map((piece) => (
        <motion.span
          key={piece.id}
          aria-hidden="true"
          initial={{ y: -120, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 2.8, delay: piece.delay, ease: 'easeOut' }}
          className="absolute top-0 h-3 w-2 rounded-sm bg-lime-300 shadow-glow"
          style={{ left: piece.left }}
        />
      ))}
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="end-game-title"
        initial={{ opacity: 0, scale: 0.86, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-lime-300/30 bg-slate-900 p-6 text-center shadow-glow outline-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-lime-200 before:to-transparent"
      >
        <p className="text-sm font-black uppercase tracking-[0.28em] text-lime-200">
          {t('result.title')}
        </p>
        <h2
          id="end-game-title"
          className="mt-3 font-display text-4xl font-black tracking-[-0.04em] text-white"
        >
          {t(`result.${result.winner}`)}
        </h2>
        <p className="mt-4 text-slate-300">
          {t('result.summary', { playerCards: result.playerCards, cpuCards: result.cpuCards })}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={onPlayAgain}>
            {t('result.playAgain')}
          </Button>
          <Button type="button" variant="secondary" onClick={onRanking}>
            {t('result.viewRanking')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
