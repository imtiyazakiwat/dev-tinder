import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Trigger haptic feedback with different intensity levels.
 * Falls back gracefully on devices that don't support haptics.
 */
export const hapticFeedback = (
  intensity: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light'
) => {
  try {
    // Only trigger haptics on iOS and Android
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    switch (intensity) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    // Silently fail if haptics aren't available
    console.log('Haptics not available:', error);
  }
};

/**
 * Trigger selection feedback - the lightest haptic
 */
export const selectionFeedback = () => {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.selectionAsync();
    }
  } catch (error) {
    // Silently fail
  }
};

/**
 * Haptic feedback for button presses
 */
export const buttonPressFeedback = () => {
  hapticFeedback('light');
};

/**
 * Stronger feedback for more significant actions
 */
export const actionFeedback = () => {
  hapticFeedback('medium');
};

/**
 * Strong feedback for major changes or confirmations
 */
export const heavyFeedback = () => {
  hapticFeedback('heavy');
};

/**
 * Success notification feedback
 */
export const successFeedback = () => {
  hapticFeedback('success');
};

/**
 * Warning notification feedback
 */
export const warningFeedback = () => {
  hapticFeedback('warning');
};

/**
 * Error notification feedback
 */
export const errorFeedback = () => {
  hapticFeedback('error');
};

/**
 * Special feedback for swipe actions
 */
export const swipeFeedback = () => {
  hapticFeedback('medium');
};

/**
 * Special feedback for matches
 */
export const matchFeedback = () => {
  // For matches, use success followed by heavy impact for emphasis
  hapticFeedback('success');
  
  // Add a slight delay before the heavy impact
  setTimeout(() => {
    hapticFeedback('heavy');
  }, 150);
}; 