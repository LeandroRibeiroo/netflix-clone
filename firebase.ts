// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA6jVxxeIFR-l5vy5ImrMuM1dWcsjRcGiM',
  authDomain: 'netflix-55e5f.firebaseapp.com',
  projectId: 'netflix-55e5f',
  storageBucket: 'netflix-55e5f.appspot.com',
  messagingSenderId: '27395918602',
  appId: '1:27395918602:web:581776bc858ea4096188f3',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };
