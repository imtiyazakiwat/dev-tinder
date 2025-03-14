import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Button, 
  Surface, 
  Divider, 
  useTheme, 
  IconButton,
  Avatar,
  Chip,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { spacing, shadows, borderRadius } from '../../constants/theme';

// Temporary mock data for the current user
const currentUser = {
  id: 'current-user',
  name: 'John Doe',
  age: 29,
  role: 'Senior Frontend Developer',
  experience: 7,
  location: 'San Francisco, CA',
  bio: 'Passionate about creating beautiful and performant web applications with React and TypeScript. Love sharing knowledge and contributing to open source.',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  skills: ['React', 'TypeScript', 'Redux', 'Next.js', 'GraphQL', 'Tailwind CSS'],
  githubStats: {
    repos: 52,
    followers: 1240,
    contributions: 3864,
  },
  languages: [
    { name: 'TypeScript', percentage: 45 },
    { name: 'JavaScript', percentage: 35 },
    { name: 'Python', percentage: 15 },
    { name: 'Go', percentage: 5 },
  ],
  workHistory: [
    { company: 'TechCorp', position: 'Senior Frontend Developer', period: '2021 - Present' },
    { company: 'DevInc', position: 'Frontend Developer', period: '2018 - 2021' },
    { company: 'WebStudio', position: 'Junior Developer', period: '2016 - 2018' },
  ],
  education: {
    degree: 'BS Computer Science',
    school: 'University of California, Berkeley',
    year: '2016',
  },
  matches: 28,
  likes: 152,
  premium: true,
};

export default function ProfileScreen() {
  const theme = useTheme();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('skills');

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: currentUser.name,
    role: currentUser.role,
    bio: currentUser.bio,
    location: currentUser.location,
  });
  
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditProfile = () => {
    // Here you would typically update the user profile via API
    console.log('Profile updated:', editForm);
    setEditModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderSkills = () => (
    <View style={styles.sectionContent}>
      <View style={styles.skillsContainer}>
        {currentUser.skills.map((skill, index) => (
          <Chip
            key={index}
            style={[styles.skillChip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={{ color: theme.colors.onPrimaryContainer }}
          >
            {skill}
          </Chip>
        ))}
      </View>
      <Button 
        mode="outlined" 
        icon="plus" 
        style={styles.addButton}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        Add Skill
      </Button>
    </View>
  );

  const renderLanguages = () => (
    <View style={styles.sectionContent}>
      {currentUser.languages.map((lang, index) => (
        <View key={index} style={styles.languageItem}>
          <Text style={styles.languageName}>{lang.name}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${lang.percentage}%`,
                  backgroundColor: getColorForLanguage(lang.name, theme),
                }
              ]} 
            />
          </View>
          <Text style={styles.percentage}>{lang.percentage}%</Text>
        </View>
      ))}
    </View>
  );

  const renderWorkHistory = () => (
    <View style={styles.sectionContent}>
      {currentUser.workHistory.map((work, index) => (
        <View key={index} style={styles.workItem}>
          <View style={styles.workHeader}>
            <Text style={styles.workPosition}>{work.position}</Text>
            <Text style={styles.workPeriod}>{work.period}</Text>
          </View>
          <Text style={styles.workCompany}>{work.company}</Text>
          {index < currentUser.workHistory.length - 1 && (
            <Divider style={styles.divider} />
          )}
        </View>
      ))}
    </View>
  );

  const renderEditModal = () => (
    <Portal>
      <Modal
        visible={editModalVisible}
        onDismiss={() => setEditModalVisible(false)}
        contentContainerStyle={[
          styles.modalContainer, 
          { backgroundColor: theme.colors.surface }
        ]}
      >
        <Text variant="headlineSmall" style={styles.modalTitle}>Edit Profile</Text>
        
        <TextInput
          label="Name"
          value={editForm.name}
          onChangeText={(text) => handleInputChange('name', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Role"
          value={editForm.role}
          onChangeText={(text) => handleInputChange('role', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Location"
          value={editForm.location}
          onChangeText={(text) => handleInputChange('location', text)}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Bio"
          value={editForm.bio}
          onChangeText={(text) => handleInputChange('bio', text)}
          multiline
          numberOfLines={4}
          style={styles.bioInput}
          mode="outlined"
        />
        
        <View style={styles.modalButtons}>
          <Button 
            mode="text" 
            onPress={() => setEditModalVisible(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleEditProfile}
            style={styles.saveButton}
          >
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  // Helper function to get a color for a language
  const getColorForLanguage = (language, theme) => {
    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.tertiary,
      theme.colors.error,
    ];
    
    // Simple hash function for language name
    const index = language.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <Surface style={[styles.headerContainer, shadows.medium]}>
          <LinearGradient
            colors={[theme.colors.cardGradientStart, theme.colors.cardGradientEnd]}
            style={styles.headerGradient}
          >
            <View style={styles.profileHeader}>
              <Avatar.Image 
                source={{ uri: currentUser.avatar }} 
                size={120} 
                style={styles.avatar}
              />
              
              <View style={styles.profileInfo}>
                <Text variant="headlineMedium" style={styles.name}>
                  {currentUser.name}, {currentUser.age}
                </Text>
                <Text variant="titleMedium" style={styles.role}>
                  {currentUser.role}
                </Text>
                <View style={styles.locationContainer}>
                  <IconButton
                    icon="map-marker"
                    size={16}
                    iconColor={theme.colors.surface}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.location}>{currentUser.location}</Text>
                </View>
              </View>
              
              <IconButton
                icon="pencil"
                mode="contained"
                containerColor={theme.colors.surface}
                iconColor={theme.colors.primary}
                size={20}
                onPress={() => {
                  setEditModalVisible(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.editButton}
              />
            </View>
            
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{currentUser.bio}</Text>
            </View>
            
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentUser.githubStats.repos}</Text>
                <Text style={styles.statLabel}>Repositories</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentUser.githubStats.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentUser.matches}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
            </View>
          </LinearGradient>
        </Surface>
        
        {/* Section Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeSection === 'skills' && 
                { backgroundColor: theme.colors.primaryContainer }
              ]}
              onPress={() => {
                setActiveSection('skills');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeSection === 'skills' && 
                  { color: theme.colors.onPrimaryContainer }
                ]}
              >
                Skills
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeSection === 'languages' && 
                { backgroundColor: theme.colors.primaryContainer }
              ]}
              onPress={() => {
                setActiveSection('languages');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeSection === 'languages' && 
                  { color: theme.colors.onPrimaryContainer }
                ]}
              >
                Languages
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeSection === 'work' && 
                { backgroundColor: theme.colors.primaryContainer }
              ]}
              onPress={() => {
                setActiveSection('work');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeSection === 'work' && 
                  { color: theme.colors.onPrimaryContainer }
                ]}
              >
                Work History
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Section Content */}
        <Surface style={[styles.sectionContainer, shadows.small]}>
          {activeSection === 'skills' && renderSkills()}
          {activeSection === 'languages' && renderLanguages()}
          {activeSection === 'work' && renderWorkHistory()}
        </Surface>
        
        {/* Premium Banner */}
        {!currentUser.premium && (
          <Surface style={[styles.premiumBanner, shadows.medium]}>
            <LinearGradient
              colors={['#8A2BE2', '#4A00E0']}
              style={styles.premiumGradient}
            >
              <Text style={styles.premiumTitle}>Upgrade to DevTinder Pro</Text>
              <Text style={styles.premiumDescription}>
                Get unlimited swipes, see who liked you, and more!
              </Text>
              <Button 
                mode="contained" 
                buttonColor="white"
                textColor="#8A2BE2"
                style={styles.premiumButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              >
                Upgrade Now
              </Button>
            </LinearGradient>
          </Surface>
        )}
      </ScrollView>
      
      {renderEditModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    margin: spacing.m,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: spacing.l,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.m,
    justifyContent: 'center',
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
  },
  role: {
    color: 'white',
    opacity: 0.9,
    marginVertical: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    margin: 0,
    padding: 0,
  },
  location: {
    color: 'white',
    opacity: 0.8,
    fontSize: 14,
  },
  editButton: {
    marginLeft: spacing.s,
  },
  bioContainer: {
    marginTop: spacing.l,
  },
  bioText: {
    color: 'white',
    opacity: 0.9,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.l,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.l,
    padding: spacing.m,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: 'white',
    opacity: 0.8,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabsContainer: {
    marginHorizontal: spacing.m,
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  tab: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.l,
    marginRight: spacing.s,
  },
  tabText: {
    fontWeight: '500',
  },
  sectionContainer: {
    margin: spacing.m,
    padding: spacing.m,
    borderRadius: borderRadius.l,
  },
  sectionContent: {
    paddingVertical: spacing.s,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    margin: spacing.xs,
  },
  addButton: {
    marginTop: spacing.m,
    alignSelf: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  languageName: {
    width: 90,
    fontWeight: '500',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginHorizontal: spacing.s,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    width: 40,
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.7,
  },
  workItem: {
    marginBottom: spacing.m,
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workPosition: {
    fontWeight: '500',
    fontSize: 16,
  },
  workPeriod: {
    fontSize: 12,
    opacity: 0.7,
  },
  workCompany: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  divider: {
    marginVertical: spacing.m,
  },
  premiumBanner: {
    margin: spacing.m,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  premiumGradient: {
    padding: spacing.l,
    alignItems: 'center',
  },
  premiumTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: spacing.s,
  },
  premiumDescription: {
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  premiumButton: {
    borderRadius: borderRadius.m,
  },
  modalContainer: {
    margin: spacing.l,
    padding: spacing.l,
    borderRadius: borderRadius.l,
  },
  modalTitle: {
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.m,
  },
  bioInput: {
    marginBottom: spacing.m,
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.m,
  },
  cancelButton: {
    marginRight: spacing.m,
  },
  saveButton: {},
}); 