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
//const firebaseConfig = {
//  apiKey: "AIzaSyCTJqBSsSxuEDW9lYVljq5wYHjs0ln2RBA",
//  authDomain: "training-c918f.firebaseapp.com",
//  projectId: "training-c918f",
//  storageBucket: "training-c918f.appspot.com",
//  messagingSenderId: "25918990019",
//  appId: "1:25918990019:web:c496091fe6f5eac4576476",
//  measurementId: "G-5WVPJ4J37M"
//};

//PARA PRODUCCION
const firebaseConfig = {
  apiKey: "AIzaSyCTJqBSsSxuEDW9lYVljq5wYHjs0ln2RBA",
  authDomain: "training-c918f.firebaseapp.com",
  projectId: "training-c918f",
  storageBucket: "training-c918f.appspot.com",
  messagingSenderId: "25918990019",
  appId: "1:25918990019:web:c496091fe6f5eac4576476",
  measurementId: "G-5WVPJ4J37M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;