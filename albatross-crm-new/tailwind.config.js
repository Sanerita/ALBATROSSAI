const colors = require('tailwindcss/colors')

module.exports = {
    darkMode: ["class"],
    content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			gray: 'colors.gray',
  			navy: {
  				'50': '#f0f0ff',
  				'100': '#e0e0fa',
  				'200': '#c7c7f0',
  				'300': '#a0a0e0',
  				'400': '#7878d0',
  				'500': '#12113d',
  				'600': '#0e0d30',
  				'700': '#0a0923',
  				'800': '#060516',
  				'900': '#12113d',
  				DEFAULT: '#12113d'
  			},
  			gold: {
  				'50': '#fff9e6',
  				'100': '#ffefb8',
  				'200': '#ffe58a',
  				'300': '#e8c466',
  				'400': '#dcae3e',
  				'500': '#c5972a',
  				'600': '#ad8016',
  				'700': '#966902',
  				'800': '#7e5200',
  				'900': '#663b00',
  				DEFAULT: '#dcae3e'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'pulse-slow': 'pulse 3s ease-in-out infinite',
  			'bounce-slow': 'bounce 2s infinite'
  		},
  		boxShadow: {
  			navy: '0 4px 14px 0 rgba(18, 17, 61, 0.2)',
  			gold: '0 4px 14px 0 rgba(220, 174, 62, 0.3)',
                ...colors.boxShadow
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},

  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
}