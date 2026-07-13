import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameResult } from '../game/domain/types';

export type RankingEntry = {
  id: string;
  nickname: string;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  cardsWon: number;
  bestScore: number;
  lastPlayedAt: string;
};

type RankingState = {
  entries: RankingEntry[];
  recordResult: (nickname: string, result: GameResult) => void;
  clearRanking: () => void;
};

function sortRanking(entries: RankingEntry[]): RankingEntry[] {
  return [...entries].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
    return new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime();
  });
}

export const useRankingStore = create<RankingState>()(
  persist(
    (set) => ({
      entries: [],
      recordResult: (nickname, result) =>
        set((state) => {
          const normalizedNickname = nickname.trim();
          const now = new Date().toISOString();
          const existing = state.entries.find((entry) => entry.nickname === normalizedNickname);
          const playerWon = result.winner === 'player';
          const playerLost = result.winner === 'cpu';
          const playerDraw = result.winner === 'tie';

          const updatedEntry: RankingEntry = {
            id: existing?.id ?? crypto.randomUUID(),
            nickname: normalizedNickname,
            wins: (existing?.wins ?? 0) + (playerWon ? 1 : 0),
            losses: (existing?.losses ?? 0) + (playerLost ? 1 : 0),
            draws: (existing?.draws ?? 0) + (playerDraw ? 1 : 0),
            gamesPlayed: (existing?.gamesPlayed ?? 0) + 1,
            cardsWon: (existing?.cardsWon ?? 0) + result.playerCards,
            bestScore: Math.max(existing?.bestScore ?? 0, result.playerCards),
            lastPlayedAt: now,
          };

          return {
            entries: sortRanking([
              ...state.entries.filter((entry) => entry.nickname !== normalizedNickname),
              updatedEntry,
            ]),
          };
        }),
      clearRanking: () => set({ entries: [] }),
    }),
    { name: 'card-game-ranking' },
  ),
);
