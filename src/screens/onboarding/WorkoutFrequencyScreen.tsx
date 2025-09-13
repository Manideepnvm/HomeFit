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
import { OnboardingStackParamList } from '../../types';

type WorkoutFrequencyScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'WorkoutFrequency'>;

interface Props {
  navigation: WorkoutFrequencyScreenNavigationProp;
}

const WorkoutFrequencyScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);

  const frequencyOptions = [
    {
      days: 3,
      title: '3 days a week',
      description: 'Perfect for beginners or busy schedules',
      benefits: [
        'Allows for recovery time',
        'Builds consistent habits',
        'Great for weight loss',
        'Sustainable long-term'
      ],
      icon: 'schedule',
      color: '#4CAF50',
    },
    {
      days: 4,
      title: '4 days a week',
      description: 'Balanced approach for steady progress',
      benefits: [
        'Good muscle development',
        'Improved cardiovascular health',
        'Flexible scheduling',
        'Moderate time commitment'
      ],
      icon: 'fitness-center',
      color: '#FF9800',
    },
    {
      days: 5,
      title: '5+ days a week',
      description: 'For serious fitness enthusiasts',
      benefits: [
        'Maximum results',
        'Advanced training splits',
        'Rapid progress',
        'High fitness level'
      ],
      icon: 'star',
      color: '#F44336',
    },
  ];

  const handleContinue = () => {
    if (selectedFrequency) {
      // TODO: Store workout frequency in context or async storage
      navigation.navigate('PersonalizedPlan');
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
            <View style={[styles.progressFill, { width: '83%' }]} />
          </View>
          <Text style={styles.progressText}>Step 5 of 6</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How often do you want to work out?</Text>
        <Text style={styles.subtitle}>
          Choose a frequency that fits your lifestyle and schedule
        </Text>

        <ScrollView style={styles.frequencyContainer} showsVerticalScrollIndicator={false}>
          {frequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.days}
              style={[
                styles.frequencyCard,
                selectedFrequency === option.days && styles.selectedFrequencyCard,
              ]}
              onPress={() => setSelectedFrequency(option.days)}
            >
              <View style={styles.frequencyHeader}>
                <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                  <Icon name={option.icon} size={24} color="#ffffff" />
                </View>
                <View style={styles.frequencyContent}>
                  <Text style={styles.frequencyTitle}>{option.title}</Text>
                  <Text style={styles.frequencyDescription}>{option.description}</Text>
                </View>
                {selectedFrequency === option.days && (
                  <Icon name="check-circle" size={24} color="#4CAF50" />
                )}
              </View>
              
              <View style={styles.benefitsContainer}>
                {option.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Icon name="check" size={16} color="#4CAF50" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedFrequency && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedFrequency}
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
  frequencyContainer: {
    flex: 1,
    marginBottom: 20,
  },
  frequencyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFrequencyCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  frequencyHeader: {
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
  frequencyContent: {
    flex: 1,
  },
  frequencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#666',
  },
  benefitsContainer: {
    marginLeft: 65,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
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

export default WorkoutFrequencyScreen;
