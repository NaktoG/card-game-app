import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type InstallState = 'unavailable' | 'available' | 'accepted' | 'dismissed';

export function InstallPrompt() {
  const { t } = useTranslation();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<InstallState>('unavailable');

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setInstallState('available');
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    setInstallState(choice?.outcome === 'accepted' ? 'accepted' : 'dismissed');
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex min-h-11 max-w-64 items-center gap-2 rounded-2xl border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-xs text-sky-50"
    >
      {installState === 'available' ? (
        <button
          type="button"
          onClick={() => void handleInstall()}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-300 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_0_28px_rgba(125,211,252,.24)] transition hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
        >
          <Download size={16} aria-hidden="true" />
          {t('app.install.action')}
        </button>
      ) : (
        <Download size={16} aria-hidden="true" className="shrink-0 text-sky-200" />
      )}
      <span className="leading-snug">
        <span className="block font-bold">{t(`app.install.${installState}.title`)}</span>
        <span className="block text-sky-100/80">{t(`app.install.${installState}.description`)}</span>
      </span>
    </div>
  );
}
