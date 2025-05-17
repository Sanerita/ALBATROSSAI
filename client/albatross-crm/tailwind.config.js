/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          navy: {
            DEFAULT: '#12113d',
            light: '#1a1a4a',
          },
          gold: {
            DEFAULT: '#dcae3e',
            light: '#e8c466',
            dark: '#c5972a',
          },
        },
        animation: {
          'pulse-slow': 'pulse 3s ease-in-out infinite',
        }
      },
    },
    plugins: [],
  }