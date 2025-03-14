import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Text, 
  Switch, 
  Divider, 
  List,
  Button,
  useTheme,
  Avatar,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, shadows, borderRadius } from '../../constants/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  
  // Settings state
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Account */}
        <Surface style={[styles.section, shadows.small]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Account</Text>
          <List.Item
            title="Edit Profile"
            description="Change your name, bio, and profile picture"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Edit Profile')}
          />
          <Divider />
          <List.Item
            title="Developer Skills"
            description="Manage your tech stack and experience"
            left={props => <List.Icon {...props} icon="code-tags" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Developer Skills')}
          />
          <Divider />
          <List.Item
            title="GitHub Integration"
            description="Connect your GitHub account"
            left={props => <List.Icon {...props} icon="github" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('GitHub Integration')}
          />
        </Surface>
        
        {/* Appearance */}
        <Surface style={[styles.section, shadows.small]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Appearance</Text>
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Developer Mode"
            description="Enable advanced features and code snippets"
            left={props => <List.Icon {...props} icon="developer-board" />}
            right={() => (
              <Switch
                value={developerMode}
                onValueChange={setDeveloperMode}
                color={theme.colors.primary}
              />
            )}
          />
        </Surface>
        
        {/* Notifications */}
        <Surface style={[styles.section, shadows.small]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Notifications</Text>
          <List.Item
            title="Push Notifications"
            description="Get notified about matches and messages"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Email Notifications"
            description="Receive updates via email"
            left={props => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                color={theme.colors.primary}
              />
            )}
          />
        </Surface>
        
        {/* Privacy */}
        <Surface style={[styles.section, shadows.small]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Privacy</Text>
          <List.Item
            title="Location Services"
            description="Allow devTinder to access your location"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Blocked Users"
            description="Manage your blocked list"
            left={props => <List.Icon {...props} icon="account-cancel" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Blocked Users')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Privacy Policy')}
          />
        </Surface>
        
        {/* Subscription */}
        <Surface style={[styles.section, shadows.small]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.premiumContainer}>
            <Text variant="titleLarge" style={styles.premiumTitle}>devTinder Pro</Text>
            <Text style={styles.premiumDescription}>
              Unlimited swipes, see who liked you, advanced filters, and more!
            </Text>
            <Button 
              mode="contained" 
              style={styles.upgradeButton}
              onPress={() => console.log('Upgrade to Pro')}
            >
              Upgrade Now
            </Button>
          </View>
        </Surface>
        
        {/* About */}
        <Surface style={[styles.section, shadows.small]}>
          <Text variant="titleMedium" style={styles.sectionTitle}>About</Text>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Help Center"
            description="Get help with devTinder"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Help Center')}
          />
          <Divider />
          <List.Item
            title="Rate the App"
            description="Tell us what you think"
            left={props => <List.Icon {...props} icon="star" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Rate the App')}
          />
        </Surface>
        
        {/* Sign Out */}
        <Button 
          mode="outlined" 
          icon="logout" 
          style={styles.signOutButton}
          onPress={() => console.log('Sign Out')}
        >
          Sign Out
        </Button>
        
        {/* Delete Account */}
        <Button 
          mode="text" 
          textColor={theme.colors.error}
          style={styles.deleteButton}
          onPress={() => console.log('Delete Account')}
        >
          Delete Account
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: spacing.m,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginHorizontal: spacing.m,
    marginVertical: spacing.s,
  },
  premiumContainer: {
    padding: spacing.m,
    alignItems: 'center',
  },
  premiumTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  premiumDescription: {
    textAlign: 'center',
    marginBottom: spacing.m,
    opacity: 0.7,
  },
  upgradeButton: {
    width: '100%',
  },
  signOutButton: {
    margin: spacing.m,
  },
  deleteButton: {
    marginBottom: spacing.xl,
  },
}); 