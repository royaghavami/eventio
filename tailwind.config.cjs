/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /child:.+/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-children")]
};
