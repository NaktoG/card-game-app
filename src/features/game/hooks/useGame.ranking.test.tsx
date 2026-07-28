import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import i18n from '../../../shared/i18n';
import { useRankingStore } from '../../ranking/rankingStore';
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

function deck(deckId: string): ApiDeck {
  return { success: true, deck_id: deckId, shuffled: true, remaining: 2 };
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

function finishingDraw(deckId: string): DrawCardsResponse {
  return {
    success: true,
    deck_id: deckId,
    cards: [card('AS', 'ACE', 'SPADES'), card('2H', '2', 'HEARTS')],
    remaining: 0,
  };
}

describe('useGame and rankingStore integration', () => {
  beforeEach(async () => {
    createDeckMock.mockReset();
    drawCardsMock.mockReset();
    localStorage.clear();
    useRankingStore.setState({ entries: [] });
    useSettingsStore.setState({ soundEnabled: false });
    await i18n.changeLanguage('en');
  });

  it('records the ranking result once when a game finishes', async () => {
    createDeckMock.mockResolvedValueOnce(deck('deck-1'));
    drawCardsMock.mockResolvedValueOnce(finishingDraw('deck-1'));
    const { result } = renderHook(() => useGame('Ada'));

    await act(async () => {
      await result.current.startGame();
    });
    await act(async () => {
      await result.current.drawHand();
    });

    await waitFor(() => {
      expect(useRankingStore.getState().entries).toHaveLength(1);
    });
    expect(useRankingStore.getState().entries[0]).toEqual(
      expect.objectContaining({
        nickname: 'Ada',
        wins: 1,
        losses: 0,
        draws: 0,
        gamesPlayed: 1,
        cardsWon: 2,
        bestScore: 2,
      }),
    );
  });

  it('does not duplicate the ranking record across repeated renders of a stable finished state', async () => {
    createDeckMock.mockResolvedValueOnce(deck('deck-1'));
    drawCardsMock.mockResolvedValueOnce(finishingDraw('deck-1'));
    const { result, rerender } = renderHook(({ nickname }) => useGame(nickname), {
      initialProps: { nickname: 'Ada' },
    });

    await act(async () => {
      await result.current.startGame();
    });
    await act(async () => {
      await result.current.drawHand();
    });

    await waitFor(() => {
      expect(useRankingStore.getState().entries).toHaveLength(1);
    });

    rerender({ nickname: 'Ada' });
    rerender({ nickname: 'Ada' });

    expect(useRankingStore.getState().entries).toHaveLength(1);
    expect(useRankingStore.getState().entries[0]).toEqual(
      expect.objectContaining({ wins: 1, gamesPlayed: 1 }),
    );
  });
});
