import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList, FitnessGoal } from '../../types';

type GoalSelectionScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'GoalSelection'>;

interface Props {
  navigation: GoalSelectionScreenNavigationProp;
}

const GoalSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);

  const goals = [
    {
      id: 'lose_weight' as FitnessGoal,
      title: 'Lose Weight',
      description: 'Burn fat and get lean',
      icon: 'trending-down',
      color: '#FF6B6B',
    },
    {
      id: 'build_muscle' as FitnessGoal,
      title: 'Build Muscle & Strength',
      description: 'Gain muscle mass and power',
      icon: 'fitness-center',
      color: '#4ECDC4',
    },
    {
      id: 'improve_fitness' as FitnessGoal,
      title: 'Improve Fitness & Endurance',
      description: 'Boost cardiovascular health',
      icon: 'directions-run',
      color: '#45B7D1',
    },
    {
      id: 'increase_flexibility' as FitnessGoal,
      title: 'Increase Flexibility & Mobility',
      description: 'Yoga, stretching, and mobility',
      icon: 'self-improvement',
      color: '#96CEB4',
    },
    {
      id: 'rehabilitation' as FitnessGoal,
      title: 'Rehabilitate from Injury',
      description: 'Safe recovery and healing',
      icon: 'healing',
      color: '#FFEAA7',
    },
    {
      id: 'stay_active' as FitnessGoal,
      title: 'Just Stay Active',
      description: 'Maintain a healthy lifestyle',
      icon: 'favorite',
      color: '#DDA0DD',
    },
  ];

  const handleContinue = () => {
    if (selectedGoal) {
      // TODO: Store selected goal in context or async storage
      navigation.navigate('FitnessLevel');
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
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '16%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 6</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your primary goal?</Text>
        <Text style={styles.subtitle}>
          Choose the goal that best describes what you want to achieve
        </Text>

        <ScrollView style={styles.goalsContainer} showsVerticalScrollIndicator={false}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.selectedGoalCard,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: goal.color }]}>
                <Icon name={goal.icon} size={24} color="#ffffff" />
              </View>
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
              {selectedGoal === goal.id && (
                <Icon name="check-circle" size={24} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGoal && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal}
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
  goalsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGoalCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
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

export default GoalSelectionScreen;
