/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom premium palette for dark mode
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        slateDark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#1e293b', // slate-800
          800: '#0f172a', // slate-900
          900: '#020617', // slate-950
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'glowSpin 4s linear infinite',
      },
      keyframes: {
        glowSpin: {
          '0%, 100%': { transform: 'rotate(0deg)', filter: 'hue-rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)', filter: 'hue-rotate(180deg)' },
        }
      }
    },
  },
  plugins: [],
}
