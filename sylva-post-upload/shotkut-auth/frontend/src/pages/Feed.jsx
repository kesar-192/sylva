import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import ProfileStatsWidget from "../components/ProfileStatsWidget.jsx";
import StoryBar from "../components/StoryBar.jsx";
import VibeFeed from "../components/VibeFeed.jsx";
import TrendingPanel from "../components/TrendingPanel.jsx";
import { FeedSkeleton } from "../components/Skeleton.jsx";
import { fetchFeed } from "../api/postsApi.js";
import { mockStories, trendingTags, trendingCreators } from "../data/mockFeed.js";

const Feed = () => {
  const { user } = useAuth();
  const { density } = useTheme();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const loadFeed = async () => {
      try {
        const { posts: fetched } = await fetchFeed();
        if (!cancelled) setPosts(fetched);
      } catch (err) {
        // Feed failing to load shouldn't crash the page - it just shows
        // empty, same as a brand-new account with no posts yet.
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadFeed();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // CreatePostModal broadcasts this after a successful post - Feed and
    // the FAB live under the same Dashboard layout but aren't in a
    // direct parent/child relationship, so a window event is simpler
    // than threading a callback through the router outlet.
    const handleCreated = (e) => setPosts((prev) => [e.detail, ...prev]);
    window.addEventListener("sylva:post-created", handleCreated);
    return () => window.removeEventListener("sylva:post-created", handleCreated);
  }, []);

  return (
    <div className="flex-1 flex gap-6 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
      <main className={`flex-1 min-w-0 ${density === "compact" ? "space-y-4" : "space-y-6"}`}>
        {loading ? (
          <FeedSkeleton />
        ) : (
          <>
            <ProfileStatsWidget user={user} />
            <div className="glass rounded-2xl p-4 sm:p-5">
              <StoryBar stories={mockStories} />
            </div>
            {posts.length > 0 ? (
              <VibeFeed posts={posts} density={density} />
            ) : (
              <div className="glass rounded-2xl p-8 text-center text-fog text-sm">
                No posts yet — hit the + button to share something.
              </div>
            )}
          </>
        )}
      </main>

      <TrendingPanel tags={trendingTags} creators={trendingCreators} />
    </div>
  );
};

export default Feed;
