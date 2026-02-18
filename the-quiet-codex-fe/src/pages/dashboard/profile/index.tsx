import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { useMeQuery } from "../../../features/auth/services/auth.api";
import ProfileCard from "../../../features/auth/components/ProfileCard";
import ProfilePictureUpload from "../../../features/auth/components/ProfilePictureUpload";
import ProfileEditForm from "../../../features/auth/components/ProfileEditForm";
import DangerZone from "../../../features/auth/components/DangerZone";

export default function DashboardProfilePage() {
  const { data: profile, isLoading } = useMeQuery();

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="skeleton h-32 w-full rounded-2xl" />
        <div className="skeleton h-40 w-full rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile — The Quiet Codex</title>
      </Helmet>

      <div className="mx-auto max-w-2xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="mb-6 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Profile Settings
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ProfileCard profile={profile} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ProfilePictureUpload
            currentUrl={profile.profilePictureUrl}
            username={profile.username}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ProfileEditForm currentUsername={profile.username} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <DangerZone />
        </motion.div>
      </div>
    </>
  );
}
