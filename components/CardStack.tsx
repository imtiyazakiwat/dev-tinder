import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Animated, 
  PanResponder, 
  Dimensions, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Alert,
  Vibration
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Developer } from '../constants/mockData';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const SWIPE_OUT_DURATION = 250;

interface CardStackProps {
  developers: Developer[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onSwipeLeft?: (developer: Developer) => void;
  onSwipeRight?: (developer: Developer) => void;
  onSuperLike?: (developer: Developer) => void;
  onLikeLogged?: (developer: Developer, action: 'like' | 'dislike' | 'superlike') => void;
  emptyStateComponent?: React.ReactNode;
}

const CardStack: React.FC<CardStackProps> = ({
  developers,
  currentIndex,
  setCurrentIndex,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  onLikeLogged,
  emptyStateComponent
}) => {
  // Animation values - all use the same animation driver type (JavaScript driver)
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  // Button animations use native driver (separate from card animations)
  const buttonLikeAnim = useRef(new Animated.Value(1)).current;
  const buttonDislikeAnim = useRef(new Animated.Value(1)).current;
  const buttonSuperlikeAnim = useRef(new Animated.Value(1)).current;

  const [swiping, setSwiping] = useState(false);
  
  // Reset animations when currentIndex changes
  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    opacity.setValue(1);
    setSwiping(false);
  }, [currentIndex]);
  
  // Card rotation based on swipe position
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });
  
  // Dynamic opacity for like/dislike indicators
  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 8, width / 4],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-width / 4, -width / 8, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  // Dynamic scale/opacity for next card
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  // Card tilt based on vertical swipe
  const verticalTilt = position.y.interpolate({
    inputRange: [-height / 4, 0, height / 4],
    outputRange: ['5deg', '0deg', '-5deg'],
    extrapolate: 'clamp',
  });

  // Create a new PanResponder for each render
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !swiping && currentIndex < developers.length,
    onPanResponderGrant: () => {
      // Slight scale down when touching card - use JS driver for consistency
      Animated.spring(scale, {
        toValue: 0.98,
        friction: 5,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderMove: (_, gesture) => {
      // Move card based on gesture
      position.setValue({ 
        x: gesture.dx, 
        y: gesture.dy / 2 // Reduce vertical movement for more natural feel
      });
      
      // Vibrate lightly when crossing threshold for better feedback
      if (Math.abs(gesture.dx) === SWIPE_THRESHOLD) {
        Vibration.vibrate(10);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      // Reset scale when releasing - use JS driver for consistency
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: false,
      }).start();
      
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const swipeRight = () => {
    if (swiping || currentIndex >= developers.length) return;
    setSwiping(true);
    
    const developer = developers[currentIndex];
    
    // Notify parent component about the like
    if (onLikeLogged) {
      onLikeLogged(developer, 'like');
    }
    
    console.log("Liked:", developer.name, "at index", currentIndex);
    
    // Subtle vibration for haptic feedback
    Vibration.vibrate(20);
    
    // Show a small notification
    Alert.alert('Liked!', `You liked ${developer.name}`);

    // Animate card off screen with physics
    Animated.parallel([
      // Move right with acceleration
      Animated.timing(position, {
        toValue: { x: width * 1.5, y: 50 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }),
      // Fade out during exit
      Animated.timing(opacity, {
        toValue: 0,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      })
    ]).start(() => {
      // Move to the next card
      updateIndex();
      
      // Call the callback after we've updated the index
      if (onSwipeRight) {
        onSwipeRight(developer);
      }
    });
  };

  const swipeLeft = () => {
    if (swiping || currentIndex >= developers.length) return;
    setSwiping(true);
    
    const developer = developers[currentIndex];
    
    // Notify parent component about the dislike
    if (onLikeLogged) {
      onLikeLogged(developer, 'dislike');
    }
    
    console.log("Disliked:", developer.name, "at index", currentIndex);
    
    // Subtle vibration for haptic feedback
    Vibration.vibrate(20);

    // Animate card off screen with physics
    Animated.parallel([
      // Move left with acceleration
      Animated.timing(position, {
        toValue: { x: -width * 1.5, y: 50 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }),
      // Fade out during exit
      Animated.timing(opacity, {
        toValue: 0,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      })
    ]).start(() => {
      // Move to the next card
      updateIndex();
      
      // Call the callback after we've updated the index
      if (onSwipeLeft) {
        onSwipeLeft(developer);
      }
    });
  };

  // Separate function to handle index updates
  const updateIndex = () => {
    // Reset immediately for the next card
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
    scale.setValue(1);
    
    // Update current index
    setCurrentIndex(currentIndex + 1);
    
    // Clear swiping state with slight delay to ensure animations are complete
    setTimeout(() => {
      setSwiping(false);
    }, 100);
  };

  const handleSuperlike = () => {
    if (swiping || currentIndex >= developers.length) return;
    setSwiping(true);
    
    const developer = developers[currentIndex];
    
    // Notify parent component about the superlike
    if (onLikeLogged) {
      onLikeLogged(developer, 'superlike');
    }
    
    console.log("Superliked:", developer.name, "at index", currentIndex);
    
    // More pronounced vibration for superlike
    Vibration.vibrate([0, 30, 10, 30]);
    
    // Show a notification
    Alert.alert('Super Liked!', `You super liked ${developer.name}`);
    
    // Call the superlike callback
    if (onSuperLike) {
      onSuperLike(developer);
    } else if (onSwipeRight) {
      // If no specific superlike handler, treat it as a right swipe
      onSwipeRight(developer);
    }
    
    // Animate card upward with a zoom out effect
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: 0, y: -height },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      })
    ]).start(() => {
      // Move to the next card
      updateIndex();
    });
  };

  const renderCards = () => {
    // If no more developers, show empty state
    if (currentIndex >= developers.length) {
      return emptyStateComponent || (
        <View style={styles.emptyState}>
          <Animated.View 
            style={{ 
              opacity: opacity, 
              transform: [{ scale: scale }] 
            }}
          >
            <Ionicons name="heart-dislike-outline" size={60} color="#FF4B7F" />
            <Text style={styles.emptyStateText}>No more developers!</Text>
            <Text style={styles.emptyStateSubText}>Come back later for more matches</Text>
          </Animated.View>
        </View>
      );
    }

    // Create an array to hold our card components
    const cards = [];
    
    // Render up to 3 cards from the current index
    for (let i = 0; i < Math.min(3, developers.length - currentIndex); i++) {
      const cardIndex = currentIndex + i;
      const developer = developers[cardIndex];
      
      if (i === 0) {
        // This is the current card (top card)
        cards.push(
          <Animated.View
            key={`${developer.id}-${cardIndex}`}
            style={[
              styles.cardContainer,
              {
                zIndex: 10, // Ensure top card is always on top
                opacity: opacity,
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate: rotate },
                  { rotateX: verticalTilt },
                  { scale: scale }
                ]
              }
            ]}
            {...panResponder.panHandlers}
          >
            <Animated.View style={[styles.likeIndicator, { opacity: likeOpacity }]}>
              <Text style={styles.indicatorText}>LIKE</Text>
            </Animated.View>
            
            <Animated.View style={[styles.dislikeIndicator, { opacity: dislikeOpacity }]}>
              <Text style={styles.indicatorText}>NOPE</Text>
            </Animated.View>
            
            <View style={styles.card}>
              <Image 
                source={{ uri: developer.avatar }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              <View style={styles.cardInfo}>
                <View style={styles.profileHeader}>
                  <View>
                    <Text style={styles.name}>{developer.name}, {developer.age}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={16} color="#777" />
                      <Text style={styles.location}>{developer.location}</Text>
                    </View>
                  </View>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{developer.role}</Text>
                  </View>
                </View>
                
                {/* Skills Tags */}
                <View style={styles.skillsContainer}>
                  {developer.skills.slice(0, 3).map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                  {developer.skills.length > 3 && (
                    <Text style={styles.moreSkills}>+{developer.skills.length - 3} more</Text>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        );
      } else {
        // This is a background card
        cards.push(
          <Animated.View
            key={`${developer.id}-${cardIndex}`}
            style={[
              styles.cardContainer,
              {
                zIndex: 9 - i,
                opacity: i === 1 ? nextCardOpacity : 0.7,
                transform: [
                  { scale: i === 1 ? nextCardScale : 0.9 - (i * 0.05) },
                  { translateY: 10 * i },
                  { translateX: (i * 5) - 2.5 } // Slight offset for stack effect
                ],
                top: i * 5 // Staggered positioning
              }
            ]}
          >
            <View style={styles.card}>
              <Image 
                source={{ uri: developer.avatar }} 
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardInfo}>
                <View style={styles.profileHeader}>
                  <View>
                    <Text style={styles.name}>{developer.name}, {developer.age}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={16} color="#777" />
                      <Text style={styles.location}>{developer.location}</Text>
                    </View>
                  </View>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{developer.role}</Text>
                  </View>
                </View>
                
                {/* Skills Tags */}
                <View style={styles.skillsContainer}>
                  {developer.skills.slice(0, 3).map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                  {developer.skills.length > 3 && (
                    <Text style={styles.moreSkills}>+{developer.skills.length - 3} more</Text>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        );
      }
    }
    
    // Return the cards in reverse order so the first one is rendered last (on top)
    return cards.reverse();
  };

  // Button animations for a more interactive feel
  const animateButton = (value: Animated.Value) => {
    return {
      transform: [{ scale: value.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
      })}]
    };
  };

  const onPressInButton = (button: Animated.Value) => {
    Animated.spring(button, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true // Button animations use native driver
    }).start();
  };

  const onPressOutButton = (button: Animated.Value) => {
    Animated.spring(button, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true // Button animations use native driver
    }).start();
  };

  return (
    <View style={styles.container}>
      {renderCards()}
      
      {/* Bottom Action Bar */}
      {currentIndex < developers.length && (
        <View style={styles.actionBar}>
          <Animated.View style={animateButton(buttonDislikeAnim)}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]} 
              onPress={swipeLeft}
              onPressIn={() => onPressInButton(buttonDislikeAnim)}
              onPressOut={() => onPressOutButton(buttonDislikeAnim)}
              disabled={swiping}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={animateButton(buttonSuperlikeAnim)}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.superlikeButton]}
              onPress={handleSuperlike}
              onPressIn={() => onPressInButton(buttonSuperlikeAnim)}
              onPressOut={() => onPressOutButton(buttonSuperlikeAnim)}
              disabled={swiping}
            >
              <Ionicons name="star" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={animateButton(buttonLikeAnim)}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]} 
              onPress={swipeRight}
              onPressIn={() => onPressInButton(buttonLikeAnim)}
              onPressOut={() => onPressOutButton(buttonLikeAnim)}
              disabled={swiping}
            >
              <Ionicons name="heart" size={30} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardContainer: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.6,
    top: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '75%',
  },
  cardInfo: {
    padding: 15,
    backgroundColor: 'white',
    height: '25%',
    justifyContent: 'space-between',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginLeft: 4,
  },
  roleTag: {
    backgroundColor: 'rgba(255, 75, 127, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF4B7F',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: 'rgba(95, 110, 230, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 11,
    color: '#5F6EE6',
  },
  moreSkills: {
    fontSize: 11, 
    color: '#777',
    marginLeft: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
    paddingTop: 10,
    marginTop: height * 0.6 + 10,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dislikeButton: {
    backgroundColor: '#FF4B7F',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  superlikeButton: {
    backgroundColor: '#FF9344',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: height * 0.6,
  },
  emptyStateText: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
  likeIndicator: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 11,
    padding: 10,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    transform: [{ rotate: '30deg' }],
  },
  dislikeIndicator: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 11,
    padding: 10,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#FF4B7F',
    backgroundColor: 'rgba(255, 75, 127, 0.2)',
    transform: [{ rotate: '-30deg' }],
  },
  indicatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CardStack; 