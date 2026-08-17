import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../../shared/i18n';
import { useSessionStore } from '../home/sessionStore';
import { RankingPage } from './RankingPage';
import { useRankingStore } from './rankingStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sampleEntries = [
  {
    id: 'first',
    nickname: 'Alice',
    wins: 5,
    losses: 1,
    draws: 0,
    gamesPlayed: 6,
    cardsWon: 150,
    bestScore: 32,
    lastPlayedAt: '2026-07-27T00:00:00.000Z',
  },
  {
    id: 'second',
    nickname: 'Bob',
    wins: 4,
    losses: 2,
    draws: 0,
    gamesPlayed: 6,
    cardsWon: 120,
    bestScore: 28,
    lastPlayedAt: '2026-07-26T00:00:00.000Z',
  },
  {
    id: 'third',
    nickname: 'Charlie',
    wins: 3,
    losses: 3,
    draws: 0,
    gamesPlayed: 6,
    cardsWon: 100,
    bestScore: 25,
    lastPlayedAt: '2026-07-25T00:00:00.000Z',
  },
  {
    id: 'fourth',
    nickname: 'Diana',
    wins: 2,
    losses: 4,
    draws: 0,
    gamesPlayed: 6,
    cardsWon: 80,
    bestScore: 22,
    lastPlayedAt: '2026-07-24T00:00:00.000Z',
  },
];

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

describe('RankingPage top positions hierarchy', () => {
  beforeEach(async () => {
    localStorage.clear();
    useSessionStore.setState({ nickname: '' });
    useRankingStore.setState({ entries: sampleEntries });
    await i18n.changeLanguage('en');
  });

  it('marks top 3 positions with data-position attribute', () => {
    render(<RankingPage onNavigate={vi.fn()} />);

    const row0 = screen.getByTestId('ranking-row-0');
    const row1 = screen.getByTestId('ranking-row-1');
    const row2 = screen.getByTestId('ranking-row-2');

    expect(row0).toHaveAttribute('data-position', '1');
    expect(row1).toHaveAttribute('data-position', '2');
    expect(row2).toHaveAttribute('data-position', '3');
  });

  it('applies distinct styling classes for top 3 positions', () => {
    render(<RankingPage onNavigate={vi.fn()} />);

    const row0 = screen.getByTestId('ranking-row-0');
    const row1 = screen.getByTestId('ranking-row-1');
    const row2 = screen.getByTestId('ranking-row-2');
    const row3 = screen.getByTestId('ranking-row-3');

    expect(row0.className).toContain('bg-lime-300/5');
    expect(row1.className).toContain('bg-cyan-300/5');
    expect(row2.className).toContain('bg-violet-300/5');
    expect(row3.className).not.toContain('bg-lime-300/5');
  });

  it('renders position badges for all entries', () => {
    render(<RankingPage onNavigate={vi.fn()} />);

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
    expect(screen.getByText('#4')).toBeInTheDocument();
  });

  it('shows all entries in correct order', () => {
    render(<RankingPage onNavigate={vi.fn()} />);

    const names = screen.getAllByText(/^(Alice|Bob|Charlie|Diana)$/);
    expect(names[0]).toHaveTextContent('Alice');
    expect(names[1]).toHaveTextContent('Bob');
    expect(names[2]).toHaveTextContent('Charlie');
    expect(names[3]).toHaveTextContent('Diana');
  });
});
