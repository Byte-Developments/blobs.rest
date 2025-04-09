// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Sofia: ['Sofia Pro Regular', 'serif'],
        SofiaBold: ['Sofia Pro Bold', 'serif'],
        Montserrat: ['Montserrat', 'serif'],
      },
    },
  },
  plugins: [],
};