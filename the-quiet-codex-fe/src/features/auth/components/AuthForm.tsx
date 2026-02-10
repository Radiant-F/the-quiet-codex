import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import type { SignInRequest, SignUpRequest } from "../auth.domain";
import { useSignInMutation, useSignUpMutation } from "../services/auth.api";
import { SERIF, FOREST, SAGE, TERRACOTTA, BLUSH } from "../../../lib/theme";

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
      className="space-y-5 rounded-3xl p-7 shadow-lg"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${SAGE}25`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-xl font-semibold"
            style={{ fontFamily: SERIF, color: FOREST }}
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </p>
          <p className="text-xs" style={{ color: `${FOREST}60` }}>
            {mode === "signin"
              ? "Welcome back to your garden."
              : "Plant your first seed today."}
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold transition-colors hover:underline"
          style={{ color: TERRACOTTA }}
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account?" : "Already registered?"}
        </button>
      </div>

      <label className="block space-y-2 text-sm font-medium">
        <span
          className="flex items-center gap-2"
          style={{ color: `${FOREST}80` }}
        >
          <FiUser size={14} />
          Username
        </span>
        <input
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors"
          style={{
            borderColor: `${SAGE}40`,
            background: `${BLUSH}40`,
            color: FOREST,
          }}
          placeholder="quiet-coder"
          {...register("username", { required: "Username is required" })}
        />
        {formState.errors.username ? (
          <span className="text-xs" style={{ color: "#c0392b" }}>
            {formState.errors.username.message}
          </span>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm font-medium">
        <span
          className="flex items-center gap-2"
          style={{ color: `${FOREST}80` }}
        >
          <FiLock size={14} />
          Password
        </span>
        <input
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors"
          style={{
            borderColor: `${SAGE}40`,
            background: `${BLUSH}40`,
            color: FOREST,
          }}
          type="password"
          placeholder="••••••••"
          {...register("password", { required: "Password is required" })}
        />
        {formState.errors.password ? (
          <span className="text-xs" style={{ color: "#c0392b" }}>
            {formState.errors.password.message}
          </span>
        ) : null}
      </label>

      <label
        className="flex items-center justify-between text-xs"
        style={{ color: `${FOREST}70` }}
      >
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            style={{ accentColor: SAGE }}
            {...register("rememberMe")}
          />
          Remember this device
        </span>
        <span
          className="rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: `${SAGE}15`, color: SAGE }}
        >
          {mode === "signin" ? "login" : "signup"}
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: FOREST }}
      >
        {isLoading ? "Working..." : "Continue"}
        <FiArrowRight />
      </button>
    </form>
  );
}
