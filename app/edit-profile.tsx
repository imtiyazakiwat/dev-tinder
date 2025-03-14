import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock user profile data - this would typically come from a real data source
const USER = {
  name: 'Jordan Smith',
  age: 28,
  bio: 'Full-stack developer passionate about building beautiful user interfaces and scalable backend systems. Looking for collaborators on open source projects.',
  location: 'San Francisco, CA',
  images: [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Express'],
  interests: ['Open Source', 'Hackathons', 'AI/ML', 'UI/UX Design']
};

export default function EditProfileScreen() {
  const theme = useTheme();
  
  // State for editable fields
  const [name, setName] = useState(USER.name);
  const [age, setAge] = useState(USER.age.toString());
  const [bio, setBio] = useState(USER.bio);
  const [location, setLocation] = useState(USER.location);
  const [skills, setSkills] = useState(USER.skills.join(', '));
  const [interests, setInterests] = useState(USER.interests.join(', '));

  // Function to handle saving profile changes
  const handleSave = () => {
    // In a real app, this would save to a database or API
    console.log('Profile updated:', { name, age, bio, location, skills, interests });
    
    // Navigate back to profile
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            size={24}
            iconColor="#333"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} /> {/* Spacer for alignment */}
        </View>

        <Text style={styles.sectionTitle}>Profile Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
          {USER.images.map((image, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: image }} style={styles.photoThumbnail} />
              <TouchableOpacity style={styles.removePhotoButton}>
                <Ionicons name="close-circle" size={24} color="#FF4B7F" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Ionicons name="add" size={30} color="#FF4B7F" />
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
        />
        
        <TextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          mode="outlined"
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
          keyboardType="numeric"
        />
        
        <TextInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          mode="outlined"
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
        />
        
        <TextInput
          label="Bio"
          value={bio}
          onChangeText={setBio}
          style={styles.input}
          mode="outlined"
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.sectionTitle}>Skills & Interests</Text>
        
        <TextInput
          label="Skills (comma separated)"
          value={skills}
          onChangeText={setSkills}
          style={styles.input}
          mode="outlined"
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
        />
        
        <TextInput
          label="Interests (comma separated)"
          value={interests}
          onChangeText={setInterests}
          style={styles.input}
          mode="outlined"
          outlineColor="#DDD"
          activeOutlineColor="#FF4B7F"
        />
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={[styles.button, styles.cancelButton]}
            textColor="#666"
          >
            Cancel
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSave}
            style={[styles.button, styles.saveButton]}
            buttonColor="#FF4B7F"
          >
            Save Changes
          </Button>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumbnail: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 120,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FF4B7F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    borderRadius: 30,
  },
  cancelButton: {
    marginRight: 8,
    borderColor: '#DDD',
  },
  saveButton: {
    marginLeft: 8,
  },
});
