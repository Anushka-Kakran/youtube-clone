/** @type {import('tailwindcss').Config} */
export default {
darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
     colors: {
        yt: {
          bg: "#f9f9f9",
          darkBg: "#0f0f0f",
          text: "#0f0f0f",
          darkText: "#ffffff",
          secondary: "#f1f1f1",
          darkSecondary: "#272727",
          border: "#e5e5e5",
          darkBorder: "#3f3f3f",
           red: "#ff0000",
    redHover: "#cc0000",
        },
      },
      fontFamily: {
        youtube: ["Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}