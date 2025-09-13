import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
