import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../../shared/i18n';
import { initialGameState } from './domain/gameReducer';
import type { GameState } from './domain/types';
import { GamePage } from './GamePage';
import type { useGame } from './hooks/useGame';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useGameMock = vi.hoisted(() => vi.fn<(nickname: string) => ReturnType<typeof useGame>>());

vi.mock('./hooks/useGame', () => ({
  useGame: useGameMock,
}));

function mockGameState(state: Partial<GameState>) {
  useGameMock.mockReturnValue({
    state: { ...initialGameState, ...state },
    result: { winner: 'tie', playerCards: 0, cpuCards: 0 },
    startGame: vi.fn(),
    drawHand: vi.fn(),
    resetGame: vi.fn(),
  });
}

describe('GamePage guidance and async feedback', () => {
  beforeEach(async () => {
    useGameMock.mockReset();
    await i18n.changeLanguage('en');
  });

  it('shows visible status and next action when a hand can be drawn', () => {
    mockGameState({ status: 'ready', deckId: 'deck-1', remaining: 20 });

    render(<GamePage onNavigate={vi.fn()} />);

    expect(screen.getByText(/status: deck ready/i)).toBeInTheDocument();
    expect(screen.getByText(/next: draw cards to play the next hand/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /draw cards/i })).toBeEnabled();
  });

  it('announces pending work and disables duplicate actions while loading', () => {
    mockGameState({ status: 'loading', deckId: 'deck-1', remaining: 20 });

    render(<GamePage onNavigate={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent(/shuffling the deck/i);
    expect(screen.getByText(/action in progress/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new game/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /dealing/i })).toHaveAttribute('aria-busy', 'true');
  });

  it('shows a useful error state and recovery guidance instead of a blank screen', () => {
    mockGameState({ status: 'error', error: 'Deck service unavailable' });

    render(<GamePage onNavigate={vi.fn()} />);

    expect(screen.getByRole('alert')).toHaveTextContent(/deck service unavailable/i);
    expect(screen.getByText(/next: start a new game to try again/i)).toBeInTheDocument();
  });
});
