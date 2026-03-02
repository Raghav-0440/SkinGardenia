export const theme = {
  colors: {
    // Primary colors
    primary: {
      main: '#2D5A27', // Deep forest green
      light: '#3D7A37', // Lighter forest green
      dark: '#1D3A17', // Darker forest green
    },
    // Secondary colors
    secondary: {
      main: '#8B5A2B', // Earthy brown
      light: '#9B6A3B', // Lighter brown
      dark: '#7B4A1B', // Darker brown
    },
    // Background colors
    background: {
      main: '#0A0F0A', // Very dark green (almost black)
      light: '#1A1F1A', // Slightly lighter dark green
      card: '#121712', // Dark green for cards
    },
    // Text colors
    text: {
      primary: '#E8F0E8', // Light greenish white
      secondary: '#B8C0B8', // Muted greenish gray
      accent: '#A0D8A0', // Soft herbal green
    },
    // Accent colors
    accent: {
      main: '#4A8F4A', // Herbal green
      light: '#5A9F5A', // Lighter herbal green
      dark: '#3A7F3A', // Darker herbal green
    },
    // Status colors
    success: '#2D5A27', // Forest green
    warning: '#8B5A2B', // Earthy brown
    error: '#8B2D2D', // Deep red
    info: '#2D5A8B', // Deep blue
  },
  // Typography
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      secondary: "'Playfair Display', serif",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  // Border radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #2D5A27 0%, #1D3A17 100%)',
    secondary: 'linear-gradient(135deg, #8B5A2B 0%, #7B4A1B 100%)',
    background: 'linear-gradient(135deg, #0A0F0A 0%, #1A1F1A 100%)',
  },
}; 