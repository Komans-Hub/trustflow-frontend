/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:     '#0A0F1E',
        'navy-2': '#0D1426',
        'navy-3': '#111827',
        'navy-4': '#1a2235',
        cyan:     '#22D3EE',
        'cyan-dim': '#0e7490',
        bronze:   '#CD7F32',
        silver:   '#A8A9AD',
        gold:     '#FFD700',
        platinum: '#E5E4E2',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"DM Sans"',       'sans-serif'],
        mono:    ['"Fira Code"',     'monospace'],
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease both',
        'pulse-slow':'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
