const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "hsl(248, 100%, 97%)",
          100: "hsl(248, 100%, 94%)",
          200: "hsl(248, 100%, 92%)", // from design
          300: "hsl(248, 95%, 82%)",
          400: "hsl(248, 90%, 73%)",
          500: "hsl(248, 85%, 64%)",
          600: "hsl(248, 81%, 55%)", // from design
          700: "hsl(248, 81%, 50%)",
          800: "hsl(248, 81%, 45%)",
          900: "hsl(248, 81%, 40%)",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".hide-webkit-cancel-button::-webkit-search-cancel-button": {
          appearance: "none",
        },
      });
    }),
  ],
};
