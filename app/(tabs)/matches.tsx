import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { 
  Text, 
  Searchbar, 
  Divider, 
  useTheme, 
  Avatar, 
  Chip,
  IconButton,
  Surface, 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shadows, borderRadius, spacing } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

// Mock data for matches
const mockMatches = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastMessage: 'I have experience with Next.js as well. Would love to collaborate!',
    timestamp: '10:30 AM',
    unread: 2,
    online: true,
    matchDate: '2 days ago',
    compatibilityScore: 92,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    role: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastMessage: 'Have you used Terraform with AWS?',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    matchDate: '5 days ago',
    compatibilityScore: 85,
  },
  {
    id: '3',
    name: 'Emily Zhang',
    role: 'Mobile Developer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    lastMessage: 'React Native is awesome for cross-platform development!',
    timestamp: '2 days ago',
    unread: 0,
    online: true,
    matchDate: '1 week ago',
    compatibilityScore: 90,
  },
  {
    id: '4',
    name: 'Michael Johnson',
    role: 'UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    lastMessage: 'Let me show you some of my design prototypes.',
    timestamp: '1 week ago',
    unread: 0,
    online: false,
    matchDate: '2 weeks ago',
    compatibilityScore: 78,
  },
  {
    id: '5',
    name: 'Jessica Wilson',
    role: 'Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    lastMessage: "I'd love to collaborate on that ML project you mentioned!",
    timestamp: '3 days ago',
    unread: 1,
    online: true,
    matchDate: '3 days ago',
    compatibilityScore: 88,
  },
];

// New match suggestions
const newMatches = [
  {
    id: '6',
    name: 'James Taylor',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    compatibilityScore: 95,
    skills: ['Node.js', 'MongoDB', 'Go'],
  },
  {
    id: '7',
    name: 'Anna Schmidt',
    role: 'Cloud Architect',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    compatibilityScore: 89,
    skills: ['AWS', 'Kubernetes', 'Terraform'],
  },
  {
    id: '8',
    name: 'David Kim',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    compatibilityScore: 93,
    skills: ['React', 'Vue.js', 'CSS'],
  },
];

export default function MatchesScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  
  const filteredMatches = searchQuery 
    ? mockMatches.filter(match => 
        match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockMatches;
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const renderMatchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => {
        console.log('Navigate to chat with', item.name);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <View style={styles.avatarContainer}>
        <Avatar.Image 
          source={{ uri: item.avatar }} 
          size={60} 
        />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text variant="titleMedium" style={styles.matchName}>{item.name}</Text>
          <Text variant="labelSmall" style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <Text variant="labelSmall" style={styles.role}>{item.role}</Text>
        
        <Text 
          variant="bodySmall" 
          style={[
            styles.lastMessage, 
            item.unread > 0 && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  const renderNewMatchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newMatchCard}
      onPress={() => {
        console.log('View profile of', item.name);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <Image 
        source={{ uri: item.avatar }} 
        style={styles.newMatchImage}
      />
      
      <View style={styles.newMatchInfo}>
        <View style={styles.newMatchHeader}>
          <Text variant="titleMedium" style={styles.newMatchName}>{item.name}</Text>
          <View style={styles.compatibilityBadge}>
            <Text style={styles.compatibilityText}>{item.compatibilityScore}%</Text>
          </View>
        </View>
        
        <Text variant="labelSmall" style={styles.newMatchRole}>{item.role}</Text>
        
        <View style={styles.skillsContainer}>
          {item.skills.map((skill, index) => (
            <Chip
              key={index}
              style={styles.skillChip}
              textStyle={styles.skillText}
              compact
            >
              {skill}
            </Chip>
          ))}
        </View>
        
        <View style={styles.actionButtons}>
          <IconButton
            icon="close"
            mode="contained"
            size={20}
            iconColor="white"
            containerColor={theme.colors.error}
            style={styles.actionButton}
            onPress={() => console.log('Pass on', item.name)}
          />
          <IconButton
            icon="message-outline"
            mode="contained"
            size={20}
            iconColor="white"
            containerColor={theme.colors.secondary}
            style={styles.actionButton}
            onPress={() => console.log('Message', item.name)}
          />
          <IconButton
            icon="heart"
            mode="contained"
            size={20}
            iconColor="white"
            containerColor={theme.colors.primary}
            style={styles.actionButton}
            onPress={() => console.log('Like', item.name)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>No matches yet</Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Keep swiping to find your perfect coding partner!
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Matches
        </Text>
      </View>
      
      {/* Search bar */}
      <Searchbar
        placeholder="Search matches"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'messages' && styles.activeTab,
            { borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => handleTabChange('messages')}
        >
          <Text 
            style={[
              styles.tabLabel, 
              activeTab === 'messages' && 
              { color: theme.colors.primary, fontWeight: 'bold' }
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'new' && styles.activeTab,
            { borderBottomColor: theme.colors.primary }
          ]}
          onPress={() => handleTabChange('new')}
        >
          <Text 
            style={[
              styles.tabLabel, 
              activeTab === 'new' && 
              { color: theme.colors.primary, fontWeight: 'bold' }
            ]}
          >
            New Matches
          </Text>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{newMatches.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'messages' ? (
        <FlatList
          data={filteredMatches}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      ) : (
        <FlatList
          data={newMatches}
          renderItem={renderNewMatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.newMatchesContainer}
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
  searchBar: {
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
    elevation: 0,
    borderRadius: borderRadius.l,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.m,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabLabel: {
    fontSize: 14,
  },
  newBadge: {
    backgroundColor: 'red',
    borderRadius: borderRadius.round,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  matchItem: {
    flexDirection: 'row',
    padding: spacing.m,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  matchInfo: {
    flex: 1,
    marginLeft: spacing.m,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchName: {
    fontWeight: '600',
  },
  timestamp: {
    opacity: 0.6,
  },
  role: {
    marginTop: 2,
    opacity: 0.8,
  },
  lastMessage: {
    marginTop: 4,
    opacity: 0.7,
  },
  unreadMessage: {
    fontWeight: 'bold',
    opacity: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
  },
  unreadCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    marginLeft: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  emptyText: {
    opacity: 0.7,
    textAlign: 'center',
  },
  newMatchesContainer: {
    padding: spacing.m,
  },
  newMatchCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    marginBottom: spacing.m,
    ...shadows.medium,
  },
  newMatchImage: {
    width: 120,
    height: 180,
  },
  newMatchInfo: {
    flex: 1,
    padding: spacing.m,
    justifyContent: 'space-between',
  },
  newMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newMatchName: {
    fontWeight: 'bold',
  },
  compatibilityBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: borderRadius.m,
  },
  compatibilityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  newMatchRole: {
    marginTop: 4,
    opacity: 0.8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.s,
  },
  skillChip: {
    marginRight: 4,
    marginBottom: 4,
    height: 24,
  },
  skillText: {
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.m,
  },
  actionButton: {
    margin: 0,
  },
});
