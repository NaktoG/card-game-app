import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { playSound } from '../../../shared/audio/soundManager';
import { useRankingStore } from '../../ranking/rankingStore';
import { useSettingsStore } from '../../settings/settingsStore';
import { gameReducer, initialGameState } from '../domain/gameReducer';
import { resolveGameWinner } from '../domain/gameRules';
import { createDeck, drawCards } from '../services/deckApi';

export function useGame(nickname: string) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const soundEnabled = useSettingsStore((settings) => settings.soundEnabled);
  const recordResult = useRankingStore((ranking) => ranking.recordResult);
  const recordedGameRef = useRef<string | null>(null);

  const startGame = useCallback(async () => {
    const controller = new AbortController();
    dispatch({ type: 'START_LOADING' });
    playSound('start', soundEnabled);

    try {
      const deck = await createDeck(controller.signal);
      dispatch({ type: 'DECK_READY', deckId: deck.deck_id, remaining: deck.remaining });
      recordedGameRef.current = null;
    } catch {
      dispatch({ type: 'ERROR', message: t('game.error') });
    }
  }, [soundEnabled, t]);

  const drawHand = useCallback(async () => {
    if (!state.deckId || state.status === 'loading' || state.remaining === 0) return;

    const controller = new AbortController();
    dispatch({ type: 'START_LOADING' });
    playSound('draw', soundEnabled);

    try {
      const response = await drawCards(state.deckId, controller.signal);
      dispatch({ type: 'DRAW_SUCCESS', response });
    } catch {
      dispatch({ type: 'ERROR', message: t('game.error') });
    }
  }, [soundEnabled, state.deckId, state.remaining, state.status, t]);

  const result = useMemo(
    () => resolveGameWinner(state.playerPile.length, state.cpuPile.length),
    [state.cpuPile.length, state.playerPile.length],
  );

  useEffect(() => {
    if (!state.lastWinner) return;

    if (state.lastWinner === 'player') playSound('win', soundEnabled);
    if (state.lastWinner === 'cpu') playSound('lose', soundEnabled);
    if (state.lastWinner === 'tie') playSound('tie', soundEnabled);
  }, [soundEnabled, state.lastWinner, state.currentHand]);

  useEffect(() => {
    if (state.status !== 'finished' || !nickname) return;
    const resultKey = `${state.deckId}-${state.playerPile.length}-${state.cpuPile.length}`;

    if (recordedGameRef.current === resultKey) return;

    recordedGameRef.current = resultKey;
    recordResult(nickname, result);
    playSound('finish', soundEnabled);
  }, [
    nickname,
    recordResult,
    result,
    soundEnabled,
    state.cpuPile.length,
    state.deckId,
    state.playerPile.length,
    state.status,
  ]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { state, result, startGame, drawHand, resetGame };
}
