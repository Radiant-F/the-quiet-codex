import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiFeather } from "react-icons/fi";
import { AuthForm, AuthHeader } from "../../features/auth";
import { BlobSVG } from "../../components";
import { CREAM, SAGE, TERRACOTTA, FOREST, SERIF, SANS } from "../../lib/theme";

export default function Auth() {
  return (
    <div
      className="relative min-h-screen overflow-hidden px-6 py-10"
      style={{ background: CREAM, fontFamily: SANS }}
    >
      <Helmet>
        <title>Sign In — The Quiet Codex</title>
      </Helmet>

      {/* decorative blobs */}
      <BlobSVG
        className="pointer-events-none absolute -top-32 -right-32 w-[500px]"
        color={SAGE}
        opacity={0.1}
        style={{ animation: "float 8s ease-in-out infinite" }}
      />
      <BlobSVG
        className="pointer-events-none absolute -bottom-40 -left-40 w-[600px]"
        color={TERRACOTTA}
        opacity={0.06}
        style={{ animation: "float-slow 10s ease-in-out infinite" }}
      />

      {/* top bar */}
      <nav className="relative z-10 mx-auto mb-12 flex max-w-4xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ background: SAGE }}
          >
            <FiFeather size={16} />
          </div>
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: SERIF, color: FOREST }}
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
