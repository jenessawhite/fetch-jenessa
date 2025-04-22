/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
}