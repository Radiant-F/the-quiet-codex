import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiEdit3,
  FiImage,
  FiSearch,
  FiLayers,
  FiUser,
  FiGlobe,
  FiArrowRight,
  FiBookOpen,
  FiStar,
} from "react-icons/fi";
import {
  DEEP,
  AURORA_1,
  AURORA_2,
  AURORA_3,
  AURORA_4,
  GLASS,
  GLASS_BORDER,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  DISPLAY,
  SANS,
  GRADIENT_PRIMARY,
} from "../../lib/theme";

/* ── helpers ── */
function MeshOrb({
  colors,
  size,
  className,
  blur = 80,
}: {
  colors: string[];
  size: number;
  className?: string;
  blur?: number;
}) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `conic-gradient(from 0deg, ${colors.join(", ")})`,
        filter: `blur(${blur}px)`,
        opacity: 0.4,
      }}
    />
  );
}

function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 backdrop-blur-xl ${hover ? "transition-transform,background,border-color duration-300" : ""} ${className}`}
      style={{
        background: GLASS,
        border: `1px solid ${GLASS_BORDER}`,
        boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
      }}
      onMouseEnter={
        hover
          ? (e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }
          : undefined
      }
      onMouseLeave={
        hover
          ? (e) => {
              e.currentTarget.style.background = GLASS;
              e.currentTarget.style.borderColor = GLASS_BORDER;
              e.currentTarget.style.transform = "translateY(0)";
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

const features = [
  {
    icon: <FiEdit3 size={22} />,
    title: "Rich Text Editor",
    desc: "Format with intent. Headings, bold, italic, links, images, blockquotes — all in a seamless writing flow.",
    gradient: `linear-gradient(135deg, ${AURORA_1}, ${AURORA_3})`,
  },
  {
    icon: <FiImage size={22} />,
    title: "Banner Images",
    desc: "Set the visual tone for every article. Upload in JPEG, PNG, WebP, or AVIF. Cloud-hosted automatically.",
    gradient: `linear-gradient(135deg, ${AURORA_2}, ${AURORA_4})`,
  },
  {
    icon: <FiSearch size={22} />,
    title: "SEO Ready",
    desc: "Custom slugs, meta descriptions, Open Graph tags. Your writing discovered by those who need it.",
    gradient: `linear-gradient(135deg, ${AURORA_3}, ${AURORA_1})`,
  },
  {
    icon: <FiLayers size={22} />,
    title: "Draft System",
    desc: "Write in private. Save progress. Refine ideas. Publish only when you know it\u2019s ready.",
    gradient: `linear-gradient(135deg, ${AURORA_4}, ${AURORA_2})`,
  },
  {
    icon: <FiUser size={22} />,
    title: "Author Profiles",
    desc: "Custom avatars, personal profiles. Build your identity as a writer in this community.",
    gradient: `linear-gradient(135deg, ${AURORA_1}, ${AURORA_4})`,
  },
  {
    icon: <FiGlobe size={22} />,
    title: "Open Access",
    desc: "Every published article is free to read. No walls, no gates. Knowledge belongs to everyone.",
    gradient: `linear-gradient(135deg, ${AURORA_2}, ${AURORA_3})`,
  },
];

export default function Root() {
  return (
    <div
      style={{
        background: DEEP,
        color: TEXT_PRIMARY,
        fontFamily: SANS,
      }}
    >
      <Helmet>
        <title>The Quiet Codex — Publishing That Glows</title>
        <meta
          name="description"
          content="A luminous space for writers. Rich text editing, visual banners, SEO tools, and unlimited drafts — all free, forever."
        />
        <meta name="theme-color" content={DEEP} />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <MeshOrb
          colors={[AURORA_1, AURORA_2, AURORA_3, AURORA_4]}
          size={600}
          className="absolute -top-40 -right-40"
          blur={120}
        />
        <MeshOrb
          colors={[AURORA_3, AURORA_4, AURORA_1, AURORA_2]}
          size={500}
          className="absolute -bottom-40 -left-40"
          blur={100}
        />
        <MeshOrb
          colors={[AURORA_2, AURORA_1, AURORA_4, AURORA_3]}
          size={300}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          blur={90}
        />
      </div>

      {/* Noise overlay */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" />

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full px-6 py-4 md:px-12"
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-6 py-3 backdrop-blur-xl"
          style={{
            background: "rgba(8,11,26,0.6)",
            border: `1px solid ${GLASS_BORDER}`,
          }}
        >
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: GRADIENT_PRIMARY }}
            >
              <FiBookOpen size={14} style={{ color: "#fff" }} />
            </div>
            <span
              className="text-base font-semibold tracking-wide"
              style={{ fontFamily: DISPLAY }}
            >
              The Quiet Codex
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/articles"
              className="hidden text-sm font-light transition-colors duration-200 md:block"
              style={{ color: TEXT_MUTED }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_PRIMARY)}
              onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
            >
              Articles
            </Link>
            <Link
              to="/auth"
              className="rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: GRADIENT_PRIMARY,
                color: "#fff",
                padding: "8px 22px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 20px ${AURORA_1}50`)
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative z-[2] flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${GLASS_BORDER}`,
            }}
          >
            <FiStar size={12} style={{ color: AURORA_2 }} />
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: TEXT_MUTED }}
            >
              Free &amp; Open Publishing Platform
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl text-5xl font-bold leading-[1.08] md:text-7xl lg:text-8xl"
          style={{ fontFamily: DISPLAY }}
        >
          Publishing That{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${AURORA_1}, ${AURORA_2}, ${AURORA_3})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Glows
          </span>
          <br />
          in the Dark
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 max-w-xl text-lg font-light leading-relaxed"
          style={{ color: TEXT_MUTED }}
        >
          A luminous space for writers. Rich text editing, visual banners, SEO
          tools, and unlimited drafts — all free, forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/auth"
            className="group flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: GRADIENT_PRIMARY,
              color: "#fff",
              padding: "14px 32px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = `0 0 30px ${AURORA_1}40, 0 0 60px ${AURORA_2}20`)
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            Start Writing Free
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/articles"
            className="rounded-xl text-sm font-light transition-all duration-300 backdrop-blur-lg"
            style={{
              border: `1px solid ${GLASS_BORDER}`,
              padding: "13px 28px",
              color: TEXT_MUTED,
              background: GLASS,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = TEXT_PRIMARY;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = GLASS_BORDER;
              e.currentTarget.style.color = TEXT_MUTED;
            }}
          >
            Explore Articles
          </Link>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 left-[15%] hidden lg:block"
        >
          <GlassCard hover={false} className="!p-4">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${AURORA_1}40, ${AURORA_3}40)`,
                }}
              />
              <div>
                <div
                  className="h-2 w-20 rounded"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
                <div
                  className="mt-1.5 h-2 w-14 rounded"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 right-[12%] hidden lg:block"
        >
          <GlassCard hover={false} className="!p-3">
            <div className="text-xs font-semibold" style={{ color: AURORA_2 }}>
              ✓ Published
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{
                background: GRADIENT_PRIMARY,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Features
            </span>
            <h2
              className="mt-4 text-4xl font-bold md:text-5xl"
              style={{ fontFamily: DISPLAY }}
            >
              Everything to Publish
              <br />
              <span style={{ color: TEXT_MUTED }}>Beautifully</span>
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <GlassCard className="h-full">
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: f.gradient, color: "#fff" }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm font-light leading-relaxed"
                    style={{ color: TEXT_MUTED }}
                  >
                    {f.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ── */}
      <section className="relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-[0.25em]"
                style={{
                  background: `linear-gradient(135deg, ${AURORA_3}, ${AURORA_1})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Writing Experience
              </span>
              <h2
                className="mt-4 text-3xl font-bold md:text-4xl"
                style={{ fontFamily: DISPLAY }}
              >
                Craft Without Limits
              </h2>
              <p
                className="mt-4 text-base font-light leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                Our editor gives you everything — rich formatting, inline
                images, custom slugs, meta descriptions, and banner uploads.
                Write privately as a draft, then publish in one click.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Full rich text formatting engine",
                  "SEO metadata and Open Graph tags",
                  "Cloud-hosted image pipeline",
                  "Private drafts with publish controls",
                  "Unlimited articles, no cost ever",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: AURORA_2, flexShrink: 0 }}
                    />
                    <span
                      className="text-sm font-light"
                      style={{ color: TEXT_MUTED }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Editor mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard hover={false} className="!p-0 overflow-hidden">
                <div
                  className="flex items-center gap-2 border-b px-4 py-3"
                  style={{ borderColor: GLASS_BORDER }}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `${AURORA_3}80` }}
                  />
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `${AURORA_2}80` }}
                  />
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `${AURORA_4}80` }}
                  />
                  <span
                    className="ml-3 text-[11px]"
                    style={{ color: TEXT_DIM }}
                  >
                    untitled-article.md
                  </span>
                </div>
                <div className="p-6">
                  <div
                    className="mb-5 text-xl font-bold"
                    style={{ fontFamily: DISPLAY }}
                  >
                    The Future of Open Publishing
                  </div>
                  <div className="space-y-2.5">
                    {[100, 85, 70, 90, 60].map((w, i) => (
                      <div
                        key={i}
                        className="h-2.5 rounded"
                        style={{
                          width: `${w}%`,
                          background: `rgba(255,255,255,${i < 3 ? 0.06 : 0.04})`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div
                      className="rounded-lg px-4 py-1.5 text-xs font-medium"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: TEXT_MUTED,
                        border: `1px solid ${GLASS_BORDER}`,
                      }}
                    >
                      Save Draft
                    </div>
                    <div
                      className="rounded-lg px-4 py-1.5 text-xs font-semibold"
                      style={{ background: GRADIENT_PRIMARY, color: "#fff" }}
                    >
                      Publish
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2
              className="text-4xl font-bold md:text-5xl"
              style={{ fontFamily: DISPLAY }}
            >
              Start in{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${AURORA_2}, ${AURORA_4})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Seconds
              </span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Sign Up",
                desc: "Free account in seconds. Just a username and password.",
                gradient: `linear-gradient(135deg, ${AURORA_1}, ${AURORA_3})`,
              },
              {
                num: "02",
                title: "Write",
                desc: "Use the rich editor. Add images, meta. Save as draft or publish.",
                gradient: `linear-gradient(135deg, ${AURORA_2}, ${AURORA_4})`,
              },
              {
                num: "03",
                title: "Share",
                desc: "Your article is live, free for the world. SEO-optimized discovery.",
                gradient: `linear-gradient(135deg, ${AURORA_3}, ${AURORA_1})`,
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <GlassCard className="text-center">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold"
                    style={{ background: step.gradient, color: "#fff" }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm font-light leading-relaxed"
                    style={{ color: TEXT_MUTED }}
                  >
                    {step.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-[2] px-6 py-28 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <GlassCard hover={false} className="!p-12 text-center md:!p-16">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: GRADIENT_PRIMARY,
                boxShadow: `0 0 40px ${AURORA_1}30`,
              }}
            >
              <FiBookOpen size={28} style={{ color: "#fff" }} />
            </div>
            <h2
              className="text-4xl font-bold md:text-5xl"
              style={{ fontFamily: DISPLAY }}
            >
              Ready to{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${AURORA_1}, ${AURORA_2}, ${AURORA_3})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Illuminate
              </span>
              ?
            </h2>
            <p
              className="mt-4 text-base font-light leading-relaxed"
              style={{ color: TEXT_MUTED }}
            >
              Free forever. Unlimited articles. No paywalls.
              <br />
              Your ideas deserve to shine.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/auth"
                className="group flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: GRADIENT_PRIMARY,
                  color: "#fff",
                  padding: "14px 32px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 30px ${AURORA_1}40, 0 0 60px ${AURORA_2}20`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Create Free Account
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/articles"
                className="text-sm font-light transition-colors duration-200"
                style={{ color: TEXT_MUTED, padding: "14px 20px" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = TEXT_PRIMARY)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
              >
                Browse Articles →
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-[2] border-t px-6 py-10"
        style={{ borderColor: GLASS_BORDER }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-md"
              style={{ background: GRADIENT_PRIMARY }}
            />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: DISPLAY, color: TEXT_DIM }}
            >
              The Quiet Codex
            </span>
          </div>
          <p className="text-xs" style={{ color: TEXT_DIM }}>
            &copy; {new Date().getFullYear()} The Quiet Codex. Illuminating
            ideas.
          </p>
          <div className="flex gap-6">
            <Link
              to="/articles"
              className="text-xs transition-colors duration-200"
              style={{ color: TEXT_DIM }}
              onMouseEnter={(e) => (e.currentTarget.style.color = AURORA_2)}
              onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_DIM)}
            >
              Articles
            </Link>
            <Link
              to="/auth"
              className="text-xs transition-colors duration-200"
              style={{ color: TEXT_DIM }}
              onMouseEnter={(e) => (e.currentTarget.style.color = AURORA_1)}
              onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_DIM)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
