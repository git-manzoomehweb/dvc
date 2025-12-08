module.exports = {
  // important: '#app',
  content: [
    "./web/**/*.{html,js}",
    "./mobile/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--text-primary)",
          50: "var(--text-primary-50)",
          100: "var(--text-primary-100)",
          200: "var(--text-primary-200)",
          300: "var(--text-primary-300)",
          400: "var(--text-primary-400)",
          500: "var(--text-primary-500)",
          600: "var(--text-primary-600)",
          700: "var(--text-primary-700)",
          800: "var(--text-primary-800)",
          900: "var(--text-primary-900)",
          950: "var(--text-primary-950)",
        },
        secondary: {
          DEFAULT: "var(--text-secondary)",
          50: "var(--text-secondary-50)",
          100: "var(--text-secondary-100)",
          200: "var(--text-secondary-200)",
          300: "var(--text-secondary-300)",
          400: "var(--text-secondary-400)",
          500: "var(--text-secondary-500)",
          600: "var(--text-secondary-600)",
          700: "var(--text-secondary-700)",
          800: "var(--text-secondary-800)",
          900: "var(--text-secondary-900)",
          950: "var(--text-secondary-950)",
        },
        special: {
          1: 'var(--text-color-1)',
          2: 'var(--text-color-2)'
        }
      }
    },
  },
  plugins: [],
}

