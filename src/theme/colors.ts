// src/theme/colors.ts

export const colors = {
  // Primary tones
  primary: {
    pink: '#c18dbe',
    darkBlue: '#23203f',
  },

  // Secondary tones
  secondary: {
    aquamarine: '#56babf',
    orange: '#f28f64',
    green: '#559370',
    white: '#ffffff',
    grey: '#575756',
    lightPink: '#f0e0fb',
  },

  // Semantic colors (for common use cases)
  text: {
    primary: '#23203f',
    secondary: '#575756',
    light: '#c18dbe',
  },

  background: {
    primary: '#ffffff',
    secondary: '#f0e0fb',
    accent: '#56babf',
  },

  accent: {
    success: '#559370',
    warning: '#f28f64',
    info: '#56babf',
  }
};

// RGB values (if needed for opacity/transparency)
export const colorsRGB: Record<string, string> = {
  pink: '194, 142, 191',
  darkBlue: '35, 32, 63',
  aquamarine: '86, 186, 191',
  orange: '242, 143, 100',
  green: '85, 147, 112',
  white: '0, 0, 0',
  grey: '87, 87, 86',
  lightPink: '240, 224, 251',
};

export default colors;