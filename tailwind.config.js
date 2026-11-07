/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border, 220 13% 91%))',
        input: 'hsl(var(--input, 220 13% 91%))',
        ring: 'hsl(var(--ring, 224 76.3% 48%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 224 71.4% 4.1%))',
        primary: {
          DEFAULT: 'hsl(var(--primary, 224 76.3% 48%))',
          foreground: 'hsl(var(--primary-foreground, 0 0% 100%))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'page': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'page-lg': '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
