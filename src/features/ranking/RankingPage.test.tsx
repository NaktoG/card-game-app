import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../../shared/i18n';
import { useSessionStore } from '../home/sessionStore';
import { RankingPage } from './RankingPage';
import { useRankingStore } from './rankingStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('RankingPage local-only copy', () => {
  beforeEach(async () => {
    localStorage.clear();
    useSessionStore.setState({ nickname: '' });
    useRankingStore.setState({ entries: [] });
    await i18n.changeLanguage('en');
  });

  it('explains that ranking is local to this browser and not an online leaderboard', () => {
    render(<RankingPage onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /local ranking/i })).toBeInTheDocument();
    expect(screen.getByText(/saved only in this browser/i)).toBeInTheDocument();
    expect(screen.getByText(/not an online leaderboard/i)).toBeInTheDocument();
  });

  it('warns that clearing ranking removes local results from this device only', () => {
    useRankingStore.setState({
      entries: [
        {
          id: 'ada',
          nickname: 'Ada',
          wins: 2,
          losses: 1,
          draws: 0,
          gamesPlayed: 3,
          cardsWon: 58,
          bestScore: 30,
          lastPlayedAt: '2026-07-27T00:00:00.000Z',
        },
      ],
    });

    render(<RankingPage onNavigate={vi.fn()} />);

    expect(screen.getByRole('button', { name: /clear local ranking/i })).toBeInTheDocument();
    expect(screen.getByText(/this removes saved results from this device only/i)).toBeInTheDocument();
  });
});
