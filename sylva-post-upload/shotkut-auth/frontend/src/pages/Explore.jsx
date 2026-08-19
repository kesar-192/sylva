import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { MasonrySkeleton } from "../components/Skeleton.jsx";
import { exploreCategories, explorePosts } from "../data/mockExplore.js";

const Explore = () => {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("For You");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-paper">Explore</h1>
        <p className="text-sm text-fog mt-1">
          Sample imagery for now - swap in real posts once the content API exists.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 feed-scroll">
        {exploreCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
              activeCategory === cat
                ? "bg-teal text-ink font-medium"
                : "glass text-fog hover:text-paper"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <MasonrySkeleton />
      ) : (
        <div className="masonry columns-2 sm:columns-3 lg:columns-4">
          {explorePosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ height: post.height }}
            >
              <img
                src={`https://picsum.photos/seed/${post.imageSeed}/400/${post.height}`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="flex items-center justify-between w-full text-paper text-xs">
                  <span className="font-medium truncate">{post.handle}</span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} className="fill-paper" />
                    {post.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
