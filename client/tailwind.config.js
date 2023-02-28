/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        atomic_teal: {
          1: '#265b5f',
          2: '#1e494c',
        },
        fossil: {
          1: '#e4ddcd',
        },
        bright_crimson: {
          1: '#cc150b',
          2: '#820e07',
        },
      },
    },
  },
  plugins: [],
};
