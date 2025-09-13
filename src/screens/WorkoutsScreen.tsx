import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import WorkoutService, { Workout } from '../services/workoutService';
import AuthService from '../services/authService';

interface Props {
  onStartWorkout: (workout: Workout) => void;
}

const WorkoutsScreen: React.FC<Props> = ({ onStartWorkout }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', title: 'All', icon: 'apps' },
    { id: 'beginner', title: 'Beginner', icon: 'trending-up' },
    { id: 'intermediate', title: 'Intermediate', icon: 'fitness-center' },
    { id: 'advanced', title: 'Advanced', icon: 'whatshot' },
  ];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, selectedFilter, searchQuery]);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const allWorkouts = await WorkoutService.getWorkouts();
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    // Filter by difficulty
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(workout => workout.difficulty === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWorkouts(filtered);
  };

  const handleStartWorkout = (workout: Workout) => {
    Alert.alert(
      'Start Workout',
      `Ready to start "${workout.name}"?\n\nDuration: ${workout.duration} minutes\nDifficulty: ${workout.difficulty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => onStartWorkout(workout) }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#666';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'trending-up';
      case 'intermediate': return 'fitness-center';
      case 'advanced': return 'whatshot';
      default: return 'fitness-center';
    }
  };

  const renderWorkoutCard = (workout: Workout) => (
    <TouchableOpacity
      key={workout.id}
      style={styles.workoutCard}
      onPress={() => handleStartWorkout(workout)}
    >
      <View style={styles.workoutHeader}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription}>{workout.description}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(workout.difficulty) }]}>
          <MaterialIcons 
            name={getDifficultyIcon(workout.difficulty)} 
            size={16} 
            color="#ffffff" 
          />
        </View>
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <MaterialIcons name="schedule" size={16} color="#666" />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="fitness-center" size={16} color="#666" />
          <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="local-fire-department" size={16} color="#666" />
          <Text style={styles.statText}>{workout.calories} cal</Text>
        </View>
      </View>

      <View style={styles.workoutMuscles}>
        <Text style={styles.musclesLabel}>Target Muscles:</Text>
        <View style={styles.muscleTags}>
          {workout.muscleGroups.slice(0, 3).map((muscle, index) => (
            <View key={index} style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>{muscle}</Text>
            </View>
          ))}
          {workout.muscleGroups.length > 3 && (
            <Text style={styles.moreMusclesText}>
              +{workout.muscleGroups.length - 3} more
            </Text>
          )}
        </View>
      </View>

      <View style={styles.workoutFooter}>
        <TouchableOpacity style={styles.startButton}>
          <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="fitness-center" size={60} color="#4CAF50" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Workout Library</Text>
        <Text style={styles.headerSubtitle}>
          Choose your perfect workout
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <MaterialIcons 
                  name={filter.icon as any} 
                  size={20} 
                  color={selectedFilter === filter.id ? '#ffffff' : '#4CAF50'} 
                />
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.id && styles.filterButtonTextActive
                ]}>
                  {filter.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Workouts List */}
        <View style={styles.workoutsContainer}>
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map(renderWorkoutCard)
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="fitness-center" size={60} color="#ccc" />
              <Text style={styles.emptyTitle}>No workouts found</Text>
              <Text style={styles.emptyDescription}>
                Try adjusting your filters or search query
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  filtersContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  workoutsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  workoutMuscles: {
    marginBottom: 16,
  },
  musclesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  muscleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  muscleTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  muscleTagText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  moreMusclesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  workoutFooter: {
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default WorkoutsScreen;
