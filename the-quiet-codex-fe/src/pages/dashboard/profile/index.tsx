import { Helmet } from "react-helmet-async";
import DashboardHeader from "../../../components/DashboardHeader";
import {
  ProfileCard,
  ProfilePictureUpload,
  ProfileEditForm,
  DangerZone,
} from "../../../features/auth";
import { useMeQuery } from "../../../features/auth/services/auth.api";
import { FiLoader } from "react-icons/fi";
import {
  AURORA_2,
  TEXT_PRIMARY,
  TEXT_MUTED,
  DISPLAY,
} from "../../../lib/theme";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useMeQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <FiLoader
          size={32}
          className="animate-spin"
          style={{ color: AURORA_2 }}
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="py-32 text-center">
        <h2
          className="mb-2 text-2xl font-semibold"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          Could not load profile
        </h2>
        <p className="text-sm" style={{ color: TEXT_MUTED }}>
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile — The Quiet Codex</title>
      </Helmet>

      <DashboardHeader title="Profile" subtitle="Manage your account" />

      <div className="mx-auto max-w-2xl space-y-8">
        <ProfileCard profile={user} />

        <ProfilePictureUpload
          currentUrl={user.profilePictureUrl}
          username={user.username}
        />

        <ProfileEditForm currentUsername={user.username} />

        <DangerZone />
      </div>
    </>
  );
}
