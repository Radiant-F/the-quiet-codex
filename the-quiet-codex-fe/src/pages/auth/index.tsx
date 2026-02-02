import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdArrowBack,
  MdPerson,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useState, useEffect } from "react";
import {
  useSigninMutation,
  useSignupMutation,
  setCredentials,
} from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/hooks";

type AuthFormValues = {
  username: string;
  password: string;
};

export default function AuthPage() {
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth,
  );

  const [signin, { isLoading: signinLoading }] = useSigninMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();

  const isSubmitting = signinLoading || signupLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, authLoading, navigate]);

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

  const onSubmit = async (values: AuthFormValues) => {
    setErrorMessage(null);
    try {
      if (isLogin) {
        const result = await signin(values).unwrap();
        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            user: result.user,
          }),
        );
        navigate("/home");
      } else {
        const result = await signup(values).unwrap();
        dispatch(
          setCredentials({
            accessToken: result.accessToken,
            user: result.user,
          }),
        );
        navigate("/home");
      }
    } catch (error: unknown) {
      const err = error as { status?: number; data?: { message?: string } };
      if (err.status === 401) {
        setErrorMessage(t("auth", "invalidCredentials"));
      } else if (err.status === 409) {
        setErrorMessage(t("auth", "usernameExists"));
      } else if (err.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage(t("auth", "error"));
      }
    }
  };

  const handleTabSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setErrorMessage(null);
    reset();
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <main className="min-h-screen auth-gradient flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[var(--page-accent)] border-t-transparent rounded-full animate-spin" />
            <span>{t("common", "loading")}</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen auth-gradient flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="glass-nav">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <MdArrowBack size={22} />
            <span className="text-xl font-bold theme-accent">
              The Quiet Codex
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass hover:opacity-80 transition-all"
              title={t("common", "switchTheme")}
            >
              {resolvedTheme === "dark" ? (
                <MdLightMode size={20} />
              ) : (
                <MdDarkMode size={20} />
              )}
            </button>
            <button
              onClick={toggleLocale}
              className="p-2.5 rounded-xl glass hover:opacity-80 transition-all flex items-center gap-1.5"
              title={t("common", "switchLanguage")}
            >
              <MdLanguage size={20} />
              <span className="text-sm font-medium uppercase">{locale}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? t("auth", "welcome") : t("auth", "createAccount")}
              </h1>
              <p className="theme-muted text-sm">
                {isLogin
                  ? t("auth", "signinSubtitle")
                  : t("auth", "signupSubtitle")}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex mb-8 glass-elevated rounded-xl p-1.5">
              <button
                onClick={() => handleTabSwitch(true)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  isLogin ? "glass-button text-white" : "hover:bg-white/5"
                }`}
              >
                {t("common", "login")}
              </button>
              <button
                onClick={() => handleTabSwitch(false)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  !isLogin ? "glass-button text-white" : "hover:bg-white/5"
                }`}
              >
                {t("common", "register")}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("common", "username")}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted">
                    <MdPerson size={20} />
                  </div>
                  <input
                    type="text"
                    {...register("username", {
                      required: t("auth", "usernameRequired"),
                      minLength: {
                        value: 3,
                        message: t("auth", "usernameMinLength"),
                      },
                    })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-input"
                    placeholder="johndoe"
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <span className="text-red-400 text-sm mt-2 block">
                    {errors.username.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("common", "password")}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted">
                    <MdLock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: t("auth", "passwordRequired"),
                      minLength: {
                        value: 8,
                        message: t("auth", "passwordMinLength"),
                      },
                    })}
                    className="w-full pl-12 pr-12 py-3 rounded-xl glass-input"
                    placeholder="••••••••"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 theme-muted hover:text-[var(--page-text)] transition-colors"
                  >
                    {showPassword ? (
                      <MdVisibilityOff size={20} />
                    ) : (
                      <MdVisibility size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm mt-2 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl glass-button text-white font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("common", "loading")}
                  </>
                ) : isLogin ? (
                  t("common", "login")
                ) : (
                  t("common", "register")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
