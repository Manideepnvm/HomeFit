import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, WorkoutSession } from '../../types';
import { WorkoutService } from '../../services/workoutService';

type ProgressScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Progress'>;

interface Props {
  navigation: ProgressScreenNavigationProp;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  averageWorkoutDuration: number;
}

const ProgressScreen: React.FC<Props> = ({ navigation }) => {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      // TODO: Get current user ID from auth context
      const userId = 'current-user-id';
      
      const [workoutStats, workoutHistory] = await Promise.all([
        WorkoutService.getWorkoutStats(userId),
        WorkoutService.getUserWorkoutHistory(userId),
      ]);
      
      setStats(workoutStats);
      setRecentSessions(workoutHistory.slice(0, 10)); // Show last 10 sessions
      
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgressData();
    setRefreshing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Mock data for chart
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 25, 30, 15, 35, 40, 25],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Icon name="calendar-today" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Weekly Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week's Activity</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="local-fire-department" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{stats?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="fitness-center" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats?.totalWorkouts || 0}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="schedule" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>
              {stats ? Math.round(stats.totalDuration) : 0}
            </Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="trending-up" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>
              {stats ? Math.round(stats.averageWorkoutDuration) : 0}
            </Text>
            <Text style={styles.statLabel}>Avg Duration</Text>
          </View>
        </View>
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading progress...</Text>
          </View>
        ) : recentSessions.length > 0 ? (
          recentSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.workoutItem}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>
                  Workout #{session.id.slice(-4)}
                </Text>
                <Text style={styles.workoutDate}>
                  {formatDate(session.startedAt)}
                </Text>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStat}>
                  <Icon name="schedule" size={16} color="#666" />
                  <Text style={styles.workoutStatText}>
                    {formatDuration(session.totalDuration)}
                  </Text>
                </View>
                {session.caloriesBurned && (
                  <View style={styles.workoutStat}>
                    <Icon name="local-fire-department" size={16} color="#FF6B6B" />
                    <Text style={styles.workoutStatText}>
                      {session.caloriesBurned} cal
                    </Text>
                  </View>
                )}
              </View>
              <Icon name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="fitness-center" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptySubtitle}>
              Start your first workout to see your progress here
            </Text>
          </View>
        )}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementCard}>
            <Icon name="emoji-events" size={30} color="#FFD700" />
            <Text style={styles.achievementTitle}>First Workout</Text>
            <Text style={styles.achievementDescription}>Complete your first workout</Text>
          </View>
          <View style={styles.achievementCard}>
            <Icon name="local-fire-department" size={30} color="#FF6B6B" />
            <Text style={styles.achievementTitle}>7-Day Streak</Text>
            <Text style={styles.achievementDescription}>Work out for 7 days in a row</Text>
          </View>
          <View style={styles.achievementCard}>
            <Icon name="fitness-center" size={30} color="#4CAF50" />
            <Text style={styles.achievementTitle}>10 Workouts</Text>
            <Text style={styles.achievementDescription}>Complete 10 workouts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = require('react-native').Dimensions.get('window');

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
  calendarButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  chart: {
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
  },
  workoutStats: {
    flexDirection: 'row',
    marginRight: 10,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  workoutStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ProgressScreen;
