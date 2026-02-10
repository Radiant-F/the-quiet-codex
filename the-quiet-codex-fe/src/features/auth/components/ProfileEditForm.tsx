import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiSave, FiUser, FiLock } from "react-icons/fi";
import type { UpdateMeRequest } from "../auth.domain";
import { useUpdateMeMutation } from "../services/auth.api";
import { FOREST, SAGE, CREAM, colors } from "../../../lib/theme";

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
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: `${FOREST}10`, background: "white" }}
    >
      <h3
        className="mb-6 text-sm font-semibold uppercase tracking-wider"
        style={{ color: `${FOREST}50` }}
      >
        Edit Profile
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: `${FOREST}80` }}
          >
            <FiUser size={14} />
            Username
          </label>
          <input
            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#87A878]"
            style={{
              borderColor: `${FOREST}15`,
              background: CREAM,
              color: FOREST,
            }}
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
          />
          {formState.errors.username && (
            <p className="text-xs" style={{ color: colors.danger }}>
              {formState.errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: `${FOREST}80` }}
          >
            <FiLock size={14} />
            New Password
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#87A878]"
            style={{
              borderColor: `${FOREST}15`,
              background: CREAM,
              color: FOREST,
            }}
            {...register("password", {
              minLength: {
                value: 6,
                message: "At least 6 characters",
              },
            })}
          />
          {formState.errors.password && (
            <p className="text-xs" style={{ color: colors.danger }}>
              {formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        {passwordValue && (
          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: `${FOREST}80` }}
            >
              <FiLock size={14} />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#87A878]"
              style={{
                borderColor: `${FOREST}15`,
                background: CREAM,
                color: FOREST,
              }}
              {...register("confirmPassword", {
                validate: (val) =>
                  val === passwordValue || "Passwords do not match",
              })}
            />
            {formState.errors.confirmPassword && (
              <p className="text-xs" style={{ color: colors.danger }}>
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
              background: colors.dangerBg,
              color: colors.danger,
              border: `1px solid ${colors.dangerBorder}`,
            }}
          >
            {serverError}
          </div>
        )}
        {success && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: `${SAGE}10`,
              color: SAGE,
              border: `1px solid ${SAGE}30`,
            }}
          >
            Profile updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={updateState.isLoading}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-60"
          style={{ background: FOREST }}
        >
          <FiSave size={14} />
          {updateState.isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
