// import { initializeApp, firebase } from "firebase/app";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBWIkwrZKyVxQ9a-B8QIUMoK3KvW-rvwJI",
    authDomain: "global-up-hire.firebaseapp.com",
    projectId: "global-up-hire",
    storageBucket: "global-up-hire.appspot.com",
    messagingSenderId: "231431496620",
    appId: "1:231431496620:web:bc98d9cfa3b036660f1009",
    measurementId: "G-P32HVGZBML"
};
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const auth = firebase.auth();
export default firebase;
export const storage = getStorage(app);