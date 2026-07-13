import { describe, expect, it } from 'vitest';
import { getCardNumericValue, mapApiCard } from './cardMapper';
import type { ApiCard } from './types';

describe('cardMapper', () => {
  it('maps face card values to numeric strength', () => {
    expect(getCardNumericValue('JACK')).toBe(11);
    expect(getCardNumericValue('QUEEN')).toBe(12);
    expect(getCardNumericValue('KING')).toBe(13);
    expect(getCardNumericValue('ACE')).toBe(14);
  });

  it('preserves api card data without mutating the original value', () => {
    const apiCard: ApiCard = {
      code: 'AS',
      image: 'https://example.com/as.png',
      images: { svg: 'https://example.com/as.svg', png: 'https://example.com/as.png' },
      value: 'ACE',
      suit: 'SPADES',
    };

    expect(mapApiCard(apiCard)).toEqual({
      code: 'AS',
      image: 'https://example.com/as.png',
      valueLabel: 'ACE',
      value: 14,
      suit: 'SPADES',
    });
    expect(apiCard.value).toBe('ACE');
  });
});
