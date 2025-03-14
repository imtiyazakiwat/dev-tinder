import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useColorScheme, Appearance, Platform, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme, animationPresets } from '../constants/theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolateColor
} from 'react-native-reanimated';

export type ThemeMode = 'light' | 'dark' | 'system';

// Define the theme context types
interface ThemeContextType {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  animationProgress: Animated.SharedValue<number>;
  animateColor: (lightColor: string, darkColor: string) => string;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  themeMode: 'system',
  toggleTheme: () => {},
  setThemeMode: () => {},
  animationProgress: { value: 0 } as Animated.SharedValue<number>,
  animateColor: () => '',
});

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get the device color scheme
  const colorScheme = useColorScheme();
  
  // Theme mode state (light, dark, or system)
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  
  // Compute dark mode based on theme mode and system preference
  const isDarkMode = themeMode === 'system' 
    ? colorScheme === 'dark' 
    : themeMode === 'dark';
  
  // Animation progress for smooth transitions
  const animationProgress = useSharedValue(isDarkMode ? 1 : 0);
  
  // Update theme when device color scheme or theme mode changes
  useEffect(() => {
    // Determine if dark mode should be active based on theme mode and system preference
    const shouldBeDark = themeMode === 'system' 
      ? colorScheme === 'dark' 
      : themeMode === 'dark';
    
    // Animate to the new theme
    animationProgress.value = withTiming(
      shouldBeDark ? 1 : 0,
      { 
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1) 
      }
    );
    
    // Update status bar style
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(shouldBeDark ? 'light-content' : 'dark-content', true);
    }
  }, [colorScheme, themeMode]);
  
  // Add appearance change listener for system theme
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        // If using system theme, update animation when system theme changes
        animationProgress.value = withTiming(
          colorScheme === 'dark' ? 1 : 0,
          { 
            duration: 400,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1) 
          }
        );
      }
    });
    
    return () => subscription.remove();
  }, [themeMode]);
  
  // Get the current theme based on dark mode setting
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode(prevMode => {
      if (prevMode === 'system') {
        // If system, switch to explicit light/dark based on current state
        return isDarkMode ? 'light' : 'dark';
      } else {
        // If already explicit light/dark, toggle between them
        return prevMode === 'light' ? 'dark' : 'light';
      }
    });
  };
  
  // Function to animate between two colors based on theme
  const animateColor = (lightColor: string, darkColor: string): string => {
    'worklet';
    return interpolateColor(
      animationProgress.value,
      [0, 1],
      [lightColor, darkColor]
    );
  };
  
  // Context value
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    themeMode,
    toggleTheme,
    setThemeMode: (mode: ThemeMode) => setThemeMode(mode),
    animationProgress,
    animateColor,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 