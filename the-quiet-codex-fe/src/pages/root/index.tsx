import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { FiArrowRight, FiBookOpen, FiFeather, FiZap } from "react-icons/fi";
import { useAppSelector } from "../../hooks";

export default function RootPage() {
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = Boolean(user.id);

  return (
    <>
      <Helmet>
        <title>The Quiet Codex — A Space for Thoughtful Writing</title>
        <meta
          name="description"
          content="The Quiet Codex is a minimal, beautiful platform where writers share their ideas with the world."
        />
      </Helmet>

      {/* ── Hero Section ──────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Aurora background */}
        <div className="aurora-bg" />

        <div className="mx-auto max-w-6xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  background: "var(--color-glass)",
                  color: "var(--color-aurora-teal)",
                  border: "1px solid var(--color-glass-border)",
                }}
              >
                <FiBookOpen size={14} />A space for thoughtful writing
              </div>
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl font-bold leading-tight lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Where words find{" "}
              <span className="gradient-text italic">their light.</span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-10 max-w-xl text-lg leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              The Quiet Codex is a minimal, beautiful platform for writers who
              care about craft. Publish articles, build your voice, and share
              ideas that resonate.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link to="/articles" className="btn btn-primary">
                Read Articles
                <FiArrowRight size={16} />
              </Link>
              {isLoggedIn ? (
                <Link to="/dashboard" className="btn btn-secondary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-secondary">
                  Start Writing
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="mb-3 text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for writers
          </h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Everything you need, nothing you don't.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FiFeather,
              title: "Rich Editor",
              desc: "A powerful TipTap editor with formatting, images, code blocks, and more — so your words look their best.",
              color: "var(--color-aurora-purple)",
              bg: "rgba(123, 97, 255, 0.08)",
            },
            {
              icon: FiBookOpen,
              title: "Beautiful Reading",
              desc: "Articles are presented with clean typography, generous whitespace, and an aurora-inspired aesthetic.",
              color: "var(--color-aurora-teal)",
              bg: "rgba(0, 212, 170, 0.08)",
            },
            {
              icon: FiZap,
              title: "Fast & Minimal",
              desc: "No bloat, no distractions. Just a focused writing and reading experience built on modern technology.",
              color: "var(--color-aurora-pink)",
              bg: "rgba(255, 107, 202, 0.08)",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className="glass-panel p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: feature.bg }}
              >
                <feature.icon size={22} style={{ color: feature.color }} />
              </div>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <motion.div
          className="glass-panel overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          style={{ background: "var(--color-glass)" }}
        >
          <div className="relative px-8 py-16 text-center">
            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(123, 97, 255, 0.15), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2
                className="mb-4 text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to share your story?
              </h2>
              <p
                className="mb-8 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Join The Quiet Codex and start writing today.
              </p>
              {isLoggedIn ? (
                <Link to="/dashboard/articles/new" className="btn btn-primary">
                  Write an Article
                  <FiArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary">
                  Get Started
                  <FiArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
