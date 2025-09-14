import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCoUHc7gWED2EI0LYv8qSHe65UJ5P7GdjI",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "smartship-b806e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartship-b806e",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "smartship-b806e.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "916579054382",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:916579054382:web:f7c1d2b1d820cf9e4480bf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7QK8Z2N6WT",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
