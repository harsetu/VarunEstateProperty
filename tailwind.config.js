/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Every colour comes from a CSS variable (RGB channels) so themes can swap them; see src/index.css.
        // "ink" are the surfaces (900 = page background)
        ink: {
          900: 'rgb(var(--c-ink-900) / <alpha-value>)',
          800: 'rgb(var(--c-ink-800) / <alpha-value>)',
          700: 'rgb(var(--c-ink-700) / <alpha-value>)',
          600: 'rgb(var(--c-ink-600) / <alpha-value>)',
          500: 'rgb(var(--c-ink-500) / <alpha-value>)',
        },
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        night: 'rgb(var(--c-night) / <alpha-value>)',
        nightalt: 'rgb(var(--c-night-alt) / <alpha-value>)',
        gold: {
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          light: 'rgb(var(--c-gold-light) / <alpha-value>)',
          dark: 'rgb(var(--c-gold-dark) / <alpha-value>)',
          deep: 'rgb(var(--c-gold-deep) / <alpha-value>)',
        },
        ash: {
          DEFAULT: 'rgb(var(--c-ash) / <alpha-value>)',
          light: 'rgb(var(--c-ash-light) / <alpha-value>)',
          dark: 'rgb(var(--c-ash-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        brand: ['Montserrat', 'Inter', 'sans-serif'],
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
        'kenburns': 'kenburns 7s ease-out forwards',
        'float': 'float 9s ease-in-out infinite',
      },
      keyframes: {
        kenburns: { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.08)' } },
        float: { '0%, 100%': { transform: 'translate(0, 0)' }, '50%': { transform: 'translate(30px, -24px)' } },
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
