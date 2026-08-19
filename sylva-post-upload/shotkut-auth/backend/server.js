import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// Vercel gives every deployment its own URL (production, git-branch,
// and per-commit preview URLs). Matching one exact CLIENT_URL breaks the
// moment you open a different one, so instead we allow:
//   1. localhost (local dev)
//   2. the exact CLIENT_URL from env (your production domain)
//   3. any *.vercel.app subdomain belonging to this project
const allowedOriginPattern = /^https:\/\/shotkut-gpuh[a-z0-9-]*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // same-origin / curl / server-to-server
      const isLocalhost = origin.startsWith("http://localhost");
      const isConfiguredClient = origin === process.env.CLIENT_URL;
      const isVercelPreview = allowedOriginPattern.test(origin);

      if (isLocalhost || isConfiguredClient || isVercelPreview) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true, // required so the browser sends/receives the refresh cookie
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Shotkut Auth API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Basic dummy protected data endpoint for the dashboard to call
app.get("/api/dashboard", protect, (req, res) => {
  res.json({ message: "This is protected dashboard data", userId: req.userId });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
