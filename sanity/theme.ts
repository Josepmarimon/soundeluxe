import {buildLegacyTheme} from 'sanity'

// Paleta refinada Sound Deluxe — tons daurats sofisticats sobre fons profund
const props = {
  '--black': '#050505',
  '--white': '#F5F0E8',

  '--gray-base': '#141414',
  '--gray': '#2A2A2A',
  '--gray-light': '#8A8578',

  '--brand-primary': '#C9A84C',
  '--brand-secondary': '#A68B3A',

  '--component-bg': '#0A0A0A',
  '--component-text-color': '#F5F0E8',

  '--accent-color': '#C9A84C',

  '--state-info-color': '#6B9BD2',
  '--state-success-color': '#6BBF7A',
  '--state-warning-color': '#D4A843',
  '--state-danger-color': '#D46B6B',

  '--focus-color': '#C9A84C',
}

export const highContrastTheme = buildLegacyTheme({
  '--black': props['--black'],
  '--white': props['--white'],

  '--gray-base': props['--gray-base'],
  '--gray': props['--gray'],

  '--brand-primary': props['--brand-primary'],

  '--component-bg': props['--component-bg'],
  '--component-text-color': props['--component-text-color'],

  '--state-info-color': props['--state-info-color'],
  '--state-success-color': props['--state-success-color'],
  '--state-warning-color': props['--state-warning-color'],
  '--state-danger-color': props['--state-danger-color'],

  '--main-navigation-color': props['--white'],
  '--main-navigation-color--inverted': props['--component-bg'],

  '--focus-color': props['--focus-color'],
})
