import { Outlet, Link, Navigate } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";
import { useAppSelector } from "../../hooks";

export default function AuthLayout() {
  const user = useAppSelector((s) => s.auth.user);

  // If already logged in, redirect to dashboard
  if (user.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
      {/* Aurora background */}
      <div className="aurora-bg" />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 sm:left-8 sm:top-8"
        style={{ color: "var(--color-text-muted)" }}
      >
        <FiBookOpen size={16} />
        <span className="hidden sm:inline">The Quiet Codex</span>
      </Link>

      <div className="w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}
