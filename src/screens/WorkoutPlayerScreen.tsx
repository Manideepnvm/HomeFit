import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Workout, Exercise } from '../services/workoutService';

const { width, height } = Dimensions.get('window');

interface Props {
  workout: Workout;
  onComplete: () => void;
  onExit: () => void;
  onLogout: () => void;
}

const WorkoutPlayerScreen: React.FC<Props> = ({ workout, onComplete, onExit, onLogout }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRest, setIsRest] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const progressPercentage = (currentExerciseIndex / totalExercises) * 100;

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const startExercise = () => {
    setIsPlaying(true);
    setTimeRemaining(currentExercise.duration);
    setIsRest(false);
  };

  const pauseExercise = () => {
    setIsPlaying(false);
  };

  const skipExercise = () => {
    Alert.alert(
      'Skip Exercise',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: handleExerciseComplete }
      ]
    );
  };

  const handleExerciseComplete = () => {
    setIsPlaying(false);
    setCompletedExercises(prev => [...prev, currentExerciseIndex]);
    
    // Animate completion
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (currentExerciseIndex < totalExercises - 1) {
      // Move to next exercise
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
        setTimeRemaining(0);
      }, 1000);
    } else {
      // Workout complete
      handleWorkoutComplete();
    }
  };

  const handleWorkoutComplete = () => {
    Alert.alert(
      'Workout Complete! 🎉',
      `Great job! You completed ${workout.name} in ${Math.round(workout.duration)} minutes.`,
      [
        {
          text: 'Finish',
          onPress: onComplete,
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      return workout.exercises[currentExerciseIndex + 1];
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onExit} style={styles.exitButton}>
            <MaterialIcons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentExerciseIndex + 1} of {totalExercises} exercises
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Current Exercise */}
        <Animated.View style={[styles.exerciseContainer, { opacity: fadeAnim }]}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseDescription}>
              {currentExercise.description}
            </Text>
          </View>

          {/* Exercise Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>
                {timeRemaining > 0 ? formatTime(timeRemaining) : 'Ready'}
              </Text>
              <Text style={styles.timerLabel}>
                {timeRemaining > 0 ? 'seconds' : 'Start when ready'}
              </Text>
            </View>
          </View>

          {/* Exercise Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {currentExercise.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>

          {/* Muscle Groups */}
          <View style={styles.muscleGroupsContainer}>
            <Text style={styles.muscleGroupsTitle}>Target Muscles:</Text>
            <View style={styles.muscleGroupsList}>
              {currentExercise.muscleGroups.map((muscle, index) => (
                <View key={index} style={styles.muscleGroupTag}>
                  <Text style={styles.muscleGroupText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Next Exercise Preview */}
        {getNextExercise() && (
          <View style={styles.nextExerciseContainer}>
            <Text style={styles.nextExerciseTitle}>Up Next:</Text>
            <View style={styles.nextExerciseCard}>
              <Text style={styles.nextExerciseName}>
                {getNextExercise()?.name}
              </Text>
              <Text style={styles.nextExerciseDuration}>
                {getNextExercise()?.duration} seconds
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={skipExercise}
        >
          <MaterialIcons name="skip-next" size={24} color="#666" />
          <Text style={styles.controlButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.primaryControlButton]} 
          onPress={isPlaying ? pauseExercise : startExercise}
        >
          <MaterialIcons 
            name={isPlaying ? "pause" : "play-arrow"} 
            size={32} 
            color="#ffffff" 
          />
          <Text style={[styles.controlButtonText, styles.primaryControlButtonText]}>
            {isPlaying ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleExerciseComplete}
        >
          <MaterialIcons name="check" size={24} color="#4CAF50" />
          <Text style={styles.controlButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exitButton: {
    padding: 8,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  exerciseHeader: {
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timerLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8,
  },
  muscleGroupsContainer: {
    marginBottom: 20,
  },
  muscleGroupsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  muscleGroupsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleGroupTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  muscleGroupText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  nextExerciseContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  nextExerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nextExerciseCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  nextExerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  nextExerciseDuration: {
    fontSize: 14,
    color: '#666',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
  },
  primaryControlButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  controlButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  primaryControlButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default WorkoutPlayerScreen;