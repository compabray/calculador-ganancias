import React from 'react';
 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Private from "./Private";
// import SingIn from "./SingIn";
import {auth} from "./firebase-config";



function App() {


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
      firebase.auth().signInWithPopup(provider);
  }

  return(
      <div>
          <h1>Sign In</h1>
          <button onClick={signInWithGoogle}>Sign in with google </button>
      </div>
  )
}



export default App;
