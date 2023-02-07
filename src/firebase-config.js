
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseApp = firebase.initializeApp( {
  apiKey: "AIzaSyCi8O1ELlnHEMbKPo6W8-PJDV60nQdqyJM",
  authDomain: "calculadora-de-ganancias.firebaseapp.com",
  projectId: "calculadora-de-ganancias",
  storageBucket: "calculadora-de-ganancias.appspot.com",
  messagingSenderId: "666324250754",
  appId: "1:666324250754:web:460e65331e173e4a8c449b",
  measurementId: "G-86922JM6KG"
})

export const auth = firebaseApp.auth()
export const db = firebaseApp.firestore()
export default firebaseApp

// export {app, db, auth}