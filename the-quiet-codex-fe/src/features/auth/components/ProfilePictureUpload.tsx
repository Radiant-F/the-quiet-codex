import { useRef, useState } from "react";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import { SAGE, FOREST, colors } from "../../../lib/theme";
import {
  validateImageFile,
  MAX_PROFILE_PIC_SIZE,
} from "../../../lib/file-validation";
import {
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
} from "../services/auth.api";

interface ProfilePictureUploadProps {
  currentUrl: string | null;
  username: string;
}

export default function ProfilePictureUpload({
  currentUrl,
  username,
}: ProfilePictureUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploadPicture, uploadState] = useUploadProfilePictureMutation();
  const [deletePicture, deleteState] = useDeleteProfilePictureMutation();

  const isLoading = uploadState.isLoading || deleteState.isLoading;

  const handleFile = async (file: File) => {
    setError(null);
    const validation = validateImageFile(file, MAX_PROFILE_PIC_SIZE);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const result = await uploadPicture(file).unwrap();
      setPreview(result.profilePictureUrl);
    } catch {
      setPreview(currentUrl);
      setError("Failed to upload profile picture.");
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deletePicture().unwrap();
      setPreview(null);
    } catch {
      setError("Failed to delete profile picture.");
    }
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: `${FOREST}10`, background: "white" }}
    >
      <h3
        className="mb-4 text-sm font-semibold uppercase tracking-wider"
        style={{ color: `${FOREST}50` }}
      >
        Profile Picture
      </h3>

      <div className="flex items-center gap-6">
        {/* Avatar with hover overlay */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isLoading}
            className="group relative h-24 w-24 overflow-hidden rounded-full"
          >
            {preview ? (
              <img
                src={preview}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white"
                style={{ background: SAGE }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <FiCamera size={20} className="text-white" />
            </div>
          </button>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isLoading}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{ background: `${FOREST}08`, color: FOREST }}
          >
            {isLoading ? "Uploading..." : "Change picture"}
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="ml-2 inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{ background: colors.dangerBg, color: colors.danger }}
            >
              <FiTrash2 size={12} />
              Remove
            </button>
          )}

          <p className="text-xs" style={{ color: `${FOREST}40` }}>
            JPEG, PNG, GIF, WebP, AVIF — max 5 MB
          </p>
        </div>
      </div>

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
          className="mt-3 text-xs font-medium"
          style={{ color: colors.danger }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
