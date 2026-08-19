import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Shapes a post consistently for every endpoint that returns one,
// mirroring the toPublicUser() pattern in authController.js.
const toPublicPost = (post) => ({
  id: post._id,
  author: post.author?._id
    ? {
        id: post.author._id,
        name: post.author.name,
        avatarUrl: post.author.avatarUrl,
      }
    : post.author,
  caption: post.caption,
  mediaItems: post.mediaItems,
  createdAt: post.createdAt,
});

// @route GET /api/posts/upload-signature
// Protected. The frontend uploads media directly to Cloudinary (so large
// video files never have to pass through our server), but an unsigned
// direct upload would let anyone upload to our account from a browser
// devtools console. Instead we sign the exact params the client is about
// to send, server-side, with our API secret - the client never sees the
// secret itself, only this one-time signature.
export const getUploadSignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  // Scoping uploads into a per-user folder keeps assets organized and
  // makes it easy to bulk-clean a user's media if their account is
  // deleted later.
  const folder = `sylva/posts/${req.userId}`;

  const paramsToSign = { timestamp, folder };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};

// @route POST /api/posts
// Protected. Expects mediaItems to already be uploaded to Cloudinary
// (via the signed direct-upload flow) - this just persists the
// resulting URLs against the authenticated user.
export const createPost = async (req, res) => {
  try {
    const { caption, mediaItems } = req.body;

    if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
      return res.status(400).json({ message: "At least one media item is required" });
    }
    if (mediaItems.length > 10) {
      return res.status(400).json({ message: "A post can have at most 10 media items" });
    }

    const cleanedItems = mediaItems.map((item) => {
      if (!item.url || !item.publicId || !["image", "video"].includes(item.type)) {
        throw new Error("Each media item needs a url, publicId, and type of image or video");
      }
      return {
        url: item.url,
        type: item.type,
        publicId: item.publicId,
        width: item.width,
        height: item.height,
        thumbnailUrl: item.thumbnailUrl,
      };
    });

    const post = await Post.create({
      author: req.userId,
      caption: caption?.slice(0, 2200) || "",
      mediaItems: cleanedItems,
    });

    await post.populate("author", "name avatarUrl");

    res.status(201).json({ post: toPublicPost(post) });
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not create post" });
  }
};

// @route GET /api/posts?cursor=<postId>&limit=20
// Protected. Cursor-based pagination (rather than page numbers) so the
// feed doesn't skip/repeat posts when new ones are created between
// page loads.
export const getFeed = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const { cursor } = req.query;

    const query = cursor ? { _id: { $lt: cursor } } : {};

    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .populate("author", "name avatarUrl");

    res.status(200).json({
      posts: posts.map(toPublicPost),
      nextCursor: posts.length === limit ? posts[posts.length - 1]._id : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/posts/user/:userId
// Protected. Posts for a single profile page, most recent first.
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "name avatarUrl");

    res.status(200).json({ posts: posts.map(toPublicPost) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route DELETE /api/posts/:postId
// Protected. Only the post's own author can delete it. Also removes the
// underlying Cloudinary assets so orphaned media doesn't pile up.
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Promise.all(
      post.mediaItems.map((item) =>
        cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.type === "video" ? "video" : "image",
        })
      )
    );

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
