import { motion, useIsPresent, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export type TransitionDirection = 'enter-arena' | 'default';

interface MotionPageProps {
  children: ReactNode;
  direction?: TransitionDirection;
}

const ease = [0.22, 1, 0.36, 1] as const;

function getMotionValues(direction: TransitionDirection, reduced: boolean) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2, ease },
    };
  }

  switch (direction) {
    case 'enter-arena':
      return {
        initial: { opacity: 1, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.4, ease },
      };
    case 'default':
    default:
      return {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -18 },
        transition: { duration: 0.45, ease },
      };
  }
}

export function MotionPage({ children, direction = 'default' }: MotionPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const isPresent = useIsPresent();
  const { initial, animate, exit, transition } = getMotionValues(
    direction,
    prefersReducedMotion ?? false,
  );

  // When exiting AnimatePresence, pull the page out of normal flow
  // so the entering page can occupy its real position immediately.
  const exitingStyle = !isPresent
    ? ({ position: 'absolute', inset: 0, width: '100%', zIndex: 10 } as const)
    : undefined;

  return (
    <motion.main
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      style={exitingStyle}
      className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8"
    >
      {children}
    </motion.main>
  );
}
