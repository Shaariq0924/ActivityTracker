module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}"
  ],
  theme: {
    extend: {
      colors: {
        at: {
          bg:      '#0a0805',
          surface: '#13100a',
          card:    '#1a1510',
          border:  '#2a2015',
          amber:   '#f59e0b',
          orange:  '#f97316',
          gold:    '#fbbf24',
          green:   '#10b981',
          cyan:    '#06b6d4',
          white:   '#fef9f0',
          muted:   '#78716c',
        }
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body:    ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber':  '0 0 24px rgba(245, 158, 11, 0.35)',
        'glow-orange': '0 0 24px rgba(249, 115, 22, 0.3)',
      }
    },
  },
  plugins: [],
};
