import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header.js";
import NewTask from "./NewTask.js";
import 'bootstrap/dist/css/bootstrap.css';
import firebase from 'firebase';

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        // User is signed in.
        if(isAnonymous){
            console.log("Anonymous sign in " + uid);
        }
        else{
            console.log("Already signed in " + user);
        }
        
    } else {
        // No user is signed in.
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    }
});

function googleSignIn() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    
        console.log("sign in succeeded: " + user);
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log("sign in failed: " + errorMessage);
    });
}
    
ReactDOM.render(<Header />, document.getElementById("header"));
ReactDOM.render(<NewTask />, document.getElementById("root"));