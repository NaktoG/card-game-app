import { motion, useReducedMotion } from 'framer-motion';
import { Medal, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AppRoute } from '../../app/App';
import { Button } from '../../shared/components/Button';
import { EmptyState } from '../../shared/components/EmptyState';
import { MotionPage } from '../../shared/components/MotionPage';
import { PremiumPanel } from '../../shared/components/PremiumPanel';
import { useSessionStore } from '../home/sessionStore';
import { useRankingStore } from './rankingStore';

const TOP_POSITIONS = 3;

const ease = [0.22, 1, 0.36, 1] as const;

function getPositionStyles(index: number) {
  const position = index + 1;

  if (position === 1) {
    return {
      row: 'bg-lime-300/5 border border-lime-300/20',
      positionBadge: 'bg-lime-300 text-slate-950',
      medalColor: 'text-lime-300',
    };
  }

  if (position === 2) {
    return {
      row: 'bg-cyan-300/5 border border-cyan-300/15',
      positionBadge: 'bg-cyan-300/80 text-slate-950',
      medalColor: 'text-cyan-300',
    };
  }

  if (position === 3) {
    return {
      row: 'bg-violet-300/5 border border-violet-300/15',
      positionBadge: 'bg-violet-300/70 text-white',
      medalColor: 'text-violet-300',
    };
  }

  return {
    row: '',
    positionBadge: 'bg-white/10 text-slate-200',
    medalColor: 'text-slate-400',
  };
}

function getRowMotion(index: number, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.15 },
    };
  }

  return {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: index * 0.04, duration: 0.35, ease },
  };
}

export function RankingPage({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  const { t } = useTranslation();
  const entries = useRankingStore((state) => state.entries);
  const clearRanking = useRankingStore((state) => state.clearRanking);
  const nickname = useSessionStore((state) => state.nickname);
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <MotionPage>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-lime-200">
              LocalStorage
            </p>
            <h1 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {t('ranking.title')}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">{t('ranking.description')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => onNavigate(nickname ? 'game' : 'home')}>
              <span className="inline-flex items-center gap-2">
                <Play size={18} />
                {t('game.start')}
              </span>
            </Button>
            {entries.length > 0 ? (
              <Button
                type="button"
                variant="danger"
                onClick={clearRanking}
                aria-describedby="clear-ranking-warning"
              >
                {t('ranking.clear')}
              </Button>
            ) : null}
          </div>
        </div>

        {entries.length === 0 ? (
          <EmptyState title={t('ranking.emptyTitle')} description={t('ranking.emptyDescription')} />
        ) : (
          <PremiumPanel>
            <p
              id="clear-ranking-warning"
              className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-rose-100"
            >
              {t('ranking.clearWarning')}
            </p>
            <div className="grid grid-cols-[72px_1fr_repeat(3,80px)] gap-2 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 max-md:hidden">
              <span>#</span>
              <span>{t('ranking.player')}</span>
              <span>{t('ranking.wins')}</span>
              <span>{t('ranking.bestScore')}</span>
              <span>{t('ranking.games')}</span>
            </div>
            <div className="divide-y divide-white/10">
              {entries.map((entry, index) => {
                const positionStyles = getPositionStyles(index);
                const motionProps = getRowMotion(index, prefersReducedMotion);

                return (
                  <motion.article
                    key={entry.id}
                    initial={motionProps.initial}
                    animate={motionProps.animate}
                    transition={motionProps.transition}
                    data-testid={`ranking-row-${index}`}
                    data-position={index + 1}
                    className={`grid gap-3 px-4 py-4 md:grid-cols-[72px_1fr_repeat(3,80px)] md:items-center ${positionStyles.row}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${positionStyles.positionBadge}`}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      {index < TOP_POSITIONS && (
                        <Medal
                          size={18}
                          className={positionStyles.medalColor}
                          aria-hidden="true"
                        />
                      )}
                      <span className="sr-only">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{entry.nickname}</p>
                      <p className="text-sm text-slate-400">
                        {t('ranking.losses')}: {entry.losses} · {t('ranking.draws')}: {entry.draws}
                      </p>
                    </div>
                    <Stat label={t('ranking.wins')} value={entry.wins} />
                    <Stat label={t('ranking.bestScore')} value={entry.bestScore} />
                    <Stat label={t('ranking.games')} value={entry.gamesPlayed} />
                  </motion.article>
                );
              })}
            </div>
          </PremiumPanel>
        )}
      </section>
    </MotionPage>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2 md:bg-transparent md:px-0 md:py-0">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 md:hidden">
        {label}
      </p>
      <p className="font-display text-2xl font-black text-white md:text-lg">{value}</p>
    </div>
  );
}
