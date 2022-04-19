// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcWimcFrQoo743v66S8_Xjq1OFviWF2vo",
    authDomain: "email-pass-firebase-auth-41070.firebaseapp.com",
    projectId: "email-pass-firebase-auth-41070",
    storageBucket: "email-pass-firebase-auth-41070.appspot.com",
    messagingSenderId: "521859425050",
    appId: "1:521859425050:web:d2949e25ff3ae144c342a3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;