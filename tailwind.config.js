/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'admin-blue': '#1B5E20',
        'admin-light-blue': '#4CAF50',
        'admin-gray': '#F1F8E9',
        'admin-dark-gray': '#558B2F',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

