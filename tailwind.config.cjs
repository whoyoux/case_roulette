
const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rollAnim: {
          "0%, 50%, 100%": {
            transform: "translateX(-100%)",
          },
        },
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translateY(-2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeOutLeft: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      animation: {
        roll: "rollAnim 10s easy-in-out infinite",
        enter: "fadeInRight 300ms ease-out",
        leave: "fadeOutLeft 300ms ease-in forwards",
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // @ts-ignore
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};

module.exports = config;
