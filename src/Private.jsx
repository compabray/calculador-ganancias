
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
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

    //State to store the data from the form

    //Function to add a new document to the database
    const [fuente, setFuente] = useState("");
    const [valor, setValor] = useState("");
    
    const addGasto = async (e) => {

        e.preventDefault();
        const collectionRef = collection(db, "gastos");
        const payload = {
            fuente,
            valor,
            uid: user.uid,
            date: new Date(),
            gasto:true, 
        };
        try {
            await addDoc(collectionRef, payload);
            setFuente("");
            setValor("");
        } catch (error) {
            console.log(error);
        } };



    return (
        <div>
            <div className='flex justify-between w-full'>
                <h1 className='text-xl text-indigo-400 p-4'> Comienza a Calcular tus ganancias ya!</h1>
                {auth.currentUser && <button className='px-4 py-2 m-4 bg-zinc-900 font-semibold rounded text-indigo-500' onClick={() => auth.signOut()}>Cerrar sesion</button>}
            </div>
           
        <div className='flex justify-between'>
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

        <div className='w-1/4'>
            <h2 className='text-lg text-zinc-500 text-center'>Agrega nueva actividad de tu negocio!</h2>
            <div className="bg-zinc-900 p-4 w-64 mt-5"> 
                <button className="w-full font-semibold text-center text-indigo-400" onClick={() => setToggleGastos(!toggleGastos)}>{toggleGastos === false ? "Nuevo Gasto!" : "Cancelar"}</button>
                {toggleGastos && (

                <form onSubmit={addGasto}>
                <div className="flex ">
                    <label className="text-indigo-500 w-1/4 mt-6">Fuente:</label>
                    <input
                        type="text"
                        value={fuente}
                        onChange={event => setFuente(event.target.value)}
                        placeholder="Ingresa la fuente"
                        required
                        className="bg-zinc-900 px-2 text-indigo-200 border-transparent border-b-indigo-500 py-0 rounded w-3/4 mt-6"
                    />
                </div>
                <div className="flex">
                    <label className="text-indigo-500 w-1/4 mt-6">Valor: <span className='text-indigo-300'>$</span></label>
                    <input
                        type="text"
                        value={valor}
                        onChange={event => setValor(event.target.value)}
                        placeholder="Ingresa el valor"
                        required
                        className="bg-zinc-900 px-2 text-indigo-200 border-transparent border-b-indigo-500 py-0  rounded w-3/4 mt-6"
                    />
                </div>
                <button type="submit" className="bg-zinc-900 text-indigo-300 font-semibold rounded p-2 mt-5 w-full hover:bg-zinc-800">Agregar</button>
            </form>
                )}	
            </div>
        </div>
        </div>
    </div>
    )
    //⥄
}
export default Private;