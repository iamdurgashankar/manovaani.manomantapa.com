// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // Only use in production/browser

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL24W71-TA4BI1g5kcEVC2n_d2uYqf0z8",
  authDomain: "manomantapa-media-page.firebaseapp.com",
  projectId: "manomantapa-media-page",
  storageBucket: "manomantapa-media-page.appspot.com", // Fixed typo here
  messagingSenderId: "704888915644",
  appId: "1:704888915644:web:50cd0f4b094dc6337c72b9",
  measurementId: "G-6QMR7SS8ZQ"
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);

// Optionally initialize analytics only in browser/production
// let analytics;
// if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
//   analytics = getAnalytics(app);
// }

// Export the app and auth instance
export const firebaseApp = app;
export const auth = getAuth(app);
