import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";

const designs = [
  { path: "/1", label: "1" },
  { path: "/2", label: "2" },
  { path: "/3", label: "3" },
  { path: "/4", label: "4" },
  { path: "/5", label: "5" },
];

export default function DesignNavigator() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-1 rounded-full px-2.5 py-2 shadow-2xl"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <span
        className="mr-1.5 px-1.5 text-[10px] font-medium uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        v
      </span>
      {designs.map((d) => {
        const isActive = current === d.path;
        return (
          <Link
            key={d.path}
            to={d.path}
            className="flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              width: 34,
              height: 34,
              background: isActive ? "#fff" : "rgba(255,255,255,0.06)",
              color: isActive ? "#000" : "rgba(255,255,255,0.55)",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }
            }}
          >
            {d.label}
          </Link>
        );
      })}
    </motion.nav>
  );
}
