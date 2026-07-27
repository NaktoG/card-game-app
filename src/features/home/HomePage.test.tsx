import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import i18n from '../../shared/i18n';
import { HomePage } from './HomePage';
import { useSessionStore } from './sessionStore';
import { useSettingsStore } from '../settings/settingsStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../shared/audio/soundManager', () => ({
  playSound: vi.fn(),
}));

describe('HomePage onboarding', () => {
  beforeEach(async () => {
    localStorage.clear();
    useSessionStore.setState({ nickname: '' });
    useSettingsStore.setState({ soundEnabled: false });
    await i18n.changeLanguage('en');
  });

  it('explains objective, turns, tie pot, and local ranking before the player starts', () => {
    render(<HomePage onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /how to play/i })).toBeInTheDocument();
    expect(screen.getByText(/win more cards than the cpu/i)).toBeInTheDocument();
    expect(screen.getByText(/draw one card for you and one for the cpu/i)).toBeInTheDocument();
    expect(screen.getByText(/ties add cards to the pot/i)).toBeInTheDocument();
    expect(screen.getByText(/ranking stays only on this device/i)).toBeInTheDocument();
  });

  it('keeps the same onboarding meanings available in English and Spanish', async () => {
    const { rerender } = render(<HomePage onNavigate={vi.fn()} />);

    expect(screen.getByText(/win more cards than the cpu/i)).toBeInTheDocument();
    expect(screen.getByText(/draw one card for you and one for the cpu/i)).toBeInTheDocument();
    expect(screen.getByText(/ties add cards to the pot/i)).toBeInTheDocument();
    expect(screen.getByText(/ranking stays only on this device/i)).toBeInTheDocument();

    await act(async () => {
      await i18n.changeLanguage('es');
    });
    rerender(<HomePage onNavigate={vi.fn()} />);

    expect(screen.getByText(/gana más cartas que la cpu/i)).toBeInTheDocument();
    expect(screen.getByText(/roba una carta para ti y una para la cpu/i)).toBeInTheDocument();
    expect(screen.getByText(/los empates suman cartas al pozo/i)).toBeInTheDocument();
    expect(screen.getByText(/el ranking queda solo en este dispositivo/i)).toBeInTheDocument();
  });

  it('starts the game from the same flow after a valid nickname is submitted', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<HomePage onNavigate={onNavigate} />);

    await user.type(screen.getByLabelText(/nickname/i), 'Ada');
    await user.click(screen.getByRole('button', { name: /enter the arena/i }));

    expect(onNavigate).toHaveBeenCalledWith('game');
    expect(useSessionStore.getState().nickname).toBe('Ada');
  });
});
