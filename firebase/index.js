import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  // Your Firebase config here
  apiKey: "AIzaSyA9s4gWs1bMxYsZrxIGRF-jLQV6cbGdkAE",
  authDomain: "chatgpt-31dd4.firebaseapp.com",
  projectId: "chatgpt-31dd4",
  storageBucket: "chatgpt-31dd4.appspot.com",
  messagingSenderId: "137374229840",
  appId: "1:137374229840:web:bc3cfb3803ac8725513855",
};

// Initialize Firebase
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Firebase initialization error", error.stack);
}

const auth = getAuth();
const db = getFirestore();

// Export Firebase modules
export {
  auth,
  db,
  doc,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  setDoc,
  Timestamp,
};
