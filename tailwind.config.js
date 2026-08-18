/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand green — the FAB, primary actions, active states
        sprout: {
          DEFAULT: '#8FC96B',
          dark: '#7DBF5C', // pressed / checkmark fills
          // Spec value #5E9A42 scored 3.40:1 on paper — below AA for the
          // 12–13px sizes it is used at. Darkened along the same hue to
          // #4A7A34: 5.09 on paper, 4.87 on canvas, 4.56 on wash.green.
          // Doubles as a fill that carries white text at 5.09:1.
          deep: '#4A7A34',
        },
        // Surfaces
        ink: '#141914', // primary text, near-black with a green cast
        slate: '#5C6459', // secondary text — passes AA on every surface here
        // Spec value #9BA398 scored 2.48:1 on canvas — a hard AA failure that
        // section 12 calls out by name. #6D766A holds the same hue at 4.51 on
        // canvas / 4.72 on paper, and stays lighter than slate so the
        // three-step text hierarchy survives.
        mist: '#6D766A', // tertiary text, placeholders
        paper: '#FFFFFF', // card surfaces
        canvas: '#FAFAF7', // app background, warm off-white
        hairline: '#EAEBE7', // 1px dividers and card borders
        // Tinted surfaces, lifted from the goals + streak cards
        wash: {
          green: '#EDF5E6',
          yellow: '#F7F3D4',
          blue: '#DCE7F0',
          clay: '#F6DDDA',
        },
        // Accents for the rating tags only
        accent: {
          clay: '#E9A9A3',
          blue: '#B8CBDE',
          sage: '#A8CE96',
        },
      },
      borderRadius: {
        pill: '999px',
        card: '24px',
        tile: '18px',
        chip: '12px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(20, 25, 20, 0.06)',
        lift: '0 8px 32px rgba(20, 25, 20, 0.10)',
        fab: '0 6px 20px rgba(143, 201, 107, 0.40)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['34px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '800' }],
        title: ['24px', { lineHeight: '30px', letterSpacing: '-0.015em', fontWeight: '800' }],
        'body-lg': ['17px', { lineHeight: '26px' }],
        body: ['15px', { lineHeight: '22px' }],
        label: ['13px', { lineHeight: '18px', fontWeight: '600' }],
        caption: ['12px', { lineHeight: '16px' }],
      },
      maxWidth: { app: '430px' },
    },
  },
  plugins: [],
}
