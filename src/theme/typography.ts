// src/theme/typography.ts

export const typography = {
  fonts: {
    heading: 'Libre Baskerville, serif',
    body: 'Segoe UI, sans-serif',
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

// Pre-defined text styles for consistency
export const textStyles = {
  h1: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.fontSizes['4xl'],
    fontWeight: typography.fontWeights.bold,
    lineHeight: typography.lineHeights.tight,
  },
  h2: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.fontSizes['3xl'],
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.snug,
  },
  h3: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.snug,
  },
  body: {
    fontFamily: typography.fonts.body,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: typography.fonts.body,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.relaxed,
  },
  caption: {
    fontFamily: typography.fonts.body,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    lineHeight: typography.lineHeights.normal,
  },
};

export default typography;