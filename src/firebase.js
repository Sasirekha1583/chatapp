import firebase from "firebase/app"
import "firebase/auth"

export const auth = firebase.initializeApp({
    apiKey: "AIzaSyDL59j9ESPmgpU5BZBbYtqB-pazu8Ik8nE",
    authDomain: "chat-aac3b.firebaseapp.com",
    projectId: "chat-aac3b",
    storageBucket: "chat-aac3b.appspot.com",
    messagingSenderId: "982246152073",
    appId: "1:982246152073:web:5ea36cef5c7cef642a7358"
}).auth()