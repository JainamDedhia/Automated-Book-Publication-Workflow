// src/Components/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAjvdK8g8SUqYPvuM37YZdZNXISrpJKrlg",
  authDomain: "bookflowautomation.firebaseapp.com",
  databaseURL: "https://bookflowautomation-default-rtdb.firebaseio.com",
  projectId: "bookflowautomation",
  storageBucket: "bookflowautomation.firebasestorage.app",
  messagingSenderId: "659250565704",
  appId: "1:659250565704:web:0aa2a43a499afff6dffe7d",
  measurementId: "G-M9J6TL44EJ"
};

const app = initializeApp(firebaseConfig);

export { app };
