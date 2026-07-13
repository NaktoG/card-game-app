import { mapApiCards } from './cardMapper';
import { resolveHandWinner } from './gameRules';
import type { DrawCardsResponse, GameCard, GameState } from './types';

export const initialGameState: GameState = {
  status: 'idle',
  deckId: null,
  remaining: 0,
  currentHand: null,
  pot: [],
  playerPile: [],
  cpuPile: [],
  lastWinner: null,
  error: null,
};

export type GameAction =
  | { type: 'START_LOADING' }
  | { type: 'DECK_READY'; deckId: string; remaining: number }
  | { type: 'DRAW_SUCCESS'; response: DrawCardsResponse }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET' }
  | { type: 'ERROR'; message: string };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, status: 'loading', error: null };

    case 'DECK_READY':
      return {
        ...initialGameState,
        status: 'ready',
        deckId: action.deckId,
        remaining: action.remaining,
      };

    case 'DRAW_SUCCESS': {
      const [playerCard, cpuCard] = mapApiCards(action.response.cards);

      if (!playerCard || !cpuCard) {
        return { ...state, status: 'error', error: 'invalidDraw' };
      }

      const pot = [...state.pot, playerCard, cpuCard];
      const winner = resolveHandWinner(playerCard, cpuCard);
      const awardedCards = winner === 'tie' ? [] : pot;
      const nextPlayerPile =
        winner === 'player' ? [...state.playerPile, ...awardedCards] : state.playerPile;
      const nextCpuPile = winner === 'cpu' ? [...state.cpuPile, ...awardedCards] : state.cpuPile;
      const nextPot: GameCard[] = winner === 'tie' ? pot : [];
      const nextStatus = action.response.remaining === 0 ? 'finished' : 'playing';

      return {
        ...state,
        status: nextStatus,
        remaining: action.response.remaining,
        currentHand: { playerCard, cpuCard, pot, winner },
        pot: nextPot,
        playerPile: nextPlayerPile,
        cpuPile: nextCpuPile,
        lastWinner: winner,
        error: null,
      };
    }

    case 'FINISH_GAME':
      return { ...state, status: 'finished' };

    case 'RESET':
      return initialGameState;

    case 'ERROR':
      return { ...state, status: 'error', error: action.message };

    default:
      return state;
  }
}
