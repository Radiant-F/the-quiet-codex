import { FiBookOpen } from "react-icons/fi";
import {
  DISPLAY,
  TEXT_PRIMARY,
  TEXT_MUTED,
  AURORA_1,
  AURORA_2,
  GLASS,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
} from "../../../lib/theme";

export default function AuthHeader() {
  return (
    <div className="space-y-5">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        style={{
          background: GLASS,
          color: AURORA_2,
          border: `1px solid ${GLASS_BORDER}`,
        }}
      >
        <FiBookOpen size={14} />
        Welcome, writer
      </div>
      <div>
        <h1
          className="text-4xl font-semibold leading-tight md:text-5xl"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          Step into
          <br />
          the{" "}
          <span
            className="italic"
            style={{
              background: GRADIENT_PRIMARY,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            aurora.
          </span>
        </h1>
        <p
          className="mt-3 max-w-sm text-sm leading-relaxed"
          style={{ color: TEXT_MUTED }}
        >
          Sign in to craft your articles, or create a new account to begin your
          journey.
        </p>
      </div>
    </div>
  );
}
