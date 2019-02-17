import React, { Component } from "react";
import { hot } from "react-hot-loader";
import fire from './fire';
import firebase from 'firebase';
import './Header.css';
import { Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    homeClicked() {
        this.props.history.push('/');
    }

    onLogin() {
        var provider = new firebase.auth.GoogleAuthProvider();

        fire.auth().currentUser.linkWithPopup(provider).then(function(result) {
            // The firebase.User instance:
            var user = result.user;
            // The Facebook firebase.auth.AuthCredential containing the Facebook
            // access token:
            var credential = result.credential;
          }, function(error) {
          });
    }

    render(){
        return (
            <div className="header">
                <span>Do It</span>
                <button onClick={this.onLogin.bind(this)}>Login</button>
            </div>
        );
    }
}
export default hot(module)(withRouter(Header));