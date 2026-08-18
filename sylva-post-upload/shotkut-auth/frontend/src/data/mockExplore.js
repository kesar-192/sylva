// Placeholder imagery from a public placeholder service (picsum.photos) -
// stand-ins until a real media/upload pipeline exists. Heights vary on
// purpose to drive the Pinterest-style masonry layout.
export const exploreCategories = [
  "For You", "Aesthetic", "Code", "Travel", "Fashion", "Food", "Art", "Music",
];

export const explorePosts = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  imageSeed: `sylva-${i + 1}`,
  height: [260, 320, 220, 360, 280, 300][i % 6],
  handle: ["@kavya.codes", "@arjun.builds", "@mira.designs", "@zara.ships", "@dev.notes"][i % 5],
  likes: Math.floor(200 + Math.random() * 4000),
}));
