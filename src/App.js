import React from 'react';
 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Private from "./Private";
// import SingIn from "./SingIn";

firebase.initializeApp({
  apiKey: "AIzaSyCi8O1ELlnHEMbKPo6W8-PJDV60nQdqyJM",
  authDomain: "calculadora-de-ganancias.firebaseapp.com",
  projectId: "calculadora-de-ganancias",
  storageBucket: "calculadora-de-ganancias.appspot.com",
  messagingSenderId: "666324250754",
  appId: "1:666324250754:web:460e65331e173e4a8c449b",
  measurementId: "G-86922JM6KG"

})



function App() {

const auth = firebase.auth();
const firestore = firebase.firestore();

const [user] = useAuthState(auth);

  return (
    <div className="App">
     <header>

     </header>
     <section>
      {user ? <Private/> : <SingIn/>}
     </section>
    </div>
  );
}

function SingIn(){

  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
          console.log(result.user);
      }).catch((error) => {
          console.log(error.message);
      });
  }

  return(
      <div>
          <h1>Sign In</h1>
          <button onClick={signInWithGoogle}>Sign in with google </button>
      </div>
  )
}



export default App;
