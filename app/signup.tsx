import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, useTheme, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleNextStep = () => {
    // Move to the next step in registration flow
    setStep(step + 1);
  };

  const handleVerifyCode = () => {
    setStep(step + 1);
  };

  const handleCompleteSignup = () => {
    // In a real app, submit all collected info to your backend
    router.push('/profile-setup');
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((stepNum) => (
          <View 
            key={stepNum} 
            style={[
              styles.stepDot, 
              step >= stepNum && { backgroundColor: '#FF4B7F' }
            ]} 
          />
        ))}
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <View style={styles.header}>
              <Text variant="headlineLarge" style={styles.title}>
                Create Account
              </Text>
              <Text style={styles.subtitle}>
                Let's start with your basic info
              </Text>
            </View>

            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              outlineColor="#DDD"
              activeOutlineColor="#FF4B7F"
            />
            
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
              onPress={handleNextStep}
              disabled={!name || phoneNumber.length < 10}
            >
              Continue
            </Button>
          </>
        );
      
      case 2:
        return (
          <>
            <View style={styles.header}>
              <Text variant="headlineLarge" style={styles.title}>
                Verification
              </Text>
              <Text style={styles.subtitle}>
                Enter the code we've sent to {phoneNumber}
              </Text>
            </View>

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
        );
      
      case 3:
        return (
          <>
            <View style={styles.header}>
              <Text variant="headlineLarge" style={styles.title}>
                About You
              </Text>
              <Text style={styles.subtitle}>
                Tell us a bit more about yourself
              </Text>
            </View>

            <Text style={styles.label}>I am a</Text>
            <SegmentedButtons
              value={gender}
              onValueChange={setGender}
              buttons={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
              style={styles.segmentedButtons}
            />
            
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              mode="outlined"
              outlineColor="#DDD"
              activeOutlineColor="#FF4B7F"
            />

            <Button
              mode="contained"
              style={styles.button}
              contentStyle={styles.buttonContent}
              buttonColor="#FF4B7F"
              onPress={handleCompleteSignup}
              disabled={!gender || !email || !email.includes('@')}
            >
              Complete
            </Button>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.container}>
          {renderStepIndicator()}
          {renderCurrentStep()}
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, { color: '#FF4B7F' }]}>Login</Text>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 6,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  segmentedButtons: {
    marginBottom: 24,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
}); 