import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardStack from '../components/CardStack';
import { LinearGradient } from 'expo-linear-gradient';

// Sample data for developers
const developers = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 28,
    bio: 'Full-stack developer with 5 years of experience. Love React and Node.js.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    location: 'San Francisco, CA',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    githubProfile: 'https://github.com/alexjohnson',
  },
  {
    id: '2',
    name: 'Sophia Chen',
    age: 26,
    bio: 'Frontend developer passionate about creating beautiful UI/UX.',
    skills: ['React', 'CSS', 'Figma', 'TypeScript'],
    location: 'New York, NY',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    githubProfile: 'https://github.com/sophiachen',
  },
  {
    id: '3',
    name: 'Marcus Williams',
    age: 30,
    bio: 'Backend developer specializing in scalable systems.',
    skills: ['Python', 'Django', 'AWS', 'Docker'],
    location: 'Seattle, WA',
    imageUrl: 'https://randomuser.me/api/portraits/men/68.jpg',
    githubProfile: 'https://github.com/marcuswilliams',
  },
  {
    id: '4',
    name: 'Emma Taylor',
    age: 27,
    bio: 'Mobile app developer with expertise in React Native.',
    skills: ['React Native', 'JavaScript', 'Firebase', 'iOS/Android'],
    location: 'Austin, TX',
    imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    githubProfile: 'https://github.com/emmataylor',
  },
  {
    id: '5',
    name: 'David Kim',
    age: 29,
    bio: 'DevOps engineer focused on automating deployment processes.',
    skills: ['Kubernetes', 'Jenkins', 'Terraform', 'AWS'],
    location: 'Chicago, IL',
    imageUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
    githubProfile: 'https://github.com/davidkim',
  },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[]>([]);

  const handleLike = (id: string) => {
    setLiked([...liked, id]);
    // Simulate a match with 50% probability
    if (Math.random() > 0.5) {
      setMatches([...matches, id]);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const handleDislike = () => {
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF7853', '#FF5977']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>DevTinder</Text>
      </LinearGradient>

      <View style={styles.cardContainer}>
        {currentIndex < developers.length ? (
          <CardStack
            data={developers}
            currentIndex={currentIndex}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No more developers to show!</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setCurrentIndex(0)}
            >
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {currentIndex < developers.length && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.dislikeButton]}
            onPress={handleDislike}
          >
            <Ionicons name="close" size={30} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.likeButton]}
            onPress={() => handleLike(developers[currentIndex].id)}
          >
            <Ionicons name="heart" size={30} color="green" />
          </TouchableOpacity>
        </View>
      )}

      {matches.length > 0 && (
        <View style={styles.matchesContainer}>
          <Text style={styles.matchesText}>
            {matches.length} Match{matches.length !== 1 ? 'es' : ''}!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  likeButton: {
    backgroundColor: 'white',
  },
  dislikeButton: {
    backgroundColor: 'white',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  resetButton: {
    backgroundColor: '#FF5977',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  matchesContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#FF5977',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  matchesText: {
    color: 'white',
    fontWeight: 'bold',
  },
});