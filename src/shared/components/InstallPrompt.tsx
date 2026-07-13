import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export function InstallPrompt() {
  const { t } = useTranslation();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!installEvent) return null;

  return (
    <button
      type="button"
      onClick={() => {
        void installEvent.prompt();
        setInstallEvent(null);
      }}
      className="hidden min-h-11 items-center gap-2 rounded-2xl bg-sky-300 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_0_36px_rgba(125,211,252,.28)] transition hover:bg-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 lg:inline-flex"
    >
      <Download size={18} aria-hidden="true" />
      {t('app.install')}
    </button>
  );
}
