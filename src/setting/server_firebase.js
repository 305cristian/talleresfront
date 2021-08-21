// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
    apiKey: "AIzaSyBCTBTJxki87iJWb0TpX4HNMfm0K_f_qBs",
    authDomain: "talleres-1b6d0.firebaseapp.com",
    projectId: "talleres-1b6d0",
    storageBucket: "talleres-1b6d0.appspot.com",
    messagingSenderId: "817231730078",
    appId: "1:817231730078:web:7fe412944d6dc6844f328f",
    measurementId: "G-2MEPK8EZDY"
            // ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;