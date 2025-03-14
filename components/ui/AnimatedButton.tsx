import React, { useMemo } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { buttonPressFeedback } from '../../utils/haptics';
import { timingConfigs } from '../../utils/animations';
import { borderRadius, shadows } from '../../constants/theme';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'gradient';
type ButtonSize = 'small' | 'medium' | 'large';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  elevation?: number;
  withHaptics?: boolean;
  borderRadius?: number;
  testID?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onPress,
  variant = 'filled',
  size = 'medium',
  color = '#FF3D7F',
  gradientColors = ['#FF3D7F', '#FF7E2E'],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  elevation = 2,
  withHaptics = true,
  borderRadius: customBorderRadius,
  testID,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withTiming(0.96, timingConfigs.fast);
    opacity.value = withTiming(0.9, timingConfigs.fast);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, timingConfigs.default);
    opacity.value = withTiming(1, timingConfigs.default);
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (withHaptics) {
      buttonPressFeedback();
    }
    
    onPress();
  };

  // Generate button container style based on variant and size
  const containerStyle = useMemo(() => {
    const sizeStyles = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minWidth: 80,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 120,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minWidth: 160,
      },
    };

    // Base styles
    const baseStyles: ViewStyle = {
      ...sizeStyles[size],
      borderRadius: customBorderRadius ?? borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      width: fullWidth ? '100%' : 'auto',
    };

    // Variant specific styles
    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: color,
          ...getShadowStyle(elevation),
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: color,
        };
      case 'text':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      case 'gradient':
        return {
          ...baseStyles,
          ...getShadowStyle(elevation),
        };
      default:
        return baseStyles;
    }
  }, [variant, size, color, fullWidth, elevation, customBorderRadius]);

  // Generate text style based on variant
  const buttonTextStyle = useMemo(() => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size specific text styles
    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    // Variant specific text styles
    switch (variant) {
      case 'filled':
      case 'gradient':
        return {
          ...baseTextStyle,
          ...sizeTextStyles[size],
          color: '#FFFFFF',
        };
      case 'outlined':
      case 'text':
        return {
          ...baseTextStyle,
          ...sizeTextStyles[size],
          color,
        };
      default:
        return baseTextStyle;
    }
  }, [variant, size, color]);

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  // Shadow styles based on elevation
  function getShadowStyle(elevation: number): ViewStyle {
    if (elevation <= 0) return {};

    if (Platform.OS === 'ios') {
      switch (elevation) {
        case 1:
          return shadows.xs;
        case 2:
          return shadows.small;
        case 3:
          return shadows.medium;
        case 4:
        case 5:
          return shadows.large;
        default:
          return shadows.xl;
      }
    } else {
      // For Android
      return {
        elevation,
      };
    }
  }

  // Render the button based on variant
  const renderButtonContent = () => {
    const content = (
      <>
        {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
        <Text style={[buttonTextStyle, textStyle]}>{label}</Text>
        {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
      </>
    );

    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.gradientContent}>{content}</View>
        </LinearGradient>
      );
    }

    return content;
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
    >
      <Animated.View style={[containerStyle, style, animatedStyles]}>
        {renderButtonContent()}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  gradientContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default AnimatedButton; 