import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiFeather } from "react-icons/fi";
import { motion } from "motion/react";
import BlobSVG from "../../components/BlobSVG";
import { PublicArticleList } from "../../features/article";
import {
  SERIF,
  SANS,
  FOREST,
  SAGE,
  TERRACOTTA,
  CREAM,
  KEYFRAMES,
} from "../../lib/theme";

export default function ArticlesPage() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: CREAM, color: FOREST, fontFamily: SANS }}
    >
      <Helmet>
        <title>Articles — The Quiet Codex</title>
        <meta
          name="description"
          content="Explore thoughtful articles from The Quiet Codex community."
        />
      </Helmet>

      <style>{KEYFRAMES}</style>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
            style={{ background: SAGE }}
          >
            <FiFeather size={18} />
          </div>
          <div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: SERIF }}
            >
              The Quiet Codex
            </span>
            <p className="text-xs" style={{ color: `${FOREST}40` }}>
              Where ideas take root
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden text-sm transition-colors md:block"
            style={{ color: `${FOREST}50` }}
          >
            Home
          </Link>
          <Link
            to="/auth"
            className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
            style={{ background: TERRACOTTA }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 py-16 md:px-16 md:py-24">
        <BlobSVG
          className="float pointer-events-none absolute -right-40 -top-20 w-[600px]"
          color={SAGE}
          opacity={0.08}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: SAGE }}
            >
              The Garden
            </span>
            <h1
              className="mt-4 text-4xl font-semibold md:text-6xl"
              style={{ fontFamily: SERIF }}
            >
              Explore articles
            </h1>
            <p
              className="mt-4 max-w-lg text-lg"
              style={{ color: `${FOREST}60` }}
            >
              Stories, insights, and ideas cultivated by our community of
              thoughtful writers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Article grid */}
      <section className="px-8 pb-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <PublicArticleList />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-8 md:px-16"
        style={{ borderTop: `1px solid ${FOREST}10` }}
      >
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row"
          style={{ color: `${FOREST}60` }}
        >
          <span style={{ fontFamily: SERIF }} className="text-base">
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
