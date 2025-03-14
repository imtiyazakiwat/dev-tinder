import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const PINK = '#FF4B7F';

export default function SignupScreen() {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };
  
  const handleComplete = () => {
    router.push('/home');
  };
  
  // Interest options
  const interests = [
    'Frontend', 'Backend', 'Mobile', 'DevOps', 'AI/ML', 
    'Web3', 'Security', 'UI/UX', 'Gaming', 'Data Science'
  ];
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>dev<Text style={{color: PINK}}>Tinder</Text></Text>
        </View>
        <View style={{width: 24}} />
      </View>
    );
  };
  
  const renderStepIndicator = () => {
    const totalSteps = 6;
    return (
      <View style={styles.stepIndicator}>
        {Array.from({length: totalSteps}).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.stepDot, 
              i + 1 === step ? styles.activeStepDot : 
              i + 1 < step ? styles.completedStepDot : null
            ]} 
          />
        ))}
      </View>
    );
  };
  
  const renderStep = () => {
    switch (step) {
      case 1: // Phone Number
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={FadeIn.duration(400)}
          >
            <Text style={styles.stepTitle}>Let's start with your number</Text>
            <Text style={styles.stepDescription}>We'll send a verification code to this number</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Your Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.input}
                mode="outlined"
                outlineColor="#DFDFDF"
                activeOutlineColor={PINK}
              />
            </View>
            
            <View style={styles.alternateLoginContainer}>
              <Text style={styles.orText}>OR</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={20} color="#555" />
                  <Text style={styles.socialButtonText}>Login with Google</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, !phoneNumber && styles.buttonDisabled]}
                onPress={handleNextStep}
                disabled={!phoneNumber}
              >
                <LinearGradient
                  colors={[PINK, '#FF7DA8']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <Text style={styles.termsText}>
                By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </Animated.View>
        );
        
      case 2: // Verification Code
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={SlideInRight.duration(400)}
          >
            <Text style={styles.stepTitle}>Verification Code</Text>
            <Text style={styles.stepDescription}>Please enter the 4-digit code sent to {phoneNumber}</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="4-digit Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.input}
                mode="outlined"
                outlineColor="#DFDFDF"
                activeOutlineColor={PINK}
              />
              
              <TouchableOpacity>
                <Text style={styles.resendText}>Didn't receive a code? <Text style={styles.resendLink}>Resend</Text></Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, verificationCode.length < 4 && styles.buttonDisabled]}
                onPress={handleNextStep}
                disabled={verificationCode.length < 4}
              >
                <LinearGradient
                  colors={[PINK, '#FF7DA8']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>Verify</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
        
      case 3: // What's Your Name
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={SlideInRight.duration(400)}
          >
            <Text style={styles.stepTitle}>What's Your Name?</Text>
            <Text style={styles.stepDescription}>Please enter your full name</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
                outlineColor="#DFDFDF"
                activeOutlineColor={PINK}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, !name && styles.buttonDisabled]}
                onPress={handleNextStep}
                disabled={!name}
              >
                <LinearGradient
                  colors={[PINK, '#FF7DA8']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
        
      case 4: // Email Address
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={SlideInRight.duration(400)}
          >
            <Text style={styles.stepTitle}>Email Address</Text>
            <Text style={styles.stepDescription}>Please enter your email address</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                mode="outlined"
                outlineColor="#DFDFDF"
                activeOutlineColor={PINK}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, (!email || !email.includes('@')) && styles.buttonDisabled]}
                onPress={handleNextStep}
                disabled={!email || !email.includes('@')}
              >
                <LinearGradient
                  colors={[PINK, '#FF7DA8']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
        
      case 5: // How Old Are You
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={SlideInRight.duration(400)}
          >
            <Text style={styles.stepTitle}>How Old Are You?</Text>
            <Text style={styles.stepDescription}>Enter your age to find compatible connections</Text>
            
            <View style={styles.ageSelector}>
              <View style={styles.ageNumbers}>
                <Text style={styles.ageNumberSide}>29</Text>
                <Text style={styles.ageNumberSide}>30</Text>
                <Text style={styles.ageNumberSelected}>31</Text>
                <Text style={styles.ageNumberSide}>32</Text>
                <Text style={styles.ageNumberSide}>33</Text>
              </View>
              <View style={styles.ageSelectorLine} />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleNextStep}
              >
                <LinearGradient
                  colors={[PINK, '#FF7DA8']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
        
      case 6: // Select Interests
        return (
          <Animated.View 
            style={styles.stepContainer}
            entering={SlideInRight.duration(400)}
          >
            <Text style={styles.stepTitle}>Select Up To 5 Interests</Text>
            <Text style={styles.stepDescription}>What coding areas are you passionate about?</Text>
            
            <View style={styles.interestsContainer}>
              {interests.map((interest) => (
                <TouchableOpacity 
                  key={interest} 
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) && styles.selectedInterestChip
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text 
                    style={[
                      styles.interestText,
                      selectedInterests.includes(interest) && styles.selectedInterestText
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, selectedInterests.length === 0 && styles.buttonDisabled]}
                onPress={handleComplete}
                disabled={selectedInterests.length === 0}
              >
                <LinearGradient
                  colors={[PINK, '#FF7DA8']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {renderHeader()}
        {renderStepIndicator()}
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EBEBEB',
    marginHorizontal: 4,
  },
  activeStepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PINK,
  },
  completedStepDot: {
    backgroundColor: PINK,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  alternateLoginContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  orText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 10,
  },
  socialButtons: {
    width: '100%',
    marginTop: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    color: '#333',
    fontWeight: '500',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  linkText: {
    color: PINK,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
  resendLink: {
    color: PINK,
    fontWeight: '500',
  },
  ageSelector: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  ageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  ageNumberSide: {
    fontSize: 24,
    fontWeight: '400',
    color: '#888',
    marginHorizontal: 15,
  },
  ageNumberSelected: {
    fontSize: 36,
    fontWeight: 'bold',
    color: PINK,
    marginHorizontal: 15,
  },
  ageSelectorLine: {
    height: 2,
    width: 40,
    backgroundColor: PINK,
    marginTop: 5,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  interestChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    margin: 6,
  },
  selectedInterestChip: {
    backgroundColor: '#FFE8EF',
  },
  interestText: {
    color: '#555',
    fontWeight: '500',
  },
  selectedInterestText: {
    color: PINK,
    fontWeight: '600',
  },
}); 