/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        megrim: ["Megrim", 'system-ui']
      },
      screens: {
        xsm: "320px",
        ...defaultTheme.screens,
      }
    },
  },
  plugins: [],
}