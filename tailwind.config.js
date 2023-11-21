/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/**/**/**/**/**/*.{tsx,js,ts}",
    "./src/**/**/**/**/*.{tsx,js,ts}",
    "./src/**/**/**/*.{tsx,js,ts}",
    "./src/**/**/*.{tsx,js,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ["Rubik", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      spacing: {
        4.5: "1.125rem",
      },
      colors: {
        primary: "#533893",
      },
      borderRadius: {
        "4xl": "1.875rem",
      },
      maxWidth: {
        "2xs": "15rem",
      },
      screens: {
        "2xs": "380px",
        xs: "440px",
        "1xl": "1400px",
      },
    },
  },
  plugins: [],
};
