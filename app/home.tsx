import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, StatusBar, ScrollView } from 'react-native';
import { Text, IconButton, useTheme, Button, Avatar, Surface, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Developer, mockDevelopers } from '../constants/mockData';
import CardStack from '../components/CardStack';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const [developers] = useState<Developer[]>(mockDevelopers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [likeLog, setLikeLog] = useState<{ id: string, name: string, action: 'like' | 'dislike' | 'superlike' }[]>([]);

  const handleLikeLogged = (developer: Developer, action: 'like' | 'dislike' | 'superlike') => {
    const newLog = { 
      id: developer.id, 
      name: developer.name, 
      action
    };
    
    setLikeLog(prev => [newLog, ...prev]);
    console.log(`${action} logged for ${developer.name}`);
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="heart-dislike" size={60} color="#FF4B7F" />
        <Text style={styles.emptyStateTitle}>No more developers</Text>
        <Text style={styles.emptyStateSubtitle}>Come back later for more matches</Text>
        <Button 
          mode="contained" 
          onPress={() => setCurrentIndex(0)}
          style={styles.resetButton}
          buttonColor="#FF4B7F"
        >
          Start Over
        </Button>
      </View>
    );
  };

  const filters = ['All', 'Frontend', 'Backend', 'Mobile', 'DevOps'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Image 
          size={40} 
          source={{ uri: 'https://i.pravatar.cc/300' }} 
        />
        <Text variant="headlineMedium" style={styles.title}>devTinder</Text>
        <IconButton 
          icon="tune" 
          size={24} 
          onPress={() => {}} 
          iconColor={theme.colors.primary}
        />
      </View>
      
      {/* Filters */}
      <Surface style={styles.filtersContainer} elevation={0}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <Chip
              key={filter}
              selected={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
              style={styles.filterChip}
              mode="outlined"
              selectedColor={theme.colors.primary}
            >
              {filter}
            </Chip>
          ))}
        </ScrollView>
      </Surface>

      {/* Main Content */}
      <View style={styles.content}>
        <CardStack 
          developers={developers}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onLikeLogged={handleLikeLogged}
          emptyStateComponent={renderEmptyState()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#FF4B7F',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.5,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 30,
    borderRadius: 30,
  }
}); 