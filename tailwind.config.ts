import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

export const texts = {
  'title-h0': [
    '3.5rem', // 4.666666666666667rem * 0.75
    {
      lineHeight: '3.75rem', // 5.333333333333333rem * 0.75
      letterSpacing: '-0.015em',
      fontWeight: '600',
    },
  ],

  'title-h1': [
    '2.625rem', // 3.5rem * 0.75
    {
      lineHeight: '3rem', // 4rem * 0.75
      letterSpacing: '-0.01em',
      fontWeight: '700',
    },
  ],
  'title-h2': [
    '2.25rem', // 3rem * 0.75
    {
      lineHeight: '2.625rem', // 3.5rem * 0.75
      letterSpacing: '-0.01em',
      fontWeight: '700',
    },
  ],
  'title-h3': [
    '1.875rem', // 2.5rem * 0.75
    {
      lineHeight: '2.25rem', // 3rem * 0.75
      letterSpacing: '-0.01em',
      fontWeight: '700',
    },
  ],
  'title-h4': [
    '1.5rem', // 2rem * 0.75
    {
      lineHeight: '1.875rem', // 2.5rem * 0.75
      letterSpacing: '-0.005em',
      fontWeight: '500',
    },
  ],
  'title-h5': [
    '1.125rem', // 1.5rem * 0.75
    {
      lineHeight: '1.5rem', // 2rem * 0.75
      letterSpacing: '0em',
      fontWeight: '500',
    },
  ],
  'title-h6': [
    '0.9375rem', // 1.25rem * 0.75
    {
      lineHeight: '1.3125rem', // 1.75rem * 0.75
      letterSpacing: '0em',
      fontWeight: '500',
    },
  ],
  'label-2xl': [
    '1.125rem', // 1.5rem * 0.75
    {
      lineHeight: '1.5rem', // 2rem * 0.75
      letterSpacing: '-0.015em',
      fontWeight: '600',
    },
  ],
     'label-xl': [
     '0.984375rem', // 1.3125rem * 0.75 (between lg 0.84375rem and 2xl 1.125rem)
     {
       lineHeight: '1.3125rem', // 1.75rem * 0.75
       letterSpacing: '-0.015em',
       fontWeight: '600',
     },
   ],
  'label-lg': [
    '0.84375rem', // 1.125rem * 0.75
    {
      lineHeight: '1.125rem', // 1.5rem * 0.75
      letterSpacing: '-0.015em',
      fontWeight: '600',
    },
  ],
  'label-md': [
    '0.75rem', // 1rem * 0.75
    {
      lineHeight: '1.125rem', // 1.5rem * 0.75
      letterSpacing: '-0.011em',
      fontWeight: '600',
    },
  ],
  'label-sm': [
    '0.65625rem', // 0.875rem * 0.75
    {
      lineHeight: '0.9375rem', // 1.25rem * 0.75
      letterSpacing: '-0.006em',
      fontWeight: '600',
    },
  ],
  'label-xs': [
    '0.5625rem', // 0.75rem * 0.75
    {
      lineHeight: '0.75rem', // 1rem * 0.75
      letterSpacing: '0em',
      fontWeight: '600',
    },
  ],
  'paragraph-xl': [
    '1.125rem', // 1.5rem * 0.75
    {
      lineHeight: '1.5rem', // 2rem * 0.75
      letterSpacing: '-0.015em',
      fontWeight: '400',
    },
  ],
  'paragraph-lg': [
    '0.84375rem', // 1.125rem * 0.75
    {
      lineHeight: '1.125rem', // 1.5rem * 0.75
      letterSpacing: '-0.015em',
      fontWeight: '400',
    },
  ],
  'paragraph-md': [
    '0.75rem', // 1rem * 0.75
    {
      lineHeight: '1.125rem', // 1.5rem * 0.75
      letterSpacing: '-0.011em',
      fontWeight: '400',
    },
  ],
  'paragraph-sm': [
    '0.65625rem', // 0.875rem * 0.75
    {
      lineHeight: '0.9375rem', // 1.25rem * 0.75
      letterSpacing: '-0.006em',
      fontWeight: '400',
    },
  ],
  'paragraph-xs': [
    '0.5625rem', // 0.75rem * 0.75
    {
      lineHeight: '0.75rem', // 1rem * 0.75
      letterSpacing: '0em',
      fontWeight: '400',
    },
  ],
  'subheading-md': [
    '0.75rem', // 1rem * 0.75
    {
      lineHeight: '1.125rem', // 1.5rem * 0.75
      letterSpacing: '0.06em',
      fontWeight: '500',
    },
  ],
  'subheading-sm': [
    '0.65625rem', // 0.875rem * 0.75
    {
      lineHeight: '0.9375rem', // 1.25rem * 0.75
      letterSpacing: '0.06em',
      fontWeight: '500',
    },
  ],
  'subheading-xs': [
    '0.5625rem', // 0.75rem * 0.75
    {
      lineHeight: '0.75rem', // 1rem * 0.75
      letterSpacing: '0.04em',
      fontWeight: '500',
    },
  ],
  'subheading-2xs': [
    '0.515625rem', // 0.6875rem * 0.75
    {
      lineHeight: '0.5625rem', // 0.75rem * 0.75
      letterSpacing: '0.02em',
      fontWeight: '500',
    },
  ],
  'doc-label': [
    '0.84375rem', // 1.125rem * 0.75
    {
      lineHeight: '1.5rem', // 2rem * 0.75
      letterSpacing: '-0.015em',
      fontWeight: '500',
    },
  ],
  'doc-paragraph': [
    '0.84375rem', // 1.125rem * 0.75
    {
      lineHeight: '1.5rem', // 2rem * 0.75
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
  'custom-xs': [
    '0 0 0 1px rgba(51, 51, 51, 0.04)',
    '0 4px 8px -2px rgba(51, 51, 51, 0.06)',
    '0 2px 4px rgba(51, 51, 51, 0.04)',
    '0 1px 2px rgba(51, 51, 51, 0.04)',
    'inset 0 -1px 1px -0.5px rgba(51, 51, 51, 0.06)',
  ],
  'custom-sm': [
    '0 0 0 1px rgba(51, 51, 51, 0.04)',
    '0 16px 8px -8px rgba(51, 51, 51, 0.01)',
    '0 12px 6px -6px rgba(51, 51, 51, 0.02)',
    '0 5px 5px -2.5px rgba(51, 51, 51, 0.08)',
    '0 1px 3px -1.5px rgba(51, 51, 51, 0.16)',
    'inset 0 -0.5px 0.5px rgba(51, 51, 51, 0.08)',
  ],
  'custom-md': [
    '0 0 0 1px rgba(51, 51, 51, 0.04)',
    '0 1px 1px 0.5px rgba(51, 51, 51, 0.04)',
    '0 3px 3px -1.5px rgba(51, 51, 51, 0.02)',
    '0 6px 6px -3px rgba(51, 51, 51, 0.04)',
    '0 12px 12px -6px rgba(51, 51, 51, 0.04)',
    '0 24px 24px -12px rgba(51, 51, 51, 0.04)',
    '0 48px 48px -24px rgba(51, 51, 51, 0.04)',
    'inset 0 -1px 1px -0.5px rgba(51, 51, 51, 0.06)',
  ],
  'custom-lg': [
    '0 0 0 1px rgba(51, 51, 51, 0.04)',
    '0 1px 1px 0.5px rgba(51, 51, 51, 0.04)',
    '0 3px 3px -1.5px rgba(51, 51, 51, 0.02)',
    '0 6px 6px -3px rgba(51, 51, 51, 0.04)',
    '0 12px 12px -6px rgba(51, 51, 51, 0.04)',
    '0 24px 24px -12px rgba(51, 51, 51, 0.04)',
    '0 48px 48px -24px rgba(51, 51, 51, 0.04)',
    '0 96px 96px -32px rgba(51, 51, 51, 0.06)',
    'inset 0 -1px 1px -0.5px rgba(51, 51, 51, 0.06)',
  ],
} as unknown as Record<string, string>;

export const borderRadii = {
  '10': '.625rem',
  '20': '1.25rem',
} as unknown as Record<string, string>;

const config = {
  darkMode: ['class'],
  safelist: ['.dark'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',

    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    
  ],
  theme: {
    colors: {
      // ============================================================
      // ============↓↓↓↓↓↓ CUSTOM TAILWIND CONFIG ↓↓↓↓↓↓============
      // ============================================================

      pb_darkergray: '#2d2d2d',
      pb_darkgray: '#383838', // primary black
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
        '50': '#eef4f4',
        '100': '#def5e9',
        '200': '#cdf0de',
        '300': '#bdebd3',
        '400': '#ace6c8',
        '500': '#9be1bc',
        '600': '#8bdcb1',
        '700': '#7ad7a6',
        '800': '#6ad29b',
        '900': '#47a473',
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
        '900': '#be4f42',
        DEFAULT: '#ee6352'
      },
      pb_redhover: '#d6594a',
      pb_reddisabled: '#a74539',
      
      pb_pastelblue: '#79addc',
      pb_pastelpurple: '#ababef',
      pb_pastelorange: '#f5d491',
      pb_pastelred: '#f17e92',
      pb_pastelgreen: '#98c8a2',
      pb_pastelbrown: '#9b8e82',
      pb_pastelstone: '#d6d3c2',

      // ============================================================
      // ============↑↑↑↑↑↑ CUSTOM TAILWIND CONFIG ↑↑↑↑↑↑============
      // ============================================================

      pastelblue: '#79addc',
      pastelpurple: '#ababef',
      pastelorange: '#f5d491',
      pastelred: '#f17e92',
      pastelgreen: '#98c8a2',
      pastelbrown: '#9b8e82',
      pastelstone: '#d6d3c2',

      gray: {
        '0': 'var(--gray-0)',
        '50': 'var(--gray-50)',
        '100': 'var(--gray-100)',
        '150': 'var(--gray-150)',
        '200': 'var(--gray-200)',
        '250': 'var(--gray-250)',
        '300': 'var(--gray-300)',
        '350': 'var(--gray-350)',
        '400': 'var(--gray-400)',
        '450': 'var(--gray-450)',
        '500': 'var(--gray-500)',
        '600': 'var(--gray-600)',
        '700': 'var(--gray-700)',
        '800': 'var(--gray-800)',
        '900': 'var(--gray-900)',
        '950': 'var(--gray-950)',
        'alpha-24': 'var(--gray-alpha-24)',
        'alpha-16': 'var(--gray-alpha-16)',
        'alpha-10': 'var(--gray-alpha-10)',
      },
      slate: {
        '0': 'var(--slate-0)',
        '50': 'var(--slate-50)',
        '100': 'var(--slate-100)',
        '200': 'var(--slate-200)',
        '300': 'var(--slate-300)',
        '400': 'var(--slate-400)',
        '500': 'var(--slate-500)',
        '600': 'var(--slate-600)',
        '700': 'var(--slate-700)',
        '800': 'var(--slate-800)',
        '900': 'var(--slate-900)',
        '950': 'var(--slate-950)',
        'alpha-24': 'var(--slate-alpha-24)',
        'alpha-16': 'var(--slate-alpha-16)',
        'alpha-10': 'var(--slate-alpha-10)',
      },
      neutral: {
        '0': 'var(--neutral-0)',
        '50': 'var(--neutral-50)',
        '100': 'var(--neutral-100)',
        '200': 'var(--neutral-200)',
        '300': 'var(--neutral-300)',
        '400': 'var(--neutral-400)',
        '500': 'var(--neutral-500)',
        '600': 'var(--neutral-600)',
        '700': 'var(--neutral-700)',
        '800': 'var(--neutral-800)',
        '900': 'var(--neutral-900)',
        '950': 'var(--neutral-950)',
        'alpha-24': 'var(--neutral-alpha-24)',
        'alpha-16': 'var(--neutral-alpha-16)',
        'alpha-10': 'var(--neutral-alpha-10)',
      },
      blue: {
        '50': 'var(--blue-50)',
        '100': 'var(--blue-100)',
        '200': 'var(--blue-200)',
        '300': 'var(--blue-300)',
        '400': 'var(--blue-400)',
        '500': 'var(--blue-500)',
        '600': 'var(--blue-600)',
        '700': 'var(--blue-700)',
        '800': 'var(--blue-800)',
        '900': 'var(--blue-900)',
        '950': 'var(--blue-950)',
        'alpha-24': 'var(--blue-alpha-24)',
        'alpha-16': 'var(--blue-alpha-16)',
        'alpha-10': 'var(--blue-alpha-10)',
      },
      orange: {
        '50': 'var(--orange-50)',
        '100': 'var(--orange-100)',
        '200': 'var(--orange-200)',
        '300': 'var(--orange-300)',
        '400': 'var(--orange-400)',
        '500': 'var(--orange-500)',
        '600': 'var(--orange-600)',
        '700': 'var(--orange-700)',
        '800': 'var(--orange-800)',
        '900': 'var(--orange-900)',
        '950': 'var(--orange-950)',
        'alpha-24': 'var(--orange-alpha-24)',
        'alpha-16': 'var(--orange-alpha-16)',
        'alpha-10': 'var(--orange-alpha-10)',
      },
      red: {
        '50': 'var(--red-50)',
        '100': 'var(--red-100)',
        '200': 'var(--red-200)',
        '300': 'var(--red-300)',
        '400': 'var(--red-400)',
        '500': 'var(--red-500)',
        '600': 'var(--red-600)',
        '700': 'var(--red-700)',
        '800': 'var(--red-800)',
        '900': 'var(--red-900)',
        '950': 'var(--red-950)',
        'alpha-24': 'var(--red-alpha-24)',
        'alpha-16': 'var(--red-alpha-16)',
        'alpha-10': 'var(--red-alpha-10)',
      },
      green: {
        '50': 'var(--green-50)',
        '100': 'var(--green-100)',
        '200': 'var(--green-200)',
        '300': 'var(--green-300)',
        '400': 'var(--green-400)',
        '500': 'var(--green-500)',
        '600': 'var(--green-600)',
        '700': 'var(--green-700)',
        '800': 'var(--green-800)',
        '900': 'var(--green-900)',
        '950': 'var(--green-950)',
        'alpha-24': 'var(--green-alpha-24)',
        'alpha-16': 'var(--green-alpha-16)',
        'alpha-10': 'var(--green-alpha-10)',
      },
      yellow: {
        '50': 'var(--yellow-50)',
        '100': 'var(--yellow-100)',
        '200': 'var(--yellow-200)',
        '300': 'var(--yellow-300)',
        '400': 'var(--yellow-400)',
        '500': 'var(--yellow-500)',
        '600': 'var(--yellow-600)',
        '700': 'var(--yellow-700)',
        '800': 'var(--yellow-800)',
        '900': 'var(--yellow-900)',
        '950': 'var(--yellow-950)',
        'alpha-24': 'var(--yellow-alpha-24)',
        'alpha-16': 'var(--yellow-alpha-16)',
        'alpha-10': 'var(--yellow-alpha-10)',
      },
      purple: {
        '50': 'var(--purple-50)',
        '100': 'var(--purple-100)',
        '200': 'var(--purple-200)',
        '300': 'var(--purple-300)',
        '400': 'var(--purple-400)',
        '500': 'var(--purple-500)',
        '600': 'var(--purple-600)',
        '700': 'var(--purple-700)',
        '800': 'var(--purple-800)',
        '900': 'var(--purple-900)',
        '950': 'var(--purple-950)',
        'alpha-24': 'var(--purple-alpha-24)',
        'alpha-16': 'var(--purple-alpha-16)',
        'alpha-10': 'var(--purple-alpha-10)',
      },
      sky: {
        '50': 'var(--sky-50)',
        '100': 'var(--sky-100)',
        '200': 'var(--sky-200)',
        '300': 'var(--sky-300)',
        '400': 'var(--sky-400)',
        '500': 'var(--sky-500)',
        '600': 'var(--sky-600)',
        '700': 'var(--sky-700)',
        '800': 'var(--sky-800)',
        '900': 'var(--sky-900)',
        '950': 'var(--sky-950)',
        'alpha-24': 'var(--sky-alpha-24)',
        'alpha-16': 'var(--sky-alpha-16)',
        'alpha-10': 'var(--sky-alpha-10)',
      },
      pink: {
        '50': 'var(--pink-50)',
        '100': 'var(--pink-100)',
        '200': 'var(--pink-200)',
        '300': 'var(--pink-300)',
        '400': 'var(--pink-400)',
        '500': 'var(--pink-500)',
        '600': 'var(--pink-600)',
        '700': 'var(--pink-700)',
        '800': 'var(--pink-800)',
        '900': 'var(--pink-900)',
        '950': 'var(--pink-950)',
        'alpha-24': 'var(--pink-alpha-24)',
        'alpha-16': 'var(--pink-alpha-16)',
        'alpha-10': 'var(--pink-alpha-10)',
      },
      teal: {
        '50': 'var(--teal-50)',
        '100': 'var(--teal-100)',
        '200': 'var(--teal-200)',
        '300': 'var(--teal-300)',
        '400': 'var(--teal-400)',
        '500': 'var(--teal-500)',
        '600': 'var(--teal-600)',
        '700': 'var(--teal-700)',
        '800': 'var(--teal-800)',
        '900': 'var(--teal-900)',
        '950': 'var(--teal-950)',
        'alpha-24': 'var(--teal-alpha-24)',
        'alpha-16': 'var(--teal-alpha-16)',
        'alpha-10': 'var(--teal-alpha-10)',
      },
      white: {
        DEFAULT: '#fff',
        'alpha-24': 'var(--white-alpha-24)',
        'alpha-16': 'var(--white-alpha-16)',
        'alpha-10': 'var(--white-alpha-10)',
      },
      black: {
        DEFAULT: 'var(--black)',
        'alpha-24': 'var(--black-alpha-24)',
        'alpha-16': 'var(--black-alpha-16)',
        'alpha-10': 'var(--black-alpha-10)',
      },
      primary: {
        dark: 'var(--primary-dark)',
        darker: 'var(--primary-darker)',
        base: 'var(--primary-base)',
        'alpha-24': 'var(--primary-alpha-24)',
        'alpha-16': 'var(--primary-alpha-16)',
        'alpha-10': 'var(--primary-alpha-10)',
      },
      static: {
        black: 'var(--static-black)',
        white: 'var(--static-white)',
      },
      bg: {
        'strong-950': 'var(--bg-strong-950)',
        'surface-800': 'var(--bg-surface-800)',
        'sub-300': 'var(--bg-sub-300)',
        'soft-200': 'var(--bg-soft-200)',
        'weak-50': 'var(--bg-weak-50)',
        'weak-25': 'var(--bg-weak-25)',
        'white-0': 'var(--bg-white-0)',
      },
      text: {
        'strong-950': 'var(--text-strong-950)',
        'sub-600': 'var(--text-sub-600)',
        'soft-400': 'var(--text-soft-400)',
        'disabled-300': 'var(--text-disabled-300)',
        'white-0': 'var(--text-white-0)',
      },
      stroke: {
        'strong-950': 'var(--stroke-strong-950)',
        'sub-300': 'var(--stroke-sub-300)',
        'soft-200': 'var(--stroke-soft-200)',
        'soft-150': 'var(--stroke-soft-150)',
        'soft-100': 'var(--stroke-soft-100)',
        'soft-50': 'var(--stroke-soft-50)',
        'white-0': 'var(--stroke-white-0)',
      },
      faded: {
        dark: 'var(--faded-dark)',
        base: 'var(--faded-base)',
        light: 'var(--faded-light)',
        lighter: 'var(--faded-lighter)',
      },
      information: {
        dark: 'var(--information-dark)',
        base: 'var(--information-base)',
        light: 'var(--information-light)',
        lighter: 'var(--information-lighter)',
      },
      warning: {
        dark: 'var(--warning-dark)',
        base: 'var(--warning-base)',
        light: 'var(--warning-light)',
        lighter: 'var(--warning-lighter)',
      },
      error: {
        dark: 'var(--error-dark)',
        base: 'var(--error-base)',
        light: 'var(--error-light)',
        lighter: 'var(--error-lighter)',
      },
      success: {
        dark: 'var(--success-dark)',
        base: 'var(--success-base)',
        light: 'var(--success-light)',
        lighter: 'var(--success-lighter)',
      },
      away: {
        dark: 'var(--away-dark)',
        base: 'var(--away-base)',
        light: 'var(--away-light)',
        lighter: 'var(--away-lighter)',
      },
      feature: {
        dark: 'var(--feature-dark)',
        base: 'var(--feature-base)',
        light: 'var(--feature-light)',
        lighter: 'var(--feature-lighter)',
      },
      verified: {
        dark: 'var(--verified-dark)',
        base: 'var(--verified-base)',
        light: 'var(--verified-light)',
        lighter: 'var(--verified-lighter)',
      },
      highlighted: {
        dark: 'var(--highlighted-dark)',
        base: 'var(--highlighted-base)',
        light: 'var(--highlighted-light)',
        lighter: 'var(--highlighted-lighter)',
      },
      stable: {
        dark: 'var(--stable-dark)',
        base: 'var(--stable-base)',
        light: 'var(--stable-light)',
        lighter: 'var(--stable-lighter)',
      },
      social: {
        apple: 'var(--social-apple)',
        twitter: 'var(--social-twitter)',
        github: 'var(--social-github)',
        notion: 'var(--social-notion)',
        tidal: 'var(--social-tidal)',
        amazon: 'var(--social-amazon)',
        zendesk: 'var(--social-zendesk)',
      },
      overlay: {
        DEFAULT: 'var(--overlay)',
      },
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontSize: {
      ...texts,
      inherit: 'inherit',
    },
    boxShadow: {
      ...shadows,
      none: defaultTheme.boxShadow.none,
    },
    extend: {
      // ============================================================
      // ============↓↓↓↓↓↓ CUSTOM TAILWIND CONFIG ↓↓↓↓↓↓============
      // ============================================================

      spacing: {
        'icon':   '1.1rem',
        'icon-sm':'0.9rem',
        'icon-xs':'0.8rem',
        'icon-2xs':'0.7rem',
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

        'button': '1.875rem',

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
  		fontSize: {
        '2xs': '.650rem',
  			'3xs': '.600rem',
  			'4xs': '.550rem',
  			'5xs': '.500rem',
  			'6xs': '.450rem',
  			'7xs': '.400rem',
  			'8xs': '.350rem',
  			'9xs': '.300rem',
        
        inherit: 'inherit',
        'xlg': '1.375rem',
  			'md': '1rem',
  			'smd': '.925rem',
        'button': '.775rem',
  		},
      screens: {
        'xs': '475px',
  			'2xs': '375px',
  			'3xs': '275px',
  			'mdlg': '896px',

        'sh': { raw: '(min-height: 480px)' },
        'smh': { raw: '(min-height: 610px)' },
        'mdh': { raw: '(min-height: 890px)' },
        'lgh': { raw: '(min-height: 1250px)' },
        'xlh': { raw: '(min-height: 1400px)' },
        '2xlh': { raw: '(min-height: 2000px)' },

        '3xl': '1600px', // 1600px
        '4xl': '1920px', // 1920px
        '5xl': '2560px', // 2560px
        '6xl': '3840px', // 3840px
        '7xl': '5120px', // 5120px
        '8xl': '6400px', // 6400px
        '9xl': '7680px', // 7680px


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
      
      // ============================================================
      // ============↑↑↑↑↑↑ CUSTOM TAILWIND CONFIG ↑↑↑↑↑↑============
      // ============================================================

  
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: [
          'var(--font-dm-mono)',
          'monospace'
        ]
      },
      borderRadius: {
        ...borderRadii,
        // lg: 'var(--radius)',
  			// md: 'calc(var(--radius) - 2px)',
  			// sm: 'calc(var(--radius) - 4px)',
  			// xs: 'calc(var(--radius) - 6px)'
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 5s linear infinite',
  			float: 'float 6s ease-in-out infinite',
  			'pop-bounce-in': 'pop-bounce-in 0.35s ease-out',
  			'toast-hide': 'fade-out 0.3s ease-in-out forwards',
  			'fade-in': 'fade-in 0.5s ease-in-out',
  			'fade-out': 'fade-out 0.5s ease-in-out',
  			'background-pan': 'background-pan 3s linear infinite',
  			'spin-and-pulse': 'spin-and-pulse 0.8s ease-in-out infinite'
      },
      keyframes: {
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

          // ============================================================
          // ============↓↓↓↓↓↓ CUSTOM TAILWIND CONFIG ↓↓↓↓↓↓============
          // ============================================================

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
          },
          'event-item-show': {
            to: { opacity: '1', transform: 'translate3d(0,0,0)' },
          },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    'prettier-plugin-tailwindcss',
    require('tailwind-scrollbar'),
    function({ addUtilities }) {
      addUtilities({
        '.hw-icon': {
          'width': '1.2rem !important',
          'height': '1.2rem !important',
        },
        '.hw-icon-sm': {
          'width': '1.05rem !important',
          'height': '1.05rem !important',
        },
        '.hw-icon-xs': {
          'width': '0.9rem !important',
          'height': '0.9rem !important',
        },
        // '.hw-icon-2xs': {
        //   'width': '0.8rem !important',
        //   'height': '0.8rem !important',
        // },
        '.hw-icon-lg': {
          'width': '1.4rem !important',
          'height': '1.4rem !important',
        },
        '.hw-icon-xl': {
          'width': '1.6rem !important',
          'height': '1.6rem !important',
        },

        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            'display': 'none'
          }
        },
      })
    },
  ],
} satisfies Config;

export default config;
