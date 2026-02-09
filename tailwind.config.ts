import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-archivo)', 'sans-serif'],
        heading: ['var(--font-archivo)', 'sans-serif'],
        narrow: ['var(--font-archivo-narrow)', 'sans-serif'],
        mono: ['monospace'],
      },
      colors: {
        'scalar-red': '#A80000',
        'scalar-black': '#000502',
        'scalar-black-charcoal': '#1a1a1a',
        parchment: '#FCFBF8',
        'atmospheric-blue': {
          DEFAULT: '#001A23',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
