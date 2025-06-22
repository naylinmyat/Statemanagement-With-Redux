/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",

  safelist: [
    "text-white",
    "text-black",
    "bg-white",
    "bg-black",
    "border-black",
    "border-white",
    "text-yellow-600",
    "text-yellow-400"
  ],
}