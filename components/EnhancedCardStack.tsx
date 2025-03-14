import React, { useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  Platform,
  Text as RNText
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInDown
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Developer } from '../constants/mockData';
import { shadows, spacing, borderRadius } from '../constants/theme';
import { hapticFeedback, swipeFeedback, matchFeedback } from '../utils/haptics';
import { springConfigs, timingConfigs } from '../utils/animations';
import AnimatedButton from './ui/AnimatedButton';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.65;
const SWIPE_THRESHOLD = width * 0.3;

interface EnhancedCardStackProps {
  developers: Developer[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onSwipeLeft?: (developer: Developer) => void;
  onSwipeRight?: (developer: Developer) => void;
  onSuperLike?: (developer: Developer) => void;
  onLikeLogged?: (developer: Developer, action: 'like' | 'dislike' | 'superlike') => void;
  emptyStateComponent?: React.ReactNode;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const EnhancedCardStack: React.FC<EnhancedCardStackProps> = ({
  developers,
  currentIndex,
  setCurrentIndex,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  onLikeLogged,
  emptyStateComponent
}) => {
  const theme = useTheme();
  const [swiping, setSwiping] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedDeveloper, setMatchedDeveloper] = useState<Developer | null>(null);
  
  // Tracks if we should prevent gesture handler from working
  const gestureDisabled = useRef(false);
  
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const likeScale = useSharedValue(0);
  const dislikeScale = useSharedValue(0);
  const superlikeScale = useSharedValue(0);
  
  // Button animation values
  const buttonLikeScale = useSharedValue(1);
  const buttonDislikeScale = useSharedValue(1);
  const buttonSuperlikeScale = useSharedValue(1);
  
  // Derived rotation value
  const rotate = useDerivedValue(() => {
    return `${interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    )}deg`;
  });
  
  // Reset card position and state
  const resetCard = useCallback(() => {
    translateX.value = withSpring(0, springConfigs.default);
    translateY.value = withSpring(0, springConfigs.default);
    cardScale.value = withSpring(1, springConfigs.default);
    likeScale.value = withTiming(0, timingConfigs.fast);
    dislikeScale.value = withTiming(0, timingConfigs.fast);
    superlikeScale.value = withTiming(0, timingConfigs.fast);
    setSwiping(false);
    gestureDisabled.current = false;
  }, []);
  
  // Update index and reset after swipe
  const updateIndex = useCallback(() => {
    setCurrentIndex(currentIndex + 1);
    resetCard();
  }, [currentIndex, resetCard, setCurrentIndex]);
  
  // Handle match modal showing
  const handleMatch = useCallback((developer: Developer) => {
    // 50% chance of a match
    const isMatch = Math.random() > 0.5;
    
    if (isMatch) {
      setMatchedDeveloper(developer);
      setShowMatchModal(true);
      matchFeedback(); // Special haptic pattern for matches
      
      // Close match modal after a delay
      setTimeout(() => {
        setShowMatchModal(false);
        setMatchedDeveloper(null);
      }, 3000);
    }
  }, []);
  
  // Handle swipe right with animation
  const handleSwipeRight = useCallback(() => {
    if (currentIndex >= developers.length || gestureDisabled.current) return;
    
    gestureDisabled.current = true;
    setSwiping(true);
    
    // Get current developer
    const developer = developers[currentIndex];
    
    // Animate card off screen
    translateX.value = withTiming(width * 1.5, timingConfigs.default, () => {
      runOnJS(updateIndex)();
      
      // Notify parent component
      if (onLikeLogged) {
        runOnJS(onLikeLogged)(developer, 'like');
      }
      
      if (onSwipeRight) {
        runOnJS(onSwipeRight)(developer);
      }
      
      // Check for match
      runOnJS(handleMatch)(developer);
    });
    
    // Additional animations
    likeScale.value = withTiming(1, timingConfigs.fast);
    cardOpacity.value = withTiming(0.8, timingConfigs.fast);
    
    // Trigger haptic feedback
    swipeFeedback();
  }, [currentIndex, developers, handleMatch, onLikeLogged, onSwipeRight, updateIndex]);
  
  // Handle swipe left with animation
  const handleSwipeLeft = useCallback(() => {
    if (currentIndex >= developers.length || gestureDisabled.current) return;
    
    gestureDisabled.current = true;
    setSwiping(true);
    
    // Get current developer
    const developer = developers[currentIndex];
    
    // Animate card off screen
    translateX.value = withTiming(-width * 1.5, timingConfigs.default, () => {
      runOnJS(updateIndex)();
      
      // Notify parent component
      if (onLikeLogged) {
        runOnJS(onLikeLogged)(developer, 'dislike');
      }
      
      if (onSwipeLeft) {
        runOnJS(onSwipeLeft)(developer);
      }
    });
    
    // Additional animations
    dislikeScale.value = withTiming(1, timingConfigs.fast);
    cardOpacity.value = withTiming(0.8, timingConfigs.fast);
    
    // Trigger haptic feedback
    swipeFeedback();
  }, [currentIndex, developers, onLikeLogged, onSwipeLeft, updateIndex]);
  
  // Handle super like with animation
  const handleSuperLike = useCallback(() => {
    if (currentIndex >= developers.length || gestureDisabled.current) return;
    
    gestureDisabled.current = true;
    setSwiping(true);
    
    // Get current developer
    const developer = developers[currentIndex];
    
    // Animate card up and off screen
    translateY.value = withTiming(-height * 1.2, timingConfigs.default, () => {
      runOnJS(updateIndex)();
      
      // Notify parent component
      if (onLikeLogged) {
        runOnJS(onLikeLogged)(developer, 'superlike');
      }
      
      if (onSuperLike) {
        runOnJS(onSuperLike)(developer);
      }
      
      // Always trigger match for super likes (80% chance)
      if (Math.random() > 0.2) {
        runOnJS(handleMatch)(developer);
      }
    });
    
    // Additional animations
    superlikeScale.value = withTiming(1, timingConfigs.fast);
    cardOpacity.value = withTiming(0.8, timingConfigs.fast);
    
    // Trigger haptic feedback
    hapticFeedback('heavy');
  }, [currentIndex, developers, handleMatch, onLikeLogged, onSuperLike, updateIndex]);
  
  // Button animations
  const animateButton = (buttonRef: Animated.SharedValue<number>) => {
    buttonRef.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };
  
  // Gesture handler for drag
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      if (gestureDisabled.current) return;
      
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      cardScale.value = withTiming(0.98, timingConfigs.fast);
    },
    onActive: (event, ctx) => {
      if (gestureDisabled.current) return;
      
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY / 2; // Dampen vertical movement
      
      // Like/dislike indicators
      if (translateX.value > 20) {
        likeScale.value = interpolate(
          translateX.value,
          [0, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        );
      } else if (translateX.value < -20) {
        dislikeScale.value = interpolate(
          -translateX.value,
          [0, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        );
      }
      
      // Super like indicators (on upward swipe)
      if (translateY.value < -20) {
        superlikeScale.value = interpolate(
          -translateY.value,
          [0, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        );
      }
    },
    onEnd: (event) => {
      if (gestureDisabled.current) return;
      
      // Swipe right
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(handleSwipeRight)();
      } 
      // Swipe left
      else if (translateX.value < -SWIPE_THRESHOLD) {
        runOnJS(handleSwipeLeft)();
      } 
      // Swipe up (super like)
      else if (translateY.value < -SWIPE_THRESHOLD) {
        runOnJS(handleSuperLike)();
      } 
      // Return to center
      else {
        translateX.value = withSpring(0, springConfigs.default);
        translateY.value = withSpring(0, springConfigs.default);
        cardScale.value = withSpring(1, springConfigs.default);
        likeScale.value = withTiming(0, timingConfigs.fast);
        dislikeScale.value = withTiming(0, timingConfigs.fast);
        superlikeScale.value = withTiming(0, timingConfigs.fast);
      }
    },
  });
  
  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotate.value },
        { scale: cardScale.value },
      ],
      opacity: cardOpacity.value,
    };
  });
  
  // Like indicator style
  const likeIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: likeScale.value,
      transform: [
        { scale: interpolate(
            likeScale.value, 
            [0, 1], 
            [0.8, 1], 
            Extrapolate.CLAMP
          ) 
        },
        { rotate: '-10deg' },
      ],
    };
  });
  
  // Dislike indicator style
  const dislikeIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: dislikeScale.value,
      transform: [
        { scale: interpolate(
            dislikeScale.value, 
            [0, 1], 
            [0.8, 1], 
            Extrapolate.CLAMP
          ) 
        },
        { rotate: '10deg' },
      ],
    };
  });
  
  // Superlike indicator style
  const superlikeIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: superlikeScale.value,
      transform: [
        { scale: interpolate(
            superlikeScale.value, 
            [0, 1], 
            [0.8, 1], 
            Extrapolate.CLAMP
          ) 
        },
      ],
    };
  });
  
  // Button animated styles
  const buttonLikeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonLikeScale.value }],
    };
  });
  
  const buttonDislikeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonDislikeScale.value }],
    };
  });
  
  const buttonSuperlikeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonSuperlikeScale.value }],
    };
  });
  
  // Render empty state if no more developers
  if (currentIndex >= developers.length) {
    return <View style={styles.container}>{emptyStateComponent}</View>;
  }
  
  // Get current developer data
  const currentDeveloper = developers[currentIndex];
  
  // Render card with developer data
  return (
    <View style={styles.container}>
      {/* Background cards (for the stack effect) */}
      {currentIndex + 2 < developers.length && (
        <Animated.View style={[styles.card, styles.cardBack, { top: 20, zIndex: 1 }]}>
          <Image
            source={{ uri: developers[currentIndex + 2].images[0] }}
            style={styles.cardImage}
          />
          <View style={[styles.cardOverlay, { opacity: 0.4 }]} />
        </Animated.View>
      )}
      
      {currentIndex + 1 < developers.length && (
        <Animated.View 
          style={[
            styles.card, 
            styles.cardBack, 
            { 
              top: 10, 
              zIndex: 2 
            }
          ]}
          entering={SlideInDown.delay(100).duration(300)}
        >
          <Image
            source={{ uri: developers[currentIndex + 1].images[0] }}
            style={styles.cardImage}
          />
          <View style={[styles.cardOverlay, { opacity: 0.3 }]} />
        </Animated.View>
      )}
      
      {/* Main card with pan gesture */}
      <PanGestureHandler onGestureEvent={gestureHandler} enabled={!gestureDisabled.current}>
        <Animated.View style={[styles.card, cardAnimatedStyle, { zIndex: 3 }]}>
          {/* Card image */}
          <Image
            source={{ uri: currentDeveloper.images[0] }}
            style={styles.cardImage}
          />
          
          {/* Like indicator */}
          <Animated.View style={[styles.indicatorContainer, styles.likeIndicator, likeIndicatorStyle]}>
            <View style={styles.indicatorBadge}>
              <Text style={styles.indicatorText}>LIKE</Text>
            </View>
          </Animated.View>
          
          {/* Dislike indicator */}
          <Animated.View style={[styles.indicatorContainer, styles.dislikeIndicator, dislikeIndicatorStyle]}>
            <View style={styles.indicatorBadge}>
              <Text style={styles.indicatorText}>NOPE</Text>
            </View>
          </Animated.View>
          
          {/* Super like indicator */}
          <Animated.View style={[styles.indicatorContainer, styles.superlikeIndicator, superlikeIndicatorStyle]}>
            <View style={[styles.indicatorBadge, styles.superlikeBadge]}>
              <Text style={styles.indicatorText}>SUPER</Text>
            </View>
          </Animated.View>
          
          {/* Card content - developer info */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.cardContent}
          >
            <View style={styles.developerInfo}>
              <Text style={styles.developerName}>{currentDeveloper.name}, {currentDeveloper.age}</Text>
              <Text style={styles.developerRole}>{currentDeveloper.role}</Text>
              <Text style={styles.developerLocation}>{currentDeveloper.location}</Text>
              
              <View style={styles.skillsContainer}>
                {currentDeveloper.skills.slice(0, 4).map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
                {currentDeveloper.skills.length > 4 && (
                  <View style={styles.skillBadge}>
                    <Text style={styles.skillText}>+{currentDeveloper.skills.length - 4}</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </PanGestureHandler>
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.buttonWrapper, buttonDislikeAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.dislikeButton]}
            onPress={() => {
              hapticFeedback('light');
              animateButton(buttonDislikeScale);
              handleSwipeLeft();
            }}
          >
            <Ionicons name="close" size={26} color="#FD5D65" />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.buttonWrapper, buttonSuperlikeAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.superlikeButton]}
            onPress={() => {
              hapticFeedback('medium');
              animateButton(buttonSuperlikeScale);
              handleSuperLike();
            }}
          >
            <Ionicons name="star" size={24} color="#00CCFF" />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={[styles.buttonWrapper, buttonLikeAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.likeButton]}
            onPress={() => {
              hapticFeedback('light');
              animateButton(buttonLikeScale);
              handleSwipeRight();
            }}
          >
            <Ionicons name="heart" size={24} color="#4BEE6A" />
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {/* Match Modal */}
      {showMatchModal && matchedDeveloper && (
        <Animated.View 
          style={styles.matchModalContainer}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
        >
          <AnimatedBlurView
            intensity={Platform.OS === 'ios' ? 40 : 20}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.matchContent}>
            <AnimatedLinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.matchCircle}
              entering={FadeIn.delay(200).duration(500)}
            >
              <Ionicons name="heart" size={40} color="#FFFFFF" />
            </AnimatedLinearGradient>
            
            <Animated.Text 
              style={styles.matchTitle}
              entering={FadeIn.delay(400).duration(500)}
            >
              It's a Match!
            </Animated.Text>
            
            <Animated.Text 
              style={styles.matchSubtitle}
              entering={FadeIn.delay(600).duration(500)}
            >
              You and {matchedDeveloper.name} liked each other
            </Animated.Text>
            
            <Animated.View
              entering={FadeIn.delay(800).duration(500)}
              style={styles.matchButtonContainer}
            >
              <AnimatedButton
                label="Send Message"
                onPress={() => setShowMatchModal(false)}
                variant="gradient"
                gradientColors={[theme.colors.primary, theme.colors.secondary]}
                size="medium"
                fullWidth
              />
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    ...shadows.large,
  },
  cardBack: {
    backgroundColor: '#F0F0F0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.m,
  },
  developerInfo: {
    marginBottom: spacing.s,
  },
  developerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  developerRole: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  developerLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: spacing.s,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  skillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: borderRadius.m,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.s,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
  },
  buttonWrapper: {
    margin: spacing.s,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    ...shadows.button,
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: '#FD5D65',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#4BEE6A',
  },
  superlikeButton: {
    borderWidth: 2,
    borderColor: '#00CCFF',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    zIndex: 10,
  },
  likeIndicator: {
    right: 40,
    transform: [{ rotate: '-10deg' }],
  },
  dislikeIndicator: {
    left: 40,
    transform: [{ rotate: '10deg' }],
  },
  superlikeIndicator: {
    top: 60,
    alignSelf: 'center',
  },
  indicatorBadge: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderWidth: 3,
    borderColor: '#4BEE6A',
    borderRadius: borderRadius.s,
    backgroundColor: 'rgba(75, 238, 106, 0.3)',
  },
  indicatorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  superlikeBadge: {
    borderColor: '#00CCFF',
    backgroundColor: 'rgba(0, 204, 255, 0.3)',
  },
  // Match modal styles
  matchModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    width: '80%',
  },
  matchCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
    ...shadows.large,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.s,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  matchSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: spacing.xl,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  matchButtonContainer: {
    width: '100%',
  }
});

export default EnhancedCardStack; 