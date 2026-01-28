import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Locale = "en" | "id";

const messages = {
  en: {
    pages: {
      root: "Welcome",
      auth: "Auth Page",
      home: "Home Page",
    },
    common: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      submit: "Submit",
      loading: "Loading...",
      switchTheme: "Switch Theme",
      switchLanguage: "Switch Language",
    },
  },
  id: {
    pages: {
      root: "Selamat Datang",
      auth: "Halaman Auth",
      home: "Halaman Beranda",
    },
    common: {
      login: "Masuk",
      register: "Daftar",
      email: "Email",
      password: "Kata Sandi",
      submit: "Kirim",
      loading: "Memuat...",
      switchTheme: "Ganti Tema",
      switchLanguage: "Ganti Bahasa",
    },
  },
} as const;

type Messages = typeof messages;
type MessageKeys = Messages["en"];

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <K extends keyof MessageKeys>(
    category: K,
    key: keyof MessageKeys[K],
  ) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "id") {
    return stored;
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = getStoredLocale();
    setLocaleState(storedLocale);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  const t = <K extends keyof MessageKeys>(
    category: K,
    key: keyof MessageKeys[K],
  ): string => {
    const categoryMessages = messages[locale][category];
    return (categoryMessages as Record<string, string>)[key as string] ?? "";
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
