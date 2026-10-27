/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // Canonical primary
          700: '#047857',
          800: '#064e3b', // Deep emerald
          900: '#022c22', // Dark forest
          950: '#011c16',
        },
        limeAccent: '#D4F636', // Canonical Neon Lime
        textMuted: '#64748B',  // Canonical WCAG AA compliant muted text
        darkForest: '#022C22',
        amberStatus: '#B45309',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(2, 44, 34, 0.08), 0 2px 6px -1px rgba(2, 44, 34, 0.04)',
        'elevated': '0 12px 32px -4px rgba(2, 44, 34, 0.12), 0 4px 12px -2px rgba(2, 44, 34, 0.06)',
        'glow': '0 0 35px -5px rgba(212, 246, 54, 0.35)',
      }
    },
  },
  plugins: [],
}
