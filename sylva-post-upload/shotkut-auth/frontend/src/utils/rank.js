// Derives a rank title + progress-bar percentage from a real auraPoints
// number (fetched from the backend), instead of hardcoding a title.
// Thresholds are arbitrary but consistent - tune freely.
const RANKS = [
  { min: 0, title: "🌱 Newcomer" },
  { min: 2000, title: "🚀 Rising Star" },
  { min: 8000, title: "✨ Trendsetter" },
  { min: 20000, title: "👑 Main Character" },
  { min: 50000, title: "🔥 Legend" },
];

export const getRankInfo = (auraPoints = 0) => {
  let current = RANKS[0];
  let next = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (auraPoints >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }

  const progress = next
    ? Math.min(100, Math.round(((auraPoints - current.min) / (next.min - current.min)) * 100))
    : 100;

  return { title: current.title, progress, nextThreshold: next?.min ?? null };
};
