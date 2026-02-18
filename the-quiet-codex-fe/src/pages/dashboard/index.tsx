import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { FiEdit3, FiBookOpen, FiPlus, FiUser } from "react-icons/fi";
import { useAppSelector } from "../../hooks";
import { useListMyArticlesQuery } from "../../features/article/services/article.api";
import { useMeQuery } from "../../features/auth/services/auth.api";

export default function DashboardOverview() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: articles } = useListMyArticlesQuery({ page: 1, limit: 1 });
  const { data: profile } = useMeQuery();

  const totalArticles = articles?.total ?? 0;
  const publishedCount =
    articles?.articles.filter((a) => a.publishedAt !== null).length ?? 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <Helmet>
        <title>Dashboard — The Quiet Codex</title>
      </Helmet>

      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {greeting()}, <span className="gradient-text">{user.username}</span>
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Here's what's happening with your writing.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <StatCard
            icon={FiEdit3}
            label="Total Articles"
            value={totalArticles}
            color="var(--color-aurora-purple)"
            bg="rgba(123, 97, 255, 0.08)"
          />
          <StatCard
            icon={FiBookOpen}
            label="Published"
            value={publishedCount}
            color="var(--color-aurora-teal)"
            bg="rgba(0, 212, 170, 0.08)"
          />
          <StatCard
            icon={FiUser}
            label="Member Since"
            value={
              profile
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
            color="var(--color-aurora-pink)"
            bg="rgba(255, 107, 202, 0.08)"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Link
            to="/dashboard/articles/new"
            className="glass-panel group flex items-center gap-4 p-6 transition-all hover:border-[var(--color-glass-border-hover)] hover:bg-[var(--color-glass-hover)]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
              }}
            >
              <FiPlus size={22} className="text-white" />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Write New Article
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Start crafting your next piece.
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard/articles"
            className="glass-panel group flex items-center gap-4 p-6 transition-all hover:border-[var(--color-glass-border-hover)] hover:bg-[var(--color-glass-hover)]"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
              style={{ background: "rgba(0, 212, 170, 0.1)" }}
            >
              <FiEdit3
                size={22}
                style={{ color: "var(--color-aurora-teal)" }}
              />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Manage Articles
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Edit, publish, or delete your writing.
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: bg }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--color-text-dim)" }}
          >
            {label}
          </p>
          <p
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
