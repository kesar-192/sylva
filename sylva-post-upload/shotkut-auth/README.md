# Shotkut Studio Workspace — Auth System

MERN authentication build for the Gath Productions / Shotkut internship
assessment (Part 1).

## Architecture

**Stack:** React + Vite + Tailwind CSS (frontend) · Express + Node.js (backend) · MongoDB Atlas (database)

**Two-token flow**

- **Access token** — JWT, 15 min expiry, signed with `ACCESS_TOKEN_SECRET`.
  Kept **in memory only** on the frontend (a JS variable inside
  `axiosClient.js`), never in localStorage. It's attached to every API
  request as `Authorization: Bearer <token>`.
- **Refresh token** — JWT, 7 day expiry, signed with a *different* secret
  (`REFRESH_TOKEN_SECRET`). Stored in an **httpOnly, secure cookie**
  scoped to `/api/auth`, and also persisted per-user in MongoDB so a
  logout can invalidate that specific session without needing to trust
  the client.

**Why httpOnly cookie over localStorage for the refresh token:** JavaScript
can't read an httpOnly cookie, so an XSS bug on the frontend can't steal a
long-lived credential. The short-lived access token is the only thing
exposed to JS, and it expires in 15 minutes even if leaked.

**Silent refresh flow**

1. On app load, the frontend calls `POST /api/auth/refresh` (cookie sent
   automatically by the browser).
2. If the cookie is valid, the backend issues a new access token and the
   user stays logged in without re-entering credentials.
3. An axios response interceptor also catches any `401` from a protected
   call, retries a refresh once, and replays the original request — so an
   access token expiring mid-session is invisible to the user.

**Logout** removes just that session's refresh token from the user's
document in MongoDB and clears the cookie, so other logged-in devices are
unaffected.

## Project structure

```
shotkut-auth/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── models/User.js            Schema + bcrypt password hashing
│   ├── controllers/authController.js
│   ├── middleware/authMiddleware.js   Verifies access token
│   ├── routes/authRoutes.js
│   ├── utils/generateTokens.js
│   └── server.js
└── frontend/
    ├── src/api/axiosClient.js    Attaches token + auto-refresh on 401
    ├── src/context/AuthContext.jsx
    ├── src/components/ProtectedRoute.jsx
    └── src/pages/{Login,Signup,Dashboard}.jsx
```

## Local setup

**Backend**
```bash
cd backend
cp .env.example .env   # fill in your MongoDB Atlas URI + JWT secrets
npm install
npm run dev             # http://localhost:5000
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Deployment plan

| Layer     | Platform          | Notes |
|-----------|--------------------|-------|
| Frontend  | Vercel             | Set `VITE_API_URL` to the deployed Render backend URL |
| Backend   | Render             | Set `CLIENT_URL` to the deployed Vercel URL, plus Mongo URI + JWT secrets as env vars |
| Database  | MongoDB Atlas      | Free-tier cluster, network access allowed from Render's IPs (or 0.0.0.0/0 for simplicity in an assessment) |

Because frontend and backend live on different domains in production, the
refresh cookie is set with `sameSite: "none"` and `secure: true` (see
`utils/generateTokens.js`) — this only works over HTTPS, which both Vercel
and Render provide by default.

## AI tool used

Claude (Anthropic) — used to scaffold the project structure, write the
auth controllers/middleware, and the token-refresh logic on the frontend.
