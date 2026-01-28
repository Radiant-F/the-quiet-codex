import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { FiSun, FiMoon, FiGlobe, FiArrowLeft } from "react-icons/fi";
import { useState } from "react";

type AuthFormValues = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onSubmit = (values: AuthFormValues) => {
    console.log("Auth form submitted:", values);
    // TODO: Integrate with auth API
  };

  return (
    <main className="min-h-screen theme-page flex flex-col">
      {/* Navigation */}
      <nav className="theme-surface border-b theme-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <FiArrowLeft size={20} />
            <span className="text-xl font-bold theme-accent">
              The Quiet Codex
            </span>
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
          </div>
        </div>
      </nav>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="theme-surface rounded-xl p-8 border theme-border">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {t("pages", "auth")}
            </h1>

            {/* Tab Switcher */}
            <div className="flex mb-6 theme-elevated rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  isLogin ? "bg-[var(--page-accent)] text-white" : ""
                }`}
              >
                {t("common", "login")}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  !isLogin ? "bg-[var(--page-accent)] text-white" : ""
                }`}
              >
                {t("common", "register")}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("common", "email")}
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full px-4 py-2 rounded-lg theme-elevated border theme-border focus:outline-none focus:ring-2 focus:ring-[var(--page-accent)]"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("common", "password")}
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="w-full px-4 py-2 rounded-lg theme-elevated border theme-border focus:outline-none focus:ring-2 focus:ring-[var(--page-accent)]"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[var(--page-accent)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? t("common", "loading") : t("common", "submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
