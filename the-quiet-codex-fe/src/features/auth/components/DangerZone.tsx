import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { useDeleteMeMutation } from "../services/auth.api";
import { FOREST, colors } from "../../../lib/theme";

export default function DangerZone() {
  const navigate = useNavigate();
  const [deleteMe, deleteState] = useDeleteMeMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMe().unwrap();
      navigate("/");
    } catch {
      // error logged by onQueryStarted
    }
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: colors.dangerBorder,
        background: colors.dangerBg,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <FiAlertTriangle size={16} style={{ color: colors.danger }} />
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: colors.danger }}
        >
          Danger Zone
        </h3>
      </div>

      <p className="mb-4 text-sm" style={{ color: `${FOREST}70` }}>
        Permanently delete your account and all of your articles. This action is
        irreversible.
      </p>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all"
          style={{ background: colors.danger }}
        >
          <FiTrash2 size={14} />
          Delete Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium" style={{ color: colors.danger }}>
            Are you absolutely sure? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteState.isLoading}
              className="rounded-full px-5 py-2 text-sm font-medium text-white transition-all disabled:opacity-60"
              style={{ background: colors.danger }}
            >
              {deleteState.isLoading ? "Deleting..." : "Yes, delete my account"}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="rounded-full border px-5 py-2 text-sm font-medium transition-all"
              style={{
                borderColor: `${FOREST}20`,
                color: `${FOREST}70`,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
