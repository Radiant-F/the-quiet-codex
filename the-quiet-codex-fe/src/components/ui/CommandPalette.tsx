import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiSearch,
  FiHome,
  FiBookOpen,
  FiEdit3,
  FiUser,
  FiGrid,
  FiLogIn,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { useAppSelector } from "../../hooks";

/* ── Command Types ───────────────────────────────────────── */
interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  action: () => void;
  keywords?: string[];
  group: "navigation" | "dashboard" | "actions";
}

/* ── Component ───────────────────────────────────────────── */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = Boolean(user.id);

  /* ── Build command list ────────────────────────────────── */
  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      {
        id: "home",
        label: "Home",
        description: "Go to the homepage",
        icon: FiHome,
        action: () => navigate("/"),
        keywords: ["landing", "front"],
        group: "navigation",
      },
      {
        id: "articles",
        label: "Browse Articles",
        description: "View all published articles",
        icon: FiBookOpen,
        action: () => navigate("/articles"),
        keywords: ["posts", "blog", "read"],
        group: "navigation",
      },
    ];

    if (isLoggedIn) {
      nav.push(
        {
          id: "dashboard",
          label: "Dashboard",
          description: "Go to dashboard overview",
          icon: FiGrid,
          action: () => navigate("/dashboard"),
          keywords: ["overview", "panel"],
          group: "dashboard",
        },
        {
          id: "my-articles",
          label: "My Articles",
          description: "Manage your articles",
          icon: FiEdit3,
          action: () => navigate("/dashboard/articles"),
          keywords: ["posts", "manage", "list"],
          group: "dashboard",
        },
        {
          id: "new-article",
          label: "New Article",
          description: "Write a new article",
          icon: FiPlus,
          action: () => navigate("/dashboard/articles/new"),
          keywords: ["create", "write", "compose"],
          group: "actions",
        },
        {
          id: "profile",
          label: "Profile",
          description: "View & edit your profile",
          icon: FiUser,
          action: () => navigate("/dashboard/profile"),
          keywords: ["account", "settings"],
          group: "dashboard",
        },
      );
    } else {
      nav.push({
        id: "sign-in",
        label: "Sign In",
        description: "Login or create an account",
        icon: FiLogIn,
        action: () => navigate("/auth"),
        keywords: ["login", "register", "account"],
        group: "actions",
      });
    }

    return nav;
  }, [isLoggedIn, navigate]);

  /* ── Filter commands ───────────────────────────────────── */
  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description?.toLowerCase().includes(q) ||
        cmd.keywords?.some((k) => k.includes(q)),
    );
  }, [commands, query]);

  /* ── Keyboard shortcut: Cmd/Ctrl + K ───────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Focus input on open ───────────────────────────────── */
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /* ── Scroll active item into view ──────────────────────── */
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;
    const activeEl = listEl.children[activeIdx] as HTMLElement | undefined;
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  /* ── Execute command ───────────────────────────────────── */
  const execute = useCallback((cmd: Command) => {
    setOpen(false);
    cmd.action();
  }, []);

  /* ── Keyboard navigation in list ───────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIdx((prev) => (prev + 1) % filtered.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIdx(
            (prev) => (prev - 1 + filtered.length) % filtered.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[activeIdx]) execute(filtered[activeIdx]);
          break;
      }
    },
    [filtered, activeIdx, execute],
  );

  /* ── Reset active index on filter change ─────────────── */
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  /* ── Group commands ────────────────────────────────────── */
  const grouped = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    for (const cmd of filtered) {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push(cmd);
    }
    return groups;
  }, [filtered]);

  const groupLabels: Record<string, string> = {
    navigation: "Navigation",
    dashboard: "Dashboard",
    actions: "Actions",
  };

  /* ── Flat index map (for active highlight) ─────────────── */
  let flatIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border"
            style={{
              background: "var(--color-deep-lighter)",
              borderColor: "var(--color-glass-border)",
              boxShadow:
                "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(147, 130, 220, 0.1)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Command palette"
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 border-b px-4"
              style={{ borderColor: "var(--color-glass-border)" }}
            >
              <FiSearch
                size={18}
                style={{ color: "var(--color-text-dim)", flexShrink: 0 }}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border-0 bg-transparent py-4 text-sm outline-none"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-sans)",
                }}
                aria-label="Search commands"
              />
              <kbd
                className="hidden items-center gap-0.5 rounded-md border px-2 py-0.5 text-[10px] font-medium sm:flex"
                style={{
                  borderColor: "var(--color-glass-border)",
                  color: "var(--color-text-dim)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Command list */}
            <div
              ref={listRef}
              className="max-h-72 overflow-y-auto py-2"
              role="listbox"
            >
              {filtered.length === 0 ? (
                <div
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  No results found.
                </div>
              ) : (
                Object.entries(grouped).map(([group, cmds]) => (
                  <div key={group}>
                    <div
                      className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-text-dim)" }}
                    >
                      {groupLabels[group] ?? group}
                    </div>
                    {cmds.map((cmd) => {
                      const idx = flatIndex++;
                      const isActive = idx === activeIdx;
                      return (
                        <button
                          key={cmd.id}
                          role="option"
                          aria-selected={isActive}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                          style={{
                            background: isActive
                              ? "rgba(147, 130, 220, 0.1)"
                              : "transparent",
                            color: isActive
                              ? "var(--color-text-primary)"
                              : "var(--color-text-muted)",
                          }}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setActiveIdx(idx)}
                        >
                          <cmd.icon size={16} className="flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{cmd.label}</div>
                            {cmd.description && (
                              <div
                                className="text-xs truncate"
                                style={{ color: "var(--color-text-dim)" }}
                              >
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {isActive && (
                            <FiArrowRight
                              size={14}
                              className="flex-shrink-0"
                              style={{ color: "var(--color-aurora-purple)" }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div
              className="flex items-center justify-between border-t px-4 py-2"
              style={{ borderColor: "var(--color-glass-border)" }}
            >
              <div
                className="flex items-center gap-3 text-[11px]"
                style={{ color: "var(--color-text-dim)" }}
              >
                <span className="flex items-center gap-1">
                  <kbd
                    className="rounded border px-1"
                    style={{ borderColor: "var(--color-glass-border)" }}
                  >
                    ↑
                  </kbd>
                  <kbd
                    className="rounded border px-1"
                    style={{ borderColor: "var(--color-glass-border)" }}
                  >
                    ↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className="rounded border px-1"
                    style={{ borderColor: "var(--color-glass-border)" }}
                  >
                    ↵
                  </kbd>
                  select
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
