import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#7e7e7e',
        'background-light': '#f8f8f5',
        'background-dark': '#0a0a0a',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px'
      },
    },
  },
  plugins: [],
}
export default config