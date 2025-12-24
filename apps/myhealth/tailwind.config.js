/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light mode tokens
        primary: 'hsl(8, 100%, 67%)', 
        accent: 'hsl(117, 20%, 61%)',
        background: 'hsl(0, 0%, 100%)',
        apptext: 'hsl(0, 0%, 5%)',
        surface: 'hsl(359, 75%, 89%)',
        border: 'hsl(359, 75%, 89%)',
        error: 'hsl(0, 84%, 60%)',
        // Dark mode tokens
        primary_dark: 'hsl(5, 100%, 75%)',
        accent_dark: 'hsl(122, 37%, 74%)',
        background_dark: 'hsl(0, 18%, 15%)',
        apptext_dark: 'hsl(0, 100%, 98%)',
        surface_dark: 'hsl(0, 17%, 21%)',
        border_dark: 'hsl(0, 17%, 21%)',
      },
    },
  },
  plugins: [],
};
