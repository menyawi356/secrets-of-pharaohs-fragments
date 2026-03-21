import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSmW4fFaM3u7GboZWD4Rkd66eBiWFBNXQ",
  authDomain: "iphzl-cd017.firebaseapp.com",
  projectId: "iphzl-cd017",
  storageBucket: "iphzl-cd017.firebasestorage.app",
  messagingSenderId: "1040430767030",
  appId: "1:1040430767030:web:d01a274f45a125c4ca7f17",
  measurementId: "G-7FB7K3VMN0"
};

const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);
