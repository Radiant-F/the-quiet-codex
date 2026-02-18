import { FiBookOpen } from "react-icons/fi";

export default function AuthHeader() {
  return (
    <div className="space-y-5">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        style={{
          background: "var(--color-glass)",
          color: "var(--color-aurora-teal)",
          border: "1px solid var(--color-glass-border)",
        }}
      >
        <FiBookOpen size={14} />
        Welcome, writer
      </div>
      <div>
        <h1
          className="text-4xl font-semibold leading-tight md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Step into
          <br />
          the <span className="gradient-text italic">aurora.</span>
        </h1>
        <p
          className="mt-3 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Sign in to craft your articles, or create a new account to begin your
          journey.
        </p>
      </div>
    </div>
  );
}
