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
      },
      animation: {
        roll: "rollAnim 10s easy-in-out infinite",
      },
    },
  },
  // @ts-ignore
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};

module.exports = config;
