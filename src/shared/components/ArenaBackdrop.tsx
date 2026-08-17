import { motion, useReducedMotion } from 'framer-motion';

const particles = Array.from({ length: 6 }, (_, index) => ({
  id: index,
  left: `${12 + ((index * 29) % 76)}%`,
  top: `${14 + ((index * 31) % 72)}%`,
  delay: index * 0.25,
  size: 3 + (index % 3),
}));

export function ArenaBackdrop() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(163,230,53,0.26),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.18),transparent_32%),linear-gradient(135deg,#050816,#0f172a_52%,#020617)]" />
      <div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime-300/10 bg-[conic-gradient(from_90deg,transparent,rgba(163,230,53,.16),transparent,rgba(56,189,248,.14),transparent)] blur-3xl"
      />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(163,230,53,.14),transparent_62%)]" />
      {!prefersReducedMotion &&
        particles.map((particle) => (
          <motion.span
            key={particle.id}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 0.7, scale: 1.3 }}
            transition={{ duration: 2.5, delay: particle.delay, ease: 'easeOut' }}
            className="absolute rounded-full bg-lime-200 shadow-[0_0_24px_rgba(190,242,100,.75)]"
            style={{
              left: particle.left,
              top: particle.top,
              height: particle.size,
              width: particle.size,
            }}
          />
        ))}
    </div>
  );
}
