// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//console.log(import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "social-blog-7c0ba.firebaseapp.com",
    projectId: "social-blog-7c0ba",
    storageBucket: "social-blog-7c0ba.appspot.com",
    messagingSenderId: "459269165940",
    appId: "1:459269165940:web:e5766eabf0c9c1a8cdd221"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);