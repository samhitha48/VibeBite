export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans Display"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          100: "#B0C8B8",
          200: "#A3BFAC",
          300: "#95B5A0",
          400: "#88AC94",
          500: "#7BA388",
          600: "#6F937A",
          700: "#62826D",
          800: "#56725F",
          DEFAULT: "#7BA388",
        },
        secondary: {
          100: "#E9B1C6",
          200: "#E5A4BD",
          300: "#E197B3",
          400: "#DE8AAA",
          500: "#DA7DA0",
          600: "#C47190",
          700: "#AE6480",
          800: "#995870",
          DEFAULT: "#da7da0",
        },
        tertiary: {
          100: "#DAE9F4",
          200: "#D4E6F2",
          300: "#CDE2F1",
          400: "#C7DFEF",
          500: "#C1DBED",
          600: "#AEC5D5",
          700: "#9AAFBE",
          800: "#8799A6",
          DEFUALT: "#c1dbed",
        },
        "accent-brown": "#6e5e5e",
      },
    },
  },
  plugins: [],
};
