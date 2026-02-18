import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiFileText,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useLogoutMutation } from "../features/auth";
import { useAppSelector } from "../hooks";
import {
  DISPLAY,
  SANS,
  DEEP,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  GLASS,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
} from "../lib/theme";

const navItems = [
  { to: "/dashboard", icon: FiFileText, label: "My Articles", end: true },
  {
    to: "/dashboard/articles/new",
    icon: FiPlusCircle,
    label: "New Article",
    end: false,
  },
  { to: "/dashboard/profile", icon: FiUser, label: "Profile", end: false },
];

export default function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const [logout, logoutState] = useLogoutMutation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout().unwrap();
    navigate("/");
  };

  const sidebar = (
    <div
      className="flex h-full w-64 flex-col"
      style={{
        background: "rgba(8,11,26,0.95)",
        borderRight: `1px solid ${GLASS_BORDER}`,
        color: TEXT_PRIMARY,
        fontFamily: SANS,
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
          style={{ background: GRADIENT_PRIMARY }}
        >
          <FiBookOpen size={14} />
        </div>
        <div>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: DISPLAY }}
          >
            The Quiet Codex
          </span>
          <p className="text-[10px]" style={{ color: TEXT_DIM }}>
            Dashboard
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive ? "" : "hover:bg-white/5"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? TEXT_PRIMARY : TEXT_MUTED,
              background: isActive ? GLASS : undefined,
              border: isActive
                ? `1px solid ${GLASS_BORDER}`
                : "1px solid transparent",
            })}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div
        style={{ borderTop: `1px solid ${GLASS_BORDER}` }}
        className="px-4 py-4"
      >
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
            style={{ background: GRADIENT_PRIMARY }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{user.username}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutState.isLoading}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all hover:bg-white/5"
          style={{ color: TEXT_DIM }}
        >
          <FiLogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen" style={{ background: DEEP }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:block">{sidebar}</aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-64">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div
          className="flex items-center justify-between px-4 py-3 md:hidden"
          style={{ borderBottom: `1px solid ${GLASS_BORDER}` }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            style={{ color: TEXT_PRIMARY }}
          >
            <FiMenu size={22} />
          </button>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
          >
            The Quiet Codex
          </span>
          <div className="w-6" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Noise overlay */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" />
    </div>
  );
}
