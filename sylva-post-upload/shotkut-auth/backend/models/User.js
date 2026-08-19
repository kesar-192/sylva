import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    // Profile fields that back the dashboard UI. auraPoints/rizzStreak
    // get sensible defaults on signup - there's no engagement-tracking
    // engine behind them yet, so they don't auto-increment. Wiring that
    // up (e.g. +points per post/login-streak logic) is a natural next
    // step, but out of scope for this pass.
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    statusTag: {
      type: String,
      default: "✨ New Here",
      maxlength: 40,
    },
    auraPoints: {
      type: Number,
      default: 100,
    },
    rizzStreak: {
      type: Number,
      default: 0,
    },
    // Storing refresh tokens allows multi-device sessions and lets us
    // invalidate a single device's session on logout without killing
    // every other active session for the same user.
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
