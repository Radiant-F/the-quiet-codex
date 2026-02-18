import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiSave, FiSend, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Article } from "../article.domain";
import {
  useCreateArticleMutation,
  useUpdateArticleMutation,
} from "../services/article.api";
import ArticleEditor from "./ArticleEditor";
import BannerUpload from "./BannerUpload";
import { slugify } from "../../../lib/file-validation";

interface ArticleFormProps {
  mode: "create" | "edit";
  initialData?: Article;
}

interface FormValues {
  title: string;
  slug: string;
  metaDescription: string;
  body: string;
  publish: boolean;
}

export default function ArticleForm({ mode, initialData }: ArticleFormProps) {
  const navigate = useNavigate();
  const [createArticle, createState] = useCreateArticleMutation();
  const [updateArticle, updateState] = useUpdateArticleMutation();
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [serverError, setServerError] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [removeBanner, setRemoveBanner] = useState(false);

  const { register, handleSubmit, control, watch, setValue, formState } =
    useForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        slug: initialData?.slug ?? "",
        metaDescription: initialData?.metaDescription ?? "",
        body: initialData?.body ?? "",
        publish:
          initialData?.publishedAt !== null &&
          initialData?.publishedAt !== undefined,
      },
    });

  const titleValue = watch("title");
  const metaDescValue = watch("metaDescription");
  const isLoading = createState.isLoading || updateState.isLoading;

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && titleValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, autoSlug, setValue]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      if (mode === "create") {
        const payload = {
          title: values.title,
          body: values.body,
          publish: values.publish,
          ...(bannerFile && { banner: bannerFile }),
          ...(values.slug && { slug: values.slug }),
          ...(values.metaDescription && {
            metaDescription: values.metaDescription,
          }),
        };
        const result = await createArticle(payload).unwrap();
        navigate(`/dashboard/articles/${result.id}`);
      } else if (initialData) {
        await updateArticle({
          id: initialData.id,
          data: {
            title: values.title,
            body: values.body,
            slug: values.slug,
            metaDescription: values.metaDescription,
            publish: values.publish,
            ...(bannerFile && { banner: bannerFile }),
            removeBanner,
          },
        }).unwrap();
      }
    } catch (err) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      setServerError(msg ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
        style={{
          color: "var(--color-text-dim)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <FiArrowLeft size={14} />
        Back to articles
      </button>

      <BannerUpload
        currentBannerUrl={initialData?.bannerImageUrl ?? null}
        onFileChange={setBannerFile}
        onRemoveChange={setRemoveBanner}
        disabled={isLoading}
      />

      {/* Title */}
      <div className="space-y-2">
        <input
          placeholder="Article title"
          className="w-full border-none bg-transparent text-4xl font-semibold outline-none placeholder:opacity-30"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
          {...register("title", { required: "Title is required" })}
        />
        {formState.errors.title && (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            {formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          Slug
          {mode === "create" && (
            <button
              type="button"
              onClick={() => setAutoSlug(!autoSlug)}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                background: autoSlug
                  ? "rgba(0,212,170,0.1)"
                  : "var(--color-glass)",
                color: autoSlug
                  ? "var(--color-aurora-teal)"
                  : "var(--color-text-dim)",
              }}
            >
              {autoSlug ? "Auto" : "Manual"}
            </button>
          )}
        </label>
        <input
          placeholder="my-article-slug"
          className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors"
          style={{
            borderColor: "var(--color-glass-border)",
            background: "var(--color-glass-hover)",
            color: "var(--color-text-primary)",
          }}
          {...register("slug")}
          onChange={(e) => {
            setAutoSlug(false);
            register("slug").onChange(e);
          }}
        />
      </div>

      {/* Meta description */}
      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          Meta Description
        </label>
        <textarea
          placeholder="A brief summary for search engines and social previews..."
          rows={2}
          className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors"
          style={{
            borderColor: "var(--color-glass-border)",
            background: "var(--color-glass-hover)",
            color: "var(--color-text-primary)",
          }}
          {...register("metaDescription")}
        />
        <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
          {metaDescValue?.length ?? 0}/160 characters
        </p>
      </div>

      {/* Body editor */}
      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          Content
        </label>
        <Controller
          name="body"
          control={control}
          rules={{ required: "Article content is required" }}
          render={({ field }) => (
            <ArticleEditor content={field.value} onChange={field.onChange} />
          )}
        />
        {formState.errors.body && (
          <p className="text-xs" style={{ color: "var(--color-danger)" }}>
            {formState.errors.body.message}
          </p>
        )}
      </div>

      {/* Publish toggle */}
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{
          borderColor: "var(--color-glass-border)",
          background: "var(--color-glass)",
        }}
      >
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            {...register("publish")}
          />
          <div
            className="h-6 w-11 rounded-full border peer-checked:border-transparent transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"
            style={{
              borderColor: "var(--color-glass-border)",
              background: "var(--color-glass-hover)",
            }}
          />
          <style>{`
            .peer:checked ~ div { background: var(--color-aurora-purple) !important; }
          `}</style>
        </label>
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Publish article
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Published articles are visible to everyone. Unpublished articles are
            saved as drafts.
          </p>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: "var(--color-danger-bg)",
            color: "var(--color-danger)",
            border: "1px solid var(--color-danger-border)",
          }}
        >
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          onClick={() => setValue("publish", true)}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
          style={{
            background:
              "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
          }}
        >
          <FiSend size={14} />
          {mode === "create" ? "Publish" : "Update & Publish"}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          onClick={() => setValue("publish", false)}
          className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-all"
          style={{
            borderColor: "var(--color-glass-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <FiSave size={14} />
          Save as Draft
        </button>
      </div>
    </form>
  );
}
