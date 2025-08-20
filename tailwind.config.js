
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0057ff' }
      },
      borderRadius: { '2xl': '1rem' }
    },
  },
  plugins: [],
}
