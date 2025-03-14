import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Dimensions } from 'react-native';

// Screen dimensions for responsive sizing
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card dimensions
export const CARD_WIDTH = SCREEN_WIDTH * 0.9;
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

// Spacing system
export const spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const borderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

// Font sizes
export const fontSize = {
  xxs: 8,
  xs: 10,
  s: 12,
  m: 14,
  l: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

// Font weights
export const fontWeight = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

// Animation durations
export const animation = {
  veryFast: 100,
  fast: 200,
  medium: 300,
  slow: 500,
  verySlow: 800,
};

// Animation curves
export const animationEasing = {
  standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
};

// Enhanced color palette with more vibrant tones
const palette = {
  // Primary colors - Vibrant pink with variations
  primary: '#FF3D7F', // More vibrant pink
  primaryDark: '#DE1A60',
  primaryLight: '#FF7DA8',
  primaryLightest: '#FFE8EF',
  
  // Secondary colors - Warm orange
  secondary: '#FF7E2E', // More vibrant orange
  secondaryDark: '#E05A0C',
  secondaryLight: '#FFA971',
  secondaryLightest: '#FFF0E6',
  
  // Accent colors - Vibrant purple
  accent: '#5E40FF', // More vibrant blue/purple
  accentDark: '#4026E0',
  accentLight: '#8C75FF',
  accentLightest: '#F0EBFF',
  
  // Complementary accent - Cyan
  complementary: '#0CD8E5',
  complementaryDark: '#0AB0BF',
  complementaryLight: '#70ECF5',
  complementaryLightest: '#E5FBFD',

  // Status colors - More vibrant
  success: '#22D876',
  successDark: '#0FB85E',
  successLight: '#6DEAA2',
  successLightest: '#E6FFF2',
  
  error: '#FF3B5E',
  errorDark: '#DE1A41',
  errorLight: '#FF8298',
  errorLightest: '#FFEAEF',
  
  warning: '#FFB422',
  warningDark: '#E09300',
  warningLight: '#FFCE70',
  warningLightest: '#FFF7E6',
  
  info: '#3D9EFF',
  infoDark: '#1A82E0',
  infoLight: '#82C0FF',
  infoLightest: '#E9F4FF',
  
  // Grays - Extended range
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
  
  // True dark mode colors
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkElevated: '#2C2C2C',
  darkBorder: '#3D3D3D',
};

// Enhanced light theme
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
    quaternary: palette.complementary,
    quaternaryContainer: palette.complementaryLight,
    
    // Background and surfaces
    background: palette.white,
    surface: palette.white,
    surfaceVariant: palette.gray50,
    surfaceDisabled: palette.gray100,
    elevation: {
      level1: palette.white,
      level2: palette.gray50,
      level3: palette.gray100,
    },
    
    // Status colors
    error: palette.error,
    errorContainer: palette.errorLightest,
    success: palette.success,
    successContainer: palette.successLightest,
    warning: palette.warning,
    warningContainer: palette.warningLightest,
    info: palette.info,
    infoContainer: palette.infoLightest,
    
    // Text colors
    onPrimary: palette.white,
    onPrimaryContainer: palette.primaryDark,
    onSecondary: palette.white,
    onSecondaryContainer: palette.secondaryDark,
    onTertiary: palette.white,
    onTertiaryContainer: palette.accentDark,
    onQuaternary: palette.white,
    onQuaternaryContainer: palette.complementaryDark,
    onBackground: palette.gray900,
    onSurface: palette.gray900,
    onSurfaceVariant: palette.gray700,
    onSurfaceDisabled: palette.gray500,
    
    // Card gradients - more vibrant
    cardGradientStart: palette.primary,
    cardGradientEnd: palette.secondary,
    cardGradientAccent: palette.accent,
    
    // Custom UI elements
    cardBackground: palette.white,
    tabBarBackground: palette.white,
    tabBarIcon: palette.gray500,
    tabBarIconActive: palette.primary,
    divider: palette.gray200,
    border: palette.gray300,
    navigationBar: palette.white,
    overlay: 'rgba(0, 0, 0, 0.1)',
    shadow: palette.gray900,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    
    // Input states
    inputBackground: palette.gray100,
    inputBorder: palette.gray300,
    inputText: palette.gray900,
    inputPlaceholder: palette.gray500,
    inputDisabled: palette.gray200,
    inputFocused: palette.primary,
  },
  roundness: 14,
  animation: {
    scale: 1.0,
  },
};

// True dark theme with proper dark colors
export const darkTheme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    // Basic UI colors
    primary: palette.primary,
    primaryContainer: palette.primaryDark,
    secondary: palette.secondary,
    secondaryContainer: palette.secondaryDark,
    tertiary: palette.accent,
    tertiaryContainer: palette.accentDark,
    quaternary: palette.complementary,
    quaternaryContainer: palette.complementaryDark,
    
    // Background and surfaces - true dark mode
    background: palette.darkBackground,
    surface: palette.darkSurface,
    surfaceVariant: palette.darkElevated,
    surfaceDisabled: palette.darkBorder,
    elevation: {
      level1: palette.darkSurface,
      level2: palette.darkElevated,
      level3: '#383838',
    },
    
    // Status colors
    error: palette.error,
    errorContainer: palette.errorDark,
    success: palette.success,
    successContainer: palette.successDark,
    warning: palette.warning,
    warningContainer: palette.warningDark,
    info: palette.info,
    infoContainer: palette.infoDark,
    
    // Text colors
    onPrimary: palette.white,
    onPrimaryContainer: palette.primaryLight,
    onSecondary: palette.white,
    onSecondaryContainer: palette.secondaryLight,
    onTertiary: palette.white,
    onTertiaryContainer: palette.accentLight,
    onQuaternary: palette.white,
    onQuaternaryContainer: palette.complementaryLight,
    onBackground: palette.gray100,
    onSurface: palette.gray100,
    onSurfaceVariant: palette.gray300,
    onSurfaceDisabled: palette.gray500,
    
    // Card gradients
    cardGradientStart: palette.primary,
    cardGradientEnd: palette.secondary,
    cardGradientAccent: palette.accent,
    
    // Custom UI elements
    cardBackground: palette.darkElevated,
    tabBarBackground: palette.darkSurface,
    tabBarIcon: palette.gray400,
    tabBarIconActive: palette.primary,
    divider: palette.darkBorder,
    border: palette.darkBorder,
    navigationBar: palette.darkSurface,
    overlay: 'rgba(0, 0, 0, 0.3)',
    shadow: palette.black,
    backdrop: 'rgba(0, 0, 0, 0.7)',
    
    // Input states
    inputBackground: palette.darkElevated,
    inputBorder: palette.darkBorder,
    inputText: palette.gray100,
    inputPlaceholder: palette.gray500,
    inputDisabled: palette.gray700,
    inputFocused: palette.primary,
  },
  roundness: 14,
  animation: {
    scale: 1.0,
  },
};

// Enhanced shadow styles with more depth
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  small: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  card: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  }
};

// Z-index values for consistent layering
export const zIndex = {
  base: 1,
  card: 10,
  header: 20,
  nav: 30,
  modal: 100,
  tooltip: 500,
  toast: 1000,
};

// Animation presets
export const animationPresets = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: animation.medium },
  },
  scale: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { duration: animation.medium, easing: animationEasing.standard },
  },
  slideUp: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    config: { duration: animation.medium, easing: animationEasing.decelerate },
  },
  slideDown: {
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    config: { duration: animation.medium, easing: animationEasing.decelerate },
  },
  slideLeft: {
    from: { opacity: 0, translateX: 20 },
    to: { opacity: 1, translateX: 0 },
    config: { duration: animation.medium, easing: animationEasing.decelerate },
  },
  slideRight: {
    from: { opacity: 0, translateX: -20 },
    to: { opacity: 1, translateX: 0 },
    config: { duration: animation.medium, easing: animationEasing.decelerate },
  },
}; 