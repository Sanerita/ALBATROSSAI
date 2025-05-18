const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        navy: {
          DEFAULT: '#12113d',
          50: '#f0f0ff',
          100: '#e0e0fa',
          200: '#c7c7f0',
          300: '#a0a0e0',
          400: '#7878d0',
          500: '#12113d', // Your base color
          600: '#0e0d30',
          700: '#0a0923',
          800: '#060516',
          900: '#020109',
        },
        gold: {
          DEFAULT: '#dcae3e',
          50: '#fff9e6',
          100: '#ffefb8',
          200: '#ffe58a',
          300: '#e8c466', // light
          400: '#dcae3e', // DEFAULT
          500: '#c5972a', // dark
          600: '#ad8016',
          700: '#966902',
          800: '#7e5200',
          900: '#663b00',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      boxShadow: {
        'navy': '0 4px 14px 0 rgba(18, 17, 61, 0.2)',
        'gold': '0 4px 14px 0 rgba(220, 174, 62, 0.3)',
        ...colors.boxShadow, // Spread the default shadows here
      }
    },
    boxShadow: { // Define custom shadows at the top level if you want to override
      'custom-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'custom-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'custom-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      'custom-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}