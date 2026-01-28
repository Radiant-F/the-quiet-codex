import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Link } from "react-router";
import { FiSun, FiMoon, FiGlobe } from "react-icons/fi";

export default function RootPage() {
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
          <h1 className="text-xl font-bold theme-accent">The Quiet Codex</h1>
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
            <Link
              to="/auth"
              className="px-4 py-2 rounded-lg theme-elevated hover:opacity-80 transition-opacity"
            >
              {t("common", "login")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-bold mb-6">{t("pages", "root")}</h2>
        <p className="text-xl theme-muted mb-8 max-w-2xl mx-auto">
          Your personal productivity companion. Organize tasks, track progress,
          and achieve your goals with ease.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/auth"
            className="px-6 py-3 rounded-lg bg-[var(--page-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            to="/home"
            className="px-6 py-3 rounded-lg theme-elevated font-medium hover:opacity-80 transition-opacity"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="theme-surface py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="theme-elevated p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[var(--page-accent)]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Task Management</h4>
              <p className="theme-muted">
                Create, organize, and track your tasks with an intuitive
                interface.
              </p>
            </div>
            <div className="theme-elevated p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[var(--page-accent)]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🏷️</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Tags & Categories</h4>
              <p className="theme-muted">
                Organize your tasks with custom tags and categories for better
                workflow.
              </p>
            </div>
            <div className="theme-elevated p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[var(--page-accent)]/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🌙</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Dark Mode</h4>
              <p className="theme-muted">
                Easy on the eyes with automatic dark mode support based on your
                preference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="theme-elevated py-8">
        <div className="container mx-auto px-4 text-center theme-muted">
          <p>&copy; 2026 The Quiet Codex. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
