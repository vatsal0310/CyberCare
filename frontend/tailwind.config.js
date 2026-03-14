/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: "#020817",
        card: "#020c1b",
        accent: "#22d3ee",
        muted: "#94a3b8"
      }
    }
  },
  plugins: []
}

