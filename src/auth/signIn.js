// import { FirebaseApp } from "firebase/app";
import { firebase } from "googleapis/build/src/apis/firebase";

 export const signIn = async (email, password) => {
    try {
            const result = await firebase.auth().signInWithEmailAndPassword();
            return {};
    } catch (e) {
      throw new Error("Error signing in");
    } 
 }
