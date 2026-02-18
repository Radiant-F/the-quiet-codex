import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import type { SignInRequest, SignUpRequest } from "../auth.domain";
import { useSignInMutation, useSignUpMutation } from "../services/auth.api";
import {
  DISPLAY,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  AURORA_1,
  AURORA_2,
  AURORA_3,
  GLASS,
  GLASS_BORDER,
  GLASS_HOVER,
  GRADIENT_PRIMARY,
} from "../../../lib/theme";

type AuthFormValues = SignInRequest | SignUpRequest;

type Mode = "signin" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signIn, signInState] = useSignInMutation();
  const [signUp, signUpState] = useSignUpMutation();
  const { register, handleSubmit, formState, reset } = useForm<AuthFormValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });

  const isLoading = signInState.isLoading || signUpState.isLoading;

  const onSubmit = async (values: AuthFormValues) => {
    if (mode === "signin") {
      await signIn(values).unwrap();
    } else {
      await signUp(values).unwrap();
    }
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl p-7"
      style={{
        background: GLASS,
        backdropFilter: "blur(16px)",
        border: `1px solid ${GLASS_BORDER}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-xl font-semibold"
            style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </p>
          <p className="text-xs" style={{ color: TEXT_DIM }}>
            {mode === "signin"
              ? "Welcome back to your space."
              : "Start your creative journey."}
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold transition-colors hover:underline"
          style={{ color: AURORA_2 }}
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account?" : "Already registered?"}
        </button>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        <span className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
          <FiUser size={14} />
          Username
        </span>
        <input
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors placeholder:opacity-40"
          style={{
            borderColor: GLASS_BORDER,
            background: GLASS_HOVER,
            color: TEXT_PRIMARY,
          }}
          placeholder="quiet-coder"
          {...register("username", { required: "Username is required" })}
        />
        {formState.errors.username ? (
          <span className="text-xs" style={{ color: "#FF4D6A" }}>
            {formState.errors.username.message}
          </span>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm font-medium">
        <span className="flex items-center gap-2" style={{ color: TEXT_MUTED }}>
          <FiLock size={14} />
          Password
        </span>
        <input
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors placeholder:opacity-40"
          style={{
            borderColor: GLASS_BORDER,
            background: GLASS_HOVER,
            color: TEXT_PRIMARY,
          }}
          type="password"
          placeholder="••••••••"
          {...register("password", { required: "Password is required" })}
        />
        {formState.errors.password ? (
          <span className="text-xs" style={{ color: "#FF4D6A" }}>
            {formState.errors.password.message}
          </span>
        ) : null}
      </label>

      <label
        className="flex items-center justify-between text-xs"
        style={{ color: TEXT_DIM }}
      >
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            style={{ accentColor: AURORA_1 }}
            {...register("rememberMe")}
          />
          Remember this device
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: GLASS,
            color: AURORA_2,
            border: `1px solid ${GLASS_BORDER}`,
          }}
        >
          {mode === "signin" ? "login" : "signup"}
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: GRADIENT_PRIMARY }}
      >
        {isLoading ? "Working..." : "Continue"}
        <FiArrowRight />
      </button>
    </form>
  );
}
