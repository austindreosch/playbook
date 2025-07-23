export const CHART_COLORS = [
  'bg-away-base',
  'bg-sky-500',
  'bg-feature-base',
  'bg-information-base',
  'bg-warning-base',
  'bg-error-base',
  'bg-success-base',
  'bg-verified-base',
  'bg-highlighted-base',
  'bg-stable-base',
] as const;

export const LABEL_COLORS = {
  yellow: {
    bg: 'bg-away-base',
    text: 'text-away-base',
  },
  sky: {
    bg: 'bg-verified-base',
    text: 'text-verified-base',
  },
  purple: {
    bg: 'bg-feature-base',
    text: 'text-feature-base',
  },
  red: {
    bg: 'bg-error-base',
    text: 'text-error-base',
  },
  pink: {
    bg: 'bg-highlighted-base',
    text: 'text-highlighted-base',
  },
  teal: {
    bg: 'bg-stable-base',
    text: 'text-stable-base',
  },
  green: {
    bg: 'bg-success-base',
    text: 'text-success-base',
  },
  orange: {
    bg: 'bg-warning-base',
    text: 'text-warning-base',
  },
  blue: {
    bg: 'bg-information-base',
    text: 'text-information-base',
  },
} as const;
