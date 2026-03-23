/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          guinda: {
            DEFAULT: '#722F37',
            dark: '#4E1F26',
            medium: '#5A2530',
            light: '#8B3A44',
            pale: '#F5ECED',
            ultra: '#FAF3F4',
          },
          dorado: {
            DEFAULT: '#C9A227',
            dark: '#A8841F',
            light: '#E4BC40',
            pale: '#FBF6E4',
          },
        },
        fontFamily: {
          heading: ['Montserrat', 'sans-serif'],
          body: ['Open Sans', 'sans-serif'],
        },
        keyframes: {
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(24px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          bounce_slow: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-8px)' },
          },
        },
        animation: {
          'fade-in-up': 'fadeInUp 0.7s ease forwards',
          'fade-in': 'fadeIn 0.8s ease forwards',
          'bounce-slow': 'bounce_slow 2s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }
