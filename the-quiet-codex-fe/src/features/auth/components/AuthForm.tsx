import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import type { SignInRequest, SignUpRequest } from "../auth.domain";
import { useSignInMutation, useSignUpMutation } from "../services/auth.api";

type AuthFormValues = SignInRequest | SignUpRequest;

type Mode = "signin" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signIn, signInState] = useSignInMutation();
  const [signUp, signUpState] = useSignUpMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState, reset } = useForm<AuthFormValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });

  const isLoading = signInState.isLoading || signUpState.isLoading;
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/dashboard";

  const onSubmit = async (values: AuthFormValues) => {
    setServerError(null);
    try {
      if (mode === "signin") {
        await signIn(values).unwrap();
      } else {
        await signUp(values).unwrap();
      }
      reset();
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      setServerError(msg ?? "Authentication failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-panel space-y-5 p-7"
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            {mode === "signin"
              ? "Welcome back to your space."
              : "Start your creative journey."}
          </p>
        </div>
        <button
          type="button"
          className="link-underline text-xs font-semibold transition-colors"
          style={{ color: "var(--color-aurora-teal)" }}
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setServerError(null);
          }}
        >
          {mode === "signin" ? "Need an account?" : "Already registered?"}
        </button>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        <span
          className="flex items-center gap-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiUser size={14} />
          Username
        </span>
        <input
          className="input"
          placeholder="quiet-coder"
          {...register("username", { required: "Username is required" })}
        />
        {formState.errors.username ? (
          <span className="text-xs" style={{ color: "var(--color-danger)" }}>
            {formState.errors.username.message}
          </span>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm font-medium">
        <span
          className="flex items-center gap-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiLock size={14} />
          Password
        </span>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          {...register("password", { required: "Password is required" })}
        />
        {formState.errors.password ? (
          <span className="text-xs" style={{ color: "var(--color-danger)" }}>
            {formState.errors.password.message}
          </span>
        ) : null}
      </label>

      <label
        className="flex items-center justify-between text-xs"
        style={{ color: "var(--color-text-dim)" }}
      >
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            style={{ accentColor: "var(--color-aurora-purple)" }}
            {...register("rememberMe")}
          />
          Remember this device
        </span>
        <span className="badge badge-info">
          {mode === "signin" ? "login" : "signup"}
        </span>
      </label>

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

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full py-3.5"
      >
        {isLoading ? "Working..." : "Continue"}
        <FiArrowRight />
      </button>
    </form>
  );
}
