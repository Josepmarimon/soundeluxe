import {buildLegacyTheme} from 'sanity'

// Tema d'alt contrast per millorar l'accessibilitat
const props = {
  // Colors base
  '--black': '#000000',
  '--white': '#FFFFFF',

  // Grisos amb alt contrast
  '--gray-base': '#1A1A1A',
  '--gray': '#333333',
  '--gray-light': '#666666',

  // Colors de marca (daurats de Sound Deluxe)
  '--brand-primary': '#D4AF37',    // Daurat principal
  '--brand-secondary': '#B8962E',  // Daurat fosc

  // Colors de fons
  '--component-bg': '#0D0D0D',
  '--component-text-color': '#FFFFFF',

  // Colors d'accent per a interaccions
  '--accent-color': '#D4AF37',

  // Colors d'estat
  '--state-info-color': '#3B82F6',
  '--state-success-color': '#22C55E',
  '--state-warning-color': '#F59E0B',
  '--state-danger-color': '#EF4444',

  // Focus visible
  '--focus-color': '#D4AF37',
}

export const highContrastTheme = buildLegacyTheme({
  // Base
  '--black': props['--black'],
  '--white': props['--white'],

  // Grisos
  '--gray-base': props['--gray-base'],
  '--gray': props['--gray'],

  // Colors de marca
  '--brand-primary': props['--brand-primary'],

  // Fons del navegador/sidebar
  '--component-bg': props['--component-bg'],
  '--component-text-color': props['--component-text-color'],

  // Colors d'estat
  '--state-info-color': props['--state-info-color'],
  '--state-success-color': props['--state-success-color'],
  '--state-warning-color': props['--state-warning-color'],
  '--state-danger-color': props['--state-danger-color'],

  // Navbar
  '--main-navigation-color': props['--white'],
  '--main-navigation-color--inverted': props['--component-bg'],

  // Focus
  '--focus-color': props['--focus-color'],
})
