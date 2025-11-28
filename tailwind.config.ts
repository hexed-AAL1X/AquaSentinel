import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077B6',
          light: '#0096C7',
          dark: '#023E8A',
        },
        secondary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C61',
          dark: '#E55A2B',
        },
        accent: {
          DEFAULT: '#2A9D8F',
          light: '#3DB5A5',
          dark: '#1F7A6E',
        },
        neutral: {
          light: '#E5E5E5',
          DEFAULT: '#999999',
          dark: '#333333',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
