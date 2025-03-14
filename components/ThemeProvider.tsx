import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '../constants/theme';

// Define the theme context types
interface ThemeContextType {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get the device color scheme
  const colorScheme = useColorScheme();
  
  // Initialize theme based on device settings
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  
  // Update theme when device color scheme changes
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);
  
  // Get the current theme based on dark mode setting
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Function to set a specific theme
  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };
  
  // Context value
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
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