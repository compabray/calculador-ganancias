import firebase from "firebase/compat/app";

function Private (){
    const auth = firebase.auth();
    return(
        <div>
            {auth.currentUser && 
    <button onClick={() => auth.signOut()}>Sign Out</button>}
        </div>
    )
}

export default Private;