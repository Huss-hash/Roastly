import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b0f",
        surface: "#15151c",
        border: "#26262f",
        accent: "#ff5c5c",
        accent2: "#ffb454",
      },
    },
  },
  plugins: [],
};

export default config;
