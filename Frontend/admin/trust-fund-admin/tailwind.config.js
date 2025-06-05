/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-color': 'var(--color-accent)',
      },
    },
  },
  plugins: [],
}
