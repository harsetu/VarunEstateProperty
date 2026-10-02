/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme: "ink" are the surfaces (900 = page background)
        ink: {
          900: '#FAF8F4',
          800: '#F3EFE7',
          700: '#FFFFFF',
          600: '#ECE7DD',
          500: '#E2DCD0',
        },
        fg: '#16171B',
        night: '#14151A',
        gold: {
          DEFAULT: '#B8922B',
          light: '#E9D49A',
          dark: '#8F6B10',
          deep: '#6E5208',
        },
        ash: {
          DEFAULT: '#555963',
          light: '#3D4048',
          dark: '#7D818A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Small text bumped up a step so body copy is readable next to big headings
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],
        'sm': ['0.9375rem', { lineHeight: '1.5rem' }],
        'hero': ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'mega': ['clamp(3rem, 12vw, 10rem)', { lineHeight: '0.85', letterSpacing: '-0.05em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,23,27,0.04), 0 8px 24px rgba(22,23,27,0.06)',
        'card-hover': '0 2px 4px rgba(22,23,27,0.05), 0 20px 40px rgba(22,23,27,0.12)',
        'card-3d': '0 4px 8px rgba(22,23,27,0.05), 0 30px 60px -12px rgba(22,23,27,0.28)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 10%)' },
          '80%': { transform: 'translate(-15%, 0%)' },
          '90%': { transform: 'translate(10%, 5%)' },
        },
      },
    },
  },
  plugins: [],
};
