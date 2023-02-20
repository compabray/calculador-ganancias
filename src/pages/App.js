import React from 'react';
import svg from '../components/undraw_businessman_re_mlee.svg';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

import Private from "./Private";
// import SingIn from "./SingIn";
import {auth} from "../firebase-config";



function App() {


const [user] = useAuthState(auth);

  return (
    <div className='App h-full'>
     <header>

     </header>
     <section className='h-full'>
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
      <div className='flex justify-center md:p-6 flex-wrap min-h-[100vh]'>
        <div className='flex flex-col justify-center m-auto lg:w-1/2'>
          <h1 className='w-full  text-center font-medium text-4xl text-indigo-500 sm:text-5xl xl:p-5'>Calcula tus ganancias!</h1>
          <h2 className='w-full mt-5 text-center text-lg text-zinc-400 sm:text-xl'>Calcula las ganancias de tu negocio totalmente gratis! Inicia sesion para comenzar a utilizar esta herramienta</h2>
          <button className=' m-auto mt-16 p-5 text-2xl bg-zinc-900 border border-indigo-500 text-indigo-500 font-semibold rounded sm:text-3xl xl:mt-32 2xl:w-1/2 hover:bg-indigo-500 hover:text-zinc-50' onClick={signInWithGoogle}>Inicia sesion con Google</button>
          </div>
          <img src={svg} alt='Calculadora' className='mt-16 w-1/2 h-1/2 lg:w-1/5 lg:h-1/5 lg:m-auto'/>
      </div>
  )
}



export default App;
