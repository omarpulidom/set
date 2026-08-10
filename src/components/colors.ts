export const Colors = {
  // Set UI — these semantic tokens are the only palette used by the app UI.
  blue: {
    DEFAULT: '#2C6BFF',
    mist: '#E9EBF0',
    soft: '#EEF2FF',
    pale: '#DDE6FF',
    wash: '#D9E4FF',
    muted: '#C9D4F0',
    light: '#7899EC',
    deep: '#4A5C91',
  },

  surface: {
    DEFAULT: '#F3F3F3',
    canvas: '#F5F5F5',
    card: '#FFFFFF',
    subtle: '#EFEFEF',
    muted: '#E6E6E6',
    soft: '#DEDEDE',
    control: '#D4D4D4',
    dark: '#202020',
    raised: '#353535',
  },

  mono: {
    mist: '#D8D8D8',
    muted: '#ADADAD',
    light: '#707070',
    DEFAULT: '#202020',
    deep: '#4E4E4E',
  },

  ink: {
    DEFAULT: '#202020',
    strong: '#181817',
    muted: '#6E6E6E',
    soft: '#77736E',
    subtle: '#7C7D86',
    quiet: '#88847F',
    light: '#AEB4C4',
  },

  border: {
    DEFAULT: '#E9E6E1',
    soft: '#ECECF0',
    muted: '#E7E3DC',
    input: '#D9D5CE',
    dashed: '#CBC7C0',
    warm: '#E2DFDA',
    chart: '#C9C6C0',
  },

  chart: {
    line: '#343434',
    grid: '#E5E2DD',
    gridLight: '#EDEAE5',
    label: '#989692',
    muted: '#8B8985',
  },

  legacy: {
    ticket: '#342D2A',
    ticketHeading: '#523F43',
    ticketAccent: '#E27C8C',
    ticketDivider: '#E0E0E0',
    ticketAccentMuted: '#7D9D8C',
    ticketAccentWarm: '#C69B63',
    ticketBorder: '#C6C2BC',
    fallback: '#2E78B7',
    authMuted: '#6B7280',
  },

  primary: {
    DEFAULT: '#2563eb', // Blue 600
    900: '#1e3a8a', // Blue 900
    800: '#1e40af', // Blue 800
    700: '#1d4ed8', // Blue 700
    600: '#2563eb', // Blue 600
    500: '#3b82f6', // Blue 500
    400: '#60a5fa', // Blue 400
    300: '#93c5fd', // Blue 300
    200: '#bfdbfe', // Blue 200
    100: '#dbeafe', // Blue 100
  },

  secondary: {
    DEFAULT: '#7c3aed', // Violet 600
    900: '#4c1d95', // Violet 900
    800: '#5b21b6', // Violet 800
    700: '#6d28d9', // Violet 700
    600: '#7c3aed', // Violet 600
    500: '#8b5cf6', // Violet 500
    400: '#a78bfa', // Violet 400
    300: '#c4b5fd', // Violet 300
    200: '#ddd6fe', // Violet 200
    100: '#ede9fe', // Violet 100
  },

  green: {
    500: '#00291e',
    DEFAULT: '#0c3d30',
    400: '#0c3d30',
    300: '#00523c',
    200: '#367a68',
    100: '#7db8a8',
  },

  greeny: {
    DEFAULT: '#007a52',
    500: '#007a52',
    400: '#21a379',
    300: '#0ab87e',
    200: '#5acda7',
    100: '#99e0c8',
  },

  rose: {
    DEFAULT: '#b8736e',
    500: '#b8736e', // custom-11
    400: '#e09d99', // custom-12
    300: '#f5beba', // custom-13
    200: '#f5d0ce', // custom-14
    100: '#f5e3e1', // custom-15
  },

  amber: {
    500: '#b87a33', // custom-16
    DEFAULT: '#cc9352',
    400: '#cc9352', // custom-17
    300: '#f5ac58', // custom-18
    200: '#f6c38a', // custom-19
    100: '#f5d8b8', // custom-20
  },

  terra: {
    DEFAULT: '#a33b07',
    500: '#a33b07', // custom-21
    400: '#cc4f10', // custom-22
    300: '#f5580a', // custom-23
    200: '#f58c58', // custom-24
    100: '#f5c1a6', // custom-25
  },

  sand: {
    DEFAULT: '#ccb68b',
    500: '#ccb68b', // custom-26
    400: '#e0c899', // custom-27
    300: '#f5e1ba', // custom-28
    200: '#f5ebd7', // custom-29
    100: '#faf3e6', // custom-30
  },

  teal: {
    DEFAULT: '#007a7a',
    500: '#007a7a', // custom-31
    400: '#21a3a3', // custom-32
    300: '#0ab8b8', // custom-33
    200: '#5acdcd', // custom-34
    100: '#99e0e0', // custom-35
  },

  ruby: {
    DEFAULT: '#a31427',
    500: '#a31427', // custom-36
    400: '#cc1830', // custom-37
    300: '#f51d3a', // custom-38
    200: '#f57182', // custom-39
    100: '#f5bac2', // custom-40
  },

  black: '#000a07',
  'black-light': '#1a221f',
  gray: {
    DEFAULT: '#333a37',
    900: '#333a37',
    800: '#4d524e',
    700: '#666b66',
    600: '#80837e',
    500: '#999b96',
    400: '#b2b3ae',
    300: '#ccccc5',
    200: '#e5e4dd',
    150: '#f2f0e9',
    100: '#fffcf5',
    50: '#fffefc',
  },
} as const
