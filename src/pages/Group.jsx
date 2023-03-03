import {useState, useEffect} from 'react';
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';


function Group() {

    const location = useLocation();

    const items = location.state?.data;
    console.log(items[0].grupo)

  return (
    <div>
        <div className='w-full'>
            <Navbar />
        </div>
            <div className='flex w-full justify-center flex-wrap'>
                <h1 className='text-zinc-200 font-semibold text-3xl border border-transparent border-b-indigo-400 py-1 px-6 text-center '>{items[0].grupo.toUpperCase()}</h1>
            </div>
            
        <div className='w-4/5 m-auto p-3 mt-6 flex flex-wrap justify-around '>
            {
                items.map((item) => {
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
                                <Link className='w-2/5 text-indigo-500'><FontAwesomeIcon icon={faPencil}/> Editar</Link>
                                <button className='w-2/5 text-indigo-500'><FontAwesomeIcon icon={faTrash}/> Borrar</button>
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