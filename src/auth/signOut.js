import { firebase } from "googleapis/build/src/apis/firebase";

export const signOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (e) {
    throw new Error("Error while signing out");
  }
};
