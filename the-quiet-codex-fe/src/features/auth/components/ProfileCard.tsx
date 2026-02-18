import { FiCalendar } from "react-icons/fi";
import type { UserProfile } from "../auth.domain";

interface ProfileCardProps {
  profile: UserProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="glass-panel flex items-center gap-6 rounded-2xl p-6">
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
          style={{
            background:
              "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
          }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>
      )}

      <div>
        <h2
          className="text-2xl font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {profile.username}
        </h2>
        <p
          className="mt-1 flex items-center gap-1.5 text-sm"
          style={{
            color: "var(--color-text-dim)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <FiCalendar size={13} />
          Member since {memberSince}
        </p>
      </div>
    </div>
  );
}
