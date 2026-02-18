import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiSave, FiUser, FiLock } from "react-icons/fi";
import type { UpdateMeRequest } from "../auth.domain";
import { useUpdateMeMutation } from "../services/auth.api";

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

interface ProfileEditFormProps {
  currentUsername: string;
}

export default function ProfileEditForm({
  currentUsername,
}: ProfileEditFormProps) {
  const [updateMe, updateState] = useUpdateMeMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState, watch, reset } =
    useForm<FormValues>({
      defaultValues: {
        username: currentUsername,
        password: "",
        confirmPassword: "",
      },
    });

  const passwordValue = watch("password");

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setSuccess(false);
    const payload: UpdateMeRequest = {};
    if (values.username && values.username !== currentUsername) {
      payload.username = values.username;
    }
    if (values.password) {
      payload.password = values.password;
    }
    if (Object.keys(payload).length === 0) return;

    try {
      await updateMe(payload).unwrap();
      setSuccess(true);
      reset({ username: values.username, password: "", confirmPassword: "" });
    } catch (err) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      setServerError(msg ?? "Failed to update profile.");
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3
        className="mb-6 text-sm font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-text-dim)" }}
      >
        Edit Profile
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiUser size={14} />
            Username
          </label>
          <input
            className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
          />
          {formState.errors.username && (
            <p className="text-xs" style={{ color: "var(--color-danger)" }}>
              {formState.errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            <FiLock size={14} />
            New Password
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            {...register("password", {
              minLength: {
                value: 6,
                message: "At least 6 characters",
              },
            })}
          />
          {formState.errors.password && (
            <p className="text-xs" style={{ color: "var(--color-danger)" }}>
              {formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        {passwordValue && (
          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              <FiLock size={14} />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              {...register("confirmPassword", {
                validate: (val) =>
                  val === passwordValue || "Passwords do not match",
              })}
            />
            {formState.errors.confirmPassword && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {/* Feedback */}
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
        {success && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(0,212,170,0.08)",
              color: "var(--color-aurora-teal)",
              border: "1px solid rgba(0,212,170,0.2)",
            }}
          >
            Profile updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={updateState.isLoading}
          className="btn btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-60"
        >
          <FiSave size={14} />
          {updateState.isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
