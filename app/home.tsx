import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  StatusBar, 
  ScrollView,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Text, IconButton, useTheme, Button, Avatar, Surface, Chip, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  SlideInRight,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedGestureHandler
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Developer, mockDevelopers } from '../constants/mockData';
import EnhancedCardStack from '../components/EnhancedCardStack';
import AnimatedButton from '../components/ui/AnimatedButton';
import GradientCard from '../components/ui/GradientCard';
import { useThemeContext } from '../components/ThemeProvider';
import { shadows, spacing, borderRadius, CARD_WIDTH, CARD_HEIGHT } from '../constants/theme';
import { buttonPressFeedback, hapticFeedback } from '../utils/haptics';
import { springConfigs, timingConfigs } from '../utils/animations';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Mock matches data
const mockMatches = [
  {
    id: '1',
    name: 'Emma Johnson',
    role: 'UI/UX Designer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isNew: true,
  },
  {
    id: '2',
    name: 'Alex Chen',
    role: 'Frontend Developer',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    isNew: true,
  },
  {
    id: '3',
    name: 'Sophia Martinez',
    role: 'Backend Developer',
    avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
    isNew: false,
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Full Stack Developer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isNew: false,
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const [developers] = useState<Developer[]>(mockDevelopers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');
  const [likeLog, setLikeLog] = useState<{ id: string, name: string, action: 'like' | 'dislike' | 'superlike' }[]>([]);
  const [matches, setMatches] = useState(mockMatches);
  const [newMatchCount, setNewMatchCount] = useState(2);
  const [showMatches, setShowMatches] = useState(false);
  
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardRotate = useSharedValue(0);
  const likeOpacity = useSharedValue(0);
  const nopeOpacity = useSharedValue(0);
  const superLikeOpacity = useSharedValue(0);
  
  // References to update nextIndex after animations
  const currentIndexRef = useRef(currentIndex);
  
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  
  // Reset animation values when the current index changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    cardRotate.value = 0;
    likeOpacity.value = 0;
    nopeOpacity.value = 0;
    superLikeOpacity.value = 0;
    
    setNextIndex(currentIndex + 1);
  }, [currentIndex]);
  
  // Handle swipe completion and logging
  const handleSwiped = (action: 'like' | 'dislike' | 'superlike') => {
    const currentDev = developers[currentIndexRef.current];
    if (!currentDev) return;
    
    const logItem = {
      id: currentDev.id,
      name: currentDev.name,
      action
    };
    
    setLikeLog(prev => [logItem, ...prev]);
    
    // Provide haptic feedback
    if (action === 'like') {
      hapticFeedback('light');
    } else if (action === 'dislike') {
      hapticFeedback('light');
    } else if (action === 'superlike') {
      hapticFeedback('success');
    }
    
    // Update to the next index after animation completes
    setTimeout(() => {
      if (currentIndexRef.current < developers.length - 1) {
        setCurrentIndex(currentIndexRef.current + 1);
      } else {
        // No more profiles - handle this case
        console.log('No more profiles to show');
        // Could navigate to an empty state or reset
      }
    }, 200);
  };
  
  // Handle gesture state changes with proper typing
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      'worklet';
    },
    onActive: (event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      cardRotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-Math.PI / 10, 0, Math.PI / 10],
        Extrapolate.CLAMP
      );
      
      // Calculate opacities for indicators
      if (event.translationX > 0) {
        likeOpacity.value = interpolate(
          event.translationX,
          [0, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        );
        nopeOpacity.value = 0;
      } else {
        nopeOpacity.value = interpolate(
          -event.translationX,
          [0, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        );
        likeOpacity.value = 0;
      }
      
      // Super like indicator based on upward swipe
      superLikeOpacity.value = interpolate(
        -event.translationY,
        [0, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP
      );
    },
    onEnd: (event) => {
      'worklet';
      
      const swipedRight = event.translationX > SWIPE_THRESHOLD;
      const swipedLeft = event.translationX < -SWIPE_THRESHOLD;
      const swipedUp = event.translationY < -SWIPE_THRESHOLD;
      
      if (swipedRight) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {
          damping: 12,
          stiffness: 80
        });
        runOnJS(handleSwiped)('like');
      } else if (swipedLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {
          damping: 12,
          stiffness: 80
        });
        runOnJS(handleSwiped)('dislike');
      } else if (swipedUp) {
        translateY.value = withSpring(-SCREEN_HEIGHT, {
          damping: 12,
          stiffness: 80
        });
        runOnJS(handleSwiped)('superlike');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        cardRotate.value = withSpring(0);
        likeOpacity.value = withSpring(0);
        nopeOpacity.value = withSpring(0);
        superLikeOpacity.value = withSpring(0);
      }
    }
  });
  
  // Handle manual button presses
  const handleButtonPress = (action: 'like' | 'dislike' | 'superlike') => {
    if (action === 'like') {
      translateX.value = withSpring(SCREEN_WIDTH * 1.5, {
        damping: 12,
        stiffness: 80
      });
      likeOpacity.value = withSpring(1);
    } else if (action === 'dislike') {
      translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {
        damping: 12,
        stiffness: 80
      });
      nopeOpacity.value = withSpring(1);
    } else if (action === 'superlike') {
      translateY.value = withSpring(-SCREEN_HEIGHT, {
        damping: 12,
        stiffness: 80
      });
      superLikeOpacity.value = withSpring(1);
    }
    
    handleSwiped(action);
  };
  
  // Animated styles
  const frontCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${cardRotate.value}rad` }
      ]
    };
  });
  
  const likeStyle = useAnimatedStyle(() => {
    return {
      opacity: likeOpacity.value,
      transform: [
        { scale: interpolate(likeOpacity.value, [0, 1], [0.8, 1]) }
      ]
    };
  });
  
  const nopeStyle = useAnimatedStyle(() => {
    return {
      opacity: nopeOpacity.value,
      transform: [
        { scale: interpolate(nopeOpacity.value, [0, 1], [0.8, 1]) }
      ]
    };
  });
  
  const superlikeStyle = useAnimatedStyle(() => {
    return {
      opacity: superLikeOpacity.value,
      transform: [
        { scale: interpolate(superLikeOpacity.value, [0, 1], [0.8, 1]) }
      ]
    };
  });
  
  const backCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(
            Math.abs(translateX.value),
            [0, SCREEN_WIDTH / 2],
            [0.9, 0.95],
            Extrapolate.CLAMP
          )
        },
        { translateY: interpolate(
            Math.abs(translateX.value),
            [0, SCREEN_WIDTH / 2],
            [20, 0],
            Extrapolate.CLAMP
          )
        }
      ],
      opacity: interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH / 2],
        [0.7, 1],
        Extrapolate.CLAMP
      )
    };
  });
  
  // Card rendering
  const renderCard = (developer: Developer, index: number, isCurrentCard: boolean) => {
    if (!developer) return null;
    
    // Split the name to get first name
    const firstName = developer.name.split(' ')[0];
    
    return (
      <Animated.View
        style={[
          styles.card,
          isCurrentCard ? frontCardStyle : backCardStyle,
          isCurrentCard ? styles.frontCard : styles.backCard
        ]}
      >
        <Image 
          source={{ uri: developer.avatar }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />
        
        {isCurrentCard && (
          <>
            <Animated.View style={[styles.likeStamp, likeStyle]}>
              <Text style={styles.stampText}>LIKE</Text>
            </Animated.View>
            
            <Animated.View style={[styles.nopeStamp, nopeStyle]}>
              <Text style={styles.stampText}>NOPE</Text>
            </Animated.View>
            
            <Animated.View style={[styles.superlikeStamp, superlikeStyle]}>
              <Text style={styles.stampText}>SUPER LIKE</Text>
            </Animated.View>
          </>
        )}
        
        <View style={styles.cardInfo}>
          <View style={styles.nameAgeContainer}>
            <Text style={styles.nameText}>{firstName}, </Text>
            <Text style={styles.ageText}>{developer.age}</Text>
          </View>
          <Text style={styles.roleText}>{developer.role}</Text>
          <View style={styles.skillsContainer}>
            {developer.skills.slice(0, 3).map((skill, i) => (
              <View key={i} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No more developers</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setCurrentIndex(0)}
        >
          <Text style={styles.resetButtonText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Available filters
  const filters = ['All', 'Frontend', 'Backend', 'Mobile', 'DevOps', 'AI/ML'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image 
          source={{ uri: 'https://i.pravatar.cc/300' }} 
              style={styles.avatar}
            />
          </TouchableOpacity>
          
          <Text style={styles.logoText}>dev<Text style={{color: '#FF4B7F'}}>Tinder</Text></Text>
          
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="chatbubble" size={28} color="#FF4B7F" />
          </TouchableOpacity>
        </View>
        
        {/* Card Stack */}
        <View style={styles.cardContainer}>
          {currentIndex < developers.length ? (
            <>
              {/* Next card (back) */}
              {nextIndex < developers.length && (
                renderCard(developers[nextIndex], nextIndex, false)
              )}
              
              {/* Current card (front) */}
              <PanGestureHandler onGestureEvent={gestureHandler}>
                {renderCard(developers[currentIndex], currentIndex, true)}
              </PanGestureHandler>
            </>
          ) : (
            renderEmptyState()
          )}
      </View>
      
        {/* Action Buttons */}
        {currentIndex < developers.length && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => handleButtonPress('dislike')}
            >
              <Ionicons name="close" size={30} color="#FF5864" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.superlikeButton]}
              onPress={() => handleButtonPress('superlike')}
            >
              <Ionicons name="star" size={28} color="#17C0F9" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleButtonPress('like')}
            >
              <Ionicons name="heart" size={30} color="#76E2B3" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => {}}
          >
            <Ionicons name="compass-outline" size={26} color="#FF4B7F" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => {}}
          >
            <Ionicons name="person-outline" size={26} color="#AAAAAA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabButton}
            onPress={() => {}}
          >
            <Ionicons name="chatbubbles-outline" size={26} color="#AAAAAA" />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Background bubbles
  backgroundBubble: {
    position: 'absolute',
    borderRadius: 300,
  },
  bubble1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(255, 61, 127, 0.08)',
    left: -100,
  },
  bubble2: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(94, 64, 255, 0.08)',
    right: -80,
  },
  bubble3: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 126, 46, 0.08)',
    right: 40,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    ...shadows.medium,
  },
  frontCard: {
    zIndex: 10,
  },
  backCard: {
    zIndex: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  ageText: {
    fontSize: 28,
    color: '#FFF',
  },
  roleText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  likeStamp: {
    position: 'absolute',
    top: 45,
    right: 25,
    transform: [{ rotate: '30deg' }],
    borderWidth: 4,
    borderColor: '#76E2B3',
    padding: 8,
    borderRadius: 10,
  },
  nopeStamp: {
    position: 'absolute',
    top: 45,
    left: 25,
    transform: [{ rotate: '-30deg' }],
    borderWidth: 4,
    borderColor: '#FF5864',
    padding: 8,
    borderRadius: 10,
  },
  superlikeStamp: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    transform: [{ rotate: '-20deg' }],
    borderWidth: 4,
    borderColor: '#17C0F9',
    padding: 8,
    borderRadius: 10,
  },
  stampText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    ...shadows.medium,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#76E2B3',
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: '#FF5864',
  },
  superlikeButton: {
    borderWidth: 2,
    borderColor: '#17C0F9',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#FF4B7F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 