import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiFeather,
  FiSun,
  FiDroplet,
  FiWind,
  FiArrowRight,
  FiHeart,
  FiBookOpen,
} from "react-icons/fi";
import { BlobSVG, LeafDivider } from "../../components";
import { SERIF, SANS, CREAM, SAGE, TERRACOTTA, FOREST } from "../../lib/theme";

const features = [
  {
    icon: <FiFeather size={24} />,
    title: "Effortless Writing",
    desc: "A rich text editor that feels as natural as pen on paper. Format with intention, write with flow.",
    color: "#87A878",
  },
  {
    icon: <FiSun size={24} />,
    title: "Visual Storytelling",
    desc: "Banner images that set the mood. Support for JPEG, PNG, WebP, and AVIF to bring your stories to life.",
    color: "#C4704B",
  },
  {
    icon: <FiDroplet size={24} />,
    title: "Organic Discovery",
    desc: "SEO that works quietly. Meta descriptions, clean URLs, and Open Graph tags grow your readership naturally.",
    color: "#87A878",
  },
  {
    icon: <FiWind size={24} />,
    title: "Gentle Drafts",
    desc: "Ideas need time to breathe. Save drafts privately and publish only when they've fully blossomed.",
    color: "#C4704B",
  },
];

export default function Design4() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: CREAM, color: FOREST, fontFamily: SANS }}
    >
      <Helmet>
        <title>The Quiet Codex — Where ideas take root</title>
        <meta
          name="description"
          content="A calm, beautiful platform to write, polish, and share your articles with the world."
        />
      </Helmet>

      <style>{`
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
      `}</style>

      {/* ── Nav ─────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
            style={{ background: "#87A878" }}
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
            <p className="text-xs text-[#2D4A3E]/40">Where ideas take root</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 text-sm text-[#2D4A3E]/50 md:flex">
            <Link
              to="/articles"
              className="flex items-center gap-1 transition-colors hover:text-[#2D4A3E]"
            >
              <FiBookOpen size={14} /> Articles
            </Link>
            <a href="#grow" className="transition-colors hover:text-[#2D4A3E]">
              Grow
            </a>
            <a
              href="#journey"
              className="transition-colors hover:text-[#2D4A3E]"
            >
              Journey
            </a>
          </div>
          <Link
            to="/auth"
            className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
            style={{ background: TERRACOTTA }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-16">
        {/* Floating blobs */}
        <BlobSVG
          className="float pointer-events-none absolute -top-20 -right-32 w-[500px] md:w-[700px]"
          color="#87A878"
          opacity={0.12}
        />
        <BlobSVG
          className="float-slow pointer-events-none absolute -bottom-32 -left-40 w-[600px] md:w-[800px]"
          color="#C4704B"
          opacity={0.08}
        />
        <BlobSVG
          className="breathe pointer-events-none absolute top-1/3 left-1/4 w-[300px]"
          color="#87A878"
          opacity={0.06}
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
              style={{
                borderColor: "rgba(135,168,120,0.3)",
                color: "#87A878",
                background: "rgba(135,168,120,0.08)",
              }}
            >
              <FiHeart size={12} /> Crafted for thoughtful writers
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl font-semibold leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: SERIF }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Nurture your ideas.
            <br />
            <span style={{ color: "#87A878" }}>Watch them </span>
            <span className="italic" style={{ color: "#C4704B" }}>
              bloom.
            </span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-lg text-lg leading-relaxed"
            style={{ color: "#2D4A3E99" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            A calm, beautiful space to write, polish, and share your articles
            with the world. No rush. No noise. Just the gentle rhythm of
            creation.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
              style={{ background: FOREST }}
            >
              Begin your journey <FiArrowRight />
            </Link>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm font-medium transition-all"
              style={{
                borderColor: "#2D4A3E30",
                color: "#2D4A3E99",
              }}
            >
              Explore articles
            </Link>
          </motion.div>
        </div>
      </section>

      <LeafDivider />

      {/* ── Features ────────────────────── */}
      <section id="grow" className="relative px-8 py-24 md:px-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 max-w-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#87A878" }}
            >
              Everything you need
            </span>
            <h2
              className="mt-4 text-4xl font-semibold md:text-5xl"
              style={{ fontFamily: SERIF }}
            >
              Tools that grow
              <br />
              with your craft.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-3xl p-8 transition-all hover:shadow-xl md:p-10"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, rgba(135,168,120,0.08), rgba(135,168,120,0.02))"
                      : "linear-gradient(135deg, rgba(196,112,75,0.08), rgba(196,112,75,0.02))",
                  border: `1px solid ${f.color}20`,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                <BlobSVG
                  className="breathe pointer-events-none absolute -right-16 -top-16 w-48 opacity-40"
                  color={f.color}
                  opacity={0.1}
                />
                <div
                  className="relative z-10 mb-4 inline-flex rounded-2xl p-3"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3
                  className="relative z-10 mb-3 text-2xl font-semibold"
                  style={{ fontFamily: SERIF }}
                >
                  {f.title}
                </h3>
                <p
                  className="relative z-10 leading-relaxed"
                  style={{ color: "#2D4A3E90" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pull Quote ──────────────────── */}
      <section className="relative px-8 py-24 md:px-16">
        <BlobSVG
          className="float pointer-events-none absolute top-0 left-1/2 w-[500px] -translate-x-1/2"
          color="#87A878"
          opacity={0.06}
        />
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FiFeather
            size={32}
            className="mx-auto mb-8"
            style={{ color: "#87A878" }}
          />
          <blockquote
            className="text-3xl font-light leading-snug italic md:text-4xl"
            style={{ fontFamily: SERIF, color: "#2D4A3E" }}
          >
            &ldquo;Great writing is not about speed. It&apos;s about giving each
            word the space it needs to mean something.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm" style={{ color: "#2D4A3E60" }}>
            — The philosophy behind every feature
          </p>
        </motion.div>
      </section>

      <LeafDivider />

      {/* ── Journey / Process ───────────── */}
      <section
        id="journey"
        className="relative px-8 py-24 md:px-16"
        style={{ background: "#2D4A3E", color: "#FDF6EC" }}
      >
        <BlobSVG
          className="float-slow pointer-events-none absolute -right-40 top-0 w-[600px]"
          color="#87A878"
          opacity={0.08}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#87A878" }}
            >
              Your path
            </span>
            <h2
              className="mt-4 text-4xl font-semibold md:text-5xl"
              style={{ fontFamily: SERIF }}
            >
              A gentle journey
              <br />
              from seed to harvest.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: "Plant",
                emoji: "🌱",
                desc: "Sign up and create your writer profile. Upload an avatar, choose a username. Set down your roots.",
              },
              {
                step: "Tend",
                emoji: "🌿",
                desc: "Open the editor and begin writing. Add headings, links, and images. Shape your article with the rich text tools.",
              },
              {
                step: "Harvest",
                emoji: "🌻",
                desc: "When you're ready, publish. Your article blooms on the web with clean SEO, a beautiful banner, and a permanent URL.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <div className="mb-4 text-5xl">{s.emoji}</div>
                <h3
                  className="mb-3 text-2xl font-semibold"
                  style={{ fontFamily: SERIF }}
                >
                  {s.step}
                </h3>
                <p className="leading-relaxed" style={{ color: "#FDF6EC90" }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ─────────────────── */}
      <section className="relative px-8 py-24 md:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Finally, a platform that doesn't scream at me. It whispers.",
                name: "A. Whitfield",
                role: "Essayist",
              },
              {
                quote:
                  "I published my first article in under five minutes. The simplicity is remarkable.",
                name: "K. Tanaka",
                role: "Tech Writer",
              },
              {
                quote:
                  "The SEO features work silently in the background. My articles get found without me chasing algorithms.",
                name: "M. Okafor",
                role: "Journalist",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="rounded-3xl p-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(135,168,120,0.06), rgba(196,112,75,0.04))",
                  border: "1px solid rgba(45,74,62,0.08)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <p
                  className="mb-6 text-lg italic leading-relaxed"
                  style={{ fontFamily: SERIF, color: "#2D4A3E" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs" style={{ color: "#2D4A3E60" }}>
                    {t.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LeafDivider />

      {/* ── CTA ─────────────────────────── */}
      <section id="start" className="relative px-8 py-32 md:px-16">
        <BlobSVG
          className="breathe pointer-events-none absolute top-1/2 left-1/2 w-[600px] -translate-x-1/2 -translate-y-1/2"
          color="#87A878"
          opacity={0.08}
        />
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#87A878" }}
          >
            Ready to begin?
          </span>
          <h2
            className="mt-6 text-5xl font-semibold md:text-7xl"
            style={{ fontFamily: SERIF }}
          >
            Let your words
            <br />
            <span className="italic" style={{ color: "#C4704B" }}>
              take root.
            </span>
          </h2>
          <p
            className="mx-auto mt-6 max-w-md text-lg"
            style={{ color: "#2D4A3E80" }}
          >
            Join a community of writers who value patience, beauty, and the
            quiet satisfaction of a well-told story.
          </p>
          <div className="mt-10">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-sm font-medium text-white shadow-xl transition-all hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${FOREST}, ${SAGE})`,
              }}
            >
              Create your garden <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────── */}
      <footer
        className="px-8 py-8 md:px-16"
        style={{ borderTop: "1px solid rgba(45,74,62,0.1)" }}
      >
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row"
          style={{ color: "#2D4A3E60" }}
        >
          <span style={{ fontFamily: SERIF }} className="text-base">
            © 2026 The Quiet Codex
          </span>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-[#2D4A3E]">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-[#2D4A3E]">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-[#2D4A3E]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
