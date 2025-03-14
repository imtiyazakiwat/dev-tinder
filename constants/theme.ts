import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF4B6A',
    secondary: '#4A3AFF',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    cardGradientStart: '#FF4B6A',
    cardGradientEnd: '#FF9344',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF4B6A',
    secondary: '#4A3AFF',
    background: '#121212',
    surface: '#1E1E1E',
    cardGradientStart: '#FF4B6A',
    cardGradientEnd: '#FF9344',
  },
};

export const CARD_WIDTH = 340;
export const CARD_HEIGHT = 520;