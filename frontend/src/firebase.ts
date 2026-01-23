// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-fHviuHSGz1Vj_ZuSrntVrMp9jHh30IA",
  authDomain: "panu-swj.firebaseapp.com",
  projectId: "panu-swj",
  storageBucket: "panu-swj.firebasestorage.app",
  messagingSenderId: "137090641503",
  appId: "1:137090641503:web:df05f24e086f27037b35ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();