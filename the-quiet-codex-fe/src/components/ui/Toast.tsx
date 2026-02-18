import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { FiCheck, FiX, FiAlertCircle, FiInfo } from "react-icons/fi";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const icons: Record<ToastType, ReactNode> = {
    success: (
      <FiCheck
        size={18}
        style={{ color: "var(--color-aurora-teal)", flexShrink: 0 }}
      />
    ),
    error: (
      <FiAlertCircle
        size={18}
        style={{ color: "var(--color-danger)", flexShrink: 0 }}
      />
    ),
    info: (
      <FiInfo
        size={18}
        style={{ color: "var(--color-aurora-blue)", flexShrink: 0 }}
      />
    ),
  };

  const progressColors: Record<ToastType, string> = {
    success: "var(--color-aurora-teal)",
    error: "var(--color-danger)",
    info: "var(--color-aurora-blue)",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {icons[t.type]}
            <p
              className="flex-1 text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-white/10"
              aria-label="Dismiss"
            >
              <FiX size={14} style={{ color: "var(--color-text-dim)" }} />
            </button>
            {t.duration && t.duration > 0 && (
              <div
                className="toast-progress"
                style={{
                  background: progressColors[t.type],
                  animation: `progress-bar ${t.duration}ms linear forwards`,
                  width: "100%",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
