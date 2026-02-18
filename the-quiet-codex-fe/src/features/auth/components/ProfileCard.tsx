import { FiCalendar } from "react-icons/fi";
import type { UserProfile } from "../auth.domain";
import {
  DISPLAY,
  SANS,
  TEXT_PRIMARY,
  TEXT_DIM,
  GLASS,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
} from "../../../lib/theme";

interface ProfileCardProps {
  profile: UserProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="flex items-center gap-6 rounded-2xl border p-6"
      style={{
        borderColor: GLASS_BORDER,
        background: GLASS,
      }}
    >
      {/* Avatar */}
      {profile.profilePictureUrl ? (
        <img
          src={profile.profilePictureUrl}
          alt={profile.username}
          className="h-20 w-20 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-20 w-20 items-center justify-center rounded-xl text-2xl font-semibold text-white"
          style={{ background: GRADIENT_PRIMARY }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          {profile.username}
        </h2>
        <p
          className="mt-1 flex items-center gap-1.5 text-sm"
          style={{ color: TEXT_DIM, fontFamily: SANS }}
        >
          <FiCalendar size={13} />
          Member since {memberSince}
        </p>
      </div>
    </div>
  );
}
