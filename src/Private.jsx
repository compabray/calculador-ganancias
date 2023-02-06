
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import { collection, query, where, onSnapshot, setDoc, doc } from "firebase/firestore";
import {useState, useEffect} from "react";
import { auth, db} from "./firebase-config";


function Private ({user}){

    //State to store the data from the database
    const [ingresos, setIngresos] = useState([]);
    const [gastos, setGastos] = useState([]);
    const historial = ingresos.concat(gastos);

    //Sort the data by date
    const historialSort = historial.sort((a, b) => {
        return b.date - a.date;
    });

    //Get the data from the database

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



    //Toggle the state to show or hide the data
    const [toggleGastos, setToggleGastos] = useState(false);
    const [toggleIngresos, setToggleIngresos] = useState(false);

    return (
        <div>
            <div className='flex justify-between w-full'>
                <h1 className='text-xl text-indigo-400 p-4'> Comienza a Calcular tus ganancias ya!</h1>
                {auth.currentUser && <button className='px-4 py-2 m-4 bg-zinc-900 font-semibold rounded text-indigo-500' onClick={() => auth.signOut()}>Cerrar sesion</button>}
            </div>
           
        <div>
        <div className='w-1/6'>
            <h2 className='text-lg text-zinc-500 text-center'>Historial:</h2>
            {historialSort.map((data) => {

          //Convert the date from firebase to a readable date
            const fireBaseTime = new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000,);
            const date = fireBaseTime.toLocaleDateString();

        return (
            <div key={data.id} className="w-11/12 m-auto p-1 bg-zinc-800 rounded mt-2"> { data.gasto === true ?
                <div className='flex flex-wrap justify-between w-full'>
                    <h3 className='text-red-500 text-sm my-auto'> <span className='text-lg'>⥄</span> {data.fuente.toUpperCase()}</h3>
                    <h3 className='text-red-400 text-sm my-auto'>- ${data.valor}</h3> 
                </div>
                
             :
                <div className='flex flex-wrap justify-between w-full'>
                    <h3 className='text-green-500 text-sm my-auto'> <span className='text-lg'>⥂</span> {data.fuente.toUpperCase()}</h3>
                    <h3 className='text-green-400 text-sm my-auto'>+ ${data.valor}</h3> 
                </div>
              }
            <h4 className='block text-xs text-zinc-400'>{date}</h4>
            </div>
            
        )
    })}</div>

        <div className='w-1/5'>
            <h2 className='text-lg text-zinc-500 text-center'>Agrega nueva actividad de tu negocio!</h2>
            <div> 
                <button className='text-red-200' onClick={() => setToggleGastos(!toggleGastos)}>Nuevo Gasto!</button>
                {toggleGastos && (
                    <div className='flex flex-col'>
                        <input type="text" placeholder='Fuente del gasto' id='fuenteGasto' />
                        <input type="number" placeholder='Valor del gasto' id='valorGasto' />
                        <button className="text-red-200" onClick={() => {
                            setDoc(doc(db, "gastos", user.uid), {
                                fuente: document.getElementById('fuenteGasto').value,
                                valor: document.getElementById('valorGasto').value,
                                gasto: true,
                                uid: user.uid,
                                date: new Date(),
                            })
                        }}>Agregar Gasto</button>
                    </div>
                )}	
            </div>
        </div>
        </div>
    </div>
    )
    //⥄
}
export default Private;