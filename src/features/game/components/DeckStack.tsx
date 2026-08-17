import { motion, useReducedMotion } from 'framer-motion';
import backCard from '../../../assets/imgs/back_card.png';

export function DeckStack({ isLoading }: { isLoading: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative h-40 w-32 sm:h-48 sm:w-36" aria-hidden="true">
      {[0, 1, 2, 3].map((card) => (
        <motion.img
          key={card}
          src={backCard}
          alt=""
          animate={{
            rotate: isLoading && !prefersReducedMotion
              ? [card * 4, card * 4 + 8, card * 4]
              : card * 4,
            y: isLoading && !prefersReducedMotion
              ? [card * 3, card * 3 - 8, card * 3]
              : card * 3,
          }}
          transition={{
            duration: 0.8,
            repeat: isLoading && !prefersReducedMotion ? Infinity : 0,
            delay: card * 0.08,
          }}
          className="absolute inset-0 h-full w-full rounded-2xl object-cover shadow-card"
        />
      ))}
    </div>
  );
}
