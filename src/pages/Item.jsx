import { useLocation, Link } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot,} from "firebase/firestore";
import Navbar from "../components/Navbar";



function Item () {

    const location = useLocation();
    

    //Obtener la descripcion del documento
    const [descripcion, setDescripcion] = useState(location.state?.data.descripcion);
    const [inputValue, setInputValue] = useState(descripcion)

    //Obtener grupo del documento
    const [grupo, setGrupo] = useState(location.state?.data.grupo);
    const [inputValueGrupo, setInputValueGrupo] = useState(grupo)


    const id = location.state?.data.id;
    //Obtiene el tipo de documento de la ruta
    const gasto = location.state?.data.gasto;
    //Obtiene el documento de la ruta
    const docRef = doc(db, gasto === true ? "gastos" : "ingresos", id);

    
      useEffect(() => {
        const unsubscribe = onSnapshot(docRef, (doc) => {
          setDescripcion(doc.data().descripcion);
          setGrupo(doc.data().grupo);
        });
        return unsubscribe;
      }, []);

    //Actualiza la descripcion del documento
      async function actualizarDescripcion(event) {
        event.preventDefault();
        await updateDoc(docRef, { descripcion: inputValue });
        console.log("Document successfully updated!");
        setDescripcion(inputValue);
    }
  
    function handleInputChange(event) {
      setInputValue(event.target.value);
    }


    //Actualiza el grupo del documento
    async function actualizarGrupo(event) {
        event.preventDefault();
        await updateDoc(docRef, { grupo: inputValueGrupo });
        console.log("Document successfully updated!");
        setGrupo(inputValueGrupo);
    }

    function handleInputChangeGrupo(event) {
        setInputValueGrupo(event.target.value);
    }


    // Convierte la fecha de firebase a una fecha legible
    const fireBaseTime = new Date(location.state?.data.date.seconds * 1000 + location.state?.data.date.nanoseconds / 1000000,);
    const date = fireBaseTime.toLocaleDateString();

  

    return (
        <div className="">
             <div className='flex flex-wrap w-full justify-center sm:justify-between p-2'>
                <Link to={"/"} className='text-xl text-indigo-400 p-4 text-center hover:text-indigo-300'>Volver a la página principal</Link>
                 <Navbar/>
            </div>
            <div className='flex flex-wrap m-auto mt-8 justify-center sm:justify-between sm:w-10/12 lg:w-3/5 p-4 sm:border sm:border-zinc-700 rounded-xl'>
                <div className="w-full flex justify-between align-middle">
                    <h1 className="text-zinc-300 text-4xl font-semibold border border-transparent border-b-indigo-500 p-2">{location.state?.data.fuente.toUpperCase()}</h1>
                    <h4 className="text-zinc-300 text-2xl p-3">{date}</h4>
                </div>
                <div className="w-full mt-3 border border-transparent  sm:mt-0 sm:w-1/2 sm:border-r-zinc-700">
                <h2 className="text-xl text-zinc-400 mt-8">Categoría: 
                    <span className={`${location.state?.data.gasto === true ? "text-red-500" : "text-green-500"}`}>
                        {location.state?.data.gasto === true ? " Gasto" : " Ingreso"}
                    </span>
                </h2>
                <h2 className="text-xl text-zinc-400 mt-4">Monto: 
                    <span className={location.state?.data.gasto === true ? "text-red-500" : "text-green-500"}>
                        {" "}${location.state?.data.valor}
                    </span>
                </h2>
                <h2 className="text-xl text-zinc-400 mt-4  w-full">
                    Grupo: 
                    <span className="text-zinc-300">
                    {  grupo === "" || !grupo  ? (
                       <div>
                       <form className="w-full flex flex-wrap  mt-2" onSubmit={actualizarGrupo}>
                       <input className="w-10/12 m-auto lg:w-11/12 lg:m-0 bg-zinc-900 text-zinc-200" placeholder="Agrega un grupo aquí" type="text" value={inputValueGrupo} onChange={handleInputChangeGrupo} required/>
                       <button className="text-white w-1/2 m-auto p-2 mt-3 rounded border border-zinc-700 text-base hover:border-indigo-600 transition duration-300" type="submit">Guardar</button>
                       </form>
                   </div>
                        
                     ) : (
                        <p className="text-zinc-300 inline">
                        {" " + grupo.charAt(0).toUpperCase() + grupo.slice(1)}
                       
                   </p>
                        
                    )}
                    </span>

                </h2>
                </div>
                <div className="w-full border border-transparent px-4 mt-8 border-t-zinc-700 sm:border-l-zinc-700 sm:mt-0 sm:border-t-transparent  sm:w-1/2">
                    <h2 className="text-xl text-zinc-400 mt-4 w-full text-center">Descripción:</h2>
                    <div>
                    {  descripcion === "" || !descripcion  ? (
                       <div>
                       <form className="w-full flex flex-wrap justify-center mt-4 lg:mt-8" onSubmit={actualizarDescripcion}>
                       <textarea className="w-11/12 m-auto bg-zinc-900 text-zinc-200 lg:w-10/12" placeholder="Agrega una descripción aquí" type="text" value={inputValue} onChange={handleInputChange} required/>
                       <button className="text-white w-1/2 m-auto p-2 mt-3 rounded border border-zinc-700 hover:border-indigo-600 transition duration-300" type="submit">Guardar</button>
                       </form>
                   </div>
                        
                     ) : (
                        <p className="text-white w-10/12 m-auto mt-4">
                        {descripcion.charAt(0).toUpperCase() + descripcion.slice(1)}
                       
                   </p>
                        
                    )}
                 </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Item;