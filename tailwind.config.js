/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // plugins: [require("daisyui"), ['prettier-plugin-tailwindcss']],
  plugins: ['prettier-plugin-tailwindcss', require("tailwindcss-animate")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#ffd166",
          "secondary": "#3c91e6",
          "accent": "#f59e0b",
          "neutral": "#4b5d67",
          "base-100": "#f5f5f5",
          "info": "#42a9e0",
          "success": "#4caf50",
          "warning": "#ffc107",
          "error": "#d32f2f",
        },
      },
    ],
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))'
      },
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
        '9': 'repeat(9, minmax(0, 1fr))',
        '10': 'repeat(10, minmax(0, 1fr))',
        '11': 'repeat(11, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      screens: {
        xs: '475px',
        '2xs': '375px',
        '3xs': '275px',
        mdlg: '896px'
      },
      fontSize: {
        '2xs': '.650rem',
        '3xs': '.600rem'
      },
      fontFamily: {},
      colors: {
        pb_darkgray: '#383838',
        pb_darkgrayhover: '#4c4c4c',
        pb_midgray: '#747474',
        pb_textgray: '#888888',
        pb_lightgray: '#d7d7d7',
        pb_lightergray: '#ebebeb',
        pb_backgroundgray: '#f4f4f4',
        pb_orange: '#F4B942',
        pb_orangehover: '#dca73b',
        pb_orangedisabled: '#ab822e',
        // 'pb-orange': {
        //   50:  '#fff8ec',
        //   100: '#fdf1d9',
        //   200: '#fceac6',
        //   300: '#fbe3b3',
        //   400: '#fadca1',
        //   500: '#f8d58e',
        //   600: '#f7ce7b',
        //   700: '#f6c768',
        //   800: '#f5c055',
        //   900: '#f4b942',
        // },
        pb_blue: '#3C91E6',
        pb_bluehover: '#3683cf',
        pb_bluedisabled: '#2a66a1',
        // 'pb-blue': {
        //   50:  '#ecf4fd',
        //   100: '#d8e9fa',
        //   200: '#c5def8',
        //   300: '#b1d3f5',
        //   400: '#9ec8f3',
        //   500: '#8abdf0',
        //   600: '#77b2ee',
        //   700: '#63a7eb',
        //   800: '#509ce9',
        //   900: '#3c91e6',
        // },
        pb_red: '#ee6352',
        pb_redhover: '#d6594a',
        // 'pb-red': {
        //   50: '#fef2f2',
        //   100: '#fee2e2',
        //   200: '#fecaca',
        //   300: '#fca5a5',
        //   400: '#f87171',
        //   500: '#ee6352',
        //   600: '#d6594a',
        //   700: '#b91c1c',
        //   800: '#991b1b',
        //   900: '#7f1d1d',
        //   950: '#450a0a',
        // },
        pb_green: '#59cd90',
        pb_greenhover: '#50b982',
        // 'pb-green': {
        //   50: '#f0fdf4',
        //   100: '#dcfce7',
        //   200: '#bbf7d0',
        //   300: '#86efac',
        //   400: '#59cd90',
        //   500: '#22c55e',
        //   600: '#50b982',
        //   700: '#15803d',
        //   800: '#166534',
        //   900: '#14532d',
        //   950: '#052e16',
        // },
        pb_salmon: '#f79d84',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'calc(var(--radius) - 6px)'
      },
      boxShadow: {
        'sm_light': '0 1px 2px 0 rgb(0 0 0 / 0.08)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(4%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 5s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    }
  },
  plugins: [],
}





