import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false);

  const handleSendCode = () => {
    // In a real app, you would send verification code to the phone number
    setIsVerificationStep(true);
  };

  const handleVerifyCode = () => {
    // In a real app, you would verify the code with your backend
    // If successful, navigate to the home screen
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (isVerificationStep) {
              setIsVerificationStep(false);
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              {isVerificationStep ? 'Verification' : 'Login'}
            </Text>
            <Text style={styles.subtitle}>
              {isVerificationStep 
                ? `Enter the code we've sent to ${phoneNumber}`
                : 'Enter your phone number to continue'}
            </Text>
          </View>

          {!isVerificationStep ? (
            <>
              <TextInput
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
                mode="outlined"
                outlineColor="#DDD"
                activeOutlineColor="#FF4B7F"
              />
              <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContent}
                buttonColor="#FF4B7F"
                onPress={handleSendCode}
                disabled={phoneNumber.length < 10}
              >
                Send Verification Code
              </Button>
            </>
          ) : (
            <>
              <TextInput
                label="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
                mode="outlined"
                outlineColor="#DDD"
                activeOutlineColor="#FF4B7F"
              />
              <TouchableOpacity style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive a code?</Text>
                <Text style={[styles.resendLink, { color: '#FF4B7F' }]}>Resend</Text>
              </TouchableOpacity>
              <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContent}
                buttonColor="#FF4B7F"
                onPress={handleVerifyCode}
                disabled={verificationCode.length < 6}
              >
                Verify Code
              </Button>
            </>
          )}

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.signupLink, { color: '#FF4B7F' }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  button: {
    borderRadius: 30,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
}); 