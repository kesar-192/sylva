// Placeholder data. None of this is backed by a real API yet — the
// current backend only supports auth (register/login/refresh/logout/
// profile). To make this dynamic, you'd add models + endpoints for
// posts, stories, streaks, and aura points, then swap these constants
// for real fetch calls in Dashboard.jsx.

export const mockStories = [
  { id: 1, name: "You", isUser: true, unread: false },
  { id: 2, name: "kavya", unread: true },
  { id: 3, name: "arjun", unread: true },
  { id: 4, name: "mira", unread: true },
  { id: 5, name: "dev", unread: false },
  { id: 6, name: "zara", unread: true },
];

export const mockPosts = [
  {
    id: 1,
    handle: "@kavya.codes",
    time: "2h",
    caption: "3am debugging arc but the vibes were immaculate ✨",
    likes: 482,
    comments: 31,
    gradient: "from-teal-deep to-teal",
  },
  {
    id: 2,
    handle: "@arjun.builds",
    time: "5h",
    caption: "shipped my first full-stack app today, main character energy fr",
    likes: 1204,
    comments: 88,
    gradient: "from-teal to-teal-deep",
  },
  {
    id: 3,
    handle: "@mira.designs",
    time: "9h",
    caption: "redesigning everything at 2am is a personality trait at this point",
    likes: 367,
    comments: 19,
    gradient: "from-teal-soft to-teal",
  },
];

export const trendingTags = [
  { tag: "#buildinpublic", posts: "12.4k" },
  { tag: "#mainCharacterEnergy", posts: "8.1k" },
  { tag: "#auraPoints", posts: "5.7k" },
  { tag: "#lofiChill", posts: "4.2k" },
];

export const trendingCreators = [
  { handle: "@kavya.codes", aura: "24.1k" },
  { handle: "@dev.notes", aura: "19.8k" },
  { handle: "@zara.ships", aura: "15.3k" },
];

export const userStats = {
  moodTag: "⚡ Flirting with Code",
  auraPoints: 12450,
  rankTitle: "👑 Main Character",
  auraProgress: 68, // percent toward next rank
  streakDays: 14,
  spotifyTrack: "Lofi Chill",
};
