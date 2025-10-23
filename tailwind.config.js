/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enables toggling via html.dark
  theme: {
    extend: {
      colors: {
        redMain: 'var(--red-main)', // use CSS variables directly
        subHeadingGray: 'var(--subheading-gray)',
        text: 'var(--text)',
        background: 'var(--bg)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'serif'],
      },
      fontSize: {
        h1: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        base: ['1rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        button: ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text)',
            a: { color: 'var(--red-main)' },
            h1: { color: 'var(--red-main)' },
            h2: { color: 'var(--subheading-gray)' },
            p: { color: 'var(--text)' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
