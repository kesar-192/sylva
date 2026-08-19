/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Sylva v3 - CSS-variable-backed tokens so Settings > Appearance
        // can genuinely retheme the app at runtime (Dark/AMOLED/Light,
        // plus an accent color picker) without a rebuild.
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        charcoal: "rgb(var(--c-charcoal) / <alpha-value>)",
        glass: "rgb(var(--c-glass) / <alpha-value>)",
        glassBorder: "rgb(var(--c-teal) / 0.2)",
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        fog: "rgb(var(--c-fog) / <alpha-value>)",
        teal: {
          DEFAULT: "rgb(var(--c-teal) / <alpha-value>)",
          soft: "rgb(var(--c-teal-soft) / <alpha-value>)",
          deep: "rgb(var(--c-teal-deep) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        "glow-teal": "0 0 30px -8px rgb(var(--c-teal) / 0.55)",
      },
    },
  },
  plugins: [],
};
