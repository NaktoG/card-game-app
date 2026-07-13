import type { ApiCard, GameCard } from './types';

const FACE_CARD_VALUES: Record<string, number> = {
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
};

export function getCardNumericValue(value: string): number {
  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  return FACE_CARD_VALUES[value] ?? 0;
}

export function mapApiCard(card: ApiCard): GameCard {
  return {
    code: card.code,
    image: card.image,
    valueLabel: card.value,
    value: getCardNumericValue(card.value),
    suit: card.suit,
  };
}

export function mapApiCards(cards: ApiCard[]): GameCard[] {
  return cards.map(mapApiCard);
}
