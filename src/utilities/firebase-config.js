import {apiKey} from './apiKey.js';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseApp = firebase.initializeApp(apiKey)

export const auth = firebaseApp.auth()
export const db = firebaseApp.firestore()
export default firebaseApp

// export {app, db, auth}