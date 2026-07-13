import type { GameCard, GameResult, HandWinner } from './types';

export function resolveHandWinner(playerCard: GameCard, cpuCard: GameCard): HandWinner {
  if (playerCard.value > cpuCard.value) {
    return 'player';
  }

  if (playerCard.value < cpuCard.value) {
    return 'cpu';
  }

  return 'tie';
}

export function resolveGameWinner(playerCards: number, cpuCards: number): GameResult {
  if (playerCards > cpuCards) {
    return { winner: 'player', playerCards, cpuCards };
  }

  if (playerCards < cpuCards) {
    return { winner: 'cpu', playerCards, cpuCards };
  }

  return { winner: 'tie', playerCards, cpuCards };
}
