/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html,scss}',
    '!./src/**/__tests__/**',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
