import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, Workout, FitnessLevel, FitnessGoal, Equipment } from '../../types';
import { WorkoutService } from '../../services/workoutService';

type WorkoutsScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Workouts'>;

interface Props {
  navigation: WorkoutsScreenNavigationProp;
}

const WorkoutsScreen: React.FC<Props> = ({ navigation }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'beginner', label: 'Beginner', icon: 'school' },
    { id: 'intermediate', label: 'Intermediate', icon: 'trending-up' },
    { id: 'advanced', label: 'Advanced', icon: 'star' },
    { id: 'lose_weight', label: 'Weight Loss', icon: 'trending-down' },
    { id: 'build_muscle', label: 'Muscle Building', icon: 'fitness-center' },
    { id: 'cardio', label: 'Cardio', icon: 'directions-run' },
  ];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, searchQuery, selectedFilter]);

  const loadWorkouts = async () => {
    try {
      const allWorkouts = await WorkoutService.getAllWorkouts();
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
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

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(workout => {
        switch (selectedFilter) {
          case 'beginner':
          case 'intermediate':
          case 'advanced':
            return workout.difficulty === selectedFilter;
          case 'lose_weight':
          case 'build_muscle':
            return workout.targetGoal.includes(selectedFilter as FitnessGoal);
          case 'cardio':
            return workout.tags.includes('cardio');
          default:
            return true;
        }
      });
    }

    setFilteredWorkouts(filtered);
  };

  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate('WorkoutPlayer', { workoutId: workout.id });
  };

  const renderWorkoutCard = (workout: Workout) => (
    <TouchableOpacity
      key={workout.id}
      style={styles.workoutCard}
      onPress={() => handleWorkoutPress(workout)}
    >
      <View style={styles.workoutImage}>
        <Icon name="fitness-center" size={40} color="#4CAF50" />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDescription} numberOfLines={2}>
          {workout.description}
        </Text>
        <View style={styles.workoutMeta}>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={16} color="#666" />
            <Text style={styles.metaText}>{workout.duration} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="trending-up" size={16} color="#666" />
            <Text style={styles.metaText}>{workout.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="fitness-center" size={16} color="#666" />
            <Text style={styles.metaText}>{workout.exercises.length} exercises</Text>
          </View>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Icon
              name={filter.icon}
              size={16}
              color={selectedFilter === filter.id ? '#ffffff' : '#4CAF50'}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.activeFilterChipText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Workouts List */}
      <ScrollView
        style={styles.workoutsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading workouts...</Text>
          </View>
        ) : filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(renderWorkoutCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="fitness-center" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No workouts found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  activeFilterChip: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 5,
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  workoutsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  workoutImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WorkoutsScreen;
