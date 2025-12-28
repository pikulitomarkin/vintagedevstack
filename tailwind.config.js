/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-deep': '#002244',
        'electric-blue': '#00D4FF',
        'tech-white': '#F0F8FF',
        'grid-line': 'rgba(0, 212, 255, 0.1)',
        'accent-neon': '#00FF88',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}

