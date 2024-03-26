import { firebase } from "googleapis/build/src/apis/firebase";

export const getCurrentUser = () => {
    const user = firebase.auth().currentUser;
    if(!user) return null;
    return {};
}