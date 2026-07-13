import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function MotionPage({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8"
    >
      {children}
    </motion.main>
  );
}
