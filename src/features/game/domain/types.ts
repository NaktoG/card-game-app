export type PlayerSide = 'player' | 'cpu';
export type HandWinner = PlayerSide | 'tie';
export type GameStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'finished' | 'error';

export type ApiDeck = {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
};

export type ApiCard = {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';
};

export type DrawCardsResponse = {
  success: boolean;
  deck_id: string;
  cards: ApiCard[];
  remaining: number;
};

export type GameCard = {
  code: string;
  image: string;
  valueLabel: string;
  value: number;
  suit: ApiCard['suit'];
};

export type Hand = {
  playerCard: GameCard;
  cpuCard: GameCard;
  pot: GameCard[];
  winner: HandWinner;
};

export type GameState = {
  status: GameStatus;
  deckId: string | null;
  remaining: number;
  currentHand: Hand | null;
  pot: GameCard[];
  playerPile: GameCard[];
  cpuPile: GameCard[];
  lastWinner: HandWinner | null;
  error: string | null;
};

export type GameResult = {
  winner: HandWinner;
  playerCards: number;
  cpuCards: number;
};
