import { motion } from 'framer-motion';
import type { GameCard, PlayerSide } from '../domain/types';
import backCard from '../../../assets/imgs/back_card.png';

export function CardView({
  card,
  side,
  isWinner,
  ariaLabel,
}: {
  card: GameCard | null;
  side: PlayerSide;
  isWinner: boolean;
  ariaLabel: string;
}) {
  return (
    <motion.div
      layout
      initial={{ rotateY: 90, opacity: 0, y: 30 }}
      animate={{ rotateY: 0, opacity: 1, y: 0, scale: isWinner ? 1.04 : 1 }}
      whileHover={{ rotateX: 4, rotateY: side === 'player' ? -5 : 5, y: -6 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className={`relative mx-auto aspect-[2.5/3.5] w-40 overflow-hidden rounded-[1.25rem] bg-white p-2 shadow-card sm:w-48 [transform-style:preserve-3d] ${
        isWinner ? 'ring-4 ring-lime-300 shadow-glow' : ''
      }`}
      aria-label={ariaLabel}
    >
      <img
        src={card?.image ?? backCard}
        alt=""
        className="h-full w-full rounded-[0.9rem] object-cover"
        draggable="false"
      />
      <span className="pointer-events-none absolute inset-2 rounded-[0.9rem] bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60" />
      {card ? (
        <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-lime-200 backdrop-blur">
          {card.valueLabel}
        </span>
      ) : null}
    </motion.div>
  );
}
