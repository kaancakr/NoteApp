// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDskfVPN9Gkh3BIfHekIRpWB1NDOnKpNMw",
  authDomain: "noteapp-d28d1.firebaseapp.com",
  projectId: "noteapp-d28d1",
  storageBucket: "noteapp-d28d1.appspot.com",
  messagingSenderId: "217609667859",
  appId: "1:217609667859:web:32fc88a6659fcc770b46e6",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();  // Use getApp() to get the default initialized app
}

// Initialize Firebase Authentication and Firestore with AsyncStorage
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const firestore = getFirestore(app);

export { auth, firestore };