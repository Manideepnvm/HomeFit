import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../types';
import AuthService from '../../services/authService';

type PersonalizedPlanScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'PersonalizedPlan'>;

interface Props {
  navigation: PersonalizedPlanScreenNavigationProp;
}

const PersonalizedPlanScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from the recommendation engine
  const personalizedPlan = {
    name: "4-Week Fat Burn Starter Program",
    description: "Perfect for beginners looking to lose weight with no equipment needed",
    duration: "4 weeks",
    frequency: "3 days per week",
    difficulty: "Beginner",
    equipment: "No Equipment",
    estimatedCalories: "200-300 per workout",
    features: [
      "Bodyweight exercises only",
      "Progressive difficulty",
      "Video demonstrations",
      "Voice coaching",
      "Progress tracking"
    ],
    weeklySchedule: [
      { day: "Monday", workout: "Upper Body Strength" },
      { day: "Wednesday", workout: "Cardio & Core" },
      { day: "Friday", workout: "Full Body HIIT" },
    ]
  };

  const handleStartPlan = async () => {
    setIsLoading(true);
    try {
      // TODO: Save the personalized plan to user's profile
      // For now, we'll just show a success message
      Alert.alert(
        'Welcome to HomeFit Coach!',
        'Your personalized fitness journey is ready to begin. Let\'s get started!',
        [
          {
            text: 'Start My Journey',
            onPress: () => {
              // Navigation will be handled by the auth state change in App.tsx
              // The user will be taken to the main app
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEdit = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#4CAF50', '#45a049']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToEdit}
        >
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 6 of 6</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.celebrationContainer}>
          <Icon name="celebration" size={60} color="#4CAF50" />
          <Text style={styles.celebrationTitle}>Your Personalized Plan is Ready!</Text>
          <Text style={styles.celebrationSubtitle}>
            Based on your preferences, we've created the perfect fitness journey for you
          </Text>
        </View>

        <ScrollView style={styles.planContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.planCard}>
            <Text style={styles.planName}>{personalizedPlan.name}</Text>
            <Text style={styles.planDescription}>{personalizedPlan.description}</Text>
            
            <View style={styles.planDetails}>
              <View style={styles.detailRow}>
                <Icon name="schedule" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>{personalizedPlan.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="repeat" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>{personalizedPlan.frequency}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>{personalizedPlan.difficulty}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="fitness-center" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>{personalizedPlan.equipment}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="local-fire-department" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>{personalizedPlan.estimatedCalories}</Text>
              </View>
            </View>

            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>What's Included:</Text>
              {personalizedPlan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>Your Weekly Schedule:</Text>
              {personalizedPlan.weeklySchedule.map((day, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.dayContainer}>
                    <Text style={styles.dayText}>{day.day}</Text>
                  </View>
                  <Text style={styles.workoutText}>{day.workout}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.startButton, isLoading && styles.disabledButton]}
          onPress={handleStartPlan}
          disabled={isLoading}
        >
          <Icon name="play-arrow" size={24} color="#ffffff" />
          <Text style={styles.startButtonText}>
            {isLoading ? 'Setting up...' : 'Start My Plan'}
          </Text>
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
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  planContainer: {
    flex: 1,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  planDetails: {
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  featuresSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 12,
  },
  scheduleSection: {
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dayContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 15,
  },
  dayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 18,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default PersonalizedPlanScreen;
