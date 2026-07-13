import { describe, expect, it } from 'vitest';
import { gameReducer, initialGameState } from './gameReducer';
import type { ApiCard, DrawCardsResponse } from './types';

function apiCard(code: string, value: string): ApiCard {
  return {
    code,
    value,
    image: `https://example.com/${code}.png`,
    images: { svg: '', png: '' },
    suit: 'SPADES',
  };
}

function response(cards: ApiCard[], remaining = 50): DrawCardsResponse {
  return { success: true, deck_id: 'deck', cards, remaining };
}

describe('gameReducer', () => {
  it('awards only the current pot to the hand winner', () => {
    const firstState = gameReducer(initialGameState, {
      type: 'DRAW_SUCCESS',
      response: response([apiCard('AS', 'ACE'), apiCard('KS', 'KING')]),
    });

    const secondState = gameReducer(firstState, {
      type: 'DRAW_SUCCESS',
      response: response([apiCard('2S', '2'), apiCard('3S', '3')]),
    });

    expect(firstState.playerPile).toHaveLength(2);
    expect(secondState.playerPile).toHaveLength(2);
    expect(secondState.cpuPile).toHaveLength(2);
  });

  it('keeps tied cards in the pot until a later hand has a winner', () => {
    const tiedState = gameReducer(initialGameState, {
      type: 'DRAW_SUCCESS',
      response: response([apiCard('9S', '9'), apiCard('9H', '9')]),
    });

    const resolvedState = gameReducer(tiedState, {
      type: 'DRAW_SUCCESS',
      response: response([apiCard('QS', 'QUEEN'), apiCard('2H', '2')]),
    });

    expect(tiedState.pot).toHaveLength(2);
    expect(resolvedState.playerPile).toHaveLength(4);
    expect(resolvedState.pot).toHaveLength(0);
  });
});
