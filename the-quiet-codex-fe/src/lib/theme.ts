/*
 * BOTANICAL ZEN — Design System Constants
 *
 * Palette: warm cream, sage, terracotta, deep forest, soft blush.
 * Typography: Cormorant Garamond (headings), DM Sans (body).
 */

// ── Typography ─────────────────────────
export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS = "'DM Sans', sans-serif";

// ── Colors ─────────────────────────────
export const CREAM = "#FDF6EC";
export const SAGE = "#87A878";
export const TERRACOTTA = "#C4704B";
export const FOREST = "#2D4A3E";
export const BLUSH = "#E8D5C4";

// ── Semantic aliases ───────────────────
export const colors = {
  bg: CREAM,
  text: FOREST,
  primary: FOREST,
  secondary: SAGE,
  accent: TERRACOTTA,
  surface: "#FFFFFF",
  muted: `${FOREST}60`,
  subtle: `${FOREST}40`,
  border: `${FOREST}15`,
  borderHover: `${FOREST}25`,
  sageBg: `${SAGE}15`,
  sageText: SAGE,
  terraBg: `${TERRACOTTA}15`,
  terraText: TERRACOTTA,
  danger: "#B91C1C",
  dangerBg: "#FEF2F2",
  dangerBorder: "#FECACA",
} as const;

// ── CSS animation keyframes (inject into <style>) ──
export const KEYFRAMES = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(-2deg); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.15; }
    50% { transform: scale(1.08); opacity: 0.25; }
  }
  .float { animation: float 8s ease-in-out infinite; }
  .float-slow { animation: float-slow 10s ease-in-out infinite; }
  .breathe { animation: breathe 6s ease-in-out infinite; }
`;
