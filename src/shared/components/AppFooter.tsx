import { Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '../config/appConfig';
import { LogoMark } from './LogoMark';

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-slate-950/70 px-4 py-6 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark size="sm" />
          <div>
            <p className="font-display text-sm font-black text-white">{APP_CONFIG.name}</p>
            <p className="text-xs text-slate-400">{t('footer.tagline')}</p>
          </div>
        </div>

        <a
          href={APP_CONFIG.repositoryUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
          aria-label={t('footer.repositoryAria')}
        >
          <Github size={18} aria-hidden="true" />
          <span className="truncate">{APP_CONFIG.repositoryLabel}</span>
        </a>
      </div>
    </footer>
  );
}
