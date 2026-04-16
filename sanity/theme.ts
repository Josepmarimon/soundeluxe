import {buildLegacyTheme} from 'sanity'

// Paleta Sound Deluxe — tema fosc amb accents daurats
// IMPORTANT: En buildLegacyTheme, --white = fons i --black = text
export const highContrastTheme = buildLegacyTheme({
  '--black': '#F5F0E8',    // Text principal (clar sobre fosc)
  '--white': '#0A0A0A',    // Fons base (fosc)

  '--gray-base': '#141414',
  '--gray': '#2A2A2A',

  '--brand-primary': '#C9A84C',

  '--component-bg': '#0A0A0A',
  '--component-text-color': '#F5F0E8',

  '--state-info-color': '#6B9BD2',
  '--state-success-color': '#6BBF7A',
  '--state-warning-color': '#D4A843',
  '--state-danger-color': '#D46B6B',

  '--main-navigation-color': '#F5F0E8',
  '--main-navigation-color--inverted': '#0A0A0A',

  '--focus-color': '#C9A84C',
})
