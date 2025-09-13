import { Exercise, Workout } from '../services/workoutService';

// Sample exercises data
export const sampleExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep your core tight throughout the movement'
    ],
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    duration: 30,
    calories: 5,
  },
  {
    id: '2',
    name: 'Squats',
    description: 'Fundamental lower body exercise',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Return to standing position'
    ],
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    duration: 30,
    calories: 6,
  },
  {
    id: '3',
    name: 'Plank',
    description: 'Isometric core strengthening exercise',
    instructions: [
      'Start in push-up position',
      'Lower to forearms',
      'Keep body in straight line from head to heels',
      'Hold position while breathing normally'
    ],
    muscleGroups: ['core', 'shoulders', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    duration: 30,
    calories: 3,
  },
  {
    id: '4',
    name: 'Lunges',
    description: 'Single-leg lower body exercise',
    instructions: [
      'Step forward with one leg',
      'Lower hips until both knees are at 90 degrees',
      'Push back to starting position',
      'Alternate legs'
    ],
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    duration: 30,
    calories: 5,
  },
  {
    id: '5',
    name: 'Mountain Climbers',
    description: 'High-intensity cardio exercise',
    instructions: [
      'Start in plank position',
      'Bring one knee to chest',
      'Quickly switch legs',
      'Maintain plank position throughout'
    ],
    muscleGroups: ['core', 'shoulders', 'legs'],
    equipment: ['none'],
    difficulty: 'intermediate',
    duration: 30,
    calories: 8,
  },
  {
    id: '6',
    name: 'Burpees',
    description: 'Full-body high-intensity exercise',
    instructions: [
      'Start standing',
      'Drop to squat position',
      'Jump feet back to plank',
      'Do a push-up',
      'Jump feet back to squat',
      'Jump up with arms overhead'
    ],
    muscleGroups: ['full-body'],
    equipment: ['none'],
    difficulty: 'advanced',
    duration: 30,
    calories: 12,
  },
  {
    id: '7',
    name: 'Dumbbell Press',
    description: 'Upper body strength exercise with weights',
    instructions: [
      'Lie on bench with dumbbells at chest level',
      'Press weights up until arms are extended',
      'Lower weights with control',
      'Keep core tight throughout'
    ],
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    duration: 45,
    calories: 8,
  },
  {
    id: '8',
    name: 'Deadlifts',
    description: 'Hip hinge movement for posterior chain',
    instructions: [
      'Stand with feet hip-width apart',
      'Hinge at hips while keeping back straight',
      'Lower weight along legs',
      'Drive hips forward to return to standing'
    ],
    muscleGroups: ['hamstrings', 'glutes', 'back', 'core'],
    equipment: ['dumbbells', 'barbell'],
    difficulty: 'intermediate',
    duration: 45,
    calories: 10,
  }
];

// Sample workouts data
export const sampleWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Beginner Bodyweight Blast',
    description: 'Perfect for fitness beginners - no equipment needed!',
    exercises: [sampleExercises[0], sampleExercises[1], sampleExercises[2]], // Push-ups, Squats, Plank
    duration: 15,
    difficulty: 'beginner',
    equipment: ['none'],
    muscleGroups: ['chest', 'legs', 'core'],
    calories: 100,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Quick Cardio HIIT',
    description: 'High-intensity interval training for fat burning',
    exercises: [sampleExercises[4], sampleExercises[5]], // Mountain Climbers, Burpees
    duration: 20,
    difficulty: 'intermediate',
    equipment: ['none'],
    muscleGroups: ['full-body'],
    calories: 200,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Strength Builder',
    description: 'Build muscle with dumbbell exercises',
    exercises: [sampleExercises[6], sampleExercises[7]], // Dumbbell Press, Deadlifts
    duration: 30,
    difficulty: 'intermediate',
    equipment: ['dumbbells', 'bench'],
    muscleGroups: ['chest', 'back', 'shoulders'],
    calories: 250,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Core Crusher',
    description: 'Intensive core workout for strong abs',
    exercises: [sampleExercises[2], sampleExercises[4]], // Plank, Mountain Climbers
    duration: 25,
    difficulty: 'intermediate',
    equipment: ['none'],
    muscleGroups: ['core', 'shoulders'],
    calories: 150,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Full Body Power',
    description: 'Complete workout targeting all muscle groups',
    exercises: sampleExercises.slice(0, 6), // All bodyweight exercises
    duration: 45,
    difficulty: 'advanced',
    equipment: ['none'],
    muscleGroups: ['full-body'],
    calories: 400,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Function to seed the database with sample data
export const seedDatabase = async () => {
  try {
    // This would be called during app initialization
    // to populate the database with sample data
    console.log('Sample data ready for seeding');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
