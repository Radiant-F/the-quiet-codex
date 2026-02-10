import { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiImage } from "react-icons/fi";
import { SAGE, TERRACOTTA, FOREST, CREAM, colors } from "../../../lib/theme";
import {
  validateImageFile,
  MAX_BANNER_SIZE,
} from "../../../lib/file-validation";
import {
  useUploadBannerMutation,
  useDeleteBannerMutation,
} from "../services/article.api";

interface BannerUploadProps {
  articleId: string;
  currentBannerUrl: string | null;
}

export default function BannerUpload({
  articleId,
  currentBannerUrl,
}: BannerUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentBannerUrl);
  const [uploadBanner, uploadState] = useUploadBannerMutation();
  const [deleteBanner, deleteState] = useDeleteBannerMutation();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    const validation = validateImageFile(file, MAX_BANNER_SIZE);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const result = await uploadBanner({ id: articleId, file }).unwrap();
      setPreview(result.bannerImageUrl);
    } catch {
      setPreview(currentBannerUrl);
      setError("Failed to upload banner image.");
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteBanner(articleId).unwrap();
      setPreview(null);
    } catch {
      setError("Failed to delete banner image.");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const isLoading = uploadState.isLoading || deleteState.isLoading;

  return (
    <div className="space-y-3">
      <label
        className="text-sm font-medium"
        style={{ color: FOREST, fontFamily: "'DM Sans', sans-serif" }}
      >
        Banner Image
      </label>

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={preview}
            alt="Banner preview"
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/30 opacity-0 transition-opacity hover:opacity-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isLoading}
              className="rounded-full px-4 py-2 text-sm font-medium text-white transition-all"
              style={{ background: SAGE }}
            >
              <FiUploadCloud className="inline mr-1" size={14} />
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded-full px-4 py-2 text-sm font-medium text-white transition-all"
              style={{ background: colors.danger }}
            >
              <FiTrash2 className="inline mr-1" size={14} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12 transition-all"
          style={{
            borderColor: isDragging ? SAGE : `${FOREST}20`,
            background: isDragging ? `${SAGE}08` : CREAM,
          }}
        >
          <FiImage size={32} style={{ color: `${FOREST}30` }} />
          <p className="text-sm" style={{ color: `${FOREST}60` }}>
            Drag & drop or{" "}
            <span className="font-medium" style={{ color: TERRACOTTA }}>
              click to upload
            </span>
          </p>
          <p className="text-xs" style={{ color: `${FOREST}40` }}>
            JPEG, PNG, GIF, WebP, AVIF — max 1 MB
          </p>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-xs font-medium" style={{ color: colors.danger }}>
          {error}
        </p>
      )}
    </div>
  );
}
