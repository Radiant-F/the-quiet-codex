import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiBookOpen } from "react-icons/fi";
import { AuthForm, AuthHeader } from "../../features/auth";
import {
  DEEP,
  AURORA_1,
  AURORA_2,
  AURORA_3,
  AURORA_4,
  GLASS_BORDER,
  TEXT_PRIMARY,
  DISPLAY,
  SANS,
  GRADIENT_PRIMARY,
} from "../../lib/theme";

export default function Auth() {
  return (
    <div
      className="relative min-h-screen overflow-hidden px-6 py-10"
      style={{ background: DEEP, fontFamily: SANS, color: TEXT_PRIMARY }}
    >
      <Helmet>
        <title>Sign In — The Quiet Codex</title>
        <meta name="theme-color" content={DEEP} />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* Aurora orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40"
          style={{
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${AURORA_1}, ${AURORA_2}, ${AURORA_3}, ${AURORA_4})`,
            filter: "blur(120px)",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute -bottom-40 -left-40"
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `conic-gradient(from 180deg, ${AURORA_3}, ${AURORA_4}, ${AURORA_1}, ${AURORA_2})`,
            filter: "blur(100px)",
            opacity: 0.3,
          }}
        />
      </div>

      {/* Noise */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" />

      {/* nav */}
      <nav className="relative z-10 mx-auto mb-12 flex max-w-4xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: GRADIENT_PRIMARY }}
          >
            <FiBookOpen size={14} style={{ color: "#fff" }} />
          </div>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
          >
            The Quiet Codex
          </span>
        </Link>
      </nav>

      <div className="relative z-10 mx-auto grid w-full max-w-4xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <AuthHeader />
        <AuthForm />
      </div>
    </div>
  );
}
