import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ── Konami Code Sequence ────────────────────────────────── */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
  shape: "circle" | "square" | "triangle";
}

const COLORS = [
  "#9382DC",
  "#67C5B0",
  "#E685A5",
  "#85B5E6",
  "#F4D35E",
  "#FF6B6B",
  "#6BCB77",
  "#C084FC",
];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    angle: Math.random() * 360,
    speed: 2 + Math.random() * 4,
    rotation: Math.random() * 720 - 360,
    shape: (["circle", "square", "triangle"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

export default function KonamiEasterEgg() {
  const [, setKeys] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = useCallback(() => {
    setActive(true);
    setParticles(createParticles(60));
    setTimeout(() => setActive(false), 4000);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (
          next.length === KONAMI.length &&
          next.every((k, i) => k === KONAMI[i])
        ) {
          setTimeout(() => trigger(), 0);
          return [];
        }
        return next;
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [trigger]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Confetti particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                backgroundColor:
                  p.shape !== "triangle" ? p.color : "transparent",
                borderRadius: p.shape === "circle" ? "50%" : 0,
                borderLeft:
                  p.shape === "triangle"
                    ? `${p.size / 2}px solid transparent`
                    : undefined,
                borderRight:
                  p.shape === "triangle"
                    ? `${p.size / 2}px solid transparent`
                    : undefined,
                borderBottom:
                  p.shape === "triangle"
                    ? `${p.size}px solid ${p.color}`
                    : undefined,
              }}
              initial={{
                y: `${p.y}vh`,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                rotate: p.rotation,
                x: [0, Math.sin(p.angle) * 80, Math.cos(p.angle) * 40, 0],
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                ease: [0.25, 0.1, 0.25, 1],
                delay: Math.random() * 0.5,
              }}
            />
          ))}

          {/* Achievement text */}
          <motion.div
            className="absolute inset-x-0 top-1/3 flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.3, type: "spring", damping: 12 }}
          >
            <span className="text-4xl">🎉</span>
            <p
              className="rounded-xl px-6 py-3 text-lg font-bold"
              style={{
                fontFamily: "var(--font-display)",
                background: "rgba(8, 11, 26, 0.9)",
                border: "1px solid var(--color-glass-border)",
                backdropFilter: "blur(12px)",
                color: "var(--color-text-primary)",
              }}
            >
              Achievement Unlocked!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
