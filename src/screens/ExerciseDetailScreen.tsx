import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Exercise } from '../types';
import { WorkoutService } from '../services/workoutService';

type ExerciseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExerciseDetail'>;
type ExerciseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExerciseDetail'>;

interface Props {
  route: ExerciseDetailScreenRouteProp;
  navigation: ExerciseDetailScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const ExerciseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { exerciseId } = route.params;
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, []);

  const loadExercise = async () => {
    try {
      const exerciseData = await WorkoutService.getExerciseById(exerciseId);
      setExercise(exerciseData);
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading exercise...</Text>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={60} color="#F44336" />
        <Text style={styles.errorTitle}>Exercise Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The exercise you're looking for doesn't exist.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Exercise Image/Video */}
        <View style={styles.mediaContainer}>
          <View style={styles.placeholderImage}>
            <Icon name="fitness-center" size={80} color="#4CAF50" />
          </View>
        </View>

        {/* Exercise Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>

          {/* Exercise Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon name="schedule" size={20} color="#4CAF50" />
              <Text style={styles.detailText}>
                {exercise.duration ? `${exercise.duration}s` : 'N/A'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="repeat" size={20} color="#4CAF50" />
              <Text style={styles.detailText}>
                {exercise.reps ? `${exercise.reps} reps` : 'N/A'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="layers" size={20} color="#4CAF50" />
              <Text style={styles.detailText}>
                {exercise.sets ? `${exercise.sets} sets` : 'N/A'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.detailText}>
                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Muscle Groups */}
          <View style={styles.muscleGroupsContainer}>
            <Text style={styles.muscleGroupsTitle}>Target Muscles</Text>
            <View style={styles.muscleGroupsList}>
              {exercise.muscleGroups.map((muscle, index) => (
                <View key={index} style={styles.muscleGroupChip}>
                  <Text style={styles.muscleGroupText}>
                    {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.equipmentContainer}>
            <Text style={styles.equipmentTitle}>Equipment Needed</Text>
            <View style={styles.equipmentList}>
              {exercise.equipment.map((equipment, index) => (
                <View key={index} style={styles.equipmentChip}>
                  <Icon name="fitness-center" size={16} color="#4CAF50" />
                  <Text style={styles.equipmentText}>
                    {equipment.charAt(0).toUpperCase() + equipment.slice(1).replace('_', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mediaContainer: {
    height: 250,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  instructionsContainer: {
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  instructionNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  muscleGroupsContainer: {
    marginBottom: 30,
  },
  muscleGroupsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  muscleGroupsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleGroupChip: {
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  muscleGroupText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  equipmentContainer: {
    marginBottom: 30,
  },
  equipmentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  equipmentText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
});

export default ExerciseDetailScreen;
