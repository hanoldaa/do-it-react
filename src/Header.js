import React, { Component } from "react";
import { hot } from "react-hot-loader";
import './Header.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import firebase from 'firebase';

class Header extends Component {

    constructor(props){
        super(props);

        this.googleSignIn = this.googleSignIn.bind(this);
    }

    googleSignIn() {
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

    render() {
        return (
          <div className="Header">
            <Container fluid="true">
                        <h1 className="text-center">Do It</h1>
            </Container>
            <Button className="sign-in-button" onClick={this.googleSignIn}>Sign In with Google</Button>
          </div>
        );
    }
}

export default hot(module)(Header);