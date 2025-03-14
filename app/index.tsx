import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Using a placeholder image URL instead of requiring a local asset
const LOGO_URL = 'https://cdn-icons-png.flaticon.com/512/6681/6681204.png';

export default function SplashScreen() {
  useEffect(() => {
    // Auto redirect to onboarding after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#FF4B7F', '#FF9344']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Image source={{ uri: LOGO_URL }} style={styles.logo} />
      <Text variant="headlineLarge" style={styles.title}>devTinder</Text>
      <Text style={styles.subtitle}>Swipe. Match. Code.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    opacity: 0.9,
  },
}); 