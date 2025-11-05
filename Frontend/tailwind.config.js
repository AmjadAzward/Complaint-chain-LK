/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg': 'rgba(56, 73, 89, 0.6)', 
      },
    },
  },
  plugins: [],
}

