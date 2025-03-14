import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, useTheme, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock user profile data
interface User {
  name: string;
  age: number;
  bio: string;
  location: string;
  images: string[];
  skills: string[];
  interests: string[];
}

const USER: User = {
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

export default function ProfileScreen() {
  const theme = useTheme();

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
          <Text style={styles.headerTitle}>My Profile</Text>
          <IconButton
            icon="settings-outline"
            size={24}
            iconColor="#333"
            onPress={() => router.push('/settings')}
          />
        </View>

        <View style={styles.profileHeader}>
          <Image
            source={{ uri: USER.images[0] }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{USER.name}, {USER.age}</Text>
            <Text style={styles.location}>{USER.location}</Text>
          </View>
        </View>

        <Button
          mode="outlined"
          icon="pencil"
          onPress={() => router.push({
            pathname: '/edit-profile',
          })}
          style={styles.editButton}
          textColor="#FF4B7F"
        >
          Edit Profile
        </Button>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{USER.bio}</Text>

        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
          {USER.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.photoThumbnail}
            />
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Ionicons name="add" size={30} color="#FF4B7F" />
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.tagsContainer}>
          {USER.skills.map((skill, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tagsContainer}>
          {USER.interests.map((interest, index) => (
            <View key={index} style={[styles.tag, styles.interestTag]}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>27</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <Divider style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
          <Divider style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>9</Text>
            <Text style={styles.statLabel}>Active Chats</Text>
          </View>
        </View>

        <Button
          mode="contained"
          icon="logout"
          onPress={() => router.replace('/onboarding')}
          style={styles.logoutButton}
          buttonColor="#333"
        >
          Logout
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
    padding: 16,
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    borderColor: '#FF4B7F',
    borderRadius: 30,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoThumbnail: {
    width: 120,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#FF4B7F20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestTag: {
    backgroundColor: '#4B7FFF20',
  },
  tagText: {
    color: '#333',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4B7F',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#DDD',
  },
  logoutButton: {
    borderRadius: 30,
    marginBottom: 16,
  },
}); 