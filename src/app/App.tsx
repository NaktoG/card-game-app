import { AnimatePresence } from 'framer-motion';
import { Gamepad2, Home, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GamePage } from '../features/game/GamePage';
import { useSessionStore } from '../features/home/sessionStore';
import { HomePage } from '../features/home/HomePage';
import { RankingPage } from '../features/ranking/RankingPage';
import { useSettingsStore } from '../features/settings/settingsStore';
import { ArenaBackdrop } from '../shared/components/ArenaBackdrop';
import { AppFooter } from '../shared/components/AppFooter';
import { InstallPrompt } from '../shared/components/InstallPrompt';
import { LogoMark } from '../shared/components/LogoMark';
import { APP_CONFIG } from '../shared/config/appConfig';
import { persistLanguage } from '../shared/i18n';

export type AppRoute = 'home' | 'game' | 'ranking';

const routeIcons = {
  home: Home,
  game: Gamepad2,
  ranking: Trophy,
};

export function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [prevRoute, setPrevRoute] = useState<AppRoute | null>(null);
  const { t, i18n } = useTranslation();
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const toggleSound = useSettingsStore((state) => state.toggleSound);

  const navigate = (nextRoute: AppRoute) => {
    if (nextRoute === 'game' && !useSessionStore.getState().nickname) {
      setRoute('home');
      return;
    }

    setPrevRoute(route);
    setRoute(nextRoute);
  };

  const changeLanguage = (language: 'es' | 'en') => {
    persistLanguage(language);
    void i18n.changeLanguage(language);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-950 text-white">
      <ArenaBackdrop />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
          >
            <LogoMark />
            <span>
              <span className="block font-display text-lg font-black tracking-tight">
                {t('app.title')}
              </span>
              <span className="block text-xs text-slate-400">{APP_CONFIG.brandLabel}</span>
            </span>
          </button>

          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2">
            {(['home', 'game', 'ranking'] as const).map((item) => {
              const Icon = routeIcons[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigate(item)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 ${
                    route === item
                      ? 'bg-lime-300 text-slate-950'
                      : 'bg-white/10 text-slate-200 hover:bg-white/15'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {t(`nav.${item}`)}
                </button>
              );
            })}
            <select
              value={i18n.language.startsWith('en') ? 'en' : 'es'}
              onChange={(event) => changeLanguage(event.target.value as 'es' | 'en')}
              aria-label={t('home.language')}
              className="min-h-11 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-lime-300"
            >
              <option className="bg-slate-950" value="es">
                ES
              </option>
              <option className="bg-slate-950" value="en">
                EN
              </option>
            </select>
            <InstallPrompt />
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? t('game.soundOn') : t('game.soundOff')}
              className="grid min-h-11 min-w-11 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {route === 'home' ? (
          <HomePage
            key="home"
            onNavigate={navigate}
          />
        ) : null}
        {route === 'game' ? (
          <GamePage
            key="game"
            onNavigate={navigate}
            direction={prevRoute === 'home' ? 'enter-arena' : 'default'}
          />
        ) : null}
        {route === 'ranking' ? <RankingPage key="ranking" onNavigate={navigate} /> : null}
      </AnimatePresence>
      <AppFooter />
    </div>
  );
}
