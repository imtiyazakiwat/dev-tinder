import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { 
  Text, 
  IconButton, 
  Surface,
  Button,
  Chip,
  useTheme,
  Avatar
} from 'react-native-paper';
import { mockDevelopers, Developer } from '../../constants/mockData';
import { Ionicons } from '@expo/vector-icons';
import CardStack from '../../components/CardStack';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const [developers] = useState(mockDevelopers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [likeLog, setLikeLog] = useState<{ id: string, name: string, action: 'like' | 'dislike' | 'superlike' }[]>([]);

  const filters = ['All', 'Frontend', 'Backend', 'Mobile', 'DevOps'];

  const handleSwipeLeft = (developer: Developer) => {
    console.log('Disliked developer:', developer.name);
  };

  const handleSwipeRight = (developer: Developer) => {
    console.log('Liked developer:', developer.name);
  };

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
        <Text variant="headlineMedium">No more developers!</Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          We're finding more talented developers in your area
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            setCurrentIndex(0);
          }}
          style={styles.resetButton}
          buttonColor={theme.colors.primary}
        >
          Start Over
        </Button>
      </View>
    );
  };

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

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <CardStack 
          developers={developers}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
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
    backgroundColor: '#fff',
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  cardsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    opacity: 0.7,
  },
  resetButton: {
    paddingHorizontal: 30,
    borderRadius: 30,
  }
});
