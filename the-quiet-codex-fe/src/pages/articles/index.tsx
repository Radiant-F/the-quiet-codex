import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";
import { motion } from "motion/react";
import { PublicArticleList } from "../../features/article";
import {
  DISPLAY,
  SANS,
  DEEP,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  AURORA_1,
  AURORA_2,
  AURORA_3,
  AURORA_4,
  GLASS,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
  GRADIENT_ACCENT,
} from "../../lib/theme";

export default function ArticlesPage() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: DEEP, color: TEXT_PRIMARY, fontFamily: SANS }}
    >
      <Helmet>
        <title>Articles — The Quiet Codex</title>
        <meta
          name="description"
          content="Explore thoughtful articles from The Quiet Codex community."
        />
        <meta name="theme-color" content={DEEP} />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* Noise */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" />

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-60 right-1/4"
          style={{
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${AURORA_1}, ${AURORA_2}, ${AURORA_3}, ${AURORA_4})`,
            filter: "blur(140px)",
            opacity: 0.25,
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
            style={{ background: GRADIENT_PRIMARY }}
          >
            <FiBookOpen size={16} />
          </div>
          <div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
            >
              The Quiet Codex
            </span>
            <p className="text-xs" style={{ color: TEXT_DIM }}>
              Where ideas illuminate
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden text-sm transition-colors hover:opacity-80 md:block"
            style={{ color: TEXT_DIM }}
          >
            Home
          </Link>
          <Link
            to="/auth"
            className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ background: GRADIENT_PRIMARY }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 py-16 md:px-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: AURORA_2 }}
            >
              The Archive
            </span>
            <h1
              className="mt-4 text-4xl font-semibold md:text-6xl"
              style={{ fontFamily: DISPLAY }}
            >
              Explore{" "}
              <span
                style={{
                  background: GRADIENT_ACCENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                articles
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-lg" style={{ color: TEXT_MUTED }}>
              Stories, insights, and ideas from our community of thoughtful
              writers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article grid */}
      <section className="relative z-10 px-8 pb-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <PublicArticleList />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 px-8 py-8 md:px-16"
        style={{ borderTop: `1px solid ${GLASS_BORDER}` }}
      >
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row"
          style={{ color: TEXT_DIM }}
        >
          <span style={{ fontFamily: DISPLAY }} className="text-base">
            &copy; 2026 The Quiet Codex
          </span>
          <div className="flex items-center gap-6">
            <Link to="/" className="transition-colors hover:opacity-80">
              Home
            </Link>
            <Link to="/articles" className="transition-colors hover:opacity-80">
              Articles
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
