/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
        violet: colors.violet,
        gray: colors.gray,
        white: colors.white,
        "grey": {
            000: "#F7F7F7",
            100: "#E1E1E1",
            200: "#CFCFCF",
            300: "#B1B1B1",
            400: "#9E9E9E",
            500: "#7E7E7E",
            600: "#626262",
            700: "#515151",
            800: "#3B3B3B",
            900: "#222222",
        },
    },
    extend: {
      fontFamily: {
        sourceCodePro: ["Source Code Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
}
