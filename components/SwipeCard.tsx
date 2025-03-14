import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface Developer {
  id: string;
  name: string;
  age: number;
  bio: string;
  skills: string[];
  location: string;
  imageUrl: string;
  githubProfile: string;
}

interface SwipeCardProps {
  developer: Developer;
  flipped: boolean;
  onFlip: () => void;
}

const { width } = Dimensions.get('window');

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  developer, 
  flipped, 
  onFlip 
}) => {
  const handleOpenGithub = () => {
    Linking.openURL(developer.githubProfile);
  };

  const renderCardFront = () => (
    <View style={styles.cardFront}>
      <Image 
        source={{ uri: developer.imageUrl }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      <BlurView intensity={80} style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.name}>{developer.name}</Text>
          <Text style={styles.age}>{developer.age}</Text>
        </View>
        
        <Text style={styles.location}>
          <Ionicons name="location" size={16} color="#FF5977" /> {developer.location}
        </Text>
        
        <Text numberOfLines={3} style={styles.bio}>{developer.bio}</Text>
        
        <View style={styles.skillsContainer}>
          {developer.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.flipButton} onPress={onFlip}>
          <Ionicons name="information-circle-outline" size={24} color="#FF5977" />
          <Text style={styles.flipButtonText}>More Info</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  const renderCardBack = () => (
    <View style={styles.cardBack}>
      <View style={styles.backHeader}>
        <TouchableOpacity onPress={onFlip} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.backTitle}>Developer Profile</Text>
      </View>
      
      <View style={styles.profileImageContainer}>
        <Image 
          source={{ uri: developer.imageUrl }} 
          style={styles.profileImage} 
        />
        <Text style={styles.backName}>{developer.name}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={20} color="#FF5977" />
          <Text style={styles.detailText}>{developer.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="code-slash" size={20} color="#FF5977" />
          <Text style={styles.detailText}>{developer.skills.join(', ')}</Text>
        </View>
        
        <View style={styles.bioContainer}>
          <Text style={styles.bioLabel}>About</Text>
          <Text style={styles.bioText}>{developer.bio}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.githubButton} 
          onPress={handleOpenGithub}
        >
          <Ionicons name="logo-github" size={20} color="#fff" />
          <Text style={styles.githubButtonText}>View GitHub Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {flipped ? renderCardBack() : renderCardFront()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardFront: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardBack: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  age: {
    fontSize: 22,
    color: '#fff',
  },
  location: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#fff',
    fontSize: 14,
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  flipButtonText: {
    color: '#FF5977',
    marginLeft: 5,
    fontSize: 16,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    marginRight: 15,
  },
  backTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  backName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    flex: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  bioContainer: {
    marginVertical: 15,
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  githubButton: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 'auto',
  },
  githubButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SwipeCard;