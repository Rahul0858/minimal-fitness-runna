import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, Auth } from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  projectId: "minimal-fitness-runna",
  appId: "1:358601157659:web:2e1fdcb5c2f9739dd15cbe",
  storageBucket: "minimal-fitness-runna.firebasestorage.app",
  apiKey: "AIzaSyDMXumOsZMuKZndlvKbUngQckBmdRMNpsc",
  authDomain: "minimal-fitness-runna.firebaseapp.com",
  messagingSenderId: "358601157659",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let auth: Auth;
if (Platform.OS !== 'web') {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error: any) {
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}

export { app, auth };
