import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";

// Real posts come back as { author: { name, avatarUrl }, mediaItems, ... }
// from the API; older mock data used a flat { handle, gradient } shape.
// Normalizing here means the mock Explore/Trending data (out of scope
// for this pass) keeps working unchanged.
const normalizePost = (post) => {
  if (post.mediaItems) {
    return {
      id: post.id,
      handle: post.author?.name ? `@${post.author.name}` : "@someone",
      time: timeAgo(post.createdAt),
      caption: post.caption,
      likes: post.likes ?? 0,
      comments: post.comments ?? 0,
      media: post.mediaItems[0],
    };
  }
  return { ...post, media: null };
};

const timeAgo = (isoDate) => {
  if (!isoDate) return "";
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

const PostCard = ({ post: rawPost, compact }) => {
  const post = normalizePost(rawPost);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [popped, setPopped] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    setPopped(true);
    setTimeout(() => setPopped(false), 350);
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="glass rounded-2xl overflow-hidden transition-shadow hover:shadow-glow-teal"
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="aura-ring">
          <div className="w-9 h-9 rounded-full bg-charcoal flex items-center justify-center m-[3px]">
            <span className="text-xs font-semibold text-paper">
              {post.handle[1]?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-paper truncate">{post.handle}</p>
          <p className="text-xs text-fog">{post.time} ago</p>
        </div>
      </div>

      <p className={`px-4 pt-3 text-sm text-paper/90 ${compact ? "line-clamp-1" : ""}`}>
        {post.caption}
      </p>

      {!compact && post.media && (
        <div className="mx-4 mt-3 rounded-xl overflow-hidden bg-charcoal/60">
          {post.media.type === "video" ? (
            <video
              src={post.media.url}
              poster={post.media.thumbnailUrl}
              className="w-full max-h-96 object-cover"
              controls
            />
          ) : (
            <img src={post.media.url} alt="" className="w-full max-h-96 object-cover" />
          )}
        </div>
      )}

      {!compact && !post.media && post.gradient && (
        <div className={`mx-4 mt-3 rounded-xl h-48 sm:h-56 bg-gradient-to-br ${post.gradient} opacity-80`} />
      )}

      <div className="flex items-center gap-5 px-4 py-3.5 text-fog">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleLike}
          className="flex items-center gap-1.5 hover:text-teal transition"
        >
          <Heart
            size={19}
            className={`${popped ? "like-pop" : ""} ${liked ? "text-teal fill-teal" : ""}`}
          />
          <span className="text-xs font-mono">{likeCount}</span>
        </motion.button>
        <button className="flex items-center gap-1.5 hover:text-teal transition">
          <MessageCircle size={19} />
          <span className="text-xs font-mono">{post.comments}</span>
        </button>
        <motion.button
          whileTap={{ scale: 0.85, rotate: 180 }}
          onClick={() => setReposted((v) => !v)}
          className={`transition ${reposted ? "text-teal" : "hover:text-teal"}`}
        >
          <Repeat2 size={19} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setBookmarked((v) => !v)}
          className={`ml-auto transition ${bookmarked ? "text-teal" : "hover:text-paper"}`}
        >
          <Bookmark size={19} className={bookmarked ? "fill-teal" : ""} />
        </motion.button>
      </div>
    </motion.article>
  );
};

const VibeFeed = ({ posts, density = "comfortable" }) => {
  const compact = density === "compact";
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} compact={compact} />
      ))}
    </div>
  );
};

export default VibeFeed;
