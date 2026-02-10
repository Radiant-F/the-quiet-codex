import { Link } from "react-router-dom";
import { FiBookOpen, FiLogIn } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export default function DesignNav() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/20 bg-white/70 px-6 py-4 shadow-lg shadow-blue-100/30 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <FiBookOpen />
        </span>
        <div>
          <p className="text-lg font-semibold">The Quiet Codex</p>
          <p className="text-xs text-slate-500">
            Notes, tasks, and calm focus.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow"
          to="/auth"
        >
          <FiLogIn />
          Sign in
        </Link>
      </div>
    </nav>
  );
}
