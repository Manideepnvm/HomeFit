import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyBOnTNrza-2hirbUts4G0TaJTtiCF0bvM8",
  authDomain: "homefit-cbb79.firebaseapp.com",
  projectId: "homefit-cbb79",
  storageBucket: "homefit-cbb79.firebasestorage.app",
  messagingSenderId: "525369667006",
  appId: "1:525369667006:web:d0847d93cdb169fcc35def"a
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
