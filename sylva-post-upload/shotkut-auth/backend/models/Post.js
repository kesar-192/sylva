import mongoose from "mongoose";

// A single uploaded file within a post. publicId is Cloudinary's asset
// identifier - we keep it so we can delete the asset from Cloudinary
// later (e.g. if the post is deleted), not just unlink it from Mongo.
const mediaItemSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    width: Number,
    height: Number,
    // Cloudinary auto-generates a poster frame for videos; storing it
    // separately lets the feed show a thumbnail without loading the
    // whole video file.
    thumbnailUrl: String,
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caption: {
      type: String,
      default: "",
      maxlength: 2200,
    },
    mediaItems: {
      type: [mediaItemSchema],
      validate: {
        validator: (items) => items.length > 0 && items.length <= 10,
        message: "A post needs between 1 and 10 media items",
      },
    },
  },
  { timestamps: true }
);

// Feed queries are "give me recent posts" or "give me this user's
// posts, most recent first" - both are served by this one index.
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
