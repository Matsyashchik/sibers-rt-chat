import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD7ZgqDoH-A2b60YIwi1QZarvQgvJRM56w",
    authDomain: "sibers-chat-8f134.firebaseapp.com",
    projectId: "sibers-chat-8f134",
    storageBucket: "sibers-chat-8f134.firebasestorage.app",
    messagingSenderId: "32134897664",
    appId: "1:32134897664:web:5dfd5282806ca1418538e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();