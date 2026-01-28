import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Link } from "react-router";
import { FiSun, FiMoon, FiGlobe, FiLogOut, FiPlus } from "react-icons/fi";

export default function HomePage() {
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (mode === "system") {
      setMode("light");
    } else if (mode === "light") {
      setMode("dark");
    } else {
      setMode("system");
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  return (
    <main className="min-h-screen theme-page">
      {/* Navigation */}
      <nav className="theme-surface border-b theme-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold theme-accent">
            The Quiet Codex
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg theme-elevated hover:opacity-80 transition-opacity"
              title={t("common", "switchTheme")}
            >
              {resolvedTheme === "dark" ? (
                <FiSun size={20} />
              ) : (
                <FiMoon size={20} />
              )}
            </button>
            <button
              onClick={toggleLocale}
              className="p-2 rounded-lg theme-elevated hover:opacity-80 transition-opacity flex items-center gap-1"
              title={t("common", "switchLanguage")}
            >
              <FiGlobe size={20} />
              <span className="text-sm uppercase">{locale}</span>
            </button>
            <button className="p-2 rounded-lg theme-elevated hover:opacity-80 transition-opacity">
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("pages", "home")}</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--page-accent)] text-white font-medium hover:opacity-90 transition-opacity">
            <FiPlus size={20} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Todo List Placeholder */}
        <div className="grid gap-4">
          <div className="theme-surface rounded-xl p-6 border theme-border">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-2 theme-border"
              />
              <div className="flex-1">
                <h3 className="font-medium">Sample Task 1</h3>
                <p className="text-sm theme-muted">
                  This is a sample task description
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs theme-elevated">
                work
              </span>
            </div>
          </div>

          <div className="theme-surface rounded-xl p-6 border theme-border">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-2 theme-border"
                defaultChecked
              />
              <div className="flex-1">
                <h3 className="font-medium line-through theme-muted">
                  Completed Task
                </h3>
                <p className="text-sm theme-muted">
                  This task has been completed
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs theme-elevated">
                personal
              </span>
            </div>
          </div>

          <div className="theme-surface rounded-xl p-6 border theme-border">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-2 theme-border"
              />
              <div className="flex-1">
                <h3 className="font-medium">Another Task</h3>
                <p className="text-sm theme-muted">
                  With some description text
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs theme-elevated">
                urgent
              </span>
            </div>
          </div>
        </div>

        {/* Empty State (hidden for demo) */}
        <div className="hidden text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
          <p className="theme-muted mb-6">
            Create your first task to get started
          </p>
          <button className="px-6 py-3 rounded-lg bg-[var(--page-accent)] text-white font-medium hover:opacity-90 transition-opacity">
            Create Task
          </button>
        </div>
      </div>
    </main>
  );
}
