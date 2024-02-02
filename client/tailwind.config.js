/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Poppins", "sans-serif"],
      },
      daisyui: {
        themes: ["light", "dark", "cupcake","coffee"],
      },
    },
  },
  plugins: [require("daisyui")],
};
