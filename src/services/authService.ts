import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  biologicalSex: 'male' | 'female' | 'prefer_not_to_say';
  age: number;
  height: number; // in cm
  weight: number; // in kg
  targetWeight?: number; // in kg
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: 'lose_weight' | 'build_muscle' | 'improve_strength' | 'general_fitness' | 'endurance' | 'flexibility' | 'rehabilitation';
  availableEquipment: string[];
  workoutFrequency: number; // days per week
  createdAt: Date;
  updatedAt: Date;
}

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      console.log('Starting signup process for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);
      
      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        id: user.uid,
        email,
        name,
        biologicalSex: 'prefer_not_to_say',
        age: 0,
        height: 0,
        weight: 0,
        fitnessLevel: 'beginner',
        primaryGoal: 'general_fitness',
        availableEquipment: [],
        workoutFrequency: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Signup completed successfully');
      return user;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      // For React Native, we need to use a different approach
      // This is a placeholder - you'll need to implement proper Google sign-in
      // using @react-native-google-signin/google-signin package
      throw new Error('Google sign-in requires additional setup for React Native');
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      console.log('Signing out user');
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Create user profile in Firestore
  async createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        id: userId,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('User profile created successfully for:', userId);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      console.log('Updating user profile for:', userId, 'with data:', profileData);
      const userRef = doc(db, 'users', userId);
      
      // Try to update the profile
      try {
        // First check if the document exists
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          console.log('User profile does not exist, creating new one');
          await setDoc(userRef, {
            id: userId,
            ...profileData,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          console.log('User profile exists, updating...');
          await updateDoc(userRef, {
            ...profileData,
            updatedAt: new Date()
          });
        }
        console.log('User profile updated successfully');
      } catch (firebaseError: any) {
        // Handle offline scenarios
        if (firebaseError.code === 'unavailable' || firebaseError.message?.includes('offline')) {
          console.log('Firebase is offline, storing profile data locally for later sync');
          // Store the profile data in AsyncStorage for later sync
          const offlineProfile = {
            id: userId,
            ...profileData,
            updatedAt: new Date(),
            offline: true
          };
          await AsyncStorage.setItem(`offline_profile_${userId}`, JSON.stringify(offlineProfile));
          console.log('Profile data stored offline, will sync when online');
          return; // Don't throw error for offline scenario
        } else {
          throw firebaseError; // Re-throw other errors
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      // Handle offline scenarios
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.log('Firebase is offline, trying to get profile from local storage');
        try {
          const offlineProfile = await AsyncStorage.getItem(`offline_profile_${userId}`);
          if (offlineProfile) {
            const parsed = JSON.parse(offlineProfile);
            delete parsed.offline; // Remove offline flag
            return parsed as UserProfile;
          }
        } catch (storageError) {
          console.log('Error reading from local storage:', storageError);
        }
        return null;
      } else {
        throw new Error('Failed to get user profile');
      }
    }
  }

  // Sync offline profile data when back online
  async syncOfflineProfile(userId: string): Promise<void> {
    try {
      const offlineProfile = await AsyncStorage.getItem(`offline_profile_${userId}`);
      if (offlineProfile) {
        const parsed = JSON.parse(offlineProfile);
        delete parsed.offline;
        
        // Try to sync with Firebase
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          ...parsed,
          updatedAt: new Date()
        });
        
        // Remove from offline storage
        await AsyncStorage.removeItem(`offline_profile_${userId}`);
        console.log('Offline profile synced successfully');
      }
    } catch (error) {
      console.log('Error syncing offline profile:', error);
    }
  }

  // Get error message from Firebase error code
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or sign in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

export default new AuthService();
