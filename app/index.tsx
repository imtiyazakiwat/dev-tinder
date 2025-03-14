import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  useEffect(() => {
    // Auto redirect to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/signup');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#fff', '#fff']} // White background like in the image
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View 
        style={styles.logoContainer}
        entering={FadeIn.duration(1000)}
      >
        <Text style={styles.logoPrefix}>dev</Text>
        <Text style={styles.logo}>Tinder</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPrefix: {
    fontSize: 40,
    fontWeight: '400',
    color: '#000',
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FF4B7F',
  },
}); 