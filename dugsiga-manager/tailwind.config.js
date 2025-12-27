/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Example vivid blue
        secondary: "#10B981", // Example vivid green
        accent: "#F59E0B",
         // Add more custom colors here to fit the "vibrant" requirement
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Will add Google Fonts later
      }
    },
  },
  plugins: [],
}
