import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


function SingIn(){

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            console.log(result.user);
        }).catch((error) => {
            console.log(error.message);
        });
    }

    return(
        <div>
            <h1>Sign In</h1>
            <button onClick={signInWithGoogle}>Sign in with google </button>
        </div>
    )
}

export default SingIn;