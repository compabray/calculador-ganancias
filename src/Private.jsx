
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, getDocs, query } from "firebase/firestore/lite";
import {useState, useEffect} from "react";
import { auth, db} from "./firebase-config";




function Private (){

    const [ganancia, setGanancia] = useState([]);
    
    useEffect(() => {
        const request = async () => {
            const gananciasRef = collection(db, "ganancias");
            const data = await getDocs(query(gananciasRef));
        setGanancia(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    request();
}, []);
 
    
    return (
        <div>
            {auth.currentUser && 
    <button onClick={() => auth.signOut()}>Sign Out</button>}
    <div>{ganancia.map((ganancia) => {
        return (
            <div key={ganancia.id}> <h2>Fuente: {ganancia.venta}</h2>
            <h2> Valor: {ganancia.valor}</h2> </div>
            
        )
    })}</div>
        </div>
    )
    
}
export default Private;