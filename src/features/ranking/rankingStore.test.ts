import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameResult } from '../game/domain/types';
import { useRankingStore } from './rankingStore';

function record(nickname: string, result: GameResult) {
  useRankingStore.getState().recordResult(nickname, result);
}

describe('rankingStore contract behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    useRankingStore.setState({ entries: [] });
    vi.useFakeTimers();
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'entry-id') });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('records wins, losses, draws, and games played', () => {
    vi.setSystemTime(new Date('2026-07-28T10:00:00.000Z'));

    record('Ada', { winner: 'player', playerCards: 30, cpuCards: 22 });
    record('Ada', { winner: 'cpu', playerCards: 20, cpuCards: 32 });
    record('Ada', { winner: 'tie', playerCards: 26, cpuCards: 26 });

    expect(useRankingStore.getState().entries).toEqual([
      expect.objectContaining({
        nickname: 'Ada',
        wins: 1,
        losses: 1,
        draws: 1,
        gamesPlayed: 3,
      }),
    ]);
  });

  it('trims nicknames and updates an existing entry instead of duplicating it', () => {
    record(' Ada ', { winner: 'player', playerCards: 28, cpuCards: 24 });
    record('Ada', { winner: 'player', playerCards: 32, cpuCards: 20 });

    expect(useRankingStore.getState().entries).toHaveLength(1);
    expect(useRankingStore.getState().entries[0]).toEqual(
      expect.objectContaining({
        nickname: 'Ada',
        wins: 2,
        gamesPlayed: 2,
      }),
    );
  });

  it('tracks total cardsWon and bestScore', () => {
    record('Ada', { winner: 'player', playerCards: 18, cpuCards: 34 });
    record('Ada', { winner: 'player', playerCards: 40, cpuCards: 12 });
    record('Ada', { winner: 'cpu', playerCards: 30, cpuCards: 22 });

    expect(useRankingStore.getState().entries[0]).toEqual(
      expect.objectContaining({
        cardsWon: 88,
        bestScore: 40,
      }),
    );
  });

  it('sorts by wins, bestScore, gamesPlayed, then latest played', () => {
    vi.setSystemTime(new Date('2026-07-28T10:00:00.000Z'));
    record('Latest tie-breaker', { winner: 'player', playerCards: 30, cpuCards: 22 });
    record('Latest tie-breaker', { winner: 'cpu', playerCards: 10, cpuCards: 42 });

    vi.setSystemTime(new Date('2026-07-28T10:01:00.000Z'));
    record('Most wins', { winner: 'player', playerCards: 20, cpuCards: 32 });
    record('Most wins', { winner: 'player', playerCards: 18, cpuCards: 34 });

    vi.setSystemTime(new Date('2026-07-28T10:02:00.000Z'));
    record('Best score', { winner: 'player', playerCards: 40, cpuCards: 12 });

    vi.setSystemTime(new Date('2026-07-28T10:03:00.000Z'));
    record('More games', { winner: 'player', playerCards: 30, cpuCards: 22 });
    record('More games', { winner: 'cpu', playerCards: 12, cpuCards: 40 });

    vi.setSystemTime(new Date('2026-07-28T10:04:00.000Z'));
    record('Older tie-breaker', { winner: 'player', playerCards: 30, cpuCards: 22 });
    useRankingStore.setState((state) => ({
      entries: state.entries.map((entry) =>
        entry.nickname === 'Older tie-breaker'
          ? { ...entry, lastPlayedAt: '2026-07-28T09:59:00.000Z' }
          : entry,
      ),
    }));

    expect(useRankingStore.getState().entries.map((entry) => entry.nickname)).toEqual([
      'Most wins',
      'Best score',
      'More games',
      'Latest tie-breaker',
      'Older tie-breaker',
    ]);
  });
});
