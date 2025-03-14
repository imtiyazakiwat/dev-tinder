import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, Chip, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileSetupScreen() {
  const theme = useTheme();
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  
  const skillOptions = [
    'JavaScript', 'TypeScript', 'Python', 'React', 'React Native',
    'Node.js', 'Express', 'MongoDB', 'SQL', 'AWS', 'Docker'
  ];
  
  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleCompleteProfile = () => {
    // In a real app, save data to a server
    router.replace('/(tabs)');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell us about yourself and your coding skills</Text>
        </View>
        
        <TextInput
          label="Bio"
          value={bio}
          onChangeText={setBio}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
          placeholder="I'm a developer who loves..."
        />
        
        <Text style={styles.sectionTitle}>Your Skills</Text>
        <View style={styles.skillsContainer}>
          {skills.map(skill => (
            <Chip
              key={skill}
              mode="flat"
              onClose={() => handleRemoveSkill(skill)}
              style={styles.skillChip}
              textStyle={{ color: '#FF4B7F' }}
            >
              {skill}
            </Chip>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Add Skills</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.skillOptionsContainer}>
          {skillOptions
            .filter(option => !skills.includes(option))
            .map(option => (
              <Chip
                key={option}
                mode="outlined"
                onPress={() => handleAddSkill(option)}
                style={styles.optionChip}
              >
                {option}
              </Chip>
            ))}
        </ScrollView>
        
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#FF4B7F"
          onPress={handleCompleteProfile}
          disabled={bio.length < 10 || skills.length === 0}
        >
          Complete Profile
        </Button>
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
    padding: 24,
  },
  header: {
    marginBottom: 32,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  skillOptionsContainer: {
    marginBottom: 32,
  },
  skillChip: {
    margin: 4,
    backgroundColor: '#FF4B7F20',
  },
  optionChip: {
    margin: 4,
  },
  button: {
    borderRadius: 30,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
}); 