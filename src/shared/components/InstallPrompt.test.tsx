import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import i18n from '../i18n';
import { InstallPrompt } from './InstallPrompt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type InstallOutcome = 'accepted' | 'dismissed';

function createInstallEvent(outcome: InstallOutcome) {
  const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
    prompt: ReturnType<typeof vi.fn>;
    userChoice: Promise<{ outcome: InstallOutcome }>;
  };
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome });
  return event;
}

describe('InstallPrompt', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('shows a compact install action when browser install is available', () => {
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(createInstallEvent('accepted'));
    });

    expect(screen.getByRole('button', { name: /install app/i })).toBeInTheDocument();
    expect(screen.getByText(/save it to your device/i)).toBeInTheDocument();
  });

  it('announces when the install prompt is accepted without blocking play', async () => {
    const user = userEvent.setup();
    const installEvent = createInstallEvent('accepted');
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(installEvent);
    });
    await user.click(screen.getByRole('button', { name: /install app/i }));

    expect(installEvent.prompt).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/install started/i)).toBeInTheDocument();
  });

  it('announces when the install prompt is dismissed and keeps the app usable', async () => {
    const user = userEvent.setup();
    const installEvent = createInstallEvent('dismissed');
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(installEvent);
    });
    await user.click(screen.getByRole('button', { name: /install app/i }));

    expect(await screen.findByText(/you can keep playing/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /install app/i })).not.toBeInTheDocument();
  });

  it('shows accurate unavailable feedback when install support is not available', () => {
    render(<InstallPrompt />);

    expect(screen.getByText(/install is unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/browser or device may already have the app/i)).toBeInTheDocument();
  });
});
