/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // ✅ include all your JS/JSX files
  ],
  theme: {
      extend: {
      colors: {
        yt: {
          red: "#FF0000",
          redHover: "#cc0000",
          bg: "#FFFFFF",
          secondary: "#F9F9F9",
          text: "#0F0F0F",
          textSecondary: "#606060",
          border: "#E5E5E5",
        },
      },
      fontFamily: {
        youtube: ["Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}