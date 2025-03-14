import { Platform } from 'react-native';
import {
  Easing,
  WithTimingConfig,
  withTiming,
  withSpring,
  WithSpringConfig,
  cancelAnimation,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { animationEasing, animation } from '../constants/theme';
import { hapticFeedback } from './haptics';

/**
 * Standard easing configurations
 */
export const timingConfigs = {
  // For most UI animations
  default: {
    duration: animation.medium,
    easing: Easing.bezier(0.2, 0.0, 0.0, 1.0),
  } as WithTimingConfig,
  
  // Fast for micro-interactions
  fast: {
    duration: animation.fast,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
  } as WithTimingConfig,
  
  // Slow for emphasis
  slow: {
    duration: animation.slow,
    easing: Easing.bezier(0.2, 0.0, 0.0, 1.0),
  } as WithTimingConfig,
  
  // Bounce effect
  bounce: {
    duration: animation.medium,
    easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  } as WithTimingConfig,
  
  // Elastic effect
  elastic: {
    duration: animation.slow,
    easing: Easing.elastic(1),
  } as WithTimingConfig,
};

/**
 * Spring configurations for more natural animations
 */
export const springConfigs = {
  // Default spring for natural UI movement
  default: {
    damping: 12,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  } as WithSpringConfig,
  
  // Bouncy spring for playful animations
  bouncy: {
    damping: 8,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  } as WithSpringConfig,
  
  // Gentle spring for subtle movements
  gentle: {
    damping: 15,
    mass: 1,
    stiffness: 80,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  } as WithSpringConfig,
  
  // Stiff spring for quick movements with minimal bounce
  stiff: {
    damping: 20,
    mass: 1,
    stiffness: 150,
    overshootClamping: true,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  } as WithSpringConfig,
};

/**
 * Animate a value with a delayed action
 */
export const withDelay = (delay: number, animation: any) => {
  'worklet';
  return {
    onFrame: (state: any, now: number) => {
      const { startTime, started } = state;
      
      // If animation hasn't started and we haven't passed start time, do nothing
      if (startTime === undefined) {
        state.startTime = now;
        state.started = false;
        return false;
      }
      
      // If we're still in the delay period
      if (now - startTime < delay) {
        return false;
      }
      
      // If we've passed the delay but haven't started the animation
      if (!started) {
        state.started = true;
        state.animationStartTime = now;
      }
      
      // Run the actual animation
      return animation.onFrame(state, state.started ? now - delay : now);
    },
  };
};

/**
 * Sequence multiple animations
 */
export const withSequence = (...animations: any[]) => {
  'worklet';
  return {
    onFrame: (state: any, now: number) => {
      const { currentIndex, finished, previousAnimation } = state;
      
      // Initialize state on first run
      if (currentIndex === undefined) {
        state.currentIndex = 0;
        state.finished = false;
        state.previousAnimation = null;
      }
      
      // If sequence is complete
      if (state.currentIndex >= animations.length) {
        return true;
      }
      
      // Get current animation
      const currentAnimation = animations[state.currentIndex];
      
      // If current animation changed, reset animation state
      if (currentAnimation !== state.previousAnimation) {
        state.previousAnimation = currentAnimation;
        state.animationState = {};
      }
      
      // Run current animation
      const isFinished = currentAnimation.onFrame(state.animationState, now);
      
      // Move to next animation if current one finished
      if (isFinished) {
        state.currentIndex += 1;
      }
      
      // Return true only if all animations are finished
      return state.currentIndex >= animations.length;
    },
  };
};

/**
 * Animation with haptic feedback
 */
export const withHaptics = (
  animation: any,
  intensity: 'light' | 'medium' | 'heavy' = 'light',
  onStart = true,
  onEnd = false
) => {
  'worklet';
  return {
    onStart: (_: any) => {
      if (onStart) {
        runOnJS(hapticFeedback)(intensity);
      }
      
      if (animation.onStart) {
        animation.onStart();
      }
    },
    onFrame: (state: any, now: number) => {
      const isFinished = animation.onFrame(state, now);
      
      if (isFinished && onEnd) {
        runOnJS(hapticFeedback)(intensity);
      }
      
      return isFinished;
    },
  };
};

/**
 * Button press animation preset
 */
export const buttonPressAnimation = (
  pressed: boolean,
  scale = 0.96,
  haptics: 'light' | 'medium' | 'heavy' | null = 'light'
) => {
  'worklet';
  
  // Apply haptic feedback on press
  if (pressed && haptics) {
    runOnJS(hapticFeedback)(haptics);
  }
  
  return pressed
    ? withTiming(scale, timingConfigs.fast)
    : withTiming(1, timingConfigs.default);
};

/**
 * Card swipe animation helpers
 */
export const calculateSwipeRotation = (
  translateX: number,
  width: number,
  factor = 0.05
) => {
  'worklet';
  return `${interpolate(
    translateX,
    [-width, 0, width],
    [-15, 0, 15],
    Extrapolate.CLAMP
  )}deg`;
};

/**
 * Create a staggered animation for list items
 */
export const createStaggeredAnimation = (
  index: number,
  isVisible: boolean,
  staggerDelay = 50,
  initialDelay = 100
) => {
  'worklet';
  
  const delay = initialDelay + index * staggerDelay;
  
  return isVisible
    ? withDelay(
        delay,
        withTiming(1, { duration: animation.medium, easing: Easing.bezier(0.2, 0.0, 0.0, 1.0) })
      )
    : withTiming(0, { duration: animation.fast, easing: Easing.bezier(0.4, 0.0, 0.2, 1.0) });
};

/**
 * Create a shared value animation that can be reused
 */
export const createSharedAnimation = (
  animation: any,
  callback?: () => void
) => {
  'worklet';
  
  return {
    ...animation,
    onFrame: (state: any, now: number) => {
      const isFinished = animation.onFrame(state, now);
      
      if (isFinished && callback) {
        runOnJS(callback)();
      }
      
      return isFinished;
    },
  };
};

/**
 * Get platform specific timing adjustments
 */
export const getPlatformTimingAdjustment = () => {
  return Platform.OS === 'android' ? 1.25 : 1;
}; 