import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Text, List, Divider, Button, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  // State for toggle settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          iconColor="#333"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> {/* Spacer for alignment */}
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <List.Section style={styles.settingsSection}>
          <List.Item
            title="Notifications"
            description="Receive push notifications"
            left={props => <List.Icon {...props} icon="bell-outline" color="#666" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D1D1', true: '#FF4B7F' }}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={props => <List.Icon {...props} icon="moon-outline" color="#666" />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#D1D1D1', true: '#FF4B7F' }}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Location Services"
            description="Enable location-based matching"
            left={props => <List.Icon {...props} icon="location-outline" color="#666" />}
            right={() => (
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#D1D1D1', true: '#FF4B7F' }}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Email Notifications"
            description="Receive email updates"
            left={props => <List.Icon {...props} icon="mail-outline" color="#666" />}
            right={() => (
              <Switch
                value={emailNotificationsEnabled}
                onValueChange={setEmailNotificationsEnabled}
                trackColor={{ false: '#D1D1D1', true: '#FF4B7F' }}
              />
            )}
          />
        </List.Section>
        
        <Text style={styles.sectionTitle}>Account</Text>
        
        <List.Section style={styles.settingsSection}>
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock-closed-outline" color="#666" />}
            right={props => <List.Icon {...props} icon="chevron-right" color="#666" />}
            onPress={() => {/* Handle navigation to change password */}}
          />
          <Divider />
          
          <List.Item
            title="Privacy Settings"
            left={props => <List.Icon {...props} icon="eye-outline" color="#666" />}
            right={props => <List.Icon {...props} icon="chevron-right" color="#666" />}
            onPress={() => {/* Handle navigation to privacy settings */}}
          />
          <Divider />
          
          <List.Item
            title="Blocked Users"
            left={props => <List.Icon {...props} icon="close-circle-outline" color="#666" />}
            right={props => <List.Icon {...props} icon="chevron-right" color="#666" />}
            onPress={() => {/* Handle navigation to blocked users */}}
          />
        </List.Section>
        
        <Text style={styles.sectionTitle}>Support</Text>
        
        <List.Section style={styles.settingsSection}>
          <List.Item
            title="Help Center"
            left={props => <List.Icon {...props} icon="help-circle-outline" color="#666" />}
            right={props => <List.Icon {...props} icon="chevron-right" color="#666" />}
            onPress={() => {/* Handle navigation to help center */}}
          />
          <Divider />
          
          <List.Item
            title="Report a Problem"
            left={props => <List.Icon {...props} icon="alert-circle-outline" color="#666" />}
            right={props => <List.Icon {...props} icon="chevron-right" color="#666" />}
            onPress={() => {/* Handle navigation to report problem */}}
          />
          <Divider />
          
          <List.Item
            title="About"
            description="Version 1.0.0"
            left={props => <List.Icon {...props} icon="information-circle-outline" color="#666" />}
          />
        </List.Section>
        
        <Button
          mode="outlined"
          icon="trash-outline"
          onPress={() => {/* Handle delete account */}}
          style={styles.dangerButton}
          textColor="#FF3B30"
        >
          Delete Account
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 60,
  },
  backButton: {
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  settingsSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 16,
  },
  dangerButton: {
    borderColor: '#FF3B30',
    borderRadius: 30,
    marginTop: 24,
  },
});
