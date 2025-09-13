import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AuthService from './src/services/authService';
import WorkoutService, { Workout } from './src/services/workoutService';
import WorkoutPlayerScreen from './src/screens/WorkoutPlayerScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        // User is signed in, check if they have completed onboarding
        checkUserProfile(user.uid);
      } else {
        // User is signed out
        setCurrentScreen('auth');
      }
    });

    return () => unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      const profile = await AuthService.getUserProfile(userId);
      if (profile && profile.fitnessLevel !== 'beginner' || profile.primaryGoal !== 'general_fitness') {
        // User has completed onboarding
        setCurrentScreen('welcome');
      } else {
        // User needs to complete onboarding
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setCurrentScreen('onboarding');
    }
  };

  const handleSignUp = () => {
    setCurrentScreen('onboarding');
  };

  const handleSignIn = () => {
    setCurrentScreen('welcome');
  };

  const handleGetStarted = () => {
    setCurrentScreen('onboarding');
  };

  const handleBackToAuth = () => {
    setCurrentScreen('auth');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleStartWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setCurrentScreen('workout-player');
  };

  const handleWorkoutComplete = () => {
    setCurrentWorkout(null);
    setCurrentScreen('welcome');
    Alert.alert('Workout Complete!', 'Great job! Your progress has been saved.');
  };

  const handleWorkoutExit = () => {
    setCurrentWorkout(null);
    setCurrentScreen('welcome');
  };

  const handleViewWorkouts = () => {
    setCurrentScreen('workouts');
  };

  const handleBackFromWorkouts = () => {
    setCurrentScreen('welcome');
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.loadingGradient}
        >
          <MaterialIcons name="fitness-center" size={80} color="#ffffff" />
          <Text style={styles.loadingTitle}>HomeFit Coach</Text>
          <ActivityIndicator size="large" color="#ffffff" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading your fitness journey...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (currentScreen === 'auth') {
    return <AuthScreen onSignUp={handleSignUp} onSignIn={handleSignIn} />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onBack={handleBackToAuth} />;
  }

  if (currentScreen === 'workouts') {
    return <WorkoutsScreen onStartWorkout={handleStartWorkout} />;
  }

  if (currentScreen === 'workout-player' && currentWorkout) {
    return (
      <WorkoutPlayerScreen
        workout={currentWorkout}
        onComplete={handleWorkoutComplete}
        onExit={handleWorkoutExit}
      />
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>HomeFit Coach</Text>
        <Text style={styles.headerSubtitle}>Your Personal Fitness Journey</Text>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <MaterialIcons name="fitness-center" size={60} color="#4CAF50" />
          <Text style={styles.welcomeTitle}>Welcome to HomeFit Coach!</Text>
          <Text style={styles.welcomeText}>
            Your personalized fitness journey starts here. Get customized workouts 
            based on your goals, fitness level, and available equipment.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <MaterialIcons name="person" size={30} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Personalized Onboarding</Text>
              <Text style={styles.featureDescription}>
                Complete quiz to get customized workout recommendations
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <MaterialIcons name="fitness-center" size={30} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Interactive Workouts</Text>
              <Text style={styles.featureDescription}>
                Timer-based workouts with voice coaching and progress tracking
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <MaterialIcons name="trending-up" size={30} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Progress Tracking</Text>
              <Text style={styles.featureDescription}>
                Monitor your fitness journey with detailed analytics and charts
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <MaterialIcons name="home" size={30} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Home-Based</Text>
              <Text style={styles.featureDescription}>
                No gym required - workouts designed for your home setup
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewWorkouts}>
            <MaterialIcons name="fitness-center" size={20} color="#4CAF50" />
            <Text style={styles.secondaryButtonText}>Browse Workouts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
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
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginTop: -20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
  },
  featureContent: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Onboarding styles
  onboardingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
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
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOptionCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  completionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  planSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    textTransform: 'capitalize',
  },
  navigationContainer: {
    padding: 20,
  },
  nextButton: {
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
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  // Auth screen styles
  authHeader: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  authContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    marginTop: -20,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  authFormTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  authFormSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
    paddingBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  authButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 10,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchButtonText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  // Loading screen styles
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingSpinner: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 10,
  },
  // Progress indicator styles
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: '#ffffff',
    transform: [{ scale: 1.2 }],
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  // Form styles
  formContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroupRow: {
    flex: 1,
    marginRight: 10,
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  radioOptionSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
  },
  radioTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  unitToggle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  unitToggleText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
});

// Onboarding Screen Component
const OnboardingScreen = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    biologicalSex: 'prefer_not_to_say' as 'male' | 'female' | 'prefer_not_to_say',
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
  });
  const [isMetric, setIsMetric] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const goals = [
    { id: 'lose_weight', title: 'Lose Weight', icon: 'trending-down', color: '#FF6B6B' },
    { id: 'build_muscle', title: 'Build Muscle', icon: 'fitness-center', color: '#4ECDC4' },
    { id: 'improve_fitness', title: 'Improve Fitness', icon: 'directions-run', color: '#45B7D1' },
    { id: 'stay_active', title: 'Stay Active', icon: 'favorite', color: '#DDA0DD' },
  ];

  const levels = [
    { id: 'beginner', title: 'Beginner', description: 'New to working out', color: '#4CAF50' },
    { id: 'intermediate', title: 'Intermediate', description: 'Some experience', color: '#FF9800' },
    { id: 'advanced', title: 'Advanced', description: 'Regular exerciser', color: '#F44336' },
  ];

  const handleNext = () => {
    if (currentStep === 0 && selectedGoal) {
      setCurrentStep(1);
    } else if (currentStep === 1 && selectedLevel) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        await AuthService.updateUserProfile(currentUser.uid, {
          fitnessLevel: selectedLevel as 'beginner' | 'intermediate' | 'advanced',
          primaryGoal: selectedGoal as any,
          biologicalSex: personalInfo.biologicalSex,
          age: parseInt(personalInfo.age) || 0,
          height: parseFloat(personalInfo.height) || 0,
          weight: parseFloat(personalInfo.weight) || 0,
          targetWeight: parseFloat(personalInfo.targetWeight) || undefined,
          availableEquipment: ['none'], // Default for now
          workoutFrequency: 3, // Default
        });
        Alert.alert(
          'Welcome to HomeFit Coach!',
          `Great! You've selected ${selectedGoal} as a ${selectedLevel}. Your personalized fitness journey is ready to begin!`,
          [
            {
              text: 'Start My Journey',
              onPress: () => {
                Alert.alert('Success!', 'Your personalized plan is ready. The full app features will be available in the complete version.');
                onBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Please sign in again');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.onboardingHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentStep === 0 ? 'Choose Your Goal' : 
             currentStep === 1 ? 'Your Fitness Level' : 
             currentStep === 2 ? 'Personal Information' :
             'Almost Done!'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {[0, 1, 2, 3].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  currentStep >= step && styles.progressDotActive
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of 4
          </Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / 4) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep + 1} of 4</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {currentStep === 0 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your primary goal?</Text>
            <Text style={styles.stepSubtitle}>Choose the goal that best describes what you want to achieve</Text>
            
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.optionCard,
                  selectedGoal === goal.id && styles.selectedOptionCard,
                ]}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <View style={[styles.optionIcon, { backgroundColor: goal.color }]}>
                  <MaterialIcons name={goal.icon} size={24} color="#ffffff" />
                </View>
                <Text style={styles.optionTitle}>{goal.title}</Text>
                {selectedGoal === goal.id && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your fitness level?</Text>
            <Text style={styles.stepSubtitle}>Be honest about your current fitness level</Text>
            
            {levels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.optionCard,
                  selectedLevel === level.id && styles.selectedOptionCard,
                ]}
                onPress={() => setSelectedLevel(level.id)}
              >
                <View style={[styles.optionIcon, { backgroundColor: level.color }]}>
                  <MaterialIcons name="star" size={24} color="#ffffff" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{level.title}</Text>
                  <Text style={styles.optionDescription}>{level.description}</Text>
                </View>
                {selectedLevel === level.id && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Tell us about yourself</Text>
            <Text style={styles.stepDescription}>
              This helps us create more personalized recommendations for you.
            </Text>
            
            <View style={styles.formContainer}>
              {/* Biological Sex */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Biological Sex</Text>
                <View style={styles.radioGroup}>
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.radioOption,
                        personalInfo.biologicalSex === option.value && styles.radioOptionSelected
                      ]}
                      onPress={() => setPersonalInfo({...personalInfo, biologicalSex: option.value as any})}
                    >
                      <Text style={[
                        styles.radioText,
                        personalInfo.biologicalSex === option.value && styles.radioTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Age */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your age"
                  value={personalInfo.age}
                  onChangeText={(text) => setPersonalInfo({...personalInfo, age: text})}
                  keyboardType="numeric"
                />
              </View>

              {/* Height and Weight */}
              <View style={styles.inputRow}>
                <View style={styles.inputGroupRow}>
                  <Text style={styles.inputLabel}>Height</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={isMetric ? "cm" : "ft"}
                    value={personalInfo.height}
                    onChangeText={(text) => setPersonalInfo({...personalInfo, height: text})}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroupRow}>
                  <Text style={styles.inputLabel}>Weight</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={isMetric ? "kg" : "lbs"}
                    value={personalInfo.weight}
                    onChangeText={(text) => setPersonalInfo({...personalInfo, weight: text})}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Unit Toggle */}
              <TouchableOpacity 
                style={styles.unitToggle}
                onPress={() => setIsMetric(!isMetric)}
              >
                <Text style={styles.unitToggleText}>
                  {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.completionContainer}>
              <MaterialIcons name="celebration" size={60} color="#4CAF50" />
              <Text style={styles.completionTitle}>Your Plan is Ready!</Text>
              <Text style={styles.completionSubtitle}>
                Based on your goal to {selectedGoal?.replace('_', ' ')} as a {selectedLevel}, 
                we've created the perfect fitness journey for you.
              </Text>
              
              <View style={styles.planSummary}>
                <View style={styles.summaryItem}>
                  <MaterialIcons name="flag" size={20} color="#4CAF50" />
                  <Text style={styles.summaryText}>{selectedGoal?.replace('_', ' ')}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <MaterialIcons name="trending-up" size={20} color="#4CAF50" />
                  <Text style={styles.summaryText}>{selectedLevel}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <MaterialIcons name="schedule" size={20} color="#4CAF50" />
                  <Text style={styles.summaryText}>3 days/week</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep < 3 ? (
            <TouchableOpacity
              style={[
                styles.nextButton,
                ((currentStep === 0 && !selectedGoal) || (currentStep === 1 && !selectedLevel)) && styles.disabledButton,
              ]}
              onPress={handleNext}
              disabled={(currentStep === 0 && !selectedGoal) || (currentStep === 1 && !selectedLevel)}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.nextButton, isSaving && styles.disabledButton]} 
              onPress={handleComplete}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
              )}
              <Text style={styles.nextButtonText}>
                {isSaving ? 'Saving...' : 'Start My Journey'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Authentication Screen Component
const AuthScreen = ({ onSignUp, onSignIn }: { onSignUp: () => void; onSignIn: () => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (isLoading) return; // Prevent multiple taps

    // Validate required fields
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up with Firebase
        await AuthService.signUp(email, password, name);
        Alert.alert('Account Created!', 'Welcome to HomeFit Coach!');
        onSignUp();
      } else {
        // Sign in with Firebase
        await AuthService.signIn(email, password);
        Alert.alert('Welcome Back!', 'Successfully signed in!');
        onSignIn();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await AuthService.signInWithGoogle();
      Alert.alert('Welcome!', 'Successfully signed in with Google!');
      onSignIn();
    } catch (error: any) {
      Alert.alert('Google Sign-in Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    Alert.alert(
      'Apple Sign-in',
      'Apple Sign-in requires additional setup:\n\n1. Configure Apple OAuth in Firebase\n2. Add your app to Apple Developer Console\n\nFor now, please use email sign-in or Google sign-in.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <View style={styles.authHeader}>
          <MaterialIcons name="fitness-center" size={60} color="#ffffff" />
          <Text style={styles.authTitle}>HomeFit Coach</Text>
          <Text style={styles.authSubtitle}>Your Personal Fitness Journey</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.authContainer}>
          <Text style={styles.authFormTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.authFormSubtitle}>
            {isSignUp 
              ? 'Join thousands of users achieving their fitness goals' 
              : 'Sign in to continue your fitness journey'
            }
          </Text>

          {isSignUp && (
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.authButton, isLoading && styles.disabledButton]} 
            onPress={handleAuth}
            disabled={isLoading}
          >
            <Text style={styles.authButtonText}>
              {isLoading 
                ? 'Please Wait...' 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
            <MaterialIcons name="login" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
            <MaterialIcons name="phone-iphone" size={20} color="#000000" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

