/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        tall: { raw: "(min-height: 800px)" },
      },
    },
  },
  plugins: [],
};
