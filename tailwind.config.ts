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
          dark: '#0a0a0a',
        },
      },
      fontFamily: {
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
        sans: ['var(--font-ibm-plex-sans)', 'sans-serif'],
        heading: ['var(--font-ibm-plex-mono)', 'monospace'],
        body: ['var(--font-ibm-plex-sans)', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
