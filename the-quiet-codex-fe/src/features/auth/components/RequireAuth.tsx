import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "@/hooks";
import { useI18n } from "@/i18n";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { t } = useI18n();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen theme-page flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[var(--page-accent)] border-t-transparent rounded-full animate-spin" />
            <span>{t("common", "loading")}</span>
          </div>
        </div>
      </main>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
