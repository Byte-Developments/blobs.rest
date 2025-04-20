import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['"YourFont"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
