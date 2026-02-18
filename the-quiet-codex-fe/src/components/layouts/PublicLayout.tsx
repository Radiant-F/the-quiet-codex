import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FiBookOpen,
  FiLogIn,
  FiMenu,
  FiX,
  FiHome,
  FiGrid,
  FiSearch,
} from "react-icons/fi";
import { useAppSelector } from "../../hooks";
import ScrollProgress from "../ui/ScrollProgress";
import BackToTop from "../ui/BackToTop";

export default function PublicLayout() {
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = Boolean(user.id);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />

      {/* ── Header ────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(8, 11, 26, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--color-glass-border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
              }}
            >
              <FiBookOpen size={16} className="text-white" />
            </div>
            <span
              className="text-sm font-bold tracking-wide"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text-primary)",
              }}
            >
              The Quiet Codex
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            <NavLink to="/" label="Home" exact />
            <NavLink to="/articles" label="Articles" />

            {/* Cmd+K hint */}
            <button
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
                )
              }
              className="mx-1 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-all hover:bg-white/5"
              style={{
                borderColor: "var(--color-glass-border)",
                color: "var(--color-text-dim)",
              }}
              aria-label="Open command palette"
            >
              <FiSearch size={13} />
              <kbd className="font-mono text-[10px]">⌘K</kbd>
            </button>

            <div
              className="mx-2 h-5 w-px"
              style={{ background: "var(--color-glass-border)" }}
            />
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn btn-primary">
                <FiGrid size={15} />
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                <FiLogIn size={15} />
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-white/5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX size={20} style={{ color: "var(--color-text-primary)" }} />
            ) : (
              <FiMenu
                size={20}
                style={{ color: "var(--color-text-primary)" }}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="border-t px-4 pb-4 pt-2 md:hidden"
            style={{
              background: "rgba(8, 11, 26, 0.95)",
              backdropFilter: "blur(16px)",
              borderColor: "var(--color-glass-border)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              <MobileNavLink to="/" icon={FiHome} label="Home" />
              <MobileNavLink
                to="/articles"
                icon={FiBookOpen}
                label="Articles"
              />
              <div
                className="my-2 h-px"
                style={{ background: "var(--color-glass-border)" }}
              />
              {isLoggedIn ? (
                <Link to="/dashboard" className="btn btn-primary w-full">
                  <FiGrid size={15} />
                  Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="btn btn-primary w-full">
                  <FiLogIn size={15} />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* ── Main ──────────────────────────────────────── */}
      <main id="main-content" className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer
        className="border-t"
        style={{ borderColor: "var(--color-glass-border)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <FiBookOpen size={14} style={{ color: "var(--color-text-dim)" }} />
            <span
              className="text-xs"
              style={{ color: "var(--color-text-dim)" }}
            >
              The Quiet Codex &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Crafted with intention.
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}

function NavLink({
  to,
  label,
  exact,
}: {
  to: string;
  label: string;
  exact?: boolean;
}) {
  const location = useLocation();
  const active = exact
    ? location.pathname === to
    : location.pathname.startsWith(to) && to !== "/";

  return (
    <Link
      to={to}
      className="link-underline rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      style={{
        color: active ? "var(--color-text-primary)" : "var(--color-text-muted)",
      }}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
      style={{ color: "var(--color-text-primary)" }}
    >
      <Icon size={18} style={{ color: "var(--color-text-dim)" }} />
      {label}
    </Link>
  );
}
