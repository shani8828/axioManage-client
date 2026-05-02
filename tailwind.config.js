/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: '#e8c0fc',
        sky: '#a8defa',
        mint: '#d0f4e0',
        lemon: '#fcf5bf',
        rose: '#ff99c8',
        dark: '#111111',
        muted: '#666666',
      },
      fontFamily: {
        sans: ['Saira', 'sans-serif'],
        display: ['Saira', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
