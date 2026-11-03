/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Vivid Primary Blue
          700: '#1d4ed8', // Dark Royal Blue
          800: '#1e3a8a', // Canonical Glosindo Navy
          900: '#0f1e4a', // Deep Glosindo Navy
          950: '#081028', // Midnight Royal Navy
        },
        cyanAccent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Canonical Glosindo Cyan / Cerulean
          700: '#0369a1',
        },
        textMuted: '#64748B',  // Canonical WCAG AA compliant muted text
        darkNavy: '#081028',
        amberStatus: '#B45309',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 30, 74, 0.08), 0 2px 6px -1px rgba(15, 30, 74, 0.04)',
        'elevated': '0 12px 32px -4px rgba(15, 30, 74, 0.12), 0 4px 12px -2px rgba(15, 30, 74, 0.06)',
      }
    },
  },
  plugins: [],
}
