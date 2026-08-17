import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AppRoute } from '../../app/App';
import { Button } from '../../shared/components/Button';
import { LoadingState } from '../../shared/components/LoadingState';
import { MotionPage } from '../../shared/components/MotionPage';
import type { TransitionDirection } from '../../shared/components/MotionPage';
import { useSessionStore } from '../home/sessionStore';
import { CardView } from './components/CardView';
import { DeckStack } from './components/DeckStack';
import { EndGameModal } from './components/EndGameModal';
import { PlayerPanel } from './components/PlayerPanel';
import { Scoreboard } from './components/Scoreboard';
import { useGame } from './hooks/useGame';

export function GamePage({
  onNavigate,
  direction,
}: {
  onNavigate: (route: AppRoute) => void;
  direction?: TransitionDirection;
}) {
  const { t } = useTranslation();
  const nickname = useSessionStore((state) => state.nickname);
  const { state, result, startGame, drawHand, resetGame } = useGame(nickname);
  const isLoading = state.status === 'loading';
  const canDraw = Boolean(state.deckId) && state.remaining > 0 && !isLoading;
  const handsLeft = Math.floor(state.remaining / 2);
  const lastOutcome = state.lastWinner
    ? state.lastWinner === 'player'
      ? t('game.playerWonHand')
      : state.lastWinner === 'cpu'
        ? t('game.cpuWonHand')
        : t('game.tieHand')
    : null;
  const statusText = state.deckId
    ? t('game.guidance.statusReady')
    : state.status === 'error'
      ? t('game.guidance.statusError')
      : t('game.guidance.statusIdle');
  const nextActionText = isLoading
    ? t('game.guidance.pending')
    : state.status === 'error'
      ? t('game.guidance.nextError')
      : canDraw
        ? t('game.guidance.nextDraw')
        : t('game.guidance.nextStart');
  const describeCard = (side: 'player' | 'cpu') => {
    const card = side === 'player' ? state.currentHand?.playerCard : state.currentHand?.cpuCard;

    return card
      ? t('game.guidance.cardLabel', {
          side: side === 'player' ? t('game.player') : t('game.cpu'),
          value: card.valueLabel,
          suit: card.suit,
        })
      : t('game.guidance.hiddenCard', {
          side: side === 'player' ? t('game.player') : t('game.cpu'),
        });
  };

  return (
    <MotionPage direction={direction}>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-lime-200">
              {nickname}
            </p>
            <h1 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              {t('app.title')}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => void startGame()} disabled={isLoading}>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={18} />
                {t('game.start')}
              </span>
            </Button>
            <Button type="button" variant="secondary" onClick={resetGame}>
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={18} />
                {t('game.reset')}
              </span>
            </Button>
          </div>
        </div>

        <Scoreboard
          playerCards={state.playerPile.length}
          cpuCards={state.cpuPile.length}
          potCards={state.pot.length}
          remaining={state.remaining}
        />

        <div
          className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 text-sm font-bold text-slate-100"
          aria-live="polite"
        >
          <p>{t('game.guidance.status', { status: statusText })}</p>
          <p className="mt-1 text-slate-300">
            {t('game.guidance.next', { action: nextActionText })}
          </p>
          {lastOutcome ? <p className="mt-1 text-lime-100">{lastOutcome}</p> : null}
        </div>

        {isLoading ? <LoadingState label={t('game.loading')} /> : null}
        {state.status === 'error' ? (
          <p className="rounded-2xl bg-rose-500/15 p-4 font-bold text-rose-100" role="alert">
            {state.error ?? t('game.error')}
          </p>
        ) : null}

        <div className="relative grid gap-5 lg:grid-cols-[1fr_280px_1fr] lg:items-center">
          <div className="pointer-events-none absolute inset-x-12 top-1/2 hidden h-24 -translate-y-1/2 rounded-full bg-lime-300/10 blur-3xl lg:block" />
          <PlayerPanel
            label={t('game.player')}
            score={state.playerPile.length}
            active={state.lastWinner === 'player'}
            statusLabel={state.lastWinner === 'player' ? t('game.guidance.wonLastHand') : undefined}
          >
            <CardView
              card={state.currentHand?.playerCard ?? null}
              side="player"
              isWinner={state.lastWinner === 'player' || state.lastWinner === 'tie'}
              ariaLabel={describeCard('player')}
            />
          </PlayerPanel>

          <div className="order-first flex flex-col items-center gap-4 lg:order-none">
            <DeckStack isLoading={isLoading} />
            <p className="text-center text-sm font-bold text-slate-300">
              {state.deckId ? t('game.handsLeft', { count: handsLeft }) : t('game.ready')}
            </p>
            <Button
              type="button"
              onClick={() => void drawHand()}
              disabled={!canDraw}
              aria-busy={isLoading || undefined}
              className="w-full max-w-xs"
            >
              {isLoading ? t('game.drawing') : t('game.draw')}
            </Button>
          </div>

          <PlayerPanel
            label={t('game.cpu')}
            score={state.cpuPile.length}
            active={state.lastWinner === 'cpu'}
            statusLabel={state.lastWinner === 'cpu' ? t('game.guidance.wonLastHand') : undefined}
          >
            <CardView
              card={state.currentHand?.cpuCard ?? null}
              side="cpu"
              isWinner={state.lastWinner === 'cpu' || state.lastWinner === 'tie'}
              ariaLabel={describeCard('cpu')}
            />
          </PlayerPanel>
        </div>

        <AnimatePresence>
          {state.lastWinner ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="mx-auto max-w-xl rounded-[2rem] border border-lime-300/20 bg-lime-300/10 p-5 text-center shadow-glow"
            >
              <Trophy className="mx-auto text-lime-200" aria-hidden="true" />
              <p className="mt-2 text-lg font-black text-white">
                {state.lastWinner === 'player'
                  ? t('game.playerWonHand')
                  : state.lastWinner === 'cpu'
                    ? t('game.cpuWonHand')
                    : t('game.tieHand')}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <EndGameModal
        open={state.status === 'finished'}
        result={result}
        onPlayAgain={() => void startGame()}
        onRanking={() => onNavigate('ranking')}
      />
    </MotionPage>
  );
}
