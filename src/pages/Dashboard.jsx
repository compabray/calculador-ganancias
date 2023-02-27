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
    

//Group the data by the property 'grupo'

function groupByProperty(arr, property) {
  const groups = {};

  // Group the items by the property
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const group = item[property];

    // Skip the item if it doesn't have the property
    if (!group) {
      continue;
    }

    // Create the group if it doesn't exist

    if (!groups[group]) {
      groups[group] = [];
    }

    // Add the item to the group

    groups[group].push(item);
  }

  const result = [];

  // Create the result array

  for (let group in groups) {
    result.push(groups[group]);
  }

  return result;
}

const groupedData = groupByProperty(items, 'grupo');

function getTotalIncomes(group) {
  let total = 0;
  group.forEach((item) => {
    if (item.gasto === false) {
      const value = Number(item.valor);
      if (!isNaN(value)) {
        total += value;
      }
    }
  });
  return total;
}

function getTotalSpent(group) {
  let total = 0;
  group.forEach((item) => {
    if (item.gasto === true) {
      const value = Number(item.valor);
      if (!isNaN(value)) {
        total += value;
      }
    }
  });
  return total;
}

function getTotalProfit(group) {
  let total = 0;
  group.forEach((item) => {
    const value = Number(item.valor);
    if (!isNaN(value)) {
      if (item.gasto === false) {
        total += value;
      } else {
        total -= value;
      }
    }
  });
  return total;
}




  return (
    <div className=''>
        <div className='flex flex-wrap w-full justify-center sm:justify-between p-2'>
            <h1 className='text-zinc-300 text-2xl w-1/2 p-3 font-semibold'>Dashboard</h1>
            <Navbar/>
        </div>
        <div className='w-full p-4  text-center'>        
            <h2 className='text-zinc-200 text-4xl'>Aquí están todos los grupos que has registrado</h2>
            <h3 className='text-zinc-400 mt-5'>¡Clickeando en el botón de ver más puedes ver todos los ingresos o gastos que pertenecen a este grupo!</h3>
            <div className='w-3/4 flex flex-wrap justify-around m-auto mt-10 '>
              {
                groupedData.length > 0 ? (
              <>
                {groupedData.map((group) => {
            
                  return (
                        <div className='w-1/5 p-4 border  border-zinc-800 rounded-md hover:border-zinc-700 hover:duration-300 duration-300 flex flex-col' key={group[0].grupo}>
                          <h2 className='w-2/3 m-auto block cursor-default text-xl font-medium text-zinc-200 p-1 border border-b-indigo-500 border-transparent'>
                            {group[0].grupo.charAt(0).toUpperCase() + group[0].grupo.slice(1).toLowerCase()}
                          </h2>
                          <h3 className='cursor-default mt-5 text-green-500'>Total Income: ${getTotalIncomes(group)}</h3>
                          <h3 className='cursor-default mt-1 text-red-500'>Total Spent: ${getTotalSpent(group)}</h3>
                          <h3 className='cursor-default mt-1 text-zinc-300'>Total Profit: ${getTotalProfit(group)}</h3>
                       
                            <Link className='cursor-pointer text-white  p-2 mt-3 rounded border border-zinc-700 text-base hover:border-indigo-600 transition duration-300' to={`/grupo/${group[0].grupo}`} state={group}>
                            Ver más
                          </Link>
                          
                        </div>
   );
 })}
               </> 
                ) : (
                  <p>No hay grupos registrados</p>
                )

              }
      
    </div>
        </div>
    </div>
  )
}

export default Dashboard