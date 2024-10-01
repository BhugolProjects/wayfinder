/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mmblue: "rgba(3, 182, 187, 0.1)",
        mmwhite: "rgba(245, 245, 245, 0.1)",
        mmpurple: "rgba(90, 69, 149, 0.1)",
        mmorange: "rgba(255, 107, 131, 0.1)",
        mmbutton: "#0091B7",
      },
    },
  },
  plugins: [],
}