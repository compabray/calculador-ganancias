
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, getDocs, query } from "firebase/firestore/lite";
import {useState, useEffect} from "react";
import { auth, db} from "./firebase-config";


function Private (){

    const [ingresos, setIngresos] = useState([]);
    
    useEffect(() => {
        
        const request = async () => {
            const ingresosRef = collection(db, "ingresos");
            const data = await getDocs(query(ingresosRef));
        setIngresos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const intervalIngresos = setInterval(request, 2000);

    return () => {
        clearInterval(intervalIngresos);

        };


}, []);

    
    return (
        <div>
            {auth.currentUser && 
    <button onClick={() => auth.signOut()}>Sign Out</button>}
    <div>{ingresos.map((data) => {
        return (
            <div key={data.id}> <h2>Fuente: {data.venta}</h2>
            <h2> Valor: {data.valor}</h2> </div>
            
        )
    })}</div>
        </div>
    )
    
}
export default Private;