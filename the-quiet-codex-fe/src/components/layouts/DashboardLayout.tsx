import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiBookOpen,
  FiHome,
  FiEdit3,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiChevronLeft,
} from "react-icons/fi";
import { useAppSelector } from "../../hooks";
import { useLogoutMutation } from "../../features/auth";
import ScrollProgress from "../ui/ScrollProgress";
import BackToTop from "../ui/BackToTop";

const NAV_ITEMS = [
  { to: "/dashboard", icon: FiHome, label: "Overview", exact: true },
  { to: "/dashboard/articles", icon: FiEdit3, label: "My Articles" },
  { to: "/dashboard/profile", icon: FiUser, label: "Profile" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [logout] = useLogoutMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/");
    } catch {
      /* error logged by RTK */
    }
  };

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen">
      <ScrollProgress />

      {/* ── Sidebar (Desktop) ─────────────────────────── */}
      <aside
        className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r lg:flex"
        style={{
          background: "var(--color-deep-lighter)",
          borderColor: "var(--color-glass-border)",
        }}
      >
        <SidebarContent
          user={user}
          isActive={isActive}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Mobile Sidebar Overlay ─────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(0,0,0,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r lg:hidden"
              style={{
                background: "var(--color-deep-lighter)",
                borderColor: "var(--color-glass-border)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-white/5"
                  aria-label="Close sidebar"
                >
                  <FiX size={20} style={{ color: "var(--color-text-muted)" }} />
                </button>
              </div>
              <SidebarContent
                user={user}
                isActive={isActive}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 lg:px-8"
          style={{
            background: "rgba(8, 11, 26, 0.8)",
            backdropFilter: "blur(12px)",
            borderColor: "var(--color-glass-border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 transition-colors hover:bg-white/5 lg:hidden"
            aria-label="Open sidebar"
          >
            <FiMenu size={20} style={{ color: "var(--color-text-primary)" }} />
          </button>

          <div className="flex-1" />

          <Link
            to="/dashboard/articles/new"
            className="btn btn-primary hidden sm:inline-flex"
          >
            <FiPlus size={16} />
            New Article
          </Link>

          {/* Mobile FAB for new article */}
          <Link
            to="/dashboard/articles/new"
            className="btn btn-primary sm:hidden"
            style={{ padding: "10px" }}
            aria-label="New article"
          >
            <FiPlus size={18} />
          </Link>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      <BackToTop />
    </div>
  );
}

/* ── Sidebar Content (shared desktop/mobile) ─────────────── */
function SidebarContent({
  user,
  isActive,
  onLogout,
}: {
  user: { username: string };
  isActive: (path: string, exact?: boolean) => boolean;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
          }}
        >
          <FiBookOpen size={18} className="text-white" />
        </div>
        <div>
          <p
            className="text-sm font-bold tracking-wide"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            The Quiet Codex
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Writer Dashboard
          </p>
        </div>
      </div>

      <div
        className="mx-4 h-px"
        style={{ background: "var(--color-glass-border)" }}
      />

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 px-3 py-4"
        aria-label="Dashboard navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                color: active
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
                background: active ? "var(--color-glass-hover)" : "transparent",
              }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--color-aurora-purple), var(--color-aurora-teal))",
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <item.icon
                size={18}
                style={{
                  color: active
                    ? "var(--color-aurora-purple)"
                    : "var(--color-text-dim)",
                  transition: "color 0.2s",
                }}
              />
              {item.label}
            </Link>
          );
        })}

        <div
          className="mx-1 my-3 h-px"
          style={{ background: "var(--color-glass-border)" }}
        />

        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiChevronLeft size={18} style={{ color: "var(--color-text-dim)" }} />
          Back to Site
        </Link>
      </nav>

      {/* User & Logout */}
      <div
        className="border-t p-4"
        style={{ borderColor: "var(--color-glass-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
            }}
          >
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 truncate">
            <p
              className="truncate text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {user.username || "Guest"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg p-2 transition-colors hover:bg-white/5"
            aria-label="Log out"
            data-tooltip="Log out"
          >
            <FiLogOut size={16} style={{ color: "var(--color-text-dim)" }} />
          </button>
        </div>
      </div>
    </>
  );
}
