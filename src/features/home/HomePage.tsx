import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppRoute } from '../../app/App';
import { Button } from '../../shared/components/Button';
import { MotionPage } from '../../shared/components/MotionPage';
import type { TransitionDirection } from '../../shared/components/MotionPage';
import { PremiumPanel } from '../../shared/components/PremiumPanel';
import { playSound } from '../../shared/audio/soundManager';
import { useSettingsStore } from '../settings/settingsStore';
import { useSessionStore } from './sessionStore';

const onboardingCards = ['objective', 'turn', 'tie', 'ranking'] as const;

export function HomePage({
  onNavigate,
  direction,
}: {
  onNavigate: (route: AppRoute) => void;
  direction?: TransitionDirection;
}) {
  const { t } = useTranslation();
  const storedNickname = useSessionStore((state) => state.nickname);
  const setNickname = useSessionStore((state) => state.setNickname);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const [nicknameInput, setNicknameInput] = useState(storedNickname);
  const [touched, setTouched] = useState(false);
  const nicknameIsValid = nicknameInput.trim().length >= 2 && nicknameInput.trim().length <= 18;
  const prefersReducedMotion = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  const eyebrow = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

  const headline = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

  const description = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

  const panel = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (!nicknameIsValid) return;

    setNickname(nicknameInput);
    playSound('start', soundEnabled);
    onNavigate('game');
  };

  return (
    <MotionPage direction={direction}>
      <section className="grid min-h-[calc(100dvh-8rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {/* 1. Eyebrow — first to appear */}
          <motion.div
            initial={eyebrow.initial}
            animate={eyebrow.animate}
            transition={{ duration: 0.5, delay: 0, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-sm font-black uppercase tracking-[0.28em] text-lime-200"
          >
            <Sparkles size={16} aria-hidden="true" />
            {t('home.eyebrow')}
          </motion.div>

          {/* 2. Headline — resolves after eyebrow */}
          <motion.h1
            initial={headline.initial}
            animate={headline.animate}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="font-display text-5xl font-black leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
          >
            {t('home.headline')}
          </motion.h1>

          {/* 3. Description — resolves after headline */}
          <motion.p
            initial={description.initial}
            animate={description.animate}
            transition={{ duration: 0.5, delay: 0.24, ease }}
            className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            {t('home.description')}
          </motion.p>

          {/* 4. PremiumPanel — becomes actionable */}
          <motion.div
            initial={panel.initial}
            animate={panel.animate}
            transition={{ duration: 0.5, delay: 0.36, ease }}
          >
            <PremiumPanel className="mt-8 max-w-xl p-4 sm:p-5">
              <form onSubmit={submit}>
                <label
                  htmlFor="nickname"
                  className="block text-sm font-black uppercase tracking-[0.24em] text-slate-300"
                >
                  {t('home.nicknameLabel')}
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="nickname"
                    value={nicknameInput}
                    onChange={(event) => setNicknameInput(event.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder={t('home.nicknamePlaceholder')}
                    aria-invalid={touched && !nicknameIsValid}
                    aria-describedby="nickname-error"
                    className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-base font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300 focus:ring-2 focus:ring-lime-300/40"
                  />
                  <Button type="submit" className="sm:min-w-48">
                    <span className="inline-flex items-center justify-center gap-2">
                      {storedNickname
                        ? t('home.continueAs', { nickname: storedNickname })
                        : t('home.start')}
                      <ArrowRight size={18} aria-hidden="true" />
                    </span>
                  </Button>
                </div>
                <p
                  id="nickname-error"
                  className="mt-3 min-h-5 text-sm font-semibold text-rose-200"
                  aria-live="polite"
                >
                  {touched && !nicknameIsValid ? t('home.nicknameError') : ''}
                </p>
              </form>
            </PremiumPanel>
          </motion.div>

          <section className="mt-6 max-w-2xl" aria-labelledby="home-onboarding-title">
            <h2
              id="home-onboarding-title"
              className="font-display text-2xl font-black tracking-[-0.04em] text-white"
            >
              {t('home.onboarding.title')}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {onboardingCards.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl"
                >
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-lime-200">
                    {t(`home.onboarding.${item}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {t(`home.onboarding.${item}`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {(['motion', 'pwa', 'ranking'] as const).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 font-black uppercase tracking-[0.18em] text-slate-200 backdrop-blur-xl"
              >
                {t(`home.highlights.${item}`)}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Card composition — settles last */}
        <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-md [perspective:1200px] lg:block">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0.6 } : { opacity: 0, scale: 0.96 }}
            animate={prefersReducedMotion ? { opacity: 0.6 } : { opacity: 0.7, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-8 rounded-full bg-lime-300/20 blur-3xl"
            aria-hidden="true"
          />
          {[0, 1, 2, 3].map((card) => (
            <motion.div
              key={card}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.48 + card * 0.08,
                ease,
              }}
              className="absolute left-1/2 top-1/2 h-72 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[1.7rem] border border-white/15 bg-gradient-to-br from-white/25 to-white/5 p-3 shadow-card backdrop-blur-xl"
              style={{
                transformOrigin: '50% 120%',
                rotate: -16 + card * 10,
              }}
            >
              <div className="relative grid h-full place-items-center overflow-hidden rounded-[1.2rem] border border-lime-300/20 bg-slate-950/80 text-5xl font-black text-lime-300">
                <span className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/20 to-transparent" />
                {card % 2 === 0 ? 'A' : 'K'}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </MotionPage>
  );
}
