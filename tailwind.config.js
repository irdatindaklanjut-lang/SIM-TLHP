module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
      colors: { ink: "#1c1c1c", lime: "#d8f45c", lilac: "#b8a8f2", paper: "#fdfdfb", mist: "#f4f4f2" },
      borderRadius: { card: "40px" },
      keyframes: {
        rise: { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "none" } },
        fill: { "0%": { transform: "scaleX(0)" }, "100%": { transform: "scaleX(1)" } },
      },
      animation: { rise: "rise .8s cubic-bezier(.2,.7,.2,1) both", fill: "fill .9s .5s cubic-bezier(.2,.7,.2,1) both" },
    },
  },
  plugins: [],
};
