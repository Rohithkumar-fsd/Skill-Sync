/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50:  'hsl(250 84% 97%)',
          100: 'hsl(250 84% 93%)',
          200: 'hsl(250 84% 85%)',
          300: 'hsl(250 84% 75%)',
          400: 'hsl(250 84% 67%)',
          500: 'hsl(250 84% 60%)',
          600: 'hsl(250 84% 54%)',
          700: 'hsl(250 84% 46%)',
          800: 'hsl(250 84% 38%)',
          900: 'hsl(250 84% 28%)',
          DEFAULT: 'hsl(250 84% 60%)',
        },
        primary: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#6366f1',
          foreground: '#ffffff',
        },
        border:     'hsl(240 6% 90%)',
        input:      'hsl(240 6% 90%)',
        ring:       'hsl(250 84% 60%)',
        background: 'hsl(0 0% 98%)',
        foreground: 'hsl(240 10% 6%)',
        secondary: {
          DEFAULT:    'hsl(240 5% 96%)',
          foreground: 'hsl(240 10% 6%)',
        },
        muted: {
          DEFAULT:    'hsl(240 5% 96%)',
          foreground: 'hsl(240 5% 50%)',
        },
        card: {
          DEFAULT:    'hsl(0 0% 100%)',
          foreground: 'hsl(240 10% 6%)',
        },
        destructive: {
          DEFAULT:    'hsl(0 84% 60%)',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT:    'hsl(250 84% 96%)',
          foreground: 'hsl(250 84% 40%)',
        },
        'gradient-start': '#6366f1',
        'gradient-mid':   '#a855f7',
        'gradient-end':   '#ec4899',
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '60':  '15rem',  // sidebar width
        '16':  '4rem',   // sidebar collapsed
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow':        '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-strong': '0 0 40px rgba(99, 102, 241, 0.4)',
        'card':        '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':  '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'scale-in':      'scaleIn 0.35s ease-out',
        'shimmer':       'shimmer 1.5s linear infinite',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'slide-right':   'slideFromRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.3)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(99,102,241,0)' },
        },
        slideFromRight: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
