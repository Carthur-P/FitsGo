import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD47WXe7jKqQW0FkIDiIzDibMUSnnlGCRM",
    authDomain: "bitexercise.firebaseapp.com",
    databaseURL: "https://bitexercise.firebaseio.com",
    projectId: "bitexercise",
    storageBucket: "bitexercise.appspot.com",
    messagingSenderId: "731302394432",
    appId: "1:731302394432:web:186e70e959d5a6db"
};

let app= firebase.initializeApp(config);

export const db=app.database();