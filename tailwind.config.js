/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
        }
      }
    },
  },
  plugins: [],
} 