/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* a16z surface system — light default, dark overrides via [data-theme="dark"] */
        surface: {
          0: '#F6F4EE',   /* travertine-05 */
          1: '#F0ECE3',   /* travertine-1  */
          2: '#FFFFFF',   /* white         */
          3: '#F0ECE3',   /* travertine-1  */
          4: '#E7E1D2',   /* travertine-15 */
        },
        border: {
          subtle:  '#E7E1D2',   /* travertine-15 */
          default: '#C7BDA9',   /* loggia-3      */
          strong:  '#ACA08D',   /* loggia        */
        },
        /* remap zinc → a16z neutral scale */
        zinc: {
          200: '#000000',
          300: '#272727',
          400: '#504C4A',
          500: '#727069',   /* truffle        */
          600: '#727069',   /* truffle        */
          700: '#ACA08D',   /* loggia (muted) */
          800: '#ACA08D',
          900: '#C7BDA9',
        },
        /* remap violet → a16z emerald / jade */
        violet: {
          300: '#7FB2AC',   /* jade-3   */
          400: '#336D5D',   /* jade     */
          500: '#336D5D',   /* jade     */
          600: '#002D2D',   /* emerald  */
          700: '#134F47',   /* emerald-6 */
          800: '#001A1A',
          900: '#001A1A',
          950: '#002D2D',
        },
        /* remap cyan → a16z riviera */
        cyan: {
          300: '#8AB1BE',
          400: '#15627C',
          500: '#15627C',
        },
        /* a16z named palette */
        emerald:  '#002D2D',
        jade:     '#336D5D',
        sapphire: '#092344',
        rosewood: '#490314',
        truffle:  '#727069',
        loggia:   '#ACA08D',
        bergamot: '#C69344',
        travertine: {
          DEFAULT: '#E1D9C7',
          '05': '#F6F4EE',
          '1':  '#F0ECE3',
          '15': '#E7E1D2',
        },
      },
      fontFamily: {
        orpheus:      ['orpheus-pro',      "'Big Caslon'",  'Constantia',     'Georgia', 'serif'],
        domaine:      ['domaine-text',     'Baskerville',   'Georgia',        'serif'],
        'domaine-sans':['domaine-sans-text',"'Helvetica Neue'",'Arial',       'sans-serif'],
        sans:         ['domaine-sans-text', "'Helvetica Neue'", 'Arial',      'sans-serif'],
        mono:         ["'JetBrains Mono'", "'Fira Code'",   'monospace'],
      },
      animation: {
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGlow: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
