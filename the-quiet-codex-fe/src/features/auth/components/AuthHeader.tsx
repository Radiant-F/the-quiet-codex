import { FiFeather } from "react-icons/fi";
import { SERIF, FOREST, SAGE, TERRACOTTA } from "../../../lib/theme";

export default function AuthHeader() {
  return (
    <div className="space-y-4">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        style={{
          background: `${SAGE}15`,
          color: SAGE,
          border: `1px solid ${SAGE}30`,
        }}
      >
        <FiFeather size={14} />
        Welcome, writer
      </div>
      <div>
        <h1
          className="text-4xl font-semibold leading-tight md:text-5xl"
          style={{ fontFamily: SERIF, color: FOREST }}
        >
          Return to
          <br />
          your{" "}
          <span className="italic" style={{ color: TERRACOTTA }}>
            garden.
          </span>
        </h1>
        <p
          className="mt-3 max-w-sm text-sm leading-relaxed"
          style={{ color: `${FOREST}80` }}
        >
          Sign in to tend your articles, or plant the first seed with a new
          account.
        </p>
      </div>
    </div>
  );
}
