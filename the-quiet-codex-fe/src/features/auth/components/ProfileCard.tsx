import { FiCalendar } from "react-icons/fi";
import type { UserProfile } from "../auth.domain";
import { SERIF, SANS, FOREST, SAGE } from "../../../lib/theme";

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
        borderColor: `${FOREST}10`,
        background: "white",
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
          className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white"
          style={{ background: SAGE }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div>
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: SERIF, color: FOREST }}
        >
          {profile.username}
        </h2>
        <p
          className="mt-1 flex items-center gap-1.5 text-sm"
          style={{ color: `${FOREST}50`, fontFamily: SANS }}
        >
          <FiCalendar size={13} />
          Member since {memberSince}
        </p>
      </div>
    </div>
  );
}
