import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { FOREST, SERIF, colors } from "../../../lib/theme";

interface DeleteArticleDialogProps {
  articleTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function DeleteArticleDialog({
  articleTitle,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteArticleDialogProps) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: colors.dangerBg }}
          >
            <FiAlertTriangle size={20} style={{ color: colors.danger }} />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: SERIF, color: FOREST }}
          >
            Delete Article
          </h3>
        </div>

        <p className="mb-2 text-sm" style={{ color: `${FOREST}80` }}>
          Are you sure you want to delete{" "}
          <strong>&ldquo;{articleTitle}&rdquo;</strong>? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setShow(false);
              onCancel();
            }}
            className="rounded-full border px-5 py-2 text-sm font-medium transition-all"
            style={{ borderColor: `${FOREST}20`, color: `${FOREST}70` }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-all disabled:opacity-60"
            style={{ background: colors.danger }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
