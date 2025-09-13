// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  biologicalSex: 'male' | 'female' | 'prefer_not_to_say';
  age: number;
  height: number; // in cm
  weight: number; // in kg
  targetWeight?: number; // in kg
  fitnessLevel: FitnessLevel;
  primaryGoal: FitnessGoal;
  availableEquipment: Equipment[];
  workoutFrequency: number; // days per week
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  notifications: boolean;
  soundEnabled: boolean;
  voiceCoachEnabled: boolean;
}

// Fitness Types
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type FitnessGoal = 
  | 'lose_weight' 
  | 'build_muscle' 
  | 'improve_fitness' 
  | 'increase_flexibility' 
  | 'rehabilitation' 
  | 'stay_active';

export type Equipment = 
  | 'none' 
  | 'dumbbells' 
  | 'kettlebells' 
  | 'resistance_bands' 
  | 'yoga_mat' 
  | 'pull_up_bar' 
  | 'chair_bench' 
  | 'full_gym';

// Workout Types
export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: FitnessLevel;
  equipment: Equipment[];
  targetGoal: FitnessGoal[];
  exercises: Exercise[];
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  duration?: number; // in seconds
  reps?: number;
  sets?: number;
  restTime?: number; // in seconds
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  difficulty: FitnessLevel;
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
}

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'abs' 
  | 'legs' 
  | 'glutes' 
  | 'calves' 
  | 'full_body' 
  | 'cardio';

// Workout Session Types
export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  startedAt: Date;
  completedAt?: Date;
  exercises: ExerciseSession[];
  totalDuration: number; // in minutes
  caloriesBurned?: number;
  difficultyRating?: number; // 1-5 scale
  notes?: string;
}

export interface ExerciseSession {
  exerciseId: string;
  completed: boolean;
  duration?: number;
  reps?: number;
  sets?: number;
  weight?: number;
  restTime?: number;
  skipped: boolean;
  difficultyRating?: number; // 1-5 scale
}

// Progress Types
export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: BodyMeasurements;
  notes?: string;
}

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  WorkoutPlayer: { workoutId: string };
  ExerciseDetail: { exerciseId: string };
  ProgressDetail: { entryId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  GoalSelection: undefined;
  FitnessLevel: undefined;
  Equipment: undefined;
  PersonalInfo: undefined;
  WorkoutFrequency: undefined;
  PersonalizedPlan: undefined;
};
