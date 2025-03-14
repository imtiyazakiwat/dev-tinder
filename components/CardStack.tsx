import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Text,
} from 'react-native';
import SwipeCard from './SwipeCard';

interface Developer {
  id: string;
  name: string;
  age: number;
  bio: string;
  skills: string[];
  location: string;
  imageUrl: string;
  githubProfile: string;
}

interface CardStackProps {
  data: Developer[];
  currentIndex: number;
  onLike: (id: string) => void;
  onDislike: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const CardStack: React.FC<CardStackProps> = ({
  data,
  currentIndex,
  onLike,
  onDislike,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [rotating, setRotating] = useState(false);
  const rotateCard = useRef(new Animated.Value(0)).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  const rotateFlip = rotateCard.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const swipeCard = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      direction === 'right'
        ? onLike(data[currentIndex].id)
        : onDislike();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const toggleRotate = () => {
    if (!rotating) {
      setRotating(true);
      Animated.timing(rotateCard, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setRotating(false);
      Animated.timing(rotateCard, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (!rotating) {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeCard('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeCard('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const renderCards = () => {
    if (currentIndex >= data.length) {
      return null;
    }

    return data
      .map((item, index) => {
        if (index < currentIndex) {
          return null;
        }

        if (index === currentIndex) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.cardStyle,
                {
                  transform: [
                    { rotate },
                    { rotateY: rotateFlip },
                    ...position.getTranslateTransform(),
                  ],
                  zIndex: 99,
                },
              ]}
              {...panResponder.panHandlers}
            >
              <SwipeCard
                developer={item}
                flipped={rotating}
                onFlip={toggleRotate}
              />

              <Animated.View
                style={[
                  styles.likeContainer,
                  { opacity: likeOpacity },
                ]}
              >
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.dislikeContainer,
                  { opacity: dislikeOpacity },
                ]}
              >
                <Text style={styles.dislikeText}>NOPE</Text>
              </Animated.View>
            </Animated.View>
          );
        }

        if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.cardStyle,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }],
                  zIndex: 98,
                },
              ]}
            >
              <SwipeCard
                developer={item}
                flipped={false}
                onFlip={() => {}}
              />
            </Animated.View>
          );
        }

        if (index === currentIndex + 2) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.cardStyle,
                {
                  zIndex: 97,
                },
              ]}
            >
              <SwipeCard
                developer={item}
                flipped={false}
                onFlip={() => {}}
              />
            </Animated.View>
          );
        }

        return null;
      })
      .reverse();
  };

  return <View style={styles.container}>{renderCards()}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: '85%',
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  likeContainer: {
    position: 'absolute',
    top: 40,
    left: 40,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 4,
    borderRadius: 5,
    borderColor: '#4CD964',
    padding: 10,
  },
  likeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CD964',
  },
  dislikeContainer: {
    position: 'absolute',
    top: 40,
    right: 40,
    transform: [{ rotate: '15deg' }],
    borderWidth: 4,
    borderRadius: 5,
    borderColor: '#FF3B30',
    padding: 10,
  },
  dislikeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});

export default CardStack;