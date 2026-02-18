import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { useRefreshMutation } from "../../features/auth";
import { useEffect, useState, type ReactNode } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  const [refresh] = useRefreshMutation();
  const [checking, setChecking] = useState(!accessToken);

  useEffect(() => {
    if (!accessToken) {
      refresh()
        .unwrap()
        .catch(() => {})
        .finally(() => setChecking(false));
    }
  }, [accessToken, refresh]);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: "var(--color-aurora-purple)",
              borderTopColor: "transparent",
            }}
          />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  if (!user.id) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
