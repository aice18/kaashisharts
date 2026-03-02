/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        background: '#FAFAFA',
        surface: '#FFFFFF',
        primary: '#111111', // Obsidian
        secondary: '#666666', // Slate
        subtle: '#F0F0F0',
        // Art Pigment Palette
        cobalt: '#1D4ed8', // International Klein Blue-ish
        vermilion: '#C23B22', // Deep Red
        ochre: '#CC7722', // Gold/Earth
        viridian: '#40826D', // Deep Teal
        violet: '#7F00FF', // Artist Violet
      },
      animation: {
        'fade-in': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'blob': 'blob 10s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    }
  },
  plugins: [],
}
