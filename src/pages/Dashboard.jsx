import React from 'react';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {auth, db} from '../firebase-config';

import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';


function Dashboard() {

  const [user] = useAuthState(auth);

  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);

  const items = ingresos.concat(gastos);

  const [group, setGroup] = useState([]);

  useEffect(() => {
    //Get the data from the database
    const gastosRef = query(collection(db, "gastos"), where("uid", "==", user.uid));
    const ingresosRef = query(collection(db, "ingresos"), where("uid", "==", user.uid));

    //Listen to the data and update the state

    const unsubscribeIngresos = onSnapshot(ingresosRef, (querySnapshot) => {
        setIngresos(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    const unsubscribeGastos = onSnapshot(gastosRef, (querySnapshot) => {
        setGastos(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    //Unsubscribe from the data when the component unmounts

    return () => {
        unsubscribeIngresos();
        unsubscribeGastos();
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    
console.log(items)

function groupByProperty(arr, property) {
  const groups = {};

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const group = item[property];

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(item);
  }

  const result = [];

  for (let group in groups) {
    result.push(groups[group]);
  }

  return result;
}

const groupedData = groupByProperty(items, 'grupo');
console.log(groupedData);


  return (
    <div className=''>
        <div className='flex flex-wrap w-full justify-center sm:justify-between p-2'>
            <h1 className='text-zinc-300 text-2xl w-1/2 p-3 font-semibold'>Dashboard</h1>
            <Navbar/>
        </div>
        <div className='w-full p-4  text-center'>        
            <h2 className='text-zinc-200 text-4xl'>Aquí están todos los grupos que has registrado</h2>
            <h3 className='text-zinc-400 mt-5'>¡Clickeando en el botón de ver más puedes ver todos los ingresos o gastos que pertenecen a este grupo!</h3>
            <h5>
    
            </h5>
        </div>
    </div>
  )
}

export default Dashboard