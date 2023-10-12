/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'spot': "inset 0.5px 1px 1px 0 hsla(0,0%,100%,.125);",
        'spot-down': "inset -0.5px -1px 1px 0 hsla(0,0%,100%,.125);"
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'pop-in': 'popIn 0.5s ease-out forwards',
        'pop-out': 'popOut 0.5s ease-out forwards',
        'fill': 'fill 0.5s ease-in-out forwards',
        'zoom-out': 'zoomOut 0.3s ease-in-out forwards',
        'zoom-in': 'zoomIn 0.3s ease-in-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        popIn: {
          '0%': { transform: 'translateY(12px)', opacity: 0 },
          '100%': { transform: 'translateX(0px)', opacity: 1 },
        },
        popOut: {
          '0%': { transform: 'translateX(0px)', opacity: 1 },
          '100%': { transform: 'translateY(12px)', opacity: 0 },
        },
        fill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.8)', opacity: 0 },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        blurIn: {
          '0%': { filter: 'blur(0px)'},
          '100%': { filter: 'blur(10px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)'},
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
	plugins: [require('tailwindcss-safe-area')],
}
