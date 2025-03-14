import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

// Screen dimensions for responsive sizing
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card dimensions
export const CARD_WIDTH = SCREEN_WIDTH * 0.9;
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

// Spacing system
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

// Font sizes
export const fontSize = {
  xs: 10,
  s: 12,
  m: 14,
  l: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

// Animation durations
export const animation = {
  fast: 200,
  medium: 300,
  slow: 500,
};

// Common color palette - updated to match the design in the image
const palette = {
  // Primary colors
  primary: '#FF4B7F', // Pink color from the image
  primaryDark: '#E03060',
  primaryLight: '#FF7D9F',
  
  // Secondary colors
  secondary: '#FF9344',
  secondaryDark: '#D97735',
  secondaryLight: '#FFB174',
  
  // Accent colors
  accent: '#4A3AFF',
  accentDark: '#3C30CC',
  accentLight: '#7C70FF',
  
  // Success, Error, Warning, Info
  success: '#4ADE80',
  error: '#F43F5E',
  warning: '#FBBF24',
  info: '#60A5FA',
  
  // Grays
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
};

// Extended themes
export const lightTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    // Basic UI colors
    primary: palette.primary,
    primaryContainer: palette.primaryLight,
    secondary: palette.secondary,
    secondaryContainer: palette.secondaryLight,
    tertiary: palette.accent,
    tertiaryContainer: palette.accentLight,
    
    // Background and surfaces - set to white for clean design
    background: palette.white,
    surface: palette.white,
    surfaceVariant: palette.gray50,
    surfaceDisabled: palette.gray100,
    
    // Status colors
    error: palette.error,
    errorContainer: '#FFECEE',
    success: palette.success,
    successContainer: '#EDFCF2',
    warning: palette.warning,
    warningContainer: '#FFF8E6',
    info: palette.info,
    infoContainer: '#EDF5FF',
    
    // Text colors
    onPrimary: palette.white,
    onPrimaryContainer: palette.primaryDark,
    onSecondary: palette.white,
    onSecondaryContainer: palette.secondaryDark,
    onTertiary: palette.white,
    onTertiaryContainer: palette.accentDark,
    onBackground: palette.gray900,
    onSurface: palette.gray900,
    onSurfaceVariant: palette.gray700,
    onSurfaceDisabled: palette.gray500,
    
    // Card gradients
    cardGradientStart: palette.primary,
    cardGradientEnd: palette.secondary,
    
    // Custom UI elements
    cardBackground: palette.white,
    tabBarBackground: palette.white,
    tabBarIcon: palette.gray500,
    tabBarIconActive: palette.primary,
    divider: palette.gray200,
    border: palette.gray300,
    navigationBar: palette.white,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    // Basic UI colors - keeping dark theme for users who prefer it
    primary: palette.primary,
    primaryContainer: '#661A2F',
    secondary: palette.secondary,
    secondaryContainer: '#803D1A',
    tertiary: palette.accent,
    tertiaryContainer: '#322880',
    
    // Background and surfaces
    background: palette.white, // Keeping white background even in dark mode
    surface: palette.white,
    surfaceVariant: palette.gray100,
    surfaceDisabled: palette.gray200,
    
    // Status colors
    error: palette.error,
    errorContainer: '#541822',
    success: palette.success,
    successContainer: '#1A4A2D',
    warning: palette.warning,
    warningContainer: '#533D09',
    info: palette.info,
    infoContainer: '#1A3A61',
    
    // Text colors - dark text on light backgrounds for dark theme
    onPrimary: palette.white,
    onPrimaryContainer: palette.primaryLight,
    onSecondary: palette.white,
    onSecondaryContainer: palette.secondaryLight,
    onTertiary: palette.white,
    onTertiaryContainer: palette.accentLight,
    onBackground: palette.gray900,
    onSurface: palette.gray900,
    onSurfaceVariant: palette.gray700,
    onSurfaceDisabled: palette.gray500,
    
    // Card gradients
    cardGradientStart: palette.primary,
    cardGradientEnd: palette.secondary,
    
    // Custom UI elements
    cardBackground: palette.white,
    tabBarBackground: palette.white,
    tabBarIcon: palette.gray400,
    tabBarIconActive: palette.primary,
    divider: palette.gray200,
    border: palette.gray300,
    navigationBar: palette.white,
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: palette.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Z-index values for consistent layering
export const zIndex = {
  base: 1,
  card: 10,
  modal: 100,
  toast: 1000,
}; 