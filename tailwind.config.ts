import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'scalar-red': {
          DEFAULT: '#A80000',
          light: '#C50000',
        },
        'scalar-black': {
          DEFAULT: '#000000',
          charcoal: '#1a1a1a',
          dark: '#000000',
        },
        'atmospheric-blue': {
          DEFAULT: '#001A23',
        },
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'sans-serif'],
        heading: ['var(--font-archivo)', 'sans-serif'],
        body: ['var(--font-archivo)', 'sans-serif'],
        narrow: ['var(--font-archivo-narrow)', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
