import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
  Dimensions,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, useTheme } from 'react-native-paper';
import { shadows, borderRadius, spacing } from '../../constants/theme';
import { timingConfigs } from '../../utils/animations';
import { buttonPressFeedback } from '../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface GradientCardProps {
  title?: string;
  subtitle?: string;
  image?: ImageSourcePropType;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  elevation?: number;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  withAnimation?: boolean;
  withShadow?: boolean;
  imageOverlay?: boolean;
  overlayOpacity?: number;
  testID?: string;
}

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export const GradientCard: React.FC<GradientCardProps> = ({
  title,
  subtitle,
  image,
  gradientColors = ['#FF3D7F', '#FF7E2E'],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  children,
  onPress,
  style,
  contentStyle,
  elevation = 3,
  width = SCREEN_WIDTH * 0.9,
  height = 'auto',
  borderRadius: customBorderRadius,
  withAnimation = true,
  withShadow = true,
  imageOverlay = true,
  overlayOpacity = 0.3,
  testID,
}) => {
  const theme = useTheme();
  const cardRadius = customBorderRadius ?? borderRadius.l;
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Handle press animations
  const handlePressIn = () => {
    if (!withAnimation || !onPress) return;
    
    scale.value = withTiming(0.98, timingConfigs.fast);
    opacity.value = withTiming(0.95, timingConfigs.fast);
    translateY.value = withTiming(2, timingConfigs.fast);
  };

  const handlePressOut = () => {
    if (!withAnimation || !onPress) return;
    
    scale.value = withTiming(1, timingConfigs.default);
    opacity.value = withTiming(1, timingConfigs.default);
    translateY.value = withTiming(0, timingConfigs.default);
  };

  const handlePress = () => {
    if (!onPress) return;
    
    buttonPressFeedback();
    onPress();
  };

  // Shadow style based on elevation
  const shadowStyle = useMemo((): ViewStyle => {
    if (!withShadow) return {};
    
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
  }, [elevation, withShadow]);

  // Animated styles
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: withAnimation ? scale.value : 1 },
      { translateY: withAnimation ? translateY.value : 0 },
    ],
    opacity: opacity.value,
  }));

  // Base card style
  const cardStyle: ViewStyle = {
    width,
    height,
    borderRadius: cardRadius,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...shadowStyle,
  };

  // Render the card content
  const renderCardContent = () => {
    // If we have an image, render it with a gradient overlay
    if (image) {
      return (
        <AnimatedImageBackground 
          source={image} 
          style={[styles.imageBackground, { width, height }]}
          imageStyle={{ borderRadius: cardRadius }}
        >
          {imageOverlay && (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}
            />
          )}
          
          <View style={[styles.content, contentStyle]}>
            {title && <Text style={styles.titleOnImage}>{title}</Text>}
            {subtitle && <Text style={styles.subtitleOnImage}>{subtitle}</Text>}
            {children}
          </View>
        </AnimatedImageBackground>
      );
    }

    // If no image, render a gradient background
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={StyleSheet.absoluteFill}
      >
        <View style={[styles.content, contentStyle]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {children}
        </View>
      </LinearGradient>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={!onPress}
      testID={testID}
    >
      <Animated.View style={[cardStyle, style, animatedStyles]}>
        {renderCardContent()}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    justifyContent: 'flex-end',
  },
  content: {
    padding: spacing.m,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.s,
  },
  titleOnImage: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleOnImage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.s,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default GradientCard; 