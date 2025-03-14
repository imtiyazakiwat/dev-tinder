import { View, ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedViewProps = ViewProps & ThemeProps;

export function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}