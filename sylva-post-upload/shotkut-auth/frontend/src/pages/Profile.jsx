import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileStatsWidget from "../components/ProfileStatsWidget.jsx";
import { explorePosts } from "../data/mockExplore.js";

const Profile = () => {
  const { user } = useAuth();
  const myPosts = explorePosts.slice(0, 9);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full space-y-6">
      <ProfileStatsWidget user={user} />

      <div className="glass rounded-2xl p-5">
        <div className="flex divide-x divide-glassBorder text-center">
          <div className="flex-1">
            <p className="text-lg font-bold text-paper font-mono">248</p>
            <p className="text-xs text-fog">Followers</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-paper font-mono">183</p>
            <p className="text-xs text-fog">Following</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-paper font-mono">{myPosts.length}</p>
            <p className="text-xs text-fog">Posts</p>
          </div>
        </div>
        <p className="text-[11px] text-fog text-center mt-3">
          Follower/following counts are placeholder - a real social graph needs its own backend model.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-paper mb-3">Your posts</h2>
        <div className="grid grid-cols-3 gap-2">
          {myPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.03 }}
              className="aspect-square rounded-lg overflow-hidden"
            >
              <img
                src={`https://picsum.photos/seed/${post.imageSeed}/300/300`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
