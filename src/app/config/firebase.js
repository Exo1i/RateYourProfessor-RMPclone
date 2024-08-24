// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5sJlt_3QtX-QMHgf_j3tFyW4PWBNuQTI",
    authDomain: "learningthisshit.firebaseapp.com",
    projectId: "learningthisshit",
    storageBucket: "learningthisshit.appspot.com",
    messagingSenderId: "300618123136",
    appId: "1:300618123136:web:1641970eb60b98fe6a2365",
    measurementId: "G-JC9C9L5JKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
export {app, analytics, db};