import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANwkdNo6AaJ3n8RX3fxA6X-c1vi-52BUM",
  authDomain: "adcm-d917a.firebaseapp.com",
  databaseURL: "https://adcm-d917a-default-rtdb.firebaseio.com",
  projectId: "adcm-d917a",
  storageBucket: "adcm-d917a.firebasestorage.app",
  messagingSenderId: "104336797318",
  appId: "1:104336797318:web:d8b281d1c9f0dfba80ab07",
  measurementId: "G-PN7Q827GC4",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(firebase);

export default db;
export { firebase };
