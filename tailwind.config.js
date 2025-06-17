/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
      borderWidth: {
        '1.5': '1.9px',
        '3': '3px',
      },
      width: {
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '12.5': '3.125rem',
      },
      height: {
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '12.5': '3.125rem',
      },
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
        '3xs': '.600rem',
        '4xs': '.550rem',
        '5xs': '.500rem',
        '6xs': '.450rem',
        '7xs': '.400rem',
        '8xs': '.350rem',
        '9xs': '.300rem',
        'smd': '.925rem', // Added between sm (0.875rem) and md (1rem)
      },
      fontFamily: {
        sans: ['din-2014', 'sans-serif'],
        // If you want to use DIN 2014 Narrow as well, you can add it here:
        // narrow: ['"DIN 2014 Narrow"', 'sans-serif'],
      },
      colors: {
        pb_darkgray: '#383838',
        pb_darkgrayhover: '#4c4c4c',
        pb_mddarkgray: '#606060',
        pb_midgray: '#747474',
        pb_textgray: '#888888',
        pb_textlightgray: '#afafaf',
        pb_textlightergray: '#c3c3c3',
        pb_lightgray: '#d7d7d7',
        pb_lightergray: '#ebebeb',
        pb_lightestgray: '#efefef',
        pb_backgroundgray: '#f5f5f5',
        pb_paperwhite: '#fefefe',
        pb_bluehover: '#1f7ec5',
        pb_bluedisabled: '#186299',
        pb_blue: {
          50:  '#e9f4fb',
          100: '#bdddf4',
          200: '#91c6ed',
          300: '#64afe6',
          400: '#4ea3e2',
          500: '#3898df',
          DEFAULT: '#228cdb',
          600: '#1f7ec5',
          700: '#186299',
          800: '#11466e',
          900: '#0a2a42',
        },
        pb_orangehover: '#e6b949',
        pb_orangedisabled: '#b39039',
        pb_orange: {
          50:  '#fff5dc',
          100: '#ffebb9',
          200: '#ffe197',
          300: '#ffdc85',
          400: '#ffd774',
          500: '#ffd262',
          DEFAULT: '#ffcd51',
          600: '#e6b949',
          700: '#cca441',
          800: '#997b31',
          900: '#665220',
        },
        pb_green: '#59cd90',
        pb_greenhover: '#50b982',
        pb_greendisabled: '#3e9065',
        pb_red: '#ee6352',
        pb_redhover: '#d6594a',
        pb_reddisabled: '#a74539',
        pb_pastelblue: '#79addc',
        pb_pastelpurple: '#ababef',
        pb_pastelorange: '#f5d491',
        pb_pastelred: '#e28d9b',
        pb_pastelgreen: '#92c9be',
        pb_pastelbrown: '#9b8e82',
        pb_pastelstone: '#d6d3c2',



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
        },
        "pop-bounce-in": {
          '0%': { opacity: '0', transform: 'scale(0.5) translateY(25%)' },
          '50%': { opacity: '1', transform: 'scale(1.05) translateY(0)' },
          '80%': { transform: 'scale(0.95) translateY(5%)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        "fade-out": {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        }
      },
      animation: {
        shimmer: 'shimmer 5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        "pop-bounce-in": 'pop-bounce-in 0.35s ease-out',
        "toast-hide": 'fade-out 0.3s ease-in-out forwards',
      },
    }
  },
  plugins: [],
}





