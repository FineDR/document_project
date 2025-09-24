/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {

      fontFamily: {
        sans: [
          'Inter',           // Modern variable font
          '-apple-system',   // iOS/macOS
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif'
        ],
        serif: [
          'Merriweather',    // Elegant serif
          'Georgia',
          'Times New Roman',
          'serif'
        ],
        mono: [
          'Fira Code',       // Coding-friendly
          'Menlo',
          'Monaco',
          'Consolas',
          'Courier New',
          'monospace'
        ],
      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
      },
      colors: {
        primary: {
          DEFAULT: '#2A4D69',
          light: '#4B86B4',
        },
        neutralText: '#90A4AE',
        paperStart: '#F4F4F4',
        paperEnd: '#D9D9D9',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
