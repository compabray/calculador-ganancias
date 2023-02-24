import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { useState, useEffect, useRef } from "react";


function Navbar() {

    const [active, setActive] = useState(false);
    const navRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                if (!event.target.matches('.button')) {
                  setActive(false);
                }
              }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, []);



    return (
        <div >
          
            <div className="w-full flex justify-end">
                <FontAwesomeIcon onClick={() => setActive(!active)} icon={active === true ? faXmark : faGear} className={`button z-40 text-indigo-500 text-2xl p-3 cursor-pointer hover:text-indigo-400`} />
            </div>
            <div ref={navRef} className={`${active === true ? "nav" : "navB"} flex justify-center flex-col top-0 absolute w-full lg:w-1/2 2xl:w-2/5 h-full bg-zinc-900` }>
            {
                active === true && (
                    <div className="w-full flex flex-col h-1/3 justify-around p-3 text-xl text-center text-indigo-400 " >
                        <Link to="/dashboard" className="hover:text-indigo-200 duration-200">Panel de control</Link>  
                        <button className="hover:text-indigo-200 duration-200" onClick={() => auth.signOut()}>Cerrar sesión</button>
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Navbar;