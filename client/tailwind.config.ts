import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A7C7E7',
          dark: '#6CA6CD',
          light: '#BBD6F2',
        },
        surface: '#E0E0E0',
        background: '#F5F5F5',
        accent: '#F4A261',
        success: '#8FBC8F',
        danger: '#E57373',
        navy: '#1E2A38',
        admin: '#FF6B35',
      },
      fontFamily: {
        sans: ['Verana', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'retro': '2px 2px 0px #4A8AB8',
        'retro-sm': '1px 1px 0px #4A8AB8',
        'inset': 'inset 2px 2px 4px rgba(0,0,0,0.1)',
        'pressed': 'inset 2px 2px 4px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;