import { motion } from 'framer-motion';
import type { GameCard, PlayerSide } from '../domain/types';
import backCard from '../../../assets/imgs/back_card.png';

export function CardView({
  card,
  side,
  isWinner,
}: {
  card: GameCard | null;
  side: PlayerSide;
  isWinner: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ rotateY: 90, opacity: 0, y: 30 }}
      animate={{ rotateY: 0, opacity: 1, y: 0, scale: isWinner ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className={`relative mx-auto aspect-[2.5/3.5] w-40 overflow-hidden rounded-[1.25rem] bg-white p-2 shadow-card sm:w-48 ${
        isWinner ? 'ring-4 ring-lime-300 shadow-glow' : ''
      }`}
      aria-label={card ? `${side} card ${card.valueLabel} ${card.suit}` : `${side} hidden card`}
    >
      <img
        src={card?.image ?? backCard}
        alt=""
        className="h-full w-full rounded-[0.9rem] object-cover"
        draggable="false"
      />
    </motion.div>
  );
}
