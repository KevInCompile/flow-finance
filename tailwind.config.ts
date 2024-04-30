import type { Config } from "tailwindcss";
import animations from "@midudev/tailwind-animations";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        palette: "var(--color-palette)",
      },
    },
  },
  darkMode: "class",
  plugins: [animations],
};
export default config;
