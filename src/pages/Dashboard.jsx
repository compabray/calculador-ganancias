import { useLocation, Link } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";


function Dashboard () {

    const location = useLocation();

    const [descripcion, setDescripcion] = useState(location.state?.data.descripcion);
    const [inputValue, setInputValue] = useState(descripcion)

    const id = location.state?.data.id;
    //Obtiene el tipo de documento de la ruta
    const gasto = location.state?.data.gasto;
    //Obtiene el documento de la ruta
    const docRef = doc(db, gasto === true ? "gastos" : "ingresos", id);

    
      useEffect(() => {
        const unsubscribe = onSnapshot(docRef, (doc) => {
          setDescripcion(doc.data().descripcion);
          console.log(doc.data().descripcion)
        });
        return unsubscribe;
      }, []);

      async function actualizarDescripcion(event) {
        event.preventDefault();
        await updateDoc(docRef, { descripcion: inputValue });
        console.log("Document successfully updated!");
        setDescripcion(inputValue);
    }
  
    function handleInputChange(event) {
      setInputValue(event.target.value);
    }


    // Convierte la fecha de firebase a una fecha legible
    const fireBaseTime = new Date(location.state?.data.date.seconds * 1000 + location.state?.data.date.nanoseconds / 1000000,);
    const date = fireBaseTime.toLocaleDateString();

  

    return (
        <div>
             <div className='flex flex-wrap w-full justify-center sm:justify-between'>
                <Link to={"/"} className='text-xl text-indigo-400 p-4 text-center hover:text-indigo-300'>Volver a la página principal</Link>
                {auth.currentUser && <button className='px-4 py-2 m-auto border border-zinc-800 font-semibold rounded text-indigo-500 hover:border-zinc-500  sm:m-2' onClick={() => auth.signOut()}>Cerrar sesion</button>}
            </div>
            <div className='flex flex-wrap m-auto justify-center sm:justify-between md:w-3/5 p-4 border border-zinc-700 rounded-xl'>
                <div className="w-full flex justify-between align-middle">
                    <h1 className="text-zinc-300 text-4xl font-semibold border border-transparent border-b-indigo-500 p-2">{location.state?.data.fuente.toUpperCase()}</h1>
                    <h4 className="text-zinc-300 text-2xl p-3">{date}</h4>
                </div>
                <div className="w-1/2 ">
                <h2 className="text-xl text-zinc-400 mt-8">Categoría: 
                    <span className={location.state?.data.gasto === true ? "text-red-500" : "text-green-500"}>
                        {location.state?.data.gasto === true ? " Gasto" : " Ingreso"}
                    </span>
                </h2>
                <h2 className="text-xl text-zinc-400 mt-8">Monto: 
                    <span className={location.state?.data.gasto === true ? "text-red-500" : "text-green-500"}>
                        {location.state?.data.gasto === true ? " -" : " +"}${location.state?.data.valor}
                    </span>
                </h2>
                </div>
                <div className="w-1/2 border border-transparent border-l-zinc-700 px-4 h-full">
                    <h2 className="text-xl text-zinc-400 mt-8 w-full text-center">Descripción:</h2>
                    <div>
                    {  descripcion === "" || !descripcion  ? (
                       <div>
                       <form onSubmit={actualizarDescripcion}>
                       <input className="" type="text-area" value={inputValue} onChange={handleInputChange} />
                       <button className="text-white" type="submit">Guardar</button>
                       </form>
                   </div>
                        
                     ) : (
                        <p className="text-white">
                        {descripcion}{console.log(descripcion)}
                       
                   </p>
                        
                    )}
                 </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Dashboard;