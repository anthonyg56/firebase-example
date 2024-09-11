// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp, getApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY || '',
  appId: process.env.EXPO_PUBLIC_APP_ID || '',
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN || '',
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID || '',
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID || '',
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET || ''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {
  app,
  auth,
}