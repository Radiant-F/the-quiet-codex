import {
  createContext,
  useContext,
  useState,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Locale = "en" | "id";

const messages = {
  en: {
    pages: {
      root: "Welcome",
      auth: "Authentication",
      home: "Home",
      articles: "Articles",
      article: "Article",
      write: "Write Article",
      myArticles: "My Articles",
    },
    common: {
      login: "Sign In",
      register: "Sign Up",
      logout: "Logout",
      username: "Username",
      password: "Password",
      submit: "Submit",
      loading: "Loading...",
      switchTheme: "Switch Theme",
      switchLanguage: "Switch Language",
      getStarted: "Get Started",
      backToHome: "Back to Home",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      confirm: "Confirm",
      search: "Search",
      by: "by",
    },
    auth: {
      welcome: "Welcome Back",
      createAccount: "Create Account",
      signinSubtitle: "Sign in to continue to The Quiet Codex",
      signupSubtitle: "Create your account to get started",
      usernameRequired: "Username is required",
      usernameMinLength: "Username must be at least 3 characters",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 8 characters",
      signinSuccess: "Signed in successfully",
      signupSuccess: "Account created successfully",
      invalidCredentials: "Invalid username or password",
      usernameExists: "Username already exists",
      error: "An error occurred. Please try again.",
    },
    home: {
      welcome: "Welcome",
      dashboard: "Dashboard",
      writeNew: "Write New Article",
      manageArticles: "Manage Your Articles",
      viewAll: "View All",
      drafts: "Drafts",
      published: "Published",
      totalArticles: "Total Articles",
      recentArticles: "Recent Articles",
      noArticlesYet: "You haven't written any articles yet",
      startWriting: "Start Writing",
    },
    landing: {
      heroTitle: "Where Stories Find Their Voice",
      heroSubtitle:
        "The Quiet Codex is a community-driven publishing platform where anyone can share their ideas, stories, and knowledge with the world.",
      latestArticles: "Latest Articles",
      readMore: "Read More",
      joinCommunity: "Join Our Community",
      startReading: "Start Reading",
      startWriting: "Start Writing",
      feature1Title: "Share Your Voice",
      feature1Desc:
        "Write and publish articles on topics you're passionate about",
      feature2Title: "Build Your Audience",
      feature2Desc: "Connect with readers who share your interests",
      feature3Title: "Grow Together",
      feature3Desc: "Join a community of writers and thinkers",
      noArticlesYet: "No articles published yet. Be the first to write!",
    },
    article: {
      articles: "Articles",
      article: "Article",
      readMore: "Read More",
      writeArticle: "Write Article",
      editArticle: "Edit Article",
      myArticles: "My Articles",
      allArticles: "All Articles",
      latestArticles: "Latest Articles",
      publishedOn: "Published on",
      updatedOn: "Updated on",
      by: "by",
      publish: "Publish",
      saveDraft: "Save as Draft",
      unpublish: "Unpublish",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this article?",
      title: "Title",
      titlePlaceholder: "Enter article title...",
      metaDescription: "Meta Description",
      metaDescriptionPlaceholder:
        "Brief description for SEO (max 320 chars)...",
      slug: "URL Slug",
      slugPlaceholder: "custom-url-slug (optional)",
      body: "Content",
      bodyPlaceholder: "Start writing your article...",
      banner: "Banner Image",
      uploadBanner: "Upload Banner",
      removeBanner: "Remove Banner",
      bannerHint: "Recommended: 1200x630px, max 1MB",
      noArticles: "No articles found",
      noArticlesDesc: "There are no articles to display at the moment.",
      noDrafts: "No drafts",
      noPublished: "No published articles",
      createFirst: "Create your first article",
      draft: "Draft",
      loading: "Loading article...",
      notFound: "Article not found",
      notFoundDesc:
        "The article you're looking for doesn't exist or has been removed.",
      shareArticle: "Share this article",
      backToArticles: "Back to Articles",
      minRead: "min read",
      views: "views",
    },
  },
  id: {
    pages: {
      root: "Selamat Datang",
      auth: "Autentikasi",
      home: "Beranda",
      articles: "Artikel",
      article: "Artikel",
      write: "Tulis Artikel",
      myArticles: "Artikel Saya",
    },
    common: {
      login: "Masuk",
      register: "Daftar",
      logout: "Keluar",
      username: "Nama Pengguna",
      password: "Kata Sandi",
      submit: "Kirim",
      loading: "Memuat...",
      switchTheme: "Ganti Tema",
      switchLanguage: "Ganti Bahasa",
      getStarted: "Mulai",
      backToHome: "Kembali ke Beranda",
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Ubah",
      confirm: "Konfirmasi",
      search: "Cari",
      by: "oleh",
    },
    auth: {
      welcome: "Selamat Datang Kembali",
      createAccount: "Buat Akun",
      signinSubtitle: "Masuk untuk melanjutkan ke The Quiet Codex",
      signupSubtitle: "Buat akun Anda untuk memulai",
      usernameRequired: "Nama pengguna wajib diisi",
      usernameMinLength: "Nama pengguna minimal 3 karakter",
      passwordRequired: "Kata sandi wajib diisi",
      passwordMinLength: "Kata sandi minimal 8 karakter",
      signinSuccess: "Berhasil masuk",
      signupSuccess: "Akun berhasil dibuat",
      invalidCredentials: "Nama pengguna atau kata sandi salah",
      usernameExists: "Nama pengguna sudah digunakan",
      error: "Terjadi kesalahan. Silakan coba lagi.",
    },
    home: {
      welcome: "Selamat Datang",
      dashboard: "Dasbor",
      writeNew: "Tulis Artikel Baru",
      manageArticles: "Kelola Artikel Anda",
      viewAll: "Lihat Semua",
      drafts: "Draf",
      published: "Dipublikasikan",
      totalArticles: "Total Artikel",
      recentArticles: "Artikel Terbaru",
      noArticlesYet: "Anda belum menulis artikel apapun",
      startWriting: "Mulai Menulis",
    },
    landing: {
      heroTitle: "Tempat Cerita Menemukan Suaranya",
      heroSubtitle:
        "The Quiet Codex adalah platform penerbitan berbasis komunitas di mana siapa saja dapat berbagi ide, cerita, dan pengetahuan mereka dengan dunia.",
      latestArticles: "Artikel Terbaru",
      readMore: "Baca Selengkapnya",
      joinCommunity: "Bergabung dengan Komunitas Kami",
      startReading: "Mulai Membaca",
      startWriting: "Mulai Menulis",
      feature1Title: "Bagikan Suara Anda",
      feature1Desc:
        "Tulis dan publikasikan artikel tentang topik yang Anda sukai",
      feature2Title: "Bangun Audiens Anda",
      feature2Desc: "Terhubung dengan pembaca yang memiliki minat yang sama",
      feature3Title: "Berkembang Bersama",
      feature3Desc: "Bergabunglah dengan komunitas penulis dan pemikir",
      noArticlesYet:
        "Belum ada artikel yang dipublikasikan. Jadilah yang pertama menulis!",
    },
    article: {
      articles: "Artikel",
      article: "Artikel",
      readMore: "Baca Selengkapnya",
      writeArticle: "Tulis Artikel",
      editArticle: "Edit Artikel",
      myArticles: "Artikel Saya",
      allArticles: "Semua Artikel",
      latestArticles: "Artikel Terbaru",
      publishedOn: "Dipublikasikan pada",
      updatedOn: "Diperbarui pada",
      by: "oleh",
      publish: "Publikasikan",
      saveDraft: "Simpan sebagai Draf",
      unpublish: "Batalkan Publikasi",
      delete: "Hapus",
      deleteConfirm: "Apakah Anda yakin ingin menghapus artikel ini?",
      title: "Judul",
      titlePlaceholder: "Masukkan judul artikel...",
      metaDescription: "Deskripsi Meta",
      metaDescriptionPlaceholder:
        "Deskripsi singkat untuk SEO (maks 320 karakter)...",
      slug: "Slug URL",
      slugPlaceholder: "custom-url-slug (opsional)",
      body: "Konten",
      bodyPlaceholder: "Mulai menulis artikel Anda...",
      banner: "Gambar Banner",
      uploadBanner: "Unggah Banner",
      removeBanner: "Hapus Banner",
      bannerHint: "Disarankan: 1200x630px, maks 1MB",
      noArticles: "Tidak ada artikel ditemukan",
      noArticlesDesc: "Tidak ada artikel untuk ditampilkan saat ini.",
      noDrafts: "Tidak ada draf",
      noPublished: "Tidak ada artikel yang dipublikasikan",
      createFirst: "Buat artikel pertama Anda",
      draft: "Draf",
      loading: "Memuat artikel...",
      notFound: "Artikel tidak ditemukan",
      notFoundDesc: "Artikel yang Anda cari tidak ada atau telah dihapus.",
      shareArticle: "Bagikan artikel ini",
      backToArticles: "Kembali ke Artikel",
      minRead: "menit baca",
      views: "dilihat",
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

// Hook to safely detect if we're on the client after hydration
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const isHydrated = useHydrated();
  const [locale, setLocaleState] = useState<Locale>("en");

  // Only read from localStorage after hydration
  useEffect(() => {
    if (isHydrated) {
      const storedLocale = getStoredLocale();
      setLocaleState(storedLocale);
    }
  }, [isHydrated]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
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
