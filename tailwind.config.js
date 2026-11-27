/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F7F7',
          100: '#EEEEEE',
          200: '#D9D9D9',
          300: '#A6A6A6',
          400: '#666666',
          500: '#111111',
          600: '#000000',
          700: '#000000',
          800: '#000000',
        },
        ink: '#111111',
        muted: '#666666',
        surface: {
          grey: '#F7F7F7',
          mint: '#FAFAFA',
          cyan: '#F0F0F0',
        },
        success: {
          50: '#F2F2F2',
          600: '#222222',
        },
        warning: {
          50: '#F2F2F2',
          600: '#333333',
        },
        error: {
          50: '#F2F2F2',
          600: '#111111',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
        nav: '0.08em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
