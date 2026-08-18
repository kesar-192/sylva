import { useState } from "react";
import { Share2 } from "lucide-react";
import { getRankInfo } from "../utils/rank.js";
import { useToast } from "../context/ToastContext.jsx";
import EditProfileModal from "./EditProfileModal.jsx";
import CustomizeVibeModal from "./CustomizeVibeModal.jsx";

const getInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

const ProfileStatsWidget = ({ user }) => {
  const [modal, setModal] = useState(null); // "edit" | "vibe" | null
  const { showToast } = useToast();
  const rank = getRankInfo(user?.auraPoints || 0);
  const handle = user?.name?.toLowerCase().replace(/\s+/g, "") || "user";

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${handle}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Sylva profile", url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Profile link copied");
      }
    } catch (err) {
      // user cancelled the share sheet - not an error worth surfacing
    }
  };

  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="h-28 sm:h-36 relative bg-gradient-to-br from-teal/30 via-charcoal to-teal-deep/30">
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="px-5 sm:px-8 pb-6">
        <div className="flex flex-wrap items-end gap-4 -mt-10">
          <div className="aura-ring">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-charcoal flex items-center justify-center m-[3px] overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-paper">{getInitials(user?.name) || "?"}</span>
              )}
            </div>
          </div>

          <div className="pb-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-paper truncate">{user?.name}</h1>
            <p className="text-sm text-fog truncate">@{handle}</p>
          </div>

          <button
            onClick={() => setModal("vibe")}
            className="ml-auto mb-1 text-xs sm:text-sm rounded-full bg-white/[0.05] border border-glassBorder px-3 py-1.5 text-teal hover:bg-white/[0.08] transition"
          >
            {user?.statusTag || "✨ New Here"}
          </button>
        </div>

        {user?.bio && <p className="mt-4 text-sm text-paper/80">{user.bio}</p>}

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="flex items-center gap-1.5 text-paper font-medium">
              <span className="font-mono">{(user?.auraPoints || 0).toLocaleString()}</span> Aura Points
            </span>
            <span className="text-fog">{rank.title}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-deep to-teal shadow-glow-teal transition-all duration-500"
              style={{ width: `${rank.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-glassBorder px-3 py-1.5 text-xs text-paper">
            🔥 {user?.rizzStreak || 0}-Day Streak
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            onClick={() => setModal("edit")}
            className="rounded-full bg-teal text-ink text-sm font-semibold px-4 py-2 hover:brightness-110 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={handleShare}
            className="rounded-full bg-white/[0.06] border border-glassBorder text-sm text-paper px-4 py-2 hover:bg-white/[0.1] transition inline-flex items-center gap-1.5"
          >
            <Share2 size={14} /> Share Profile
          </button>
          <button
            onClick={() => setModal("vibe")}
            className="rounded-full bg-white/[0.06] border border-glassBorder text-sm text-paper px-4 py-2 hover:bg-white/[0.1] transition"
          >
            Customize Vibe
          </button>
        </div>
      </div>

      {modal === "edit" && <EditProfileModal onClose={() => setModal(null)} />}
      {modal === "vibe" && <CustomizeVibeModal onClose={() => setModal(null)} />}
    </div>
  );
};

export default ProfileStatsWidget;
