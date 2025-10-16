/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        redBg: '#FEE2E2',
        grayBg:'#E5E7EB',
        whiteBg:'#FFFFFF',
        redMain: '#DC2626',
        subHeadingGray: '#374151',
      },
      container: {
      center: true,        // centers the container horizontally
      padding: {
        DEFAULT: "1rem",   // default padding on all sides
        sm: "2rem",        // small screens
        lg: "4rem",        // large screens
        xl: "5rem",        // extra large screens
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },

      fontFamily: {
        // Only Times New Roman globally
        sans: ['"Times New Roman"', 'serif'],
      },
      fontSize: {
        h1: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],      // main headings
        h2: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],      // subheadings
        base: ['1rem', { lineHeight: '1.75rem', fontWeight: '400' }],   // normal paragraphs
        button: ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],  // buttons
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.sans'),
            color: theme('colors.paragraphGray'),
            a: { color: theme('colors.redMain'), '&:hover': { color: theme('colors.redMain') } },
            h1: {
              fontSize: theme('fontSize.h1')[0],
              lineHeight: theme('fontSize.h1')[1].lineHeight,
              fontWeight: theme('fontSize.h1')[1].fontWeight,
              color: theme('colors.redMain'),
            },
            h2: {
              fontSize: theme('fontSize.h2')[0],
              lineHeight: theme('fontSize.h2')[1].lineHeight,
              fontWeight: theme('fontSize.h2')[1].fontWeight,
              color: theme('colors.subHeadingGray'),
            },
            p: {
              fontSize: theme('fontSize.base')[0],
              lineHeight: theme('fontSize.base')[1].lineHeight,
              fontWeight: theme('fontSize.base')[1].fontWeight,
              color: theme('colors.paragraphGray'),
            },
          },
        },
        professional: {
          css: {
            fontFamily: theme('fontFamily.sans'),
            color: theme('colors.paragraphGray'),
            a: { color: theme('colors.redMain') },
            h1: {
              fontSize: theme('fontSize.h1')[0],
              lineHeight: theme('fontSize.h1')[1].lineHeight,
              fontWeight: theme('fontSize.h1')[1].fontWeight,
              color: theme('colors.redMain'),
            },
            h2: {
              fontSize: theme('fontSize.h2')[0],
              lineHeight: theme('fontSize.h2')[1].lineHeight,
              fontWeight: theme('fontSize.h2')[1].fontWeight,
              color: theme('colors.subHeadingGray'),
            },
            p: {
              fontSize: theme('fontSize.base')[0],
              lineHeight: theme('fontSize.base')[1].lineHeight,
              fontWeight: theme('fontSize.base')[1].fontWeight,
              color: theme('colors.paragraphGray'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),

  ],
};
