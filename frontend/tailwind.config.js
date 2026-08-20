/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#121212',
          card: '#161616',
          border: '#2a2a2a',
        },
        neon: {
          cyan: '#00ffcc',
          pink: '#ff0080',
          yellow: '#ffe600',
          green: '#00ff66',
          purple: '#b537f2',
        },
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #000',
        'brutal': '4px 4px 0px #000',
        'brutal-lg': '6px 6px 0px #000',
        'neon-cyan': '4px 4px 0px #00ffcc',
        'neon-pink': '4px 4px 0px #ff0080',
        'neon-yellow': '4px 4px 0px #ffe600',
      },
    },
  },
  plugins: [],
}
