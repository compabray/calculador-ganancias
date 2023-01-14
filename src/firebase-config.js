import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyCi8O1ELlnHEMbKPo6W8-PJDV60nQdqyJM",
  authDomain: "calculadora-de-ganancias.firebaseapp.com",
  projectId: "calculadora-de-ganancias",
  storageBucket: "calculadora-de-ganancias.appspot.com",
  messagingSenderId: "666324250754",
  appId: "1:666324250754:web:460e65331e173e4a8c449b",
  measurementId: "G-86922JM6KG"
}

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = firebase.auth();

export {app, db, auth}