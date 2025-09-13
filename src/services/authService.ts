import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
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
      
      return user;
    } catch (error: any) {
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
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
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
    } catch (error) {
      throw new Error('Failed to create user profile');
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to get user profile');
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
