import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/components/Button';
import type { GameResult } from '../domain/types';

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
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="end-game-title"
        initial={{ opacity: 0, scale: 0.86, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-[2rem] border border-lime-300/30 bg-slate-900 p-6 text-center shadow-glow outline-none"
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
