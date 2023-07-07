// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU_-KT7j5Zm7NTth7oiydpDTW27YWvv3Q",
  authDomain: "teach-league.firebaseapp.com",
  projectId: "teach-league",
  storageBucket: "teach-league.appspot.com",
  messagingSenderId: "824406673244",
  appId: "1:824406673244:web:0368c5d6e8222d669ba399",
  measurementId: "G-MFE9EB88W7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
