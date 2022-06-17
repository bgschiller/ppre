const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".hide-webkit-cancel-button::-webkit-search-cancel-button": {
          appearance: "none",
        },
      });
    }),
    require("@tailwindcss/forms"),
  ],
};
