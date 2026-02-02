import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { ArticleEditor } from "@/features/article/components/ArticleEditor";
import {
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useGetArticleByIdQuery,
  useUploadBannerMutation,
  useDeleteBannerMutation,
} from "@/features/article";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdArrowBack,
  MdCloudUpload,
  MdDelete,
  MdSave,
  MdPublish,
} from "react-icons/md";

function WritePageContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!id;

  // Form state
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [body, setBody] = useState("");
  const [slug, setSlug] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // API hooks
  const { data: existingArticle, isLoading: isLoadingArticle } =
    useGetArticleByIdQuery(id!, { skip: !id });
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [uploadBanner, { isLoading: isUploadingBanner }] =
    useUploadBannerMutation();
  const [deleteBanner, { isLoading: isDeletingBanner }] =
    useDeleteBannerMutation();

  // Load existing article data
  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setMetaDescription(existingArticle.metaDescription);
      setBody(existingArticle.body);
      setSlug(existingArticle.slug);
      if (existingArticle.bannerImageUrl) {
        setBannerPreview(existingArticle.bannerImageUrl);
      }
    }
  }, [existingArticle]);

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : mode === "light" ? "system" : "dark");
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (1MB max)
      if (file.size > 1024 * 1024) {
        alert(
          locale === "en"
            ? "Banner image must be less than 1MB"
            : "Gambar banner harus kurang dari 1MB",
        );
        return;
      }

      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = async () => {
    if (isEditing && existingArticle?.bannerImageUrl) {
      await deleteBanner(id!);
    }
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim() || !metaDescription.trim() || !body.trim()) {
      alert(
        locale === "en"
          ? "Please fill in all required fields"
          : "Mohon lengkapi semua field yang wajib diisi",
      );
      return;
    }

    try {
      let articleId = id;

      if (isEditing) {
        // Update existing article
        await updateArticle({
          id: id!,
          data: {
            title,
            metaDescription,
            body,
            slug: slug || undefined,
            publish,
          },
        }).unwrap();
      } else {
        // Create new article
        const result = await createArticle({
          title,
          metaDescription,
          body,
          slug: slug || undefined,
          publish,
        }).unwrap();
        articleId = result.id;
      }

      // Upload banner if selected
      if (bannerFile && articleId) {
        await uploadBanner({ id: articleId, file: bannerFile }).unwrap();
      }

      // Navigate to my articles or the published article
      if (publish) {
        navigate("/my-articles");
      } else {
        navigate("/my-articles");
      }
    } catch (error) {
      console.error("Failed to save article:", error);
      alert(
        locale === "en"
          ? "Failed to save article. Please try again."
          : "Gagal menyimpan artikel. Silakan coba lagi.",
      );
    }
  };

  const isLoading =
    isCreating ||
    isUpdating ||
    isUploadingBanner ||
    isDeletingBanner ||
    isLoadingArticle;

  if (isEditing && isLoadingArticle) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--page-accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="theme-accent">The Quiet</span>{" "}
            <span className="theme-text">Codex</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="theme-muted hover:theme-accent cursor-pointer transition-colors"
              title={t("common", "switchTheme")}
            >
              {resolvedTheme === "dark" ? (
                <MdLightMode className="h-5 w-5" />
              ) : (
                <MdDarkMode className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleLanguage}
              className="theme-muted hover:theme-accent cursor-pointer transition-colors"
              title={t("common", "switchLanguage")}
            >
              <MdLanguage className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/my-articles"
              className="theme-muted flex items-center gap-2 transition-colors hover:text-[var(--page-accent)]"
            >
              <MdArrowBack className="h-5 w-5" />
            </Link>
            <h1 className="theme-text text-2xl font-bold">
              {isEditing
                ? t("article", "editArticle")
                : t("article", "writeArticle")}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="glass flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdSave className="h-5 w-5" />
              <span className="hidden sm:inline">
                {t("article", "saveDraft")}
              </span>
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="glass-button flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MdPublish className="h-5 w-5" />
              <span className="hidden sm:inline">
                {t("article", "publish")}
              </span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Banner Image */}
          <div className="glass rounded-xl p-6">
            <label className="theme-text mb-2 block font-medium">
              {t("article", "banner")}
            </label>
            <p className="theme-muted mb-4 text-sm">
              {t("article", "bannerHint")}
            </p>

            {bannerPreview ? (
              <div className="relative">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <button
                  onClick={handleRemoveBanner}
                  disabled={isDeletingBanner}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  <MdDelete className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-[var(--page-border)] transition-colors hover:border-[var(--page-accent)]"
              >
                <div className="text-center">
                  <MdCloudUpload className="mx-auto h-12 w-12 text-[var(--page-muted)]" />
                  <p className="theme-muted mt-2">
                    {t("article", "uploadBanner")}
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="glass rounded-xl p-6">
            <label className="theme-text mb-2 block font-medium">
              {t("article", "title")} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("article", "titlePlaceholder")}
              className="glass-input w-full rounded-lg px-4 py-3 text-lg"
              maxLength={200}
            />
          </div>

          {/* Meta Description */}
          <div className="glass rounded-xl p-6">
            <label className="theme-text mb-2 block font-medium">
              {t("article", "metaDescription")} *
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder={t("article", "metaDescriptionPlaceholder")}
              className="glass-input w-full resize-none rounded-lg px-4 py-3"
              rows={3}
              maxLength={320}
            />
            <p className="theme-muted mt-2 text-right text-sm">
              {metaDescription.length}/320
            </p>
          </div>

          {/* Slug */}
          <div className="glass rounded-xl p-6">
            <label className="theme-text mb-2 block font-medium">
              {t("article", "slug")}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-"),
                )
              }
              placeholder={t("article", "slugPlaceholder")}
              className="glass-input w-full rounded-lg px-4 py-3"
              maxLength={200}
            />
            <p className="theme-muted mt-2 text-sm">
              {locale === "en"
                ? "Leave empty to auto-generate from title"
                : "Biarkan kosong untuk dibuat otomatis dari judul"}
            </p>
          </div>

          {/* Body */}
          <div className="glass rounded-xl p-6">
            <label className="theme-text mb-4 block font-medium">
              {t("article", "body")} *
            </label>
            <ArticleEditor content={body} onChange={setBody} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WritePage() {
  return (
    <RequireAuth>
      <WritePageContent />
    </RequireAuth>
  );
}
