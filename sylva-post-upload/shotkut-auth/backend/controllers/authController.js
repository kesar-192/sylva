import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshCookieOptions,
} from "../utils/generateTokens.js";

// Shapes the public-facing user object consistently across every
// endpoint that returns one, so the frontend always gets the same shape.
const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  statusTag: user.statusTag,
  auraPoints: user.auraPoints,
  rizzStreak: user.rizzStreak,
  createdAt: user.createdAt,
});

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(201).json({
      user: toPublicUser(user),
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      user: toPublicUser(user),
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/auth/refresh
// Reads the httpOnly refresh token cookie, validates it against the
// stored tokens for that user, and issues a fresh access token.
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Refresh token invalid or expired" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const tokenExists = user.refreshTokens.some((rt) => rt.token === token);
    if (!tokenExists) {
      // Token reuse/replay after logout, or tampering - reject.
      return res.status(403).json({ message: "Refresh token not recognized" });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/auth/logout
// Removes only the refresh token belonging to this device/session.
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await User.findByIdAndUpdate(decoded.userId, {
          $pull: { refreshTokens: { token } },
        });
      } catch (err) {
        // Token already invalid/expired - nothing to clean up server-side.
      }
    }

    res.clearCookie("refreshToken", { path: "/api/auth" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/auth/profile
// Protected route - requires a valid access token (see authMiddleware).
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PATCH /api/auth/profile
// Protected route - lets a user update their own name, bio, avatar,
// and status tag. auraPoints/rizzStreak are intentionally NOT editable
// here - they're meant to be system-derived, not self-reported.
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl, statusTag } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = name.trim();
    }
    if (bio !== undefined) updates.bio = bio.slice(0, 160);
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl.trim();
    if (statusTag !== undefined) updates.statusTag = statusTag.slice(0, 40);

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
