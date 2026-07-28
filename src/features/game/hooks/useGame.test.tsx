import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import i18n from '../../../shared/i18n';
import { useSettingsStore } from '../../settings/settingsStore';
import type { ApiCard, ApiDeck, DrawCardsResponse } from '../domain/types';
import { createDeck, drawCards } from '../services/deckApi';
import { useGame } from './useGame';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../shared/audio/soundManager', () => ({
  playSound: vi.fn(),
}));

vi.mock('../services/deckApi', () => ({
  createDeck: vi.fn(),
  drawCards: vi.fn(),
}));

const createDeckMock = vi.mocked(createDeck);
const drawCardsMock = vi.mocked(drawCards);

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve: Deferred<T>['resolve'];
  let reject: Deferred<T>['reject'];
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve: resolve!, reject: reject! };
}

function deck(deckId: string, remaining = 52): ApiDeck {
  return { success: true, deck_id: deckId, shuffled: true, remaining };
}

function card(code: string, value: ApiCard['value'], suit: ApiCard['suit']): ApiCard {
  return {
    code,
    image: `https://example.com/${code}.png`,
    images: {
      svg: `https://example.com/${code}.svg`,
      png: `https://example.com/${code}.png`,
    },
    value,
    suit,
  };
}

function drawResponse(deckId: string, remaining = 50): DrawCardsResponse {
  return {
    success: true,
    deck_id: deckId,
    cards: [card('AS', 'ACE', 'SPADES'), card('2H', '2', 'HEARTS')],
    remaining,
  };
}

describe('useGame async operations', () => {
  beforeEach(async () => {
    createDeckMock.mockReset();
    drawCardsMock.mockReset();
    localStorage.clear();
    useSettingsStore.setState({ soundEnabled: false });
    await i18n.changeLanguage('en');
  });

  it('does not let a late start response modify state after resetGame', async () => {
    const startRequest = createDeferred<ApiDeck>();
    createDeckMock.mockReturnValueOnce(startRequest.promise);
    const { result } = renderHook(() => useGame('Ada'));

    act(() => {
      void result.current.startGame();
    });
    expect(result.current.state.status).toBe('loading');

    act(() => {
      result.current.resetGame();
    });

    await act(async () => {
      startRequest.resolve(deck('late-deck'));
      await startRequest.promise;
    });

    expect(result.current.state).toMatchObject({ status: 'idle', deckId: null, remaining: 0 });
  });

  it('aborts the active start request on unmount and ignores its late response', async () => {
    const startRequest = createDeferred<ApiDeck>();
    let startSignal: AbortSignal | undefined;
    createDeckMock.mockImplementationOnce((signal) => {
      startSignal = signal;
      return startRequest.promise;
    });
    const { result, unmount } = renderHook(() => useGame('Ada'));

    act(() => {
      void result.current.startGame();
    });

    unmount();

    expect(startSignal?.aborted).toBe(true);

    await act(async () => {
      startRequest.resolve(deck('late-deck'));
      await startRequest.promise;
    });
  });

  it('does not let a late draw response modify state after resetGame', async () => {
    const drawRequest = createDeferred<DrawCardsResponse>();
    createDeckMock.mockResolvedValueOnce(deck('deck-1'));
    drawCardsMock.mockReturnValueOnce(drawRequest.promise);
    const { result } = renderHook(() => useGame('Ada'));

    await act(async () => {
      await result.current.startGame();
    });

    act(() => {
      void result.current.drawHand();
    });
    expect(result.current.state.status).toBe('loading');

    act(() => {
      result.current.resetGame();
    });

    await act(async () => {
      drawRequest.resolve(drawResponse('deck-1'));
      await drawRequest.promise;
    });

    expect(result.current.state).toMatchObject({ status: 'idle', deckId: null, remaining: 0 });
    expect(result.current.state.currentHand).toBeNull();
    expect(result.current.state.playerPile).toHaveLength(0);
    expect(result.current.state.cpuPile).toHaveLength(0);
  });

  it('aborts the active draw request on unmount and ignores its late response', async () => {
    const drawRequest = createDeferred<DrawCardsResponse>();
    let drawSignal: AbortSignal | undefined;
    createDeckMock.mockResolvedValueOnce(deck('deck-1'));
    drawCardsMock.mockImplementationOnce((_deckId, signal) => {
      drawSignal = signal;
      return drawRequest.promise;
    });
    const { result, unmount } = renderHook(() => useGame('Ada'));

    await act(async () => {
      await result.current.startGame();
    });

    act(() => {
      void result.current.drawHand();
    });

    unmount();

    expect(drawSignal?.aborted).toBe(true);

    await act(async () => {
      drawRequest.resolve(drawResponse('deck-1'));
      await drawRequest.promise;
    });
  });

  it('does not let the first of two consecutive start operations overwrite the second', async () => {
    const firstStart = createDeferred<ApiDeck>();
    const secondStart = createDeferred<ApiDeck>();
    createDeckMock.mockReturnValueOnce(firstStart.promise).mockReturnValueOnce(secondStart.promise);
    const { result } = renderHook(() => useGame('Ada'));

    act(() => {
      void result.current.startGame();
      void result.current.startGame();
    });

    await act(async () => {
      secondStart.resolve(deck('deck-2'));
      await secondStart.promise;
    });

    expect(result.current.state).toMatchObject({ status: 'ready', deckId: 'deck-2' });

    await act(async () => {
      firstStart.resolve(deck('deck-1'));
      await firstStart.promise;
    });

    expect(result.current.state).toMatchObject({ status: 'ready', deckId: 'deck-2' });
  });

  it('preserves the normal start and draw flow', async () => {
    createDeckMock.mockResolvedValueOnce(deck('deck-1'));
    drawCardsMock.mockResolvedValueOnce(drawResponse('deck-1'));
    const { result } = renderHook(() => useGame('Ada'));

    await act(async () => {
      await result.current.startGame();
    });

    expect(result.current.state).toMatchObject({
      status: 'ready',
      deckId: 'deck-1',
      remaining: 52,
    });

    await act(async () => {
      await result.current.drawHand();
    });

    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.remaining).toBe(50);
    expect(result.current.state.currentHand?.winner).toBe('player');
    expect(result.current.state.playerPile).toHaveLength(2);
  });

  it('keeps loading and active errors coherent', async () => {
    const startRequest = createDeferred<ApiDeck>();
    createDeckMock.mockReturnValueOnce(startRequest.promise);
    const { result } = renderHook(() => useGame('Ada'));

    act(() => {
      void result.current.startGame();
    });

    expect(result.current.state.status).toBe('loading');
    expect(result.current.state.error).toBeNull();

    await act(async () => {
      startRequest.reject(new Error('Deck service unavailable'));
      await expect(startRequest.promise).rejects.toThrow('Deck service unavailable');
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });
    expect(result.current.state.error).toBe('We could not connect to the deck. Try again.');
  });
});
