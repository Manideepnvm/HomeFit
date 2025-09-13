import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import WorkoutService from '../../services/workoutService';
import AuthService from '../../services/authService';

interface Props {
  navigation?: any; // Simplified for Expo demo
}

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  averageWorkoutDuration: number;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        const workoutStats = await WorkoutService.getWorkoutStats(currentUser.uid);
        setStats(workoutStats);
      } else {
        // Fallback data if no user
        setStats({
          totalWorkouts: 0,
          totalDuration: 0,
          currentStreak: 0,
          caloriesBurned: 0,
        });
      }
    } catch (error) {
      console.error('Error loading home data:', error);
      // Fallback data on error
      setStats({
        totalWorkouts: 0,
        totalDuration: 0,
        currentStreak: 0,
        caloriesBurned: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartWorkout = () => {
    // TODO: Navigate to workout player with today's workout
    // For now, show an alert since WorkoutPlayer is not in the tab navigator
    Alert.alert('Start Workout', 'Workout player will be available in the full version!');
  };

  const handleViewAllWorkouts = () => {
    // TODO: Navigate to workouts tab
    Alert.alert('Browse Workouts', 'Workout library will be available in the full version!');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>Ready to crush your goals?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="person" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Today's Workout Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <TouchableOpacity style={styles.workoutCard} onPress={handleStartWorkout}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.workoutCardGradient}
          >
            <View style={styles.workoutCardContent}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>Upper Body Strength</Text>
                <Text style={styles.workoutDuration}>25 minutes</Text>
                <Text style={styles.workoutDifficulty}>Beginner</Text>
              </View>
              <View style={styles.workoutIcon}>
                <MaterialIcons name="fitness-center" size={40} color="#ffffff" />
              </View>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <MaterialIcons name="play-arrow" size={24} color="#FF6B6B" />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="local-fire-department" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{stats?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="fitness-center" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats?.totalWorkouts || 0}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="schedule" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>
              {stats ? Math.round(stats.totalDuration) : 0}
            </Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={handleViewAllWorkouts}>
            <MaterialIcons name="list" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Browse Workouts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="trending-up" size={24} color="#FF9800" />
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <MaterialIcons name="person" size={24} color="#9C27B0" />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Motivational Quote */}
      <View style={styles.section}>
        <View style={styles.quoteCard}>
          <MaterialIcons name="format-quote" size={30} color="#4CAF50" />
          <Text style={styles.quoteText}>
            "The only bad workout is the one that didn't happen."
          </Text>
          <Text style={styles.quoteAuthor}>- Unknown</Text>
        </View>
      </View>
    </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  workoutCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  workoutCardGradient: {
    padding: 20,
  },
  workoutCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  workoutDuration: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 3,
  },
  workoutDifficulty: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  workoutIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 15,
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
