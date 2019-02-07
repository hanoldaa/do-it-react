import firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBaVsRBtrXuSa42n5xBMDjOyf2QEd-QF5c",
    authDomain: "react-tasks-7fc14.firebaseapp.com",
    databaseURL: "https://react-tasks-7fc14.firebaseio.com",
    projectId: "react-tasks-7fc14",
    storageBucket: "react-tasks-7fc14.appspot.com",
    messagingSenderId: "122399834487"
  };
  var fire = firebase.initializeApp(config);
  export default fire;