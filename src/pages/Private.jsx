
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import {useState, useEffect, useRef} from "react";
import { auth, db} from "../firebase-config";

import { Link } from "react-router-dom";

import Navbar from '../components/Navbar';

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

    //Function to add a new document to the database
    const [fuente, setFuente] = useState("");
    const [valor, setValor] = useState(0);
    const [descripcion, setDescripcion] = useState("");
    const [grupo, setGrupo] = useState("");
    const [errorN, setErrorN] = useState(false);
    

    //Function to check if the input is a number NEED TO FIX IT
    const checkNumber = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === "" || e.target.value === null || re.test(e.target.value || e.target.value === 0 )) {
            setValor(e.target.value);
            setErrorN(false);
        } else {
            setErrorN(true);
        }
    };

    const addGasto = async (e) => {

        e.preventDefault();
        const collectionRef = collection(db, "gastos");
        const payload = {
            fuente,
            valor,
            uid: user.uid,
            date: new Date(),
            gasto:true, 
            descripcion,
            grupo,
        };
        try {
            await addDoc(collectionRef, payload);
            setFuente("");
            setValor("");
            setDescripcion("");
            setGrupo("");
        } catch (error) {
            console.log(error);
        } };

        const addIngreso = async (e) => {

            e.preventDefault();
            const collectionRef = collection(db, "ingresos");
            const payload = {
                fuente,
                valor,
                uid: user.uid,
                date: new Date(),
                gasto:false, 
                descripcion,
                grupo,
            };
            try {
                await addDoc(collectionRef, payload);
                setFuente("");
                setValor("");
                setDescripcion("");
                setGrupo("");
            } catch (error) {
                console.log(error);
            } };

            const handleToggleGastos = () => {
                setToggleGastos(!toggleGastos);
                setFuente("");
                setValor("");
                setErrorN(false);
                
                if(toggleGastos === false){
                    setToggleIngresos(false);
                }
            };

            const handleToggleIngresos = () => {
                setToggleIngresos(!toggleIngresos);
                setFuente("");
                setValor("");
                setErrorN(false);
                
                if(toggleIngresos === false){
                    setToggleGastos(false);
                }
            };


          const handleDelete = async (id, gasto) => {
                if(gasto === true){
                    await deleteDoc(doc(db, "gastos", id));
                } else {
                    await deleteDoc(doc(db, "ingresos", id));
                }
          };

            //Calculate the total of the data
            const totalGastos = gastos.reduce((acc, gasto) => acc + parseInt(gasto.valor), 0);
            const totalIngresos = ingresos.reduce((acc, ingreso) => acc + parseInt(ingreso.valor), 0);
            const total = totalIngresos - totalGastos;

            //Calculate the percentage of profit
            const porcentajeGanancia = () => {
                if(totalIngresos === 0 || totalGastos === 0){
                    return 0;
                } else {
                    return (total/ totalIngresos) * 100;
                }
            };
        
            const [menu, setMenu] = useState(null);
            const menuRef = useRef();

            useEffect(() => {
                const handleOutsideClick = (event) => {
                    if (menuRef.current && !menuRef.current.contains(event.target)) {
                        if (!event.target.matches('.button')) {
                          setMenu(null);
                        }
                      }
                };
            
                document.addEventListener('mousedown', handleOutsideClick);
            
                return () => {
                  document.removeEventListener('mousedown', handleOutsideClick);
                };
              }, []);

            const handleMenu = (id) => {
                setMenu((prevId) => (prevId === id ? null : id));
            };

    return (
        <div className='p-4 md:px-12 h-full lg:p-2'>
            <div className='flex flex-wrap w-full justify-center sm:justify-between'>
                <h1 className='text-xl text-indigo-400 p-4 text-center'> Comienza a Calcular tus ganancias ya!</h1>
                <Navbar/>
            </div>
           
        <div className='flex flex-wrap mt-5 xl:justify-between'>
        <div className='w-full order-last mt-16 lg:mt-5 lg:order-none lg:h-screen lg:w-2/5 xl:w-1/3 xl:h-auto pl-4 2xl:pr-12'>
            <h2 className='text-lg text-zinc-400 text-center'>Historial:</h2>
            { historial.length === 0 ? <h3 className='text-center text-zinc-500'>No hay datos</h3> :
            <div className='flex flex-wrap justify-between w-full'>
            {historialSort.map((data) => {

          //Convert the date from firebase to a readable date
            const fireBaseTime = new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000,);
            const date = fireBaseTime.toLocaleDateString();

                
        return (
            <div key={data.id} className="w-full m-auto p-1 bg-zinc-800 rounded mt-2 slideLeft flex flex-wrap">
               <div className="w-95 h-full p-0">
                { data.gasto === true ?
                <div className='flex flex-wrap justify-between w-full' >
                    <h3 className='text-red-500 text-sm my-auto'> <span className='text-lg'>⥄</span> {data.fuente.toUpperCase()}</h3>
                    <h3 className='text-red-400 text-sm my-auto'>- ${data.valor}</h3> 
                </div>
                
             :
                <div className='flex flex-wrap justify-between w-full' >
                    <h3 className='text-green-500 text-sm my-auto'> <span className='text-lg'>⥂</span> {data.fuente.toUpperCase()}</h3>
                    <h3 className='text-green-400 text-sm my-auto'>+ ${data.valor}</h3> 
                </div>
              }
              <div className='flex justify-between'>
            <h4 className='w-1/2 inline text-xs text-zinc-400'>{date}</h4>
            </div>
            </div> 
            <button className='button cursor-pointer text-base text-bold text-zinc-400 inline h-2/3 w-5 text-right' onClick={() => handleMenu(data.id)}>&#8942;</button>
            <div className='relative'>
            {menu === data.id && (
                <div ref={menuRef} className="w-24 bg-zinc-900 border border-zinc-800 rounded p-2 flex flex-col absolute -top-full -left-1 transform translate-x-1">
                    <button className='text-zinc-400 text-sm hover:text-zinc-300 text-center' onClick={()=> handleDelete(data.id, data.gasto)}>Eliminar</button>
                    <Link to={'/item'} state={{data: data}} className='text-zinc-400 text-sm hover:text-zinc-300 text-center'>Ver más</Link>
                </div>
            )}
             </div>
            </div>
            
        )
    })}
    </div>
}
   </div>
    
<div className='w-full flex flex-col lg:w-3/5 xl:w-2/3 xl:flex-row'>
    <div className='w-full mt-5 rounded-md order-first lg:order-none mx-auto lg:w-1/2 xl:px-16'>
        <h2 className='text-lg w-full text-zinc-400 text-center'>Aquí están las estadísticas de tus registros </h2>
        <div className='flex justify-center'>
        <div className=' px-4 py-8 border border-zinc-800 w-full mt-5 rounded-3xl slideUp'>
                <h3 className='text-green-400 text-center'>Total de ingresos: ${totalIngresos}</h3>
                <h3 className='text-red-400 text-center'>Total de gastos: ${totalGastos}</h3>
                <h3 className='text-indigo-400 text-center'>Total: ${total}</h3>
                <h3 className='text-zinc-400 text-center'>Porcentaje de ganancias: {historial.length === 0 ?  "0" : Math.round(porcentajeGanancia())}%</h3>   
                </div>
            </div>
        </div>

        <div className='w-full mt-16 mx-auto xl:mt-6 lg:w-1/2'>
            <h2 className='text-lg text-zinc-400 text-center'>Agrega nueva actividad de tu negocio</h2>
            <div className=''>
            <div className={`${toggleGastos === false ? "h-14 hover:border-indigo-400 hover:border" : "h-auto"}  border-2 border-zinc-900 rounded-md w-64 mt-5 m-auto slideRight`}> 
                <button className="p-4 w-full font-semibold text-center text-indigo-400" onClick={() => handleToggleGastos()}>{toggleGastos === false ? "Nuevo Gasto" : "Cancelar Gasto"}</button>
                {toggleGastos && (

                <form className='p-2' onSubmit={addGasto}>
                <div className="flex ">
                    <label className="text-zinc-300 w-1/4">Fuente:</label>
                    <input
                        type="text"
                        value={fuente}
                        onChange={(event) => setFuente(event.target.value)}
                        placeholder="Ingresa la fuente"
                        required
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4"
                    />
                    
                </div>
                <div className="flex">
                    <label className="text-zinc-300 w-1/4 mt-6">Valor: <span className='text-indigo-300'>$</span></label>
                    <input
                        type="text"
                        value={valor}
                        onChange={event => checkNumber(event)}
                        placeholder="Ingresa el valor"
                        required
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4 mt-6"
                    />
                </div>
                {errorN === true ? <h4 className='text-red-400 text-sm w-full text-center p-2'>Solo se permiten números</h4> : null}
                <div className="flex flex-wrap">
                    <label className="text-zinc-300 w-full">Descripcion:</label>
                    <textarea
                        type="text"
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        placeholder="Ingresa la descripcion (opcional)" 
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-full"
                    />
                    
                </div>
                <div className="flex ">
                    <label className="text-zinc-300 w-1/4">Grupo</label>
                    <input
                        type="text"
                        value={grupo}
                        onChange={(event) => setGrupo(event.target.value)}
                        placeholder="Ingresa un grupo (opcional)"
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4"
                    />
                    
                </div>
                <button type="submit" className="border border-zinc-800 text-indigo-400 font-semibold rounded p-2 mt-5 w-full hover:bg-indigo-600 hover:text-zinc-300">Agregar</button>
            </form>
                )}	
            </div>
            <div className={`${toggleIngresos === false ? "h-14 hover:border-indigo-400 hover:border" : "h-auto"} border-2 border-zinc-900 rounded-md w-64 m-auto mt-5 slideRight`}> 
                <button className="p-4 w-full font-semibold text-center text-indigo-400" onClick={() => handleToggleIngresos()}>{toggleIngresos === false ? "Nuevo Ingreso" : "Cancelar Ingreso"}</button>
                {toggleIngresos && (

                <form className='p-2' onSubmit={addIngreso}>
                <div className="flex ">
                    <label className="text-zinc-300 w-1/4 ">Fuente:</label>
                    <input
                        type="text"
                        value={fuente}
                        onChange={event => setFuente(event.target.value)}
                        placeholder="Ingresa la fuente"
                        required
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4 "
                    />
                </div>
                <div className="flex">
                    <label className="text-zinc-300 w-1/4 mt-6">Valor: <span className='text-indigo-300'>$</span></label>
                    <input
                        type="text"
                        value={valor}
                        onChange={event => checkNumber(event)}
                        placeholder="Ingresa el valor"
                        required
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4 mt-6"
                    />
                </div>
                {errorN === true ? <h4 className='text-red-400 text-sm w-full text-center p-2'>Solo se permiten números</h4> : null}
                <div className="flex ">
                    <label className="text-zinc-300 w-1/4">Descripcion:</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                        placeholder="Ingresa la descripcion (opcional)" 
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4"
                    />
                    
                </div>
                <div className="flex ">
                    <label className="text-zinc-300 w-1/4">Grupo</label>
                    <input
                        type="text"
                        value={grupo}
                        onChange={(event) => setGrupo(event.target.value)}
                        placeholder="Ingresa un grupo (opcional)"
                        className="px-2 py-0 bg-transparent text-indigo-200 border-transparent border-b-indigo-500 w-3/4"
                    />
                    
                </div>
                <button type="submit" className="border border-zinc-800 text-indigo-400 font-semibold rounded p-2 mt-5 w-full hover:bg-indigo-600 hover:text-zinc-300">Agregar</button>
            </form>
                )}	
            </div>
            </div>

        </div>
        </div>
       </div>
    </div>
    
    )
    //⥄
}
export default Private;