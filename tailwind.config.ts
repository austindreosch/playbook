import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';

export const texts = {
  'title-h1': [
    '2.75rem',
    {
      lineHeight: '3.25rem',
      letterSpacing: '-0.01em',
      fontWeight: '500',
    },
  ],
  'title-h2': [
    '2.25rem',
    {
      lineHeight: '2.75rem',
      letterSpacing: '-0.01em',
      fontWeight: '500',
    },
  ],
  'title-h3': [
    '1.875rem',
    {
      lineHeight: '2.25rem',
      letterSpacing: '-0.01em',
      fontWeight: '500',
    },
  ],
  'title-h4': [
    '1.5rem',
    {
      lineHeight: '1.875rem',
      letterSpacing: '-0.005em',
      fontWeight: '500',
    },
  ],
  'title-h5': [
    '1.125rem',
    {
      lineHeight: '1.375rem',
      letterSpacing: '0em',
      fontWeight: '500',
    },
  ],
  'title-h6': [
    '1rem',
    {
      lineHeight: '1.375rem',
      letterSpacing: '0em',
      fontWeight: '500',
    },
  ],
  'label-xl': [
    '1.125rem',
    {
      lineHeight: '1.5rem',
      letterSpacing: '-0.015em',
      fontWeight: '500',
    },
  ],
  'label-lg': [
    '0.875rem',
    {
      lineHeight: '1.25rem',
      letterSpacing: '-0.015em',
      fontWeight: '500',
    },
  ],
  'label-md': [
    '0.8rem',
    {
      lineHeight: '1.2rem',
      letterSpacing: '-0.011em',
      fontWeight: '500',
    },
  ],
  'label-sm': [
    '0.7rem',
    {
      lineHeight: '0.9rem',
      letterSpacing: '-0.006em',
      fontWeight: '500',
    },
  ],
  'label-xs': [
    '0.625rem',
    {
      lineHeight: '0.8rem',
      letterSpacing: '0em',
      fontWeight: '500',
    },
  ],
  'paragraph-xl': [
    '1.125rem',
    {
      lineHeight: '1.5rem',
      letterSpacing: '-0.015em',
      fontWeight: '400',
    },
  ],
  'paragraph-lg': [
    '0.875rem',
    {
      lineHeight: '1.25rem',
      letterSpacing: '-0.015em',
      fontWeight: '400',
    },
  ],
  'paragraph-md': [
    '0.8rem',
    {
      lineHeight: '1.2rem',
      letterSpacing: '-0.011em',
      fontWeight: '400',
    },
  ],
  'paragraph-sm': [
    '0.7rem',
    {
      lineHeight: '1rem',
      letterSpacing: '-0.006em',
      fontWeight: '400',
    },
  ],
  'paragraph-xs': [
    '0.625rem',
    {
      lineHeight: '0.8rem',
      letterSpacing: '0em',
      fontWeight: '400',
    },
  ],
  'subheading-md': [
    '0.8rem',
    {
      lineHeight: '1.2rem',
      letterSpacing: '0.06em',
      fontWeight: '500',
    },
  ],
  'subheading-sm': [
    '0.7rem',
    {
      lineHeight: '1rem',
      letterSpacing: '0.06em',
      fontWeight: '500',
    },
  ],
  'subheading-xs': [
    '0.6rem',
    {
      lineHeight: '0.75rem',
      letterSpacing: '0.04em',
      fontWeight: '500',
    },
  ],
  'subheading-2xs': [
    '0.55rem',
    {
      lineHeight: '0.7rem',
      letterSpacing: '0.02em',
      fontWeight: '500',
    },
  ],
  'doc-label': [
    '0.875rem',
    {
      lineHeight: '1.5rem',
      letterSpacing: '-0.015em',
      fontWeight: '500',
    },
  ],
  'doc-paragraph': [
    '0.875rem',
    {
      lineHeight: '1.5rem',
      letterSpacing: '-0.015em',
      fontWeight: '400',
    },
  ],
} as unknown as Record<string, string>;

export const shadows = {
  'regular-xs': '0 1px 2px 0 #0a0d1408',
  'regular-sm': '0 2px 4px #1b1c1d0a',
  'regular-md': '0 16px 32px -12px #0e121b1a',
  'button-primary-focus': [
    '0 0 0 2px theme(colors.bg[white-0])',
    '0 0 0 4px theme(colors.primary[alpha-10])',
  ],
  'button-important-focus': [
    '0 0 0 2px theme(colors.bg[white-0])',
    '0 0 0 4px theme(colors.neutral[alpha-16])',
  ],
  'button-error-focus': [
    '0 0 0 2px theme(colors.bg[white-0])',
    '0 0 0 4px theme(colors.red[alpha-10])',
  ],
  'fancy-buttons-neutral': ['0 1px 2px 0 #1b1c1d7a', '0 0 0 1px #242628'],
  'fancy-buttons-primary': [
    '0 1px 2px 0 #0e121b3d',
    '0 0 0 1px theme(colors.primary[base])',
  ],
  'fancy-buttons-error': [
    '0 1px 2px 0 #0e121b3d',
    '0 0 0 1px theme(colors.error[base])',
  ],
  'fancy-buttons-stroke': [
    '0 1px 3px 0 #0e121b1f',
    '0 0 0 1px theme(colors.stroke[soft-200])',
  ],
  'toggle-switch': ['0 6px 10px 0 #0e121b0f', '0 2px 4px 0 #0e121b08'],
  'switch-thumb': ['0 4px 8px 0 #1b1c1d0f', '0 2px 4px 0 #0e121b14'],
  tooltip: ['0 12px 24px 0 #0e121b0f', '0 1px 2px 0 #0e121b08'],
} as unknown as Record<string, string>;

export const borderRadii = {
  '10': '.625rem',
  '20': '1.25rem',
} as unknown as Record<string, string>;

const config = {
  darkMode: ['class'],
  safelist: ['.dark'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [
    'prettier-plugin-tailwindcss',
    tailwindcssAnimate,
    require('tailwind-scrollbar'),
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        '.icon': {
          width: theme('width.icon'),
          height: theme('height.icon'),
        },
        '.icon-sm': {
          width: theme('width.icon-sm'),
          height: theme('height.icon-sm'),
        },
        '.icon-xs': {
          width: theme('width.icon-xs'),
          height: theme('height.icon-xs'),
        },
      };
      addUtilities(newUtilities);
    },
  ],
  theme: {
    colors: {
      // New semantic color system
      neutral: {
        '0': 'hsl(var(--neutral-0))',
        '50': 'hsl(var(--neutral-50))',
        '100': 'hsl(var(--neutral-100))',
        '200': 'hsl(var(--neutral-200))',
        '300': 'hsl(var(--neutral-300))',
        '400': 'hsl(var(--neutral-400))',
        '500': 'hsl(var(--neutral-500))',
        '600': 'hsl(var(--neutral-600))',
        '700': 'hsl(var(--neutral-700))',
        '800': 'hsl(var(--neutral-800))',
        '900': 'hsl(var(--neutral-900))',
        '950': 'hsl(var(--neutral-950))',
        'alpha-24': 'hsl(var(--neutral-alpha-24))',
        'alpha-16': 'hsl(var(--neutral-alpha-16))',
        'alpha-10': 'hsl(var(--neutral-alpha-10))',
      },
      blue: {
        '50': 'hsl(var(--blue-50))',
        '100': 'hsl(var(--blue-100))',
        '200': 'hsl(var(--blue-200))',
        '300': 'hsl(var(--blue-300))',
        '400': 'hsl(var(--blue-400))',
        '500': 'hsl(var(--blue-500))',
        '600': 'hsl(var(--blue-600))',
        '700': 'hsl(var(--blue-700))',
        '800': 'hsl(var(--blue-800))',
        '900': 'hsl(var(--blue-900))',
        '950': 'hsl(var(--blue-950))',
        'alpha-24': 'hsl(var(--blue-alpha-24))',
        'alpha-16': 'hsl(var(--blue-alpha-16))',
        'alpha-10': 'hsl(var(--blue-alpha-10))',
      },
      orange: {
        '50': 'hsl(var(--orange-50))',
        '100': 'hsl(var(--orange-100))',
        '200': 'hsl(var(--orange-200))',
        '300': 'hsl(var(--orange-300))',
        '400': 'hsl(var(--orange-400))',
        '500': 'hsl(var(--orange-500))',
        '600': 'hsl(var(--orange-600))',
        '700': 'hsl(var(--orange-700))',
        '800': 'hsl(var(--orange-800))',
        '900': 'hsl(var(--orange-900))',
        '950': 'hsl(var(--orange-950))',
        'alpha-24': 'hsl(var(--orange-alpha-24))',
        'alpha-16': 'hsl(var(--orange-alpha-16))',
        'alpha-10': 'hsl(var(--orange-alpha-10))',
      },
      red: {
        '50': 'hsl(var(--red-50))',
        '100': 'hsl(var(--red-100))',
        '200': 'hsl(var(--red-200))',
        '300': 'hsl(var(--red-300))',
        '400': 'hsl(var(--red-400))',
        '500': 'hsl(var(--red-500))',
        '600': 'hsl(var(--red-600))',
        '700': 'hsl(var(--red-700))',
        '800': 'hsl(var(--red-800))',
        '900': 'hsl(var(--red-900))',
        '950': 'hsl(var(--red-950))',
        'alpha-24': 'hsl(var(--red-alpha-24))',
        'alpha-16': 'hsl(var(--red-alpha-16))',
        'alpha-10': 'hsl(var(--red-alpha-10))',
      },
      green: {
        '50': 'hsl(var(--green-50))',
        '100': 'hsl(var(--green-100))',
        '200': 'hsl(var(--green-200))',
        '300': 'hsl(var(--green-300))',
        '400': 'hsl(var(--green-400))',
        '500': 'hsl(var(--green-500))',
        '600': 'hsl(var(--green-600))',
        '700': 'hsl(var(--green-700))',
        '800': 'hsl(var(--green-800))',
        '900': 'hsl(var(--green-900))',
        '950': 'hsl(var(--green-950))',
        'alpha-24': 'hsl(var(--green-alpha-24))',
        'alpha-16': 'hsl(var(--green-alpha-16))',
        'alpha-10': 'hsl(var(--green-alpha-10))',
      },
      yellow: {
        '50': 'hsl(var(--yellow-50))',
        '100': 'hsl(var(--yellow-100))',
        '200': 'hsl(var(--yellow-200))',
        '300': 'hsl(var(--yellow-300))',
        '400': 'hsl(var(--yellow-400))',
        '500': 'hsl(var(--yellow-500))',
        '600': 'hsl(var(--yellow-600))',
        '700': 'hsl(var(--yellow-700))',
        '800': 'hsl(var(--yellow-800))',
        '900': 'hsl(var(--yellow-900))',
        '950': 'hsl(var(--yellow-950))',
        'alpha-24': 'hsl(var(--yellow-alpha-24))',
        'alpha-16': 'hsl(var(--yellow-alpha-16))',
        'alpha-10': 'hsl(var(--yellow-alpha-10))',
      },
      purple: {
        '50': 'hsl(var(--purple-50))',
        '100': 'hsl(var(--purple-100))',
        '200': 'hsl(var(--purple-200))',
        '300': 'hsl(var(--purple-300))',
        '400': 'hsl(var(--purple-400))',
        '500': 'hsl(var(--purple-500))',
        '600': 'hsl(var(--purple-600))',
        '700': 'hsl(var(--purple-700))',
        '800': 'hsl(var(--purple-800))',
        '900': 'hsl(var(--purple-900))',
        '950': 'hsl(var(--purple-950))',
        'alpha-24': 'hsl(var(--purple-alpha-24))',
        'alpha-16': 'hsl(var(--purple-alpha-16))',
        'alpha-10': 'hsl(var(--purple-alpha-10))',
      },
      sky: {
        '50': 'hsl(var(--sky-50))',
        '100': 'hsl(var(--sky-100))',
        '200': 'hsl(var(--sky-200))',
        '300': 'hsl(var(--sky-300))',
        '400': 'hsl(var(--sky-400))',
        '500': 'hsl(var(--sky-500))',
        '600': 'hsl(var(--sky-600))',
        '700': 'hsl(var(--sky-700))',
        '800': 'hsl(var(--sky-800))',
        '900': 'hsl(var(--sky-900))',
        '950': 'hsl(var(--sky-950))',
        'alpha-24': 'hsl(var(--sky-alpha-24))',
        'alpha-16': 'hsl(var(--sky-alpha-16))',
        'alpha-10': 'hsl(var(--sky-alpha-10))',
      },
      pink: {
        '50': 'hsl(var(--pink-50))',
        '100': 'hsl(var(--pink-100))',
        '200': 'hsl(var(--pink-200))',
        '300': 'hsl(var(--pink-300))',
        '400': 'hsl(var(--pink-400))',
        '500': 'hsl(var(--pink-500))',
        '600': 'hsl(var(--pink-600))',
        '700': 'hsl(var(--pink-700))',
        '800': 'hsl(var(--pink-800))',
        '900': 'hsl(var(--pink-900))',
        '950': 'hsl(var(--pink-950))',
        'alpha-24': 'hsl(var(--pink-alpha-24))',
        'alpha-16': 'hsl(var(--pink-alpha-16))',
        'alpha-10': 'hsl(var(--pink-alpha-10))',
      },
      teal: {
        '50': 'hsl(var(--teal-50))',
        '100': 'hsl(var(--teal-100))',
        '200': 'hsl(var(--teal-200))',
        '300': 'hsl(var(--teal-300))',
        '400': 'hsl(var(--teal-400))',
        '500': 'hsl(var(--teal-500))',
        '600': 'hsl(var(--teal-600))',
        '700': 'hsl(var(--teal-700))',
        '800': 'hsl(var(--teal-800))',
        '900': 'hsl(var(--teal-900))',
        '950': 'hsl(var(--teal-950))',
        'alpha-24': 'hsl(var(--teal-alpha-24))',
        'alpha-16': 'hsl(var(--teal-alpha-16))',
        'alpha-10': 'hsl(var(--teal-alpha-10))',
      },
      white: {
        DEFAULT: '#fff',
        'alpha-24': 'hsl(var(--white-alpha-24))',
        'alpha-16': 'hsl(var(--white-alpha-16))',
        'alpha-10': 'hsl(var(--white-alpha-10))',
      },
      black: {
        DEFAULT: '#000',
        'alpha-24': 'hsl(var(--black-alpha-24))',
        'alpha-16': 'hsl(var(--black-alpha-16))',
        'alpha-10': 'hsl(var(--black-alpha-10))',
      },
      primary: {
        dark: 'hsl(var(--primary-dark))',
        darker: 'hsl(var(--primary-darker))',
        base: 'hsl(var(--primary-base))',
        'alpha-24': 'hsl(var(--primary-alpha-24))',
        'alpha-16': 'hsl(var(--primary-alpha-16))',
        'alpha-10': 'hsl(var(--primary-alpha-10))',
        // ShadCN compatibility
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      static: {
        black: 'hsl(var(--static-black))',
        white: 'hsl(var(--static-white))',
      },
      bg: {
        'strong-950': 'hsl(var(--bg-strong-950))',
        'surface-800': 'hsl(var(--bg-surface-800))',
        'sub-300': 'hsl(var(--bg-sub-300))',
        'soft-200': 'hsl(var(--bg-soft-200))',
        'weak-50': 'hsl(var(--bg-weak-50))',
        'white-0': 'hsl(var(--bg-white-0))',
      },
      text: {
        'strong-950': 'hsl(var(--text-strong-950))',
        'sub-600': 'hsl(var(--text-sub-600))',
        'mid-500': 'hsl(var(--text-mid-500))',
        'soft-400': 'hsl(var(--text-soft-400))',
        'disabled-300': 'hsl(var(--text-disabled-300))',
        'white-0': 'hsl(var(--text-white-0))',
      },
      stroke: {
        'strong-950': 'hsl(var(--stroke-strong-950))',
        'sub-300': 'hsl(var(--stroke-sub-300))',
        'soft-200': 'hsl(var(--stroke-soft-200))',
        'white-0': 'hsl(var(--stroke-white-0))',
      },
      faded: {
        dark: 'hsl(var(--faded-dark))',
        base: 'hsl(var(--faded-base))',
        light: 'hsl(var(--faded-light))',
        lighter: 'hsl(var(--faded-lighter))',
      },
      information: {
        dark: 'hsl(var(--information-dark))',
        base: 'hsl(var(--information-base))',
        light: 'hsl(var(--information-light))',
        lighter: 'hsl(var(--information-lighter))',
      },
      warning: {
        dark: 'hsl(var(--warning-dark))',
        base: 'hsl(var(--warning-base))',
        light: 'hsl(var(--warning-light))',
        lighter: 'hsl(var(--warning-lighter))',
      },
      error: {
        dark: 'hsl(var(--error-dark))',
        base: 'hsl(var(--error-base))',
        light: 'hsl(var(--error-light))',
        lighter: 'hsl(var(--error-lighter))',
      },
      success: {
        dark: 'hsl(var(--success-dark))',
        base: 'hsl(var(--success-base))',
        light: 'hsl(var(--success-light))',
        lighter: 'hsl(var(--success-lighter))',
      },
      away: {
        dark: 'hsl(var(--away-dark))',
        base: 'hsl(var(--away-base))',
        light: 'hsl(var(--away-light))',
        lighter: 'hsl(var(--away-lighter))',
      },
      feature: {
        dark: 'hsl(var(--feature-dark))',
        base: 'hsl(var(--feature-base))',
        light: 'hsl(var(--feature-light))',
        lighter: 'hsl(var(--feature-lighter))',
      },
      verified: {
        dark: 'hsl(var(--verified-dark))',
        base: 'hsl(var(--verified-base))',
        light: 'hsl(var(--verified-light))',
        lighter: 'hsl(var(--verified-lighter))',
      },
      highlighted: {
        dark: 'hsl(var(--highlighted-dark))',
        base: 'hsl(var(--highlighted-base))',
        light: 'hsl(var(--highlighted-light))',
        lighter: 'hsl(var(--highlighted-lighter))',
      },
      stable: {
        dark: 'hsl(var(--stable-dark))',
        base: 'hsl(var(--stable-base))',
        light: 'hsl(var(--stable-light))',
        lighter: 'hsl(var(--stable-lighter))',
      },
      social: {
        apple: 'hsl(var(--social-apple))',
        twitter: 'hsl(var(--social-twitter))',
        github: 'hsl(var(--social-github))',
        notion: 'hsl(var(--social-notion))',
        tidal: 'hsl(var(--social-tidal))',
        amazon: 'hsl(var(--social-amazon))',
        zendesk: 'hsl(var(--social-zendesk))',
      },
      overlay: {
        DEFAULT: 'hsl(var(--overlay))',
      },
      transparent: 'transparent',
      current: 'currentColor',
      illustration: {
        'white-0': 'hsl(var(--illustration-white-0))',
        'weak-100': 'hsl(var(--illustration-weak-100))',
        'soft-200': 'hsl(var(--illustration-soft-200))',
        'sub-300': 'hsl(var(--illustration-sub-300))',
        'strong-400': 'hsl(var(--illustration-strong-400))',
      },
      // Preserved original Playbook colors
      neutral_old: '#FEF9F3',
      pb_darkergray: '#2d2d2d',
      pb_darkgray: '#383838',
      pb_darkgrayhover: '#4c4c4c',
      pb_mddarkgray: '#606060',
      pb_midgray: '#707070',
      pb_textgray: '#747474',
      pb_textlightgray: '#888888',
      pb_textlightergray: '#9c9c9c',
      pb_textlightestgray: '#afafaf',
      pb_textlighterestgray: '#c3c3c3',
      pb_lightgray: '#d7d7d7',
      pb_lightergray: '#ebebeb',
      pb_lightestgray: '#efefef',
      pb_backgroundgray: '#f5f5f5',
      pb_paperwhite: '#fcfcfc',
      pb_bluehover: '#1f7ec5',
      pb_bluedisabled: '#186299',
      pb_blue: {
        '50': '#e9f4fb',
        '100': '#bdddf4',
        '200': '#91c6ed',
        '300': '#64afe6',
        '400': '#4ea3e2',
        '500': '#3898df',
        '600': '#1f7ec5',
        '700': '#186299',
        '800': '#11466e',
        '900': '#0a2a42',
        DEFAULT: '#228cdb'
      },
      pb_orangehover: '#e6b949',
      pb_orangedisabled: '#b39039',
      pb_orange: {
        '50': '#fff5dc',
        '100': '#ffebb9',
        '200': '#ffe197',
        '300': '#ffdc85',
        '400': '#ffd774',
        '500': '#ffd262',
        '600': '#e6b949',
        '700': '#cca441',
        '800': '#997b31',
        '900': '#665220',
        DEFAULT: '#ffcd51'
      },
      pb_green: {
        '50': '#e5f7ed',
        '100': '#def5e9',
        '200': '#cdf0de',
        '300': '#bdebd3',
        '400': '#ace6c8',
        '500': '#9be1bc',
        '600': '#8bdcb1',
        '700': '#7ad7a6',
        '800': '#6ad29b',
        '900': '#59cd90',
        DEFAULT: '#59cd90'
      },
      pb_greenhover: '#50b982',
      pb_greendisabled: '#3e9065',
      pb_red: {
        '50': '#fdefee',
        '100': '#fce0dc',
        '200': '#fad0cb',
        '300': '#f8c1ba',
        '400': '#f7b1a9',
        '500': '#f5a197',
        '600': '#f39286',
        '700': '#f18275',
        '800': '#f07363',
        '900': '#ee6352',
        DEFAULT: '#ee6352'
      },
      pb_redhover: '#d6594a',
      pb_reddisabled: '#a74539',
      pb_pastelblue: '#79addc',
      pb_pastelpurple: '#ababef',
      pb_pastelorange: '#f5d491',
      pb_pastelred: '#f17e92',
      pb_pastelgreen: '#b8dca7',
      pb_pastelbrown: '#9b8e82',
      pb_pastelstone: '#d6d3c2',
      // ShadCN theme colors
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
    fontSize: {
      // New comprehensive typography system
      ...texts,
      inherit: 'inherit',
      // Preserved original custom sizes
      'xlg': '1.375rem',
      'md': '1rem',
      smd: '.925rem',
      'nums': '.825rem',
      'button': '.775rem',
      '2xs': '.650rem',
      '3xs': '.600rem',
      '4xs': '.550rem',
      '5xs': '.500rem',
      '6xs': '.450rem',
      '7xs': '.400rem',
      '8xs': '.350rem',
      '9xs': '.300rem',
    },
    extend: {
      screens: {
        xs: '475px',
        '2xs': '375px',
        '3xs': '275px',
        mdlg: '896px',
        xsh: { raw: '(min-height: 480px)' },
        smh: { raw: '(min-height: 610px)' },
        mdh: { raw: '(min-height: 890px)' },
        lgh: { raw: '(min-height: 1250px)' },
        xlh: { raw: '(min-height: 1400px)' },
        '2xlh': { raw: '(min-height: 2000px)' },
      },
      container: {
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1540px',
        },
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
        '8': '8px',
        '9': '9px',
        '10': '10px',
        '1.5': '1.9px'
      },
      width: {
        'icon-2xs': '0.7rem',
        'icon-xs': '0.8rem',
        'icon-sm': '0.9rem',
        'icon': '1.1rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '68': '17rem',
        '70': '17.5rem',
        '74': '18.5rem',
        '76': '19rem',
        '78': '19.5rem',
        '82': '20.5rem',
        '84': '21rem',
        '86': '21.5rem',
        '88': '22rem',
        '90': '22.5rem',
        '92': '23rem',
        '94': '23.5rem',
        '98': '24.5rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
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
        '12.5': '3.125rem'
      },
      height: {
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        'icon-xs': '0.8rem',
        'icon-sm': '0.9rem',
        'icon': '1.1rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        'button': '1.875rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '10.5': '2.625rem',
        '11.5': '2.875rem',
        '12.5': '3.125rem',
        '18': '4.5rem',
        '30': '7.5rem'
      },
      maxHeight: {
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        '8xl': '90rem'
      },
      maxWidth: {
        '7xl': '80rem',
        '8xl': '90rem',
        '9xl': '100rem',
        '10xl': '110rem',
        '11xl': '120rem',
      },
      ringOffsetWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
        '10': '10px',
        '12': '12px',
        '16': '16px'
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
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))'
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
      lineHeight: {
        'relaxed-plus': '1.9',
        'tighter': '1.1',
      },
      fontFamily: {
        sans: [
          'din-2014',
          'sans-serif'
        ],
        mono: [
          'var(--font-dm-mono)',
          'monospace'
        ]
      },
      borderRadius: {
        ...borderRadii,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        sm2: 'calc(var(--radius) - 5px)',
        xs: 'calc(var(--radius) - 6px)'
      },
      boxShadow: {
        // New comprehensive shadow system
        ...shadows,
        // Preserved original shadow
        sm_light: '0 1px 2px 0 rgb(0 0 0 / 0.08)',
        none: defaultTheme.boxShadow.none,
      },
      keyframes: {
        // New keyframes
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
          to: { height: '0', opacity: '0' },
        },
        'event-item-show': {
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        // Preserved original keyframes
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(-4%)'
          },
          '50%': {
            transform: 'translateY(4%)'
          }
        },
        'pop-bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5) translateY(25%)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05) translateY(0)'
          },
          '80%': {
            transform: 'scale(0.95) translateY(5%)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          }
        },
        'background-pan': {
          '0%': {
            backgroundPosition: '0% center'
          },
          '100%': {
            backgroundPosition: '-200% center'
          }
        },
        'spin-and-pulse': {
          '0%': {
            transform: 'scale(1) rotate(0deg)'
          },
          '50%': {
            transform: 'scale(1.2) rotate(180deg)'
          },
          '100%': {
            transform: 'scale(1) rotate(360deg)'
          }
        }
      },
      animation: {
        // New animations
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'event-item-show': 'event-item-show .5s cubic-bezier(0.6, 1, 0.75, 0.9) forwards',
        // Preserved original animations
        shimmer: 'shimmer 5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pop-bounce-in': 'pop-bounce-in 0.35s ease-out',
        'toast-hide': 'fade-out 0.3s ease-in-out forwards',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-out': 'fade-out 0.5s ease-in-out',
        'background-pan': 'background-pan 3s linear infinite',
        'spin-and-pulse': 'spin-and-pulse 0.8s ease-in-out infinite'
      }
    }
  }
} satisfies Config;

export default config;