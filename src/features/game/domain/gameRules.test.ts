import { describe, expect, it } from 'vitest';
import { resolveGameWinner, resolveHandWinner } from './gameRules';
import type { GameCard } from './types';

function card(value: number): GameCard {
  return { code: `${value}S`, image: '', valueLabel: String(value), value, suit: 'SPADES' };
}

describe('gameRules', () => {
  it('resolves the highest card as hand winner', () => {
    expect(resolveHandWinner(card(14), card(13))).toBe('player');
    expect(resolveHandWinner(card(2), card(10))).toBe('cpu');
    expect(resolveHandWinner(card(9), card(9))).toBe('tie');
  });

  it('resolves final game winner by collected cards', () => {
    expect(resolveGameWinner(28, 24).winner).toBe('player');
    expect(resolveGameWinner(20, 32).winner).toBe('cpu');
    expect(resolveGameWinner(26, 26).winner).toBe('tie');
  });
});
