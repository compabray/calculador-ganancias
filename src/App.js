import React from 'react';
 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Private from "./Private";
// import SingIn from "./SingIn";
import {auth} from "./firebase-config";



function App() {


const [user] = useAuthState(auth);

  return (
    <div className='App'>
     <header>

     </header>
     <section>
      {user ? <Private user={user}/> : <SingIn/>}
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
      <div className='flex justify-center flex-wrap'>
          <h1 className='w-full p-5 text-center font-medium text-5xl text-indigo-400 '>Calcula tus ganancias!</h1>
          <h2 className='w-full text-center text-xl text-zinc-400'>Calcula las ganancias de tu negocio totalmente gratis! Inicia sesion para comenzar a utilizar esta herramienta</h2>
          <button className='mt-32 p-6 bg-zinc-900 text-indigo-600 font-semibold rounded text-3xl hover:text-indigo-400' onClick={signInWithGoogle}>Inicia sesion con Google</button>
      </div>
  )
}



export default App;
