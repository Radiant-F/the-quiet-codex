import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiFeather,
  FiFileText,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useLogoutMutation } from "../features/auth";
import { useAppSelector } from "../hooks";
import { SERIF, SANS, FOREST, SAGE, CREAM } from "../lib/theme";

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
        background: FOREST,
        color: CREAM,
        fontFamily: SANS,
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
          style={{ background: SAGE }}
        >
          <FiFeather size={16} />
        </div>
        <div>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: SERIF }}
          >
            The Quiet Codex
          </span>
          <p className="text-[10px] opacity-40">Dashboard</p>
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
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? CREAM : `${CREAM}99`,
            })}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: SAGE, color: "white" }}
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
          style={{ color: `${CREAM}70` }}
        >
          <FiLogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen" style={{ background: CREAM }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:block">{sidebar}</aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-64">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div
          className="flex items-center justify-between border-b px-4 py-3 md:hidden"
          style={{ borderColor: `${FOREST}10` }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            style={{ color: FOREST }}
          >
            <FiMenu size={22} />
          </button>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: SERIF, color: FOREST }}
          >
            The Quiet Codex
          </span>
          <div className="w-6" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
