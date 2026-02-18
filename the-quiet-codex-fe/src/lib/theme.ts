/*
 * ETHEREAL GLASS / AURORA — Design System Constants
 *
 * Palette: deep navy, aurora gradients, frosted glass, luminous accents.
 * Typography: Bricolage Grotesque (headings), Manrope (body).
 */

// ── Typography ─────────────────────────
export const DISPLAY = "'Bricolage Grotesque', 'DM Sans', sans-serif";
export const SANS = "'Manrope', 'DM Sans', sans-serif";

// ── Core palette ───────────────────────
export const DEEP = "#080B1A";
export const AURORA_1 = "#7B61FF";
export const AURORA_2 = "#00D4AA";
export const AURORA_3 = "#FF6BCA";
export const AURORA_4 = "#00B4FF";

// ── Glass tokens ───────────────────────
export const GLASS = "rgba(255,255,255,0.04)";
export const GLASS_BORDER = "rgba(255,255,255,0.08)";
export const GLASS_HOVER = "rgba(255,255,255,0.07)";
export const GLASS_HOVER_BORDER = "rgba(255,255,255,0.15)";

// ── Text ───────────────────────────────
export const TEXT_PRIMARY = "#F0F0FF";
export const TEXT_MUTED = "rgba(240,240,255,0.5)";
export const TEXT_DIM = "rgba(240,240,255,0.35)";

// ── Semantic aliases ───────────────────
export const colors = {
  bg: DEEP,
  text: TEXT_PRIMARY,
  primary: AURORA_1,
  secondary: AURORA_2,
  accent: AURORA_3,
  surface: GLASS,
  muted: TEXT_MUTED,
  subtle: TEXT_DIM,
  border: GLASS_BORDER,
  borderHover: GLASS_HOVER_BORDER,
  sageBg: `${AURORA_2}15`,
  sageText: AURORA_2,
  terraBg: `${AURORA_3}15`,
  terraText: AURORA_3,
  danger: "#FF4D6A",
  dangerBg: "rgba(255,77,106,0.08)",
  dangerBorder: "rgba(255,77,106,0.2)",
} as const;

// ── Gradients ──────────────────────────
export const GRADIENT_PRIMARY = `linear-gradient(135deg, ${AURORA_1}, ${AURORA_2})`;
export const GRADIENT_ACCENT = `linear-gradient(135deg, ${AURORA_3}, ${AURORA_1})`;
