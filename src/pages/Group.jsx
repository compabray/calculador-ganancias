import {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import { onSnapshot, } from "firebase/firestore";
import Navbar from "../components/Navbar";

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
            
        <div className='w-3/4 m-auto p-3 mt-6 flex flex-wrap justify-around '>
            {
                items.map((item) => (
                    <div key={item.fuente} className="p-3 w-1/5 bg-zinc-900 text-center rounded-lg">     
                        <h2 className='text-xl text-zinc-400 font-bold'>{item.fuente}</h2>
                        <h3 className={`${item.gasto === true ? 'text-red-500' : 'text-green-500'} font-bold`}>{item.gasto === true ? ` -${item.valor}` : ` +${item.valor}`}</h3>
                    </div>
                ))

            }
        </div>
    </div>
  )
}

export default Group