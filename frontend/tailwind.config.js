/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        cream: '#fefbf6',
        sand: '#f5f0e8',
        lime: '#a3e635',
        coral: '#ff6b6b',
        sky: '#38bdf8',
        violet: '#a78bfa',
        mint: '#34d399',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #1a1a1a',
        'brutal-sm': '2px 2px 0px 0px #1a1a1a',
        'brutal-lg': '6px 6px 0px 0px #1a1a1a',
        'brutal-lime': '4px 4px 0px 0px #a3e635',
        'brutal-coral': '4px 4px 0px 0px #ff6b6b',
        'brutal-sky': '4px 4px 0px 0px #38bdf8',
        'brutal-violet': '4px 4px 0px 0px #a78bfa',
      },
    },
  },
  plugins: [],
}
