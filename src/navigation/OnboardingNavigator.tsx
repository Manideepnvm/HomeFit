import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../types';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GoalSelectionScreen from '../screens/onboarding/GoalSelectionScreen';
import FitnessLevelScreen from '../screens/onboarding/FitnessLevelScreen';
import EquipmentScreen from '../screens/onboarding/EquipmentScreen';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import WorkoutFrequencyScreen from '../screens/onboarding/WorkoutFrequencyScreen';
import PersonalizedPlanScreen from '../screens/onboarding/PersonalizedPlanScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent back navigation during onboarding
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
      <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} />
      <Stack.Screen name="Equipment" component={EquipmentScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="WorkoutFrequency" component={WorkoutFrequencyScreen} />
      <Stack.Screen name="PersonalizedPlan" component={PersonalizedPlanScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
