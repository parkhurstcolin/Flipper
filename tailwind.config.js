/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand accent (yellow). Use accent / accent-dark / accent-light
        // instead of hard-coded yellow-400/500/600.
        accent: {
          light: "#facc15", // yellow-400
          DEFAULT: "#eab308", // yellow-500
          dark: "#ca8a04", // yellow-600
        },
      },
    },
  },
  plugins: [],
};
