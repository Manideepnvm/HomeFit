import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../../firebase.config';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in seconds
  calories: number; // estimated calories burned
  imageUrl?: string;
  videoUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number; // total duration in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscleGroups: string[];
  calories: number; // estimated total calories
  imageUrl?: string;
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  workoutName: string;
  completedAt: Date;
  duration: number; // actual duration in minutes
  calories: number; // actual calories burned
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    completed: boolean;
  }[];
  notes?: string;
  rating?: number; // 1-5 stars
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  currentStreak: number;
  caloriesBurned: number;
  averageWorkoutDuration: number;
  favoriteMuscleGroup: string;
  lastWorkoutDate?: Date;
}

class WorkoutService {
  // Get all exercises
  async getExercises(): Promise<Exercise[]> {
    try {
      const exercisesRef = collection(db, 'exercises');
      const snapshot = await getDocs(exercisesRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
    } catch (error) {
      console.error('Error getting exercises:', error);
      return [];
    }
  }

  // Get exercises by muscle group
  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    try {
      const exercisesRef = collection(db, 'exercises');
      const q = query(exercisesRef, where('muscleGroups', 'array-contains', muscleGroup));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
    } catch (error) {
      console.error('Error getting exercises by muscle group:', error);
      return [];
    }
  }

  // Get exercises by equipment
  async getExercisesByEquipment(equipment: string[]): Promise<Exercise[]> {
    try {
      const exercisesRef = collection(db, 'exercises');
      const q = query(exercisesRef, where('equipment', 'array-contains-any', equipment));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
    } catch (error) {
      console.error('Error getting exercises by equipment:', error);
      return [];
    }
  }

  // Get all workouts
  async getWorkouts(): Promise<Workout[]> {
    try {
      const workoutsRef = collection(db, 'workouts');
      const snapshot = await getDocs(workoutsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  }

  // Get workouts by difficulty
  async getWorkoutsByDifficulty(difficulty: string): Promise<Workout[]> {
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(workoutsRef, where('difficulty', '==', difficulty));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
    } catch (error) {
      console.error('Error getting workouts by difficulty:', error);
      return [];
    }
  }

  // Get recommended workouts for user
  async getRecommendedWorkouts(
    userId: string, 
    fitnessLevel: string, 
    equipment: string[], 
    goal: string
  ): Promise<Workout[]> {
    try {
      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef, 
        where('difficulty', '==', fitnessLevel),
        where('equipment', 'array-contains-any', equipment)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
    } catch (error) {
      console.error('Error getting recommended workouts:', error);
      return [];
    }
  }

  // Log a completed workout
  async logWorkout(workoutLog: Omit<WorkoutLog, 'id'>): Promise<string> {
    try {
      const workoutLogsRef = collection(db, 'workoutLogs');
      const docRef = await addDoc(workoutLogsRef, {
        ...workoutLog,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging workout:', error);
      throw new Error('Failed to log workout');
    }
  }

  // Get workout history for user
  async getWorkoutHistory(userId: string, limitCount: number = 10): Promise<WorkoutLog[]> {
    try {
      const workoutLogsRef = collection(db, 'workoutLogs');
      const q = query(
        workoutLogsRef, 
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
    } catch (error) {
      console.error('Error getting workout history:', error);
      return [];
    }
  }

  // Get workout statistics for user
  async getWorkoutStats(userId: string): Promise<WorkoutStats> {
    try {
      const workoutLogsRef = collection(db, 'workoutLogs');
      const q = query(workoutLogsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const logs = snapshot.docs.map(doc => doc.data() as WorkoutLog);
      
      if (logs.length === 0) {
        return {
          totalWorkouts: 0,
          totalDuration: 0,
          currentStreak: 0,
          caloriesBurned: 0,
          averageWorkoutDuration: 0,
          favoriteMuscleGroup: 'None'
        };
      }

      const totalWorkouts = logs.length;
      const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
      const caloriesBurned = logs.reduce((sum, log) => sum + log.calories, 0);
      const averageWorkoutDuration = totalDuration / totalWorkouts;

      // Calculate current streak
      const sortedLogs = logs.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const log of sortedLogs) {
        const logDate = new Date(log.completedAt);
        logDate.setHours(0, 0, 0, 0);
        
        if (logDate.getTime() === today.getTime() - (currentStreak * 24 * 60 * 60 * 1000)) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Find favorite muscle group
      const muscleGroupCounts: { [key: string]: number } = {};
      logs.forEach(log => {
        log.exercises.forEach(exercise => {
          // This would need to be enhanced to get actual muscle groups from exercises
          muscleGroupCounts['Full Body'] = (muscleGroupCounts['Full Body'] || 0) + 1;
        });
      });

      const favoriteMuscleGroup = Object.keys(muscleGroupCounts).reduce((a, b) => 
        muscleGroupCounts[a] > muscleGroupCounts[b] ? a : b, 'Full Body'
      );

      return {
        totalWorkouts,
        totalDuration,
        currentStreak,
        caloriesBurned,
        averageWorkoutDuration,
        favoriteMuscleGroup,
        lastWorkoutDate: sortedLogs[0]?.completedAt
      };
    } catch (error) {
      console.error('Error getting workout stats:', error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        currentStreak: 0,
        caloriesBurned: 0,
        averageWorkoutDuration: 0,
        favoriteMuscleGroup: 'None'
      };
    }
  }

  // Create a new workout
  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const workoutsRef = collection(db, 'workouts');
      const docRef = await addDoc(workoutsRef, {
        ...workout,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw new Error('Failed to create workout');
    }
  }

  // Update workout
  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<void> {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating workout:', error);
      throw new Error('Failed to update workout');
    }
  }

  // Delete workout
  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      await deleteDoc(workoutRef);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }
}

export default new WorkoutService();