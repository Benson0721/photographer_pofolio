/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/**/*.{vue,js,ts,jsx,tsx}",
    "./src/views/**/*.{vue,js,ts,jsx,tsx}",
    "formkit.theme.mjs",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ["Noto Sans TC"],
        bellefair: ["Bellefair"],
        playfair: ["Playfair Display"],
        montserrat: ["Montserrat"],
      },
      colors: {},
      screens: {
        sm: "375px",
        md: "768px",
        lg: "1440px",
      },
    },
  },
  plugins: [],
};
