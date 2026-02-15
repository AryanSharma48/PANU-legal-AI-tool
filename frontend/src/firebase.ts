// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyDnczud85y8eJb9zsRfWgmH7amn1INIAi0",
  authDomain: "panu001.firebaseapp.com",
  projectId: "panu001",
  storageBucket: "panu001.firebasestorage.app",
  messagingSenderId: "70881530300",
  appId: "1:70881530300:web:217bb519dd2afc68779bb9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();