import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Divider, useTheme, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for messages
const MATCHES = [
  {
    id: 'm1',
    name: 'Sophie Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 'm2',
    name: 'Alex Rodriguez',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
    isNew: true,
  },
  {
    id: 'm3',
    name: 'Taylor Liu',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    isNew: false,
  },
  {
    id: 'm4',
    name: 'Jamie Rivera',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
    isNew: false,
  },
  {
    id: 'm5',
    name: 'Morgan Chen',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    isNew: false,
  },
];

const CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Sophie Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
    lastMessage: 'I would love to collaborate on that React Native project!',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: 'c2',
    name: 'Alex Rodriguez',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
    lastMessage: 'Are you going to the hackathon next weekend?',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: 'c3',
    name: 'Morgan Chen',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    lastMessage: 'I just pushed the changes to GitHub. Can you review?',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: 'c4',
    name: 'Jamie Rivera',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
    lastMessage: 'Thanks for helping with the API integration!',
    time: 'Tuesday',
    unread: 0,
  },
];

export default function MessagesScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity style={styles.matchItem}>
      <View style={styles.matchImageContainer}>
        <Image source={{ uri: item.image }} style={styles.matchImage} />
        {item.isNew && <View style={styles.newMatchBadge} />}
      </View>
      <Text style={styles.matchName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.conversationImage} />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.conversationMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Messages</Text>
        <IconButton
          icon="filter-outline"
          size={24}
          iconColor="#333"
          onPress={() => {}}
        />
      </View>

      <Searchbar
        placeholder="Search messages..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#666"
        inputStyle={styles.searchInput}
      />

      <View style={styles.matchesContainer}>
        <Text style={styles.sectionTitle}>New Matches</Text>
        <FlatList
          data={MATCHES}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.matchesList}
        />
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Messages</Text>
      <FlatList
        data={CONVERSATIONS}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
        ItemSeparatorComponent={() => <Divider style={styles.conversationDivider} />}
      />
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
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 30,
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  matchesContainer: {
    marginBottom: 16,
  },
  matchesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  matchItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  matchImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  matchImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  newMatchBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  matchName: {
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 16,
  },
  conversationsList: {
    paddingHorizontal: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  conversationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationTime: {
    fontSize: 14,
    color: '#666',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF4B7F',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  conversationDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
}); 