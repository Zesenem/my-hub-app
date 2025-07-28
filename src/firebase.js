import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxF4yWbuIhwL6Aok1OlXJNkANl36OCAZI",
  authDomain: "my-hub-app.firebaseapp.com",
  projectId: "my-hub-app",
  storageBucket: "my-hub-app.firebasestorage.app",
  messagingSenderId: "914197931434",
  appId: "1:914197931434:web:81b47847200ceba002f7d3",
  measurementId: "G-33BLBTKGYY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };