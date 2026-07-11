/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Plaid design tokens
        primary:        '#05565c',
        'primary-bright':'#088181',
        'primary-deep': '#034049',
        ink:            '#012e37',
        'ink-soft':     '#555555',
        'ink-surface':  '#00172e',
        canvas:         '#ffffff',
        paper:          '#f9f9ff',
        cloud:          '#f9fafb',
        hairline:       '#d8fef3',
        'hairline-strong': '#012e37',
        link:           '#0a71ac',
        'accent-glow':  '#10d1b7',
        'accent-mint':  '#b1eefc',
        // Trust tier colours (kept for TrustBadge)
        bronze:   '#CD7F32',
        silver:   '#A8A9AD',
        gold:     '#FFD700',
        platinum: '#E5E4E2',
      },
      fontFamily: {
        // Plaid uses proprietary fonts; we use best-match Google Fonts
        display: ['"Plus Jakarta Sans"', 'sans-serif'],   // Plaid Sans substitute
        body:    ['"Inter"', 'sans-serif'],                // Cern substitute
        mono:    ['"Fira Code"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['5rem',   { lineHeight: '1.1',  fontWeight: '500' }],
        'display-lg': ['3.75rem',{ lineHeight: '1.15', fontWeight: '500' }],
        'display-md': ['2.5rem', { lineHeight: '1.2',  fontWeight: '500' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3',  fontWeight: '500' }],
        'body-lg':    ['1.25rem',{ lineHeight: '1.5',  fontWeight: '400' }],
        'body-md':    ['1rem',   { lineHeight: '1.6',  fontWeight: '400' }],
        'caption-md': ['0.875rem',{ lineHeight: '1.5', fontWeight: '400' }],
        'caption-sm': ['0.75rem',{ lineHeight: '1.5',  fontWeight: '400' }],
        'btn':        ['0.8125rem',{ lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.13px' }],
      },
      borderRadius: {
        'none': '0px',
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        'pill': '9999px',
      },
      spacing: {
        'xxs': '4px',
        'xs':  '8px',
        'sm':  '12px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '32px',
        'xxl': '48px',
        'section': '80px',
      },
      boxShadow: {
        'soft-lift': 'rgba(18,18,18,0.08) 0px 2px 4px 0px',
        'card':      'rgba(0,0,0,0.06) 0px 2px 8px 0px, rgba(85,85,85,0.12) 0px 6px 12px 0px',
        'modal':     'rgba(0,0,0,0.2) 0px 4px 8px 0px',
        'glow-teal': '0 0 36px 5px #10d1b7',
        'focus-blue':'0 0 0 3px rgba(10,113,172,0.2)',
      },
      transitionDuration: {
        'fast': '100ms',
        'base': '300ms',
        'slow': '500ms',
      },
      maxWidth: {
        'content': '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
// appended animation tokens — handled in index.css directly
