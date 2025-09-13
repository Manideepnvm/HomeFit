import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, FitnessLevel } from '../../types';

type FitnessLevelScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'FitnessLevel'>;

interface Props {
  navigation: FitnessLevelScreenNavigationProp;
}

const FitnessLevelScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | null>(null);

  const levels = [
    {
      id: 'beginner' as FitnessLevel,
      title: 'Beginner',
      description: 'New to working out or getting back into fitness',
      details: [
        'Little to no exercise experience',
        'Starting your fitness journey',
        'Need guidance and motivation',
        'Focus on building habits'
      ],
      icon: 'school',
      color: '#4CAF50',
    },
    {
      id: 'intermediate' as FitnessLevel,
      title: 'Intermediate',
      description: 'Work out occasionally and know the basics',
      details: [
        'Some exercise experience',
        'Can perform basic movements',
        'Ready for moderate challenges',
        'Looking to progress further'
      ],
      icon: 'trending-up',
      color: '#FF9800',
    },
    {
      id: 'advanced' as FitnessLevel,
      title: 'Advanced',
      description: 'Work out regularly and know the ropes',
      details: [
        'Regular exercise routine',
        'Experienced with various exercises',
        'Can handle intense workouts',
        'Seeking advanced challenges'
      ],
      icon: 'star',
      color: '#F44336',
    },
  ];

  const handleContinue = () => {
    if (selectedLevel) {
      // TODO: Store selected level in context or async storage
      navigation.navigate('Equipment');
    }
  };

  return (
    <LinearGradient
      colors={['#4CAF50', '#45a049']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 6</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your fitness level?</Text>
        <Text style={styles.subtitle}>
          Be honest about your current fitness level to get the best recommendations
        </Text>

        <ScrollView style={styles.levelsContainer} showsVerticalScrollIndicator={false}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selectedLevel === level.id && styles.selectedLevelCard,
              ]}
              onPress={() => setSelectedLevel(level.id)}
            >
              <View style={styles.levelHeader}>
                <View style={[styles.iconContainer, { backgroundColor: level.color }]}>
                  <Icon name={level.icon} size={24} color="#ffffff" />
                </View>
                <View style={styles.levelContent}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </View>
                {selectedLevel === level.id && (
                  <Icon name="check-circle" size={24} color="#4CAF50" />
                )}
              </View>
              
              <View style={styles.detailsContainer}>
                {level.details.map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    <Icon name="check" size={16} color="#4CAF50" />
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLevel && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedLevel}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  levelsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  levelCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLevelCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    marginLeft: 65,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default FitnessLevelScreen;
