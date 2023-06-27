// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcagqyzEc391moLkUKb968jEo7u1fah08",
  authDomain: "vue3-project-9165b.firebaseapp.com",
  projectId: "vue3-project-9165b",
  storageBucket: "vue3-project-9165b.appspot.com",
  messagingSenderId: "321420721974",
  appId: "1:321420721974:web:68968675f8994237107d97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}