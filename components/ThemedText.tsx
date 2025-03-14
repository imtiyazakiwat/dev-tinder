import { Text, TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextType =
  | 'title'
  | 'subtitle'
  | 'default'
  | 'defaultSemiBold'
  | 'small'
  | 'smallSemiBold'
  | 'code';

export type ThemedTextProps = TextProps &
  ThemeProps & {
    type?: TextType;
    inherit?: boolean;
  };

/**
 * ThemedText component is a wrapper around the React Native Text component.
 * It uses the useThemeColor hook to access the current theme colors.
 * It also supports a 'type' prop which allows for different text styles.
 */
export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', inherit, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Set some sensible default styles based on the text type
  const textStyles = {
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: 0.35,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 0.35,
    },
    default: {
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0.35,
    },
    defaultSemiBold: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.35,
    },
    small: {
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.25,
    },
    smallSemiBold: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.25,
    },
    code: {
      fontFamily: 'SpaceMono',
      fontSize: 16,
      letterSpacing: 0,
    },
  };

  return (
    <Text
      style={[inherit ? {} : { color }, textStyles[type], style]}
      {...otherProps}
    />
  );
}