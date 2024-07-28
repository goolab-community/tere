/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        font1: ["Montserrat", "sans-serif"], // 'custom' is the name you'll use in your classes
      },
    },
  },
  plugins: [],
};
