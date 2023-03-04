import {useState, useEffect} from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth ,db } from '../firebase-config';
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';


function Group() {

    const location = useLocation();
    const itemLoc = location.state?.data;

    console.log(location)

    const [user] = useAuthState(auth);

  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);

  const items = ingresos.concat(gastos);


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

const itemSorted = items.filter((item) => item.grupo === itemLoc[0].grupo);

    const handleDelete = async (id, gasto) => {
        if(gasto === true){
            await deleteDoc(doc(db, "gastos", id));
        } else {
            await deleteDoc(doc(db, "ingresos", id));
        }
  };



  return (
    <div>
        <div className='w-full'>
            <Navbar />
        </div>
            <div className='flex w-full justify-center flex-wrap'>
                <h1 className='text-zinc-200 font-semibold text-3xl border border-transparent border-b-indigo-400 py-1 px-6 text-center '>{itemLoc[0].grupo.toUpperCase()}</h1>
            </div>
            
        <div className='w-4/5 m-auto p-3 mt-6 flex flex-wrap justify-around '>
            {
                itemSorted.map((item) => {
                    const fireBaseTime = new Date(item.date.seconds * 1000 + item.date.nanoseconds / 1000000,);
                    const date = fireBaseTime.toLocaleDateString();
                return (
                    <div key={item.fuente} className="flex flex-col w-1/4 bg-zinc-900 text-center rounded-lg h-auto items-stretch">   
                        
                        <h2 className='text-xl text-zinc-300 font-bold w-full rounded-t-lg bg-zinc-800 h-16 truncate py-5 px-2'>{item.fuente.charAt(0).toUpperCase() + item.fuente.slice(1)}</h2>
                      
           
                        <div className='flex flex-col justify-between  p-4 w-full flex-1'>
                            <div>
                                <h3 className={`${item.gasto === true ? 'text-red-500' : 'text-green-500'}  w-full  text-xl`}>{item.gasto === true ? ` - $${item.valor}` : ` + $${item.valor}`}</h3>
                                <h2 className='w-full text-center text-zinc-500 text-sm'>{date}</h2>
                                <h3 className='text-zinc-400 mt-4 multine-ellipsis' >{ item.descripcion ? `${item.descripcion.charAt(0).toUpperCase() + item.descripcion.slice(1).toLowerCase()}` : 'Aún no tiene una descripción' } </h3>
                            </div>
                            <div className='w-full flex justify-around mt-3'>
                                <Link to={'/item'} state={{data: item}} className='w-2/5 text-indigo-400 hover:text-indigo-200 hover:duration-200 duration-200'><FontAwesomeIcon icon={faPencil}/>  Editar</Link>
                                <button onClick={()=> handleDelete(item.id, item.gasto)} className='w-2/5 text-indigo-400 hover:text-red-500 hover:duration-200 duration-200'>
                                    <FontAwesomeIcon icon={faTrash}/>  Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                )})
            }
        </div>
    </div>
  )
}

export default Group