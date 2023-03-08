/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        custom_gray: {
          1: '#dee3ea',
          2: '#b2bdcd',
          3: '#5d7290',
          4: '#323d4d',
          5: '#242c37',
          6: '#151a21',
          7: '#0b0e11',
        },
        bright_crimson: {
          1: '#cc150b',
          2: '#820e07',
        },
        atomic_teal: {
          1: '#265b5f',
          2: '#1e494c',
        },
      },
    },
  },
  plugins: [],
};
