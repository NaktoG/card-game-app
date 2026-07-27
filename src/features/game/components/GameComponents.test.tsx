import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../../shared/i18n';
import type { GameCard } from '../domain/types';
import { CardView } from './CardView';
import { EndGameModal } from './EndGameModal';
import { PlayerPanel } from './PlayerPanel';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const aceOfSpades: GameCard = {
  code: 'AS',
  image: '/ace.svg',
  valueLabel: 'ACE',
  value: 14,
  suit: 'SPADES',
};

if (!window.PointerEvent) {
  window.PointerEvent = MouseEvent as typeof PointerEvent;
}

describe('game component accessibility', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('uses meaningful card labels for visible and hidden cards', () => {
    render(
      <div>
        <CardView
          card={aceOfSpades}
          side="player"
          isWinner
          ariaLabel="Player card: Ace of spades"
        />
        <CardView card={null} side="cpu" isWinner={false} ariaLabel="CPU card: hidden" />
      </div>,
    );

    expect(screen.getByLabelText(/player card: ace of spades/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpu card: hidden/i)).toBeInTheDocument();
  });

  it('labels player sections with active and winner text that is not color-only', () => {
    render(
      <PlayerPanel
        label="Player"
        score={24}
        active
        statusLabel="Active turn"
        winnerLabel="Won last hand"
      >
        <span>Card slot</span>
      </PlayerPanel>,
    );

    expect(screen.getByRole('region', { name: /player/i })).toBeInTheDocument();
    expect(screen.getByText(/active turn/i)).toBeInTheDocument();
    expect(screen.getByText(/won last hand/i)).toBeInTheDocument();
  });

  it('moves focus into the end-game dialog and returns focus after keyboard restart', async () => {
    const user = userEvent.setup();
    const onPlayAgain = vi.fn();
    const opener = document.createElement('button');
    opener.textContent = 'Open game result';
    document.body.append(opener);
    opener.focus();

    render(
      <EndGameModal
        open
        result={{ winner: 'player', playerCards: 30, cpuCards: 22 }}
        onPlayAgain={onPlayAgain}
        onRanking={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: /epic victory/i })).toHaveFocus();

    await user.tab();
    await user.keyboard('{Enter}');

    expect(onPlayAgain).toHaveBeenCalledTimes(1);
    expect(opener).toHaveFocus();
    opener.remove();
  });

  it('keeps keyboard focus contained inside the end-game dialog while open', async () => {
    const user = userEvent.setup();
    const backgroundAction = vi.fn();

    render(
      <div>
        <button type="button" onClick={backgroundAction}>
          Background action
        </button>
        <EndGameModal
          open
          result={{ winner: 'player', playerCards: 30, cpuCards: 22 }}
          onPlayAgain={vi.fn()}
          onRanking={vi.fn()}
        />
      </div>,
    );

    const dialog = screen.getByRole('dialog', { name: /epic victory/i });
    const playAgain = screen.getByRole('button', { name: /play again/i });
    const ranking = screen.getByRole('button', { name: /view ranking/i });

    expect(dialog).toHaveFocus();

    await user.tab();
    expect(playAgain).toHaveFocus();

    await user.tab();
    expect(ranking).toHaveFocus();

    await user.tab();
    expect(playAgain).toHaveFocus();

    await user.tab({ shift: true });
    expect(ranking).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(backgroundAction).not.toHaveBeenCalled();
  });
});
