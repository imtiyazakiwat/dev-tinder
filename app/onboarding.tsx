import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Using a placeholder image URL instead of requiring a local asset
const ILLUSTRATION_URL = 'https://cdni.iconscout.com/illustration/premium/thumb/developers-working-on-coding-3839570-3202816.png';

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F8F8']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>Welcome to devTinder</Text>
          <Text style={styles.subtitle}>Connect with developers who share your passion for code</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: ILLUSTRATION_URL }} style={styles.illustration} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor="#FF4B7F"
            onPress={() => router.push('/login')}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            style={[styles.button, styles.secondaryButton]}
            contentStyle={styles.buttonContent}
            textColor="#FF4B7F"
            onPress={() => router.push('/signup')}
          >
            Sign Up
          </Button>
          <Button 
            mode="text"
            onPress={() => router.push('/(tabs)')}
            textColor="#666"
          >
            Continue as guest
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 30,
    marginBottom: 16,
  },
  secondaryButton: {
    borderColor: '#FF4B7F',
  },
  buttonContent: {
    paddingVertical: 8,
  },
}); 