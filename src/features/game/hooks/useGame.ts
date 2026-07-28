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
  const activeControllerRef = useRef<AbortController | null>(null);
  const operationIdRef = useRef(0);

  const abortActiveOperation = useCallback(() => {
    activeControllerRef.current?.abort();
    activeControllerRef.current = null;
    operationIdRef.current += 1;
  }, []);

  const beginOperation = useCallback(() => {
    abortActiveOperation();

    const controller = new AbortController();
    const operationId = operationIdRef.current;
    activeControllerRef.current = controller;

    return { controller, operationId };
  }, [abortActiveOperation]);

  const isActiveOperation = useCallback((operationId: number) => {
    return operationIdRef.current === operationId;
  }, []);

  const isAbortError = useCallback((error: unknown) => {
    return error instanceof DOMException && error.name === 'AbortError';
  }, []);

  const startGame = useCallback(async () => {
    const { controller, operationId } = beginOperation();
    dispatch({ type: 'START_LOADING' });
    playSound('start', soundEnabled);

    try {
      const deck = await createDeck(controller.signal);
      if (!isActiveOperation(operationId)) return;

      dispatch({ type: 'DECK_READY', deckId: deck.deck_id, remaining: deck.remaining });
      recordedGameRef.current = null;
    } catch (error) {
      if (controller.signal.aborted || !isActiveOperation(operationId) || isAbortError(error))
        return;

      dispatch({ type: 'ERROR', message: t('game.error') });
    }
  }, [beginOperation, isAbortError, isActiveOperation, soundEnabled, t]);

  const drawHand = useCallback(async () => {
    if (!state.deckId || state.status === 'loading' || state.remaining === 0) return;

    const { controller, operationId } = beginOperation();
    dispatch({ type: 'START_LOADING' });
    playSound('draw', soundEnabled);

    try {
      const response = await drawCards(state.deckId, controller.signal);
      if (!isActiveOperation(operationId)) return;

      dispatch({ type: 'DRAW_SUCCESS', response });
    } catch (error) {
      if (controller.signal.aborted || !isActiveOperation(operationId) || isAbortError(error))
        return;

      dispatch({ type: 'ERROR', message: t('game.error') });
    }
  }, [
    beginOperation,
    isAbortError,
    isActiveOperation,
    soundEnabled,
    state.deckId,
    state.remaining,
    state.status,
    t,
  ]);

  useEffect(() => {
    return () => {
      abortActiveOperation();
    };
  }, [abortActiveOperation]);

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
    abortActiveOperation();
    dispatch({ type: 'RESET' });
  }, [abortActiveOperation]);

  return { state, result, startGame, drawHand, resetGame };
}
