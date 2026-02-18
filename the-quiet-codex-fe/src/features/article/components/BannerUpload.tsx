import { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiImage } from "react-icons/fi";
import {
  validateImageFile,
  MAX_BANNER_SIZE,
} from "../../../lib/file-validation";

interface BannerUploadProps {
  currentBannerUrl: string | null;
  onFileChange: (file: File | null) => void;
  onRemoveChange: (remove: boolean) => void;
  disabled?: boolean;
}

export default function BannerUpload({
  currentBannerUrl,
  onFileChange,
  onRemoveChange,
  disabled = false,
}: BannerUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentBannerUrl);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    setError(null);
    const validation = validateImageFile(file, MAX_BANNER_SIZE);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileChange(file);
    onRemoveChange(false);
  };

  const handleDelete = () => {
    setError(null);
    setPreview(null);
    onFileChange(null);
    onRemoveChange(true);
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
  const isLoading = disabled;

  return (
    <div className="space-y-3">
      <label
        className="text-sm font-medium"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-sans)",
        }}
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
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
              }}
            >
              <FiUploadCloud className="inline mr-1" size={14} />
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
              style={{ background: "var(--color-danger)" }}
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
            borderColor: isDragging
              ? "var(--color-aurora-teal)"
              : "var(--color-glass-border)",
            background: isDragging
              ? "rgba(0,212,170,0.05)"
              : "var(--color-glass)",
          }}
        >
          <FiImage size={32} style={{ color: "var(--color-text-dim)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Drag & drop or{" "}
            <span
              className="font-medium"
              style={{ color: "var(--color-aurora-teal)" }}
            >
              click to upload
            </span>
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
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
        <p
          className="text-xs font-medium"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
