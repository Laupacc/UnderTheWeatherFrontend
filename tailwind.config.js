/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        UndertheWeather: ["UndertheWeather"],
      },
      colors: {
        'custom-blue': '#0A4D68',
        'custom-blue2': '#002B5B',
        'custom-blue3': '#256D85',
        'custom-blue4': '#166fd2',
        'custom-blue5': '#0e4f97',
        'custom-green': '#B9EDDD',
      },
    },
  },
  plugins: [],
};