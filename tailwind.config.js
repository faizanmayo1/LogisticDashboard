/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Surface + text scale (driven by CSS variables so it swaps with theme)
        ink: {
          950: 'rgb(var(--c-ink-950) / <alpha-value>)',
          900: 'rgb(var(--c-ink-900) / <alpha-value>)',
          850: 'rgb(var(--c-ink-850) / <alpha-value>)',
          800: 'rgb(var(--c-ink-800) / <alpha-value>)',
          750: 'rgb(var(--c-ink-750) / <alpha-value>)',
          700: 'rgb(var(--c-ink-700) / <alpha-value>)',
          600: 'rgb(var(--c-ink-600) / <alpha-value>)',
          500: 'rgb(var(--c-ink-500) / <alpha-value>)',
          400: 'rgb(var(--c-ink-400) / <alpha-value>)',
          300: 'rgb(var(--c-ink-300) / <alpha-value>)',
          200: 'rgb(var(--c-ink-200) / <alpha-value>)',
          100: 'rgb(var(--c-ink-100) / <alpha-value>)',
        },
        // Theme-aware overlay + border tokens
        overlay: {
          1: 'rgb(var(--c-overlay-1) / <alpha-value>)',
          2: 'rgb(var(--c-overlay-2) / <alpha-value>)',
          3: 'rgb(var(--c-overlay-3) / <alpha-value>)',
        },
        hairline: {
          DEFAULT: 'rgb(var(--c-hairline) / <alpha-value>)',
          strong: 'rgb(var(--c-hairline-strong) / <alpha-value>)',
        },
        brand: {
          50:  '#ecf5ff',
          100: '#d4e8ff',
          200: '#aed2ff',
          300: '#7cb6ff',
          400: '#4d95ff',
          500: '#2a78f5',
          600: '#1a5fdc',
          700: '#184cb0',
          800: '#173f8a',
          900: '#15336d',
        },
        accent: {
          teal: '#2dd4bf',
          violet: '#a78bfa',
          amber: '#fbbf24',
          rose: '#fb7185',
          emerald: '#34d399',
          cyan: '#22d3ee',
        },
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: '0 0 0 1px rgba(42,120,245,0.25), 0 0 32px -4px rgba(42,120,245,0.25)',
        insetHi: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'radial-brand':
          'radial-gradient(60% 60% at 50% 0%, rgba(42,120,245,0.18) 0%, rgba(42,120,245,0) 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
