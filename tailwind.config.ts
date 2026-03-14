import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hunter: {
          purple: "#8b5cf6",
          cyan: "#14b8a6",
        },
      },
      animation: {
        "cursor-blink": "cursor-blink 1s step-end infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "cursor-blink": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        glow: {
          from: { boxShadow: "0 0 10px -10px #8b5cf6" },
          to: { boxShadow: "0 0 20px -5px #14b8a6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
