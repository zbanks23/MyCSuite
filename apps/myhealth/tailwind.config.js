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
        // Primary & Accent
        primary: 'hsl(8, 100%, 67%)',
        accent: 'hsl(117, 20%, 61%)',
        'primary-dark': 'hsl(5, 100%, 75%)',
        'accent-dark': 'hsl(122, 37%, 74%)',

        // Backgrounds
        'bg-light': 'hsl(0, 0%, 100%)',
        'bg-default': 'hsl(0, 0%, 95%)',
        'bg-dark': 'hsl(0, 0%, 90%)',
        
        'bg-light-dark': 'hsl(0, 0%, 10%)',
        'bg-default-dark': 'hsl(0, 0%, 5%)',
        'bg-dark-dark': 'hsl(0, 0%, 0%)',

        // Text & UI
        apptext: 'hsl(0, 0%, 5%)',
        'apptext-muted': 'hsl(0, 0%, 30%)',
        'apptext-dark': 'hsl(0, 100%, 95%)',
        'apptext-muted-dark': 'hsl(0, 0%, 70%)',
        
        error: 'hsl(0, 84%, 60%)',
        border: 'hsl(0, 0%, 89%)',
        'border-dark': 'hsl(0, 17%, 21%)',
      },
    },
  },
  plugins: [],
};
